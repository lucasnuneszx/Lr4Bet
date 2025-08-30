const express = require('express');
const { query, transaction } = require('../config/database');
const router = express.Router();

// Middleware para verificar JWT e permissões de admin
const authenticateAdmin = (req, res, next) => {
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
        
        // Verificar se é admin
        if (!user.is_admin) {
            return res.status(403).json({ success: false, message: 'Acesso negado - Apenas administradores' });
        }
        
        req.user = user;
        next();
    });
};

// Dashboard administrativo
router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
        // Estatísticas gerais
        const totalUsers = await query('SELECT COUNT(*) as count FROM users');
        const activeUsers = await query('SELECT COUNT(*) as count FROM users WHERE status = "active"');
        const totalBets = await query('SELECT COUNT(*) as count FROM user_bets');
        const pendingBets = await query('SELECT COUNT(*) as count FROM user_bets WHERE status = "pending"');
        const totalTransactions = await query('SELECT COUNT(*) as count FROM transactions');
        const pendingTransactions = await query('SELECT COUNT(*) as count FROM transactions WHERE status = "pending"');
        
        // Receita total
        const totalRevenue = await query(
            'SELECT SUM(amount) as total FROM transactions WHERE type = "bet" AND status = "completed"'
        );
        
        // Apostas por status
        const betsByStatus = await query(
            `SELECT status, COUNT(*) as count 
             FROM user_bets 
             GROUP BY status`
        );
        
        // Usuários por mês (últimos 6 meses)
        const usersByMonth = await query(
            `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
             FROM users 
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
             GROUP BY month
             ORDER BY month DESC`
        );
        
        res.json({
            success: true,
            stats: {
                total_users: totalUsers[0].count,
                active_users: activeUsers[0].count,
                total_bets: totalBets[0].count,
                pending_bets: pendingBets[0].count,
                total_transactions: totalTransactions[0].count,
                pending_transactions: pendingTransactions[0].count,
                total_revenue: totalRevenue[0].total || 0
            },
            bets_by_status: betsByStatus,
            users_by_month: usersByMonth
        });
        
    } catch (error) {
        console.error('Erro no dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar usuários
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        
        const offset = (page - 1) * limit;
        
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        if (status && status !== 'all') {
            whereClause += ' AND status = ?';
            params.push(status);
        }
        
        if (search) {
            whereClause += ' AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        const users = await query(
            `SELECT id, username, email, first_name, last_name, phone, birth_date, cpf,
                    balance, is_verified, is_admin, status, created_at, updated_at
             FROM users 
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );
        
        // Contar total de usuários
        const totalUsers = await query(
            `SELECT COUNT(*) as total FROM users ${whereClause}`,
            params
        );
        
        res.json({
            success: true,
            users,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalUsers[0].total / limit),
                total_users: totalUsers[0].total,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Atualizar status do usuário
router.put('/users/:userId/status', authenticateAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, reason } = req.body;
        
        if (!status || !['active', 'suspended', 'banned'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido'
            });
        }
        
        await query(
            'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, userId]
        );
        
        // Registrar ação administrativa
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details) 
             VALUES (?, 'user_status_update', 'user', ?, ?)`,
            [req.user.userId, userId, `Status alterado para ${status}. Motivo: ${reason || 'Não informado'}`]
        );
        
        res.json({
            success: true,
            message: `Status do usuário alterado para ${status}`
        });
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar transações pendentes
router.get('/transactions/pending', authenticateAdmin, async (req, res) => {
    try {
        const { type, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;
        
        let whereClause = 'WHERE t.status = "pending"';
        let params = [];
        
        if (type && type !== 'all') {
            whereClause += ' AND t.type = ?';
            params.push(type);
        }
        
        const transactions = await query(
            `SELECT t.*, u.username, u.email, u.first_name, u.last_name
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             ${whereClause}
             ORDER BY t.created_at ASC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );
        
        // Contar total de transações pendentes
        const totalTransactions = await query(
            `SELECT COUNT(*) as total FROM transactions t ${whereClause}`,
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
        console.error('Erro ao listar transações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Aprovar transação
router.post('/transactions/:transactionId/approve', authenticateAdmin, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { notes } = req.body;
        
        // Buscar transação
        const transactions = await query(
            'SELECT * FROM transactions WHERE id = ? AND status = "pending"',
            [transactionId]
        );
        
        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transação não encontrada ou já processada'
            });
        }
        
        const transaction = transactions[0];
        
        // Processar transação baseada no tipo
        if (transaction.type === 'deposit') {
            await transaction(async (connection) => {
                // Atualizar saldo do usuário
                await connection.execute(
                    'UPDATE users SET balance = balance + ? WHERE id = ?',
                    [transaction.amount, transaction.user_id]
                );
                
                // Marcar transação como concluída
                await connection.execute(
                    'UPDATE transactions SET status = "completed", completed_at = NOW() WHERE id = ?',
                    [transactionId]
                );
                
                // Aplicar bônus de depósito se configurado
                const bonusPercentage = await connection.execute(
                    'SELECT setting_value FROM system_settings WHERE setting_key = "bonus_percentage"'
                );
                
                if (bonusPercentage.length > 0 && parseFloat(bonusPercentage[0].setting_value) > 0) {
                    const bonusAmount = transaction.amount * (parseFloat(bonusPercentage[0].setting_value) / 100);
                    const wageringRequirement = bonusAmount * 5; // 5x o valor do bônus
                    
                    await connection.execute(
                        `INSERT INTO bonuses (user_id, type, amount, wagering_requirement, status) 
                         VALUES (?, 'deposit', ?, ?, 'active')`,
                        [transaction.user_id, bonusAmount, wageringRequirement]
                    );
                }
            });
            
        } else if (transaction.type === 'withdrawal') {
            // Aprovar saque (saldo já foi reservado)
            await query(
                'UPDATE transactions SET status = "completed", completed_at = NOW() WHERE id = ?',
                [transactionId]
            );
        }
        
        // Registrar ação administrativa
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details) 
             VALUES (?, 'transaction_approve', 'transaction', ?, ?)`,
            [req.user.userId, transactionId, `Transação aprovada. Notas: ${notes || 'Nenhuma'}`]
        );
        
        res.json({
            success: true,
            message: 'Transação aprovada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao aprovar transação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Rejeitar transação
router.post('/transactions/:transactionId/reject', authenticateAdmin, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { reason } = req.body;
        
        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Motivo da rejeição é obrigatório'
            });
        }
        
        // Buscar transação
        const transactions = await query(
            'SELECT * FROM transactions WHERE id = ? AND status = "pending"',
            [transactionId]
        );
        
        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transação não encontrada ou já processada'
            });
        }
        
        const transaction = transactions[0];
        
        // Processar rejeição
        if (transaction.type === 'withdrawal') {
            // Devolver saldo reservado
            await query(
                'UPDATE users SET balance = balance + ? WHERE id = ?',
                [transaction.amount, transaction.user_id]
            );
        }
        
        // Marcar transação como rejeitada
        await query(
            'UPDATE transactions SET status = "failed", completed_at = NOW() WHERE id = ?',
            [transactionId]
        );
        
        // Registrar ação administrativa
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details) 
             VALUES (?, 'transaction_reject', 'transaction', ?, ?)`,
            [req.user.userId, transactionId, `Transação rejeitada. Motivo: ${reason}`]
        );
        
        res.json({
            success: true,
            message: 'Transação rejeitada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao rejeitar transação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Gerenciar configurações do sistema
router.get('/settings', authenticateAdmin, async (req, res) => {
    try {
        const settings = await query('SELECT * FROM system_settings ORDER BY setting_key');
        
        res.json({
            success: true,
            settings
        });
        
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Atualizar configuração do sistema
router.put('/settings/:key', authenticateAdmin, async (req, res) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;
        
        if (!value) {
            return res.status(400).json({
                success: false,
                message: 'Valor é obrigatório'
            });
        }
        
        await query(
            `UPDATE system_settings 
             SET setting_value = ?, description = ?, updated_at = CURRENT_TIMESTAMP
             WHERE setting_key = ?`,
            [value, description, key]
        );
        
        // Registrar ação administrativa
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details) 
             VALUES (?, 'setting_update', 'system_setting', ?, ?)`,
            [req.user.userId, key, `Configuração ${key} alterada para ${value}`]
        );
        
        res.json({
            success: true,
            message: 'Configuração atualizada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar ações administrativas
router.get('/actions', authenticateAdmin, async (req, res) => {
    try {
        const { admin_id, action_type, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;
        
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        if (admin_id) {
            whereClause += ' AND admin_id = ?';
            params.push(admin_id);
        }
        
        if (action_type) {
            whereClause += ' AND action_type = ?';
            params.push(action_type);
        }
        
        const actions = await query(
            `SELECT aa.*, u.username as admin_username
             FROM admin_actions aa
             JOIN users u ON aa.admin_id = u.id
             ${whereClause}
             ORDER BY aa.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );
        
        // Contar total de ações
        const totalActions = await query(
            `SELECT COUNT(*) as total FROM admin_actions aa ${whereClause}`,
            params
        );
        
        res.json({
            success: true,
            actions,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalActions[0].total / limit),
                total_actions: totalActions[0].total,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('Erro ao listar ações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
