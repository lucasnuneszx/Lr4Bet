const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, transaction } = require('../config/database');
const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone, birth_date, cpf } = req.body;

        // Validações básicas
        if (!username || !email || !password || !first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos obrigatórios devem ser preenchidos'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'A senha deve ter pelo menos 6 caracteres'
            });
        }

        // Verificar se usuário já existe
        const existingUser = await query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email ou nome de usuário já cadastrado'
            });
        }

        // Hash da senha
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Inserir usuário
        const result = await query(
            `INSERT INTO users (username, email, password, first_name, last_name, phone, birth_date, cpf) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [username, email, hashedPassword, first_name, last_name, phone, birth_date, cpf]
        );

        // Criar bônus de boas-vindas
        const welcomeBonus = await query(
            'SELECT setting_value FROM system_settings WHERE setting_key = "welcome_bonus"'
        );

        if (welcomeBonus.length > 0) {
            const bonusAmount = parseFloat(welcomeBonus[0].setting_value);
            await query(
                `INSERT INTO bonuses (user_id, type, amount, wagering_requirement, status) 
                 VALUES (?, 'welcome', ?, ?, 'active')`,
                [result.insertId, bonusAmount, bonusAmount * 5] // 5x o valor do bônus
            );
        }

        // Gerar JWT
        const token = jwt.sign(
            { userId: result.insertId, username, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso!',
            token,
            user: {
                id: result.insertId,
                username,
                email,
                first_name,
                last_name,
                balance: 0.00
            }
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        // Buscar usuário
        const users = await query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const user = users[0];

        // Verificar status da conta
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Conta suspensa ou banida'
            });
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        // Gerar JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Atualizar última atividade
        await query(
            'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                balance: user.balance,
                is_admin: user.is_admin
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Verificar token
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await query(
            'SELECT id, username, email, first_name, last_name, balance, is_admin, status FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            user: user[0]
        });

    } catch (error) {
        console.error('Erro na verificação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // Em uma implementação real, você pode invalidar o token
    res.json({
        success: true,
        message: 'Logout realizado com sucesso'
    });
});

// Esqueci minha senha
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email é obrigatório'
            });
        }

        const users = await query('SELECT id, username FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email não encontrado'
            });
        }

        // Gerar token de reset (implementar lógica de email)
        const resetToken = jwt.sign(
            { userId: users[0].id, type: 'reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // TODO: Enviar email com link de reset

        res.json({
            success: true,
            message: 'Email de recuperação enviado'
        });

    } catch (error) {
        console.error('Erro no forgot password:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
