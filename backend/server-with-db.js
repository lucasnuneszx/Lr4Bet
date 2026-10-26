// Servidor LR4.bet com persistência em PostgreSQL

const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { query, testConnection, initializeTables } = require('./database');
const config = require('./config');

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());

// Configurações PayGate
const PAYGATE_CONFIG = {
    publicKey: config.paygate.publicKey,
    secretKey: config.paygate.secretKey,
    baseUrl: config.paygate.baseUrl,
    webhookSecret: config.paygate.webhookSecret,
    useRealAPI: config.paygate.useRealAPI,
    sandboxUrl: 'https://sandbox.paygate.com.br/',
    fallbackToSimulation: config.paygate.fallbackToSimulation
};

// Sistema de caixas
const cases = {
    premium: {
        name: 'Caixa Premium',
        price: 100,
        icon: '💎',
        description: 'Caixa com prêmios de alto valor',
        prizes: {
            'jackpot': { name: 'Jackpot', value: 10000, probability: 0.01 },
            'mega': { name: 'Mega Prêmio', value: 5000, probability: 0.05 },
            'grande': { name: 'Grande Prêmio', value: 1000, probability: 0.15 },
            'medio': { name: 'Prêmio Médio', value: 500, probability: 0.30 },
            'pequeno': { name: 'Prêmio Pequeno', value: 100, probability: 0.49 }
        }
    },
    medium: {
        name: 'Caixa Média',
        price: 50,
        icon: '📦',
        description: 'Caixa com prêmios médios',
        prizes: {
            'mega': { name: 'Mega Prêmio', value: 2000, probability: 0.02 },
            'grande': { name: 'Grande Prêmio', value: 500, probability: 0.10 },
            'medio': { name: 'Prêmio Médio', value: 200, probability: 0.25 },
            'pequeno': { name: 'Prêmio Pequeno', value: 50, probability: 0.63 }
        }
    },
    basic: {
        name: 'Caixa Básica',
        price: 25,
        icon: '📋',
        description: 'Caixa com prêmios básicos',
        prizes: {
            'grande': { name: 'Grande Prêmio', value: 200, probability: 0.05 },
            'medio': { name: 'Prêmio Médio', value: 100, probability: 0.20 },
            'pequeno': { name: 'Prêmio Pequeno', value: 25, probability: 0.75 }
        }
    },
    simple: {
        name: 'Caixa Simples',
        price: 10,
        icon: '📄',
        description: 'Caixa com prêmios simples',
        prizes: {
            'medio': { name: 'Prêmio Médio', value: 50, probability: 0.10 },
            'pequeno': { name: 'Prêmio Pequeno', value: 10, probability: 0.90 }
        }
    }
};

// Endpoints

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Testar conexão com banco
app.get('/api/db/test', async (req, res) => {
    try {
        const isConnected = await testConnection();
        res.json({ 
            success: isConnected,
            message: isConnected ? 'Banco conectado' : 'Erro na conexão'
        });
    } catch (error) {
        res.json({ 
            success: false,
            error: error.message 
        });
    }
});

// Obter caixas disponíveis
app.get('/api/cases/available', (req, res) => {
    res.json({
        success: true,
        data: cases
    });
});

