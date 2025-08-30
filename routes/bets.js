const express = require('express');
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

// Criar nova aposta
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { match_id, bet_type_id, selection, stake_amount } = req.body;
        const userId = req.user.userId;

        // Validações
        if (!match_id || !bet_type_id || !selection || !stake_amount) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }

        if (stake_amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valor da aposta deve ser maior que zero'
            });
        }

        // Verificar se o jogo está ativo
        const match = await query(
            'SELECT * FROM matches WHERE id = ? AND is_active = TRUE AND status = "scheduled"',
            [match_id]
        );

        if (match.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Jogo não disponível para apostas'
            });
        }

        // Verificar se as odds ainda são válidas
        const odds = await query(
            'SELECT * FROM odds WHERE match_id = ? AND bet_type_id = ? AND selection = ? AND is_active = TRUE',
            [match_id, bet_type_id, selection]
        );

        if (odds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Odds não disponíveis para esta seleção'
            });
        }

        const oddsValue = odds[0].odds_value;
        const potentialWin = stake_amount * oddsValue;

        // Verificar saldo do usuário
        const user = await query('SELECT balance FROM users WHERE id = ?', [userId]);
        
        if (user.length === 0 || user[0].balance < stake_amount) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente para realizar a aposta'
            });
        }

        // Verificar limite máximo de aposta
        const maxBet = await query(
            'SELECT setting_value FROM system_settings WHERE setting_key = "max_bet"'
        );

        if (maxBet.length > 0 && stake_amount > parseFloat(maxBet[0].setting_value)) {
            return res.status(400).json({
                success: false,
                message: `Valor máximo permitido por aposta é R$ ${maxBet[0].setting_value}`
            });
        }

        // Criar aposta usando transação
        const result = await transaction(async (connection) => {
            // Inserir aposta
            const [betResult] = await connection.execute(
                `INSERT INTO user_bets (user_id, match_id, bet_type_id, selection, odds_value, stake_amount, potential_win) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, match_id, bet_type_id, selection, oddsValue, stake_amount, potentialWin]
            );

            // Deduzir saldo do usuário
            await connection.execute(
                'UPDATE users SET balance = balance - ? WHERE id = ?',
                [stake_amount, userId]
            );

            // Registrar transação
            await connection.execute(
                `INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, status) 
                 VALUES (?, 'bet', ?, ?, ?, ?, 'completed')`,
                [userId, stake_amount, user[0].balance, user[0].balance - stake_amount, 
                 `Aposta criada - ID: ${betResult.insertId}`]
            );

            return betResult;
        });

        res.status(201).json({
            success: true,
            message: 'Aposta criada com sucesso!',
            bet: {
                id: result.insertId,
                stake_amount,
                potential_win: potentialWin,
                odds: oddsValue
            }
        });

    } catch (error) {
        console.error('Erro ao criar aposta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar apostas do usuário
router.get('/my-bets', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;
        
        let whereClause = 'WHERE ub.user_id = ?';
        let params = [userId];
        
        if (status && status !== 'all') {
            whereClause += ' AND ub.status = ?';
            params.push(status);
        }
        
        // Buscar apostas com informações dos jogos
        const bets = await query(
            `SELECT ub.*, m.match_date, m.home_score, m.away_score, m.status as match_status,
                    ht.name as home_team, at.name as away_team, bt.name as bet_type_name,
                    l.name as league_name
             FROM user_bets ub
             JOIN matches m ON ub.match_id = m.id
             JOIN teams ht ON m.home_team_id = ht.id
             JOIN teams at ON m.away_team_id = at.id
             JOIN bet_types bt ON ub.bet_type_id = bt.id
             JOIN leagues l ON m.league_id = l.id
             ${whereClause}
             ORDER BY ub.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );
        
        // Contar total de apostas
        const totalBets = await query(
            `SELECT COUNT(*) as total FROM user_bets ub ${whereClause}`,
            params
        );
        
        res.json({
            success: true,
            bets,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalBets[0].total / limit),
                total_bets: totalBets[0].total,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar apostas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Cancelar aposta
router.post('/cancel/:betId', authenticateToken, async (req, res) => {
    try {
        const { betId } = req.params;
        const userId = req.user.userId;
        
        // Verificar se a aposta existe e pertence ao usuário
        const bet = await query(
            'SELECT * FROM user_bets WHERE id = ? AND user_id = ? AND status = "pending"',
            [betId, userId]
        );
        
        if (bet.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aposta não encontrada ou não pode ser cancelada'
            });
        }
        
        // Verificar se o jogo ainda não começou
        const match = await query(
            'SELECT * FROM matches WHERE id = ? AND status = "scheduled"',
            [bet[0].match_id]
        );
        
        if (match.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Não é possível cancelar apostas em jogos que já começaram'
            });
        }
        
        // Cancelar aposta e reembolsar
        await transaction(async (connection) => {
            // Atualizar status da aposta
            await connection.execute(
                'UPDATE user_bets SET status = "cancelled" WHERE id = ?',
                [betId]
            );
            
            // Reembolsar saldo
            await connection.execute(
                'UPDATE users SET balance = balance + ? WHERE id = ?',
                [bet[0].stake_amount, userId]
            );
            
            // Registrar transação de reembolso
            const user = await connection.execute(
                'SELECT balance FROM users WHERE id = ?',
                [userId]
            );
            
            await connection.execute(
                `INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, status) 
                 VALUES (?, 'refund', ?, ?, ?, ?, 'completed')`,
                [userId, bet[0].stake_amount, user[0].balance - bet[0].stake_amount, 
                 user[0].balance, `Reembolso da aposta ${betId}`, 'completed']
            );
        });
        
        res.json({
            success: true,
            message: 'Aposta cancelada e reembolsada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao cancelar aposta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Estatísticas das apostas
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const stats = await query(
            `SELECT 
                COUNT(*) as total_bets,
                SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as won_bets,
                SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lost_bets,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bets,
                SUM(stake_amount) as total_staked,
                SUM(CASE WHEN status = 'won' THEN potential_win ELSE 0 END) as total_won,
                SUM(CASE WHEN status = 'lost' THEN stake_amount ELSE 0 END) as total_lost
             FROM user_bets 
             WHERE user_id = ?`,
            [userId]
        );
        
        const totalBets = stats[0].total_bets;
        const winRate = totalBets > 0 ? (stats[0].won_bets / totalBets * 100).toFixed(2) : 0;
        const profit = (stats[0].total_won || 0) - (stats[0].total_staked || 0);
        
        res.json({
            success: true,
            stats: {
                total_bets: totalBets,
                won_bets: stats[0].won_bets || 0,
                lost_bets: stats[0].lost_bets || 0,
                pending_bets: stats[0].pending_bets || 0,
                total_staked: stats[0].total_staked || 0,
                total_won: stats[0].total_won || 0,
                total_lost: stats[0].total_lost || 0,
                win_rate: winRate,
                profit: profit
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
