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

// Comprar raspadinha
router.post('/buy', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { scratchType, price } = req.body;

        if (!scratchType || !price) {
            return res.status(400).json({
                success: false,
                message: 'Tipo e preço da raspadinha são obrigatórios'
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Preço deve ser maior que zero'
            });
        }

        // Verificar saldo do usuário
        const user = await query('SELECT balance FROM users WHERE id = ?', [userId]);
        
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if (user[0].balance < price) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente para comprar esta raspadinha'
            });
        }

        // Gerar prêmio da raspadinha
        const prize = generateScratchPrize(scratchType, price);

        // Processar compra e prêmio usando transação
        const result = await transaction(async (connection) => {
            // Deduzir valor da raspadinha
            await connection.execute(
                'UPDATE users SET balance = balance - ? WHERE id = ?',
                [price, userId]
            );

            // Registrar transação de compra
            await connection.execute(
                `INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, status) 
                 VALUES (?, 'scratch_purchase', ?, ?, ?, ?, 'completed')`,
                [userId, price, user[0].balance, user[0].balance - price, 
                 `Compra de raspadinha ${scratchType}`]
            );

            // Se o prêmio for dinheiro, creditar na conta
            if (prize.type === 'money') {
                await connection.execute(
                    'UPDATE users SET balance = balance + ? WHERE id = ?',
                    [prize.value, userId]
                );

                // Registrar transação do prêmio
                const newBalance = user[0].balance - price + prize.value;
                await connection.execute(
                    `INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, status) 
                     VALUES (?, 'scratch_prize', ?, ?, ?, ?, 'completed')`,
                    [userId, prize.value, user[0].balance - price, newBalance, 
                     `Prêmio da raspadinha ${scratchType}: ${prize.formattedValue}`]
                );
            }

            // Registrar raspadinha jogada
            await connection.execute(
                `INSERT INTO scratch_cards (user_id, scratch_type, price, prize_type, prize_value, prize_description, status) 
                 VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
                [userId, scratchType, price, prize.type, prize.value, prize.description]
            );

            return { newBalance: user[0].balance - price + (prize.type === 'money' ? prize.value : 0) };
        });

        res.json({
            success: true,
            message: 'Raspadinha comprada com sucesso!',
            prize: prize,
            newBalance: result.newBalance
        });

    } catch (error) {
        console.error('Erro ao comprar raspadinha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Gerar prêmio da raspadinha
function generateScratchPrize(scratchType, price) {
    // Definir faixas de prêmios baseadas no preço da carta
    let prizeRanges;
    
    if (price >= 50) {
        // Carta Especial (R$ 50) - Prêmios maiores
        prizeRanges = {
            money: { min: 100, max: 5000, probability: 0.4 },
            product: { min: 200, max: 3000, probability: 0.3 },
            gift_card: { min: 100, max: 1000, probability: 0.2 },
            free_scratch: { probability: 0.1 }
        };
    } else if (price >= 20) {
        // Carta Mega (R$ 20) - Prêmios médios
        prizeRanges = {
            money: { min: 50, max: 1000, probability: 0.5 },
            product: { min: 100, max: 1500, probability: 0.3 },
            gift_card: { min: 50, max: 500, probability: 0.2 }
        };
    } else if (price >= 10) {
        // Carta Premium (R$ 10) - Prêmios pequenos
        prizeRanges = {
            money: { min: 10, max: 500, probability: 0.6 },
            product: { min: 50, max: 800, probability: 0.3 },
            gift_card: { min: 25, max: 300, probability: 0.1 }
        };
    } else {
        // Carta Clássica (R$ 5) - Prêmios básicos
        prizeRanges = {
            money: { min: 1, max: 100, probability: 0.7 },
            product: { min: 20, max: 300, probability: 0.2 },
            gift_card: { min: 10, max: 150, probability: 0.1 }
        };
    }
    
    // Selecionar tipo de prêmio baseado na probabilidade
    const random = Math.random();
    let selectedType = 'money';
    let cumulativeProbability = 0;
    
    for (const [type, config] of Object.entries(prizeRanges)) {
        cumulativeProbability += config.probability;
        if (random <= cumulativeProbability) {
            selectedType = type;
            break;
        }
    }
    
    // Gerar prêmio específico
    let prize;
    switch (selectedType) {
        case 'money':
            const moneyValue = Math.floor(Math.random() * 
                (prizeRanges.money.max - prizeRanges.money.min + 1)) + 
                prizeRanges.money.min;
            prize = {
                type: 'money',
                message: `🎉 PARABÉNS! Você ganhou R$ ${moneyValue.toLocaleString('pt-BR')}!`,
                description: `Seu prêmio de R$ ${moneyValue.toLocaleString('pt-BR')} será creditado em sua conta.`,
                value: moneyValue,
                formattedValue: `R$ ${moneyValue.toLocaleString('pt-BR')}`
            };
            break;
            
        case 'product':
            const productValue = Math.floor(Math.random() * 
                (prizeRanges.product.max - prizeRanges.product.min + 1)) + 
                prizeRanges.product.min;
            const products = [
                'Smartphone Premium',
                'Fone de Ouvido Bluetooth',
                'Smartwatch',
                'Tablet',
                'Console de Videogame',
                'Notebook',
                'Câmera Digital',
                'Drone'
            ];
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            prize = {
                type: 'product',
                message: `🎁 INCRÍVEL! Você ganhou um ${randomProduct}!`,
                description: `Produto no valor de R$ ${productValue.toLocaleString('pt-BR')}. Entraremos em contato para entrega.`,
                value: productValue,
                formattedValue: randomProduct
            };
            break;
            
        case 'gift_card':
            const giftValue = Math.floor(Math.random() * 
                (prizeRanges.gift_card.max - prizeRanges.gift_card.min + 1)) + 
                prizeRanges.gift_card.min;
            const stores = [
                'Amazon',
                'Magazine Luiza',
                'Americanas',
                'Casas Bahia',
                'Ricardo Eletro',
                'Fast Shop',
                'Submarino',
                'Extra'
            ];
            const randomStore = stores[Math.floor(Math.random() * stores.length)];
            prize = {
                type: 'gift_card',
                message: `🎫 SUCESSO! Você ganhou um Vale-Presente da ${randomStore}!`,
                description: `Vale no valor de R$ ${giftValue.toLocaleString('pt-BR')} para usar na ${randomStore}.`,
                value: giftValue,
                formattedValue: `Vale ${randomStore} - R$ ${giftValue.toLocaleString('pt-BR')}`
            };
            break;
            
        case 'free_scratch':
            prize = {
                type: 'free_scratch',
                message: '🎯 BOA! Você ganhou uma Raspadinha Grátis!',
                description: 'Use quando quiser para tentar ganhar mais prêmios.',
                value: 0,
                formattedValue: 'Raspadinha Grátis'
            };
            break;
            
        default:
            prize = {
                type: 'money',
                message: '🎉 PARABÉNS! Você ganhou R$ 50!',
                description: 'Seu prêmio será creditado em sua conta.',
                value: 50,
                formattedValue: 'R$ 50,00'
            };
    }
    
    return prize;
}

// Obter histórico de raspadinhas do usuário
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;
        
        const scratchCards = await query(
            `SELECT * FROM scratch_cards 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), offset]
        );
        
        // Contar total de raspadinhas
        const totalScratch = await query(
            'SELECT COUNT(*) as total FROM scratch_cards WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            scratchCards,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalScratch[0].total / limit),
                total_scratch: totalScratch[0].total,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar histórico de raspadinhas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Estatísticas das raspadinhas
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const stats = await query(
            `SELECT 
                COUNT(*) as total_scratch,
                SUM(price) as total_spent,
                SUM(CASE WHEN prize_type = 'money' THEN prize_value ELSE 0 END) as total_won_money,
                SUM(CASE WHEN prize_type = 'product' THEN prize_value ELSE 0 END) as total_won_products,
                SUM(CASE WHEN prize_type = 'gift_card' THEN prize_value ELSE 0 END) as total_won_gifts
             FROM scratch_cards 
             WHERE user_id = ?`,
            [userId]
        );
        
        const totalSpent = stats[0].total_spent || 0;
        const totalWon = (stats[0].total_won_money || 0) + (stats[0].total_won_products || 0) + (stats[0].total_won_gifts || 0);
        const profit = totalWon - totalSpent;
        
        res.json({
            success: true,
            stats: {
                total_scratch: stats[0].total_scratch || 0,
                total_spent: totalSpent,
                total_won: totalWon,
                profit: profit,
                roi: totalSpent > 0 ? ((totalWon / totalSpent - 1) * 100).toFixed(2) : 0
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar estatísticas das raspadinhas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