// Abrir caixa
app.post('/api/cases/open', async (req, res) => {
    const { type } = req.body;
    const userId = 1; // Admin user ID
    
    if (!cases[type]) {
        return res.status(400).json({
            success: false,
            error: 'Tipo de caixa inválido'
        });
    }
    
    const caseData = cases[type];
    const prize = selectPrize(caseData.prizes);
    
    try {
        // Salvar no banco de dados
        await query(`
            INSERT INTO case_openings (user_id, case_type, prize_key, prize_name, prize_value)
            VALUES ($1, $2, $3, $4, $5)
        `, [userId, type, prize.key, prize.name, prize.value]);
        
        res.json({
            success: true,
            data: {
                caseType: type,
                prize: prize
            }
        });
    } catch (error) {
        console.error('Erro ao salvar abertura de caixa:', error);
        res.json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Criar pagamento PIX
app.post('/api/pix/create', async (req, res) => {
    const { amount, description, customer } = req.body;
    const userId = 1; // Admin user ID
    
    const orderId = `lr4_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        // Salvar transação no banco
        await query(`
            INSERT INTO pix_transactions (transaction_id, user_id, amount, status, customer_data)
            VALUES ($1, $2, $3, $4, $5)
        `, [orderId, userId, amount, 'pending', JSON.stringify(customer)]);
        
        // Simular resposta PIX
        const pixCode = `00020126580014br.gov.bcb.pix0136${orderId}520400005303986540${amount.toFixed(2)}5802BR5913LR4.bet Casino6009Sao Paulo62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        let qrCodeDataUrl;
        try {
            qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
                width: 300,
                margin: 2,
                color: { dark: '#000000', light: '#FFFFFF' }
            });
        } catch (error) {
            console.error('Erro ao gerar QR code:', error);
            qrCodeDataUrl = `data:image/svg+xml;base64,${Buffer.from(`
                <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="300" height="300" fill="white" stroke="black" stroke-width="2"/>
                    <text x="150" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="black">
                        QR Code PIX - R$ ${amount.toFixed(2).replace('.', ',')}
                    </text>
                </svg>
            `).toString('base64')}`;
        }
        
        // Atualizar transação com dados PIX
        await query(`
            UPDATE pix_transactions 
            SET pix_code = $1, qr_code = $2
            WHERE transaction_id = $3
        `, [pixCode, qrCodeDataUrl, orderId]);
        
        res.json({
            success: true,
            data: {
                transaction_id: orderId,
                status: 'pending',
                amount: amount,
                pixHash: qrCodeDataUrl,
                pixCode: pixCode,
                status_date: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Erro ao criar pagamento PIX:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Consultar status PIX
app.get('/api/pix/status/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await query(`
            SELECT * FROM pix_transactions WHERE transaction_id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Transação não encontrada'
            });
        }
        
        const transaction = result.rows[0];
        res.json({
            success: true,
            data: {
                transaction_id: transaction.transaction_id,
                status: transaction.status,
                amount: parseFloat(transaction.amount),
                pixCode: transaction.pix_code,
                pixHash: transaction.qr_code,
                status_date: transaction.updated_at
            }
        });
        
    } catch (error) {
        console.error('Erro ao consultar status PIX:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Sistema de saques

// Configurações de saque
app.get('/api/withdrawals/config', (req, res) => {
    res.json({
        success: true,
        data: {
            minAmount: 10.00,
            maxAmount: 10000.00,
            processingFee: 2.50
        }
    });
});

// Criar solicitação de saque
app.post('/api/withdrawals/create', async (req, res) => {
    const { amount, method, bank, account, agency, cpf, name } = req.body;
    const userId = 1; // Admin user ID
    
    if (!amount || !method || !bank || !account || !agency || !cpf || !name) {
        return res.status(400).json({
            success: false,
            error: 'Todos os campos são obrigatórios'
        });
    }
    
    if (amount < 10 || amount > 10000) {
        return res.status(400).json({
            success: false,
            error: 'Valor deve estar entre R$ 10,00 e R$ 10.000,00'
        });
    }
    
    const withdrawalId = `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const processingFee = 2.50;
    const netAmount = parseFloat(amount) - processingFee;
    
    try {
        // Salvar saque no banco
        const result = await query(`
            INSERT INTO withdrawals (withdrawal_id, user_id, amount, method, bank, account, agency, cpf, name, status, processing_fee, net_amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [withdrawalId, userId, amount, method, bank, account, agency, cpf, name, 'pending', processingFee, netAmount]);
        
        const withdrawal = result.rows[0];
        
        // Simular processamento automático para valores baixos
        if (amount <= 100) {
            setTimeout(async () => {
                try {
                    await query(`
                        UPDATE withdrawals 
                        SET status = 'completed', updated_at = CURRENT_TIMESTAMP
                        WHERE withdrawal_id = $1
                    `, [withdrawalId]);
                    console.log('Saque aprovado automaticamente:', withdrawalId);
                } catch (error) {
                    console.error('Erro ao aprovar saque:', error);
                }
            }, 5000);
        }
        
        res.json({
            success: true,
            data: {
                id: withdrawal.withdrawal_id,
                amount: parseFloat(withdrawal.amount),
                method: withdrawal.method,
                bank: withdrawal.bank,
                account: withdrawal.account,
                agency: withdrawal.agency,
                cpf: withdrawal.cpf,
                name: withdrawal.name,
                status: withdrawal.status,
                processingFee: parseFloat(withdrawal.processing_fee),
                netAmount: parseFloat(withdrawal.net_amount),
                createdAt: withdrawal.created_at,
                updatedAt: withdrawal.updated_at
            }
        });
        
    } catch (error) {
        console.error('Erro ao criar saque:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Listar saques
app.get('/api/withdrawals/list', async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM withdrawals 
            ORDER BY created_at DESC
        `);
        
        const withdrawals = result.rows.map(row => ({
            id: row.withdrawal_id,
            amount: parseFloat(row.amount),
            method: row.method,
            bank: row.bank,
            account: row.account,
            agency: row.agency,
            cpf: row.cpf,
            name: row.name,
            status: row.status,
            processingFee: parseFloat(row.processing_fee),
            netAmount: parseFloat(row.net_amount),
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        
        res.json({
            success: true,
            data: withdrawals
        });
        
    } catch (error) {
        console.error('Erro ao listar saques:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Status de saque específico
app.get('/api/withdrawals/status/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await query(`
            SELECT * FROM withdrawals WHERE withdrawal_id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Saque não encontrado'
            });
        }
        
        const withdrawal = result.rows[0];
        res.json({
            success: true,
            data: {
                id: withdrawal.withdrawal_id,
                amount: parseFloat(withdrawal.amount),
                method: withdrawal.method,
                bank: withdrawal.bank,
                account: withdrawal.account,
                agency: withdrawal.agency,
                cpf: withdrawal.cpf,
                name: withdrawal.name,
                status: withdrawal.status,
                processingFee: parseFloat(withdrawal.processing_fee),
                netAmount: parseFloat(withdrawal.net_amount),
                createdAt: withdrawal.created_at,
                updatedAt: withdrawal.updated_at
            }
        });
        
    } catch (error) {
        console.error('Erro ao consultar status do saque:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Funções auxiliares

function selectPrize(prizes) {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const [key, prize] of Object.entries(prizes)) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
            return { key, ...prize };
        }
    }
    
    // Fallback para o último prêmio
    const lastPrize = Object.entries(prizes).pop();
    return { key: lastPrize[0], ...lastPrize[1] };
}

// Inicialização

async function startServer() {
    try {
        // Testar conexão com banco
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('Não foi possível conectar ao banco de dados');
            process.exit(1);
        }
        
        // Inicializar tabelas
        await initializeTables();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor LR4.Bet rodando na porta ${PORT}`);
        });
        
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Iniciar servidor
startServer();

module.exports = app;
