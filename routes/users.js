const express = require('express');
const bcrypt = require('bcryptjs');
const { query, transaction } = require('../config/database');
const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const users = await query(
            `SELECT id, username, email, first_name, last_name, phone, birth_date, cpf, 
                    balance, is_verified, status, created_at
             FROM users WHERE id = ?`,
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
            user: users[0]
        });
        
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Atualizar perfil do usuário
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { first_name, last_name, phone, birth_date } = req.body;
        
        // Validações básicas
        if (!first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: 'Nome e sobrenome são obrigatórios'
            });
        }
        
        await query(
            `UPDATE users 
             SET first_name = ?, last_name = ?, phone = ?, birth_date = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [first_name, last_name, phone, birth_date, userId]
        );
        
        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Alterar senha
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { current_password, new_password } = req.body;
        
        if (!current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Senha atual e nova senha são obrigatórias'
            });
        }
        
        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'A nova senha deve ter pelo menos 6 caracteres'
            });
        }
        
        // Verificar senha atual
        const users = await query('SELECT password FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        const isValidPassword = await bcrypt.compare(current_password, users[0].password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Senha atual incorreta'
            });
        }
        
        // Hash da nova senha
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);
        
        // Atualizar senha
        await query(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [hashedPassword, userId]
        );
        
        res.json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Solicitar depósito
router.post('/deposit', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, payment_method } = req.body;
        
        if (!amount || !payment_method) {
            return res.status(400).json({
                success: false,
                message: 'Valor e método de pagamento são obrigatórios'
            });
        }
        
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valor deve ser maior que zero'
            });
        }
        
        // Verificar valor mínimo
        const minDeposit = await query(
            'SELECT setting_value FROM system_settings WHERE setting_key = "min_deposit"'
        );
        
        if (minDeposit.length > 0 && amount < parseFloat(minDeposit[0].setting_value)) {
            return res.status(400).json({
                success: false,
                message: `Valor mínimo para depósito é R$ ${minDeposit[0].setting_value}`
            });
        }
        
        // Gerar ID de referência único
        const referenceId = `DEP${Date.now()}${userId}`;
        
        // Registrar transação de depósito
        const result = await query(
            `INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, 
                                     description, status, reference_id) 
             VALUES (?, 'deposit', ?, ?, ?, ?, 'pending', ?)`,
            [userId, amount, 0, 0, `Depósito via ${payment_method}`, referenceId]
        );
        
        // TODO: Integrar com gateway de pagamento
        
        res.status(201).json({
            success: true,
            message: 'Solicitação de depósito criada com sucesso!',
            transaction: {
                id: result.insertId,
                reference_id: referenceId,
                amount,
                status: 'pending'
            }
        });
        
    } catch (error) {
        console.error('Erro ao solicitar depósito:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Solicitar saque
router.post('/withdrawal', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, bank_info } = req.body;
        
        if (!amount || !bank_info) {
            return res.status(400).json({
                success: false,
                message: 'Valor e informações bancárias são obrigatórios'
            });
        }
        
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valor deve ser maior que zero'
            });
        }
        
        // Verificar saldo disponível
        const users = await query('SELECT balance FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0 || users[0].balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente para realizar o saque'
            });
        }
        
        // Verificar valor mínimo
        const minWithdrawal = await query(
            'SELECT setting_value FROM system_settings WHERE setting_key = "min_withdrawal"'
        );
        
        if (minWithdrawal.length > 0 && amount < parseFloat(minWithdrawal[0].setting_value)) {
            return res.status(400).json({
                success: false,
                message: `Valor mínimo para saque é R$ ${minWithdrawal[0].setting_value}`
            });
        }
        
        // Gerar ID de referência único
        const referenceId = `WIT${Date.now()}${userId}`;
        
        // Registrar transação de saque
        const result = await query(
            `INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, 
                                     description, status, reference_id) 
             VALUES (?, 'withdrawal', ?, ?, ?, ?, 'pending', ?)`,
            [userId, amount, users[0].balance, users[0].balance, 
             `Saque para conta bancária`, referenceId]
        );
        
        // Reservar saldo (não deduzir ainda, aguardar aprovação)
        await query(
            'UPDATE users SET balance = balance - ? WHERE id = ?',
            [amount, userId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Solicitação de saque criada com sucesso!',
            transaction: {
                id: result.insertId,
                reference_id: referenceId,
                amount,
                status: 'pending'
            }
        });
        
    } catch (error) {
        console.error('Erro ao solicitar saque:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar transações do usuário
router.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, status, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;
        
        let whereClause = 'WHERE user_id = ?';
        let params = [userId];
        
        if (type && type !== 'all') {
            whereClause += ' AND type = ?';
            params.push(type);
        }
        
        if (status && status !== 'all') {
            whereClause += ' AND status = ?';
            params.push(status);
        }
        
        const transactions = await query(
            `SELECT * FROM transactions 
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );
        
        // Contar total de transações
        const totalTransactions = await query(
            `SELECT COUNT(*) as total FROM transactions ${whereClause}`,
            params
        );
        
        res.json({
            success: true,
            transactions,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalTransactions[0].total / limit),
                total_transactions: totalTransactions[0].total,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Obter saldo e bônus
router.get('/balance', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Buscar saldo atual
        const users = await query('SELECT balance FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        // Buscar bônus ativos
        const bonuses = await query(
            `SELECT * FROM bonuses 
             WHERE user_id = ? AND status = 'active' AND expires_at > NOW()
             ORDER BY created_at DESC`,
            [userId]
        );
        
        const totalBonus = bonuses.reduce((sum, bonus) => sum + parseFloat(bonus.amount), 0);
        const totalWagering = bonuses.reduce((sum, bonus) => sum + parseFloat(bonus.wagering_requirement), 0);
        const totalWagered = bonuses.reduce((sum, bonus) => sum + parseFloat(bonus.wagered_amount), 0);
        
        res.json({
            success: true,
            balance: users[0].balance,
            bonuses: {
                active: bonuses.length,
                total_amount: totalBonus,
                wagering_requirement: totalWagering,
                wagered_amount: totalWagered,
                remaining_requirement: totalWagering - totalWagered
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Verificar se usuário pode apostar
router.get('/can-bet', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Verificar status da conta
        const users = await query(
            'SELECT status, balance FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        if (users[0].status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Conta suspensa ou banida',
                can_bet: false
            });
        }
        
        // Verificar se há bônus com requisitos de apostas
        const bonuses = await query(
            `SELECT * FROM bonuses 
             WHERE user_id = ? AND status = 'active' AND expires_at > NOW()
             AND wagering_requirement > wagered_amount`,
            [userId]
        );
        
        const hasActiveBonus = bonuses.length > 0;
        
        res.json({
            success: true,
            can_bet: true,
            account_status: users[0].status,
            balance: users[0].balance,
            has_active_bonus: hasActiveBonus,
            bonus_count: bonuses.length
        });
        
    } catch (error) {
        console.error('Erro ao verificar permissão de apostas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
