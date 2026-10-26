const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const QRCode = require('qrcode');
const axios = require('axios');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public_html')));

// Configuração para produção
const PAYGATE_CONFIG = {
    publicKey: process.env.PAYGATE_PUBLIC_KEY || config.paygate.publicKey,
    secretKey: process.env.PAYGATE_SECRET_KEY || config.paygate.secretKey,
    baseUrl: process.env.PAYGATE_BASE_URL || config.paygate.baseUrl,
    webhookSecret: process.env.PAYGATE_WEBHOOK_SECRET || config.paygate.webhookSecret,
    useRealAPI: process.env.PAYGATE_USE_REAL_API === 'true' || config.paygate.useRealAPI,
    fallbackToSimulation: process.env.PAYGATE_FALLBACK_TO_SIMULATION === 'true' || config.paygate.fallbackToSimulation
};

// Sistema de caixas
const cases = [
    { type: 'premium', name: 'Caixa Premium', price: 100, icon: '💎' },
    { type: 'medium', name: 'Caixa Média', price: 50, icon: '🎁' },
    { type: 'basic', name: 'Caixa Básica', price: 25, icon: '📦' },
    { type: 'simple', name: 'Caixa Simples', price: 10, icon: '🎯' }
];

const caseProbabilities = {
    premium: {
        'jackpot': 0.01, 'grand_prize': 0.05, 'big_prize': 0.15, 'medium_prize': 0.30, 'small_prize': 0.49
    },
    medium: {
        'grand_prize': 0.02, 'big_prize': 0.08, 'medium_prize': 0.25, 'small_prize': 0.65
    },
    basic: {
        'big_prize': 0.05, 'medium_prize': 0.20, 'small_prize': 0.75
    },
    simple: {
        'medium_prize': 0.15, 'small_prize': 0.85
    }
};

const prizes = {
    jackpot: { name: 'JACKPOT!', value: 10000, icon: '🏆' },
    grand_prize: { name: 'Prêmio Grande', value: 1000, icon: '🥇' },
    big_prize: { name: 'Prêmio Alto', value: 500, icon: '🥈' },
    medium_prize: { name: 'Prêmio Médio', value: 100, icon: '🥉' },
    small_prize: { name: 'Prêmio Pequeno', value: 25, icon: '🎖️' }
};

// Sistema de PIX
let transactions = [];

// Sistema de saques
let withdrawals = [];
let withdrawalConfig = {
    minAmount: 10.00,
    maxAmount: 10000.00,
    processingFee: 2.50
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'UP', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Endpoint para obter caixas disponíveis
app.get('/api/cases/available', (req, res) => {
    res.json({
        success: true,
        data: cases
    });
});

// Endpoint para abrir caixa
app.post('/api/cases/open', (req, res) => {
    const { caseType } = req.body;
    
    const caseInfo = cases.find(c => c.type === caseType);
    if (!caseInfo) {
        return res.status(400).json({ success: false, error: 'Tipo de caixa inválido' });
    }
    
    const probabilities = caseProbabilities[caseType];
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedPrize = null;
    
    for (const [prizeKey, probability] of Object.entries(probabilities)) {
        cumulativeProbability += probability;
        if (random <= cumulativeProbability) {
            selectedPrize = { key: prizeKey, ...prizes[prizeKey] };
            break;
        }
    }
    
    if (!selectedPrize) {
        selectedPrize = { key: 'small_prize', ...prizes.small_prize };
    }
    
    res.json({
        success: true,
        data: {
            case: caseInfo,
            prize: selectedPrize
        }
    });
});

// Endpoint para criar pagamento PIX
app.post('/api/pix/create', async (req, res) => {
    const { amount, description, customer } = req.body;
    
    if (!amount || !customer || !customer.name || !customer.cpf) {
        return res.status(400).json({ 
            success: false, 
            error: 'Dados obrigatórios: amount, customer.name, customer.cpf' 
        });
    }
    
    const orderId = `lr4_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let clientData;
    if (amount >= 500) {
        clientData = {
            fullName: customer.name,
            email: customer.email || 'cliente@lr4.bet',
            phone: customer.phone || '11999999999',
            doc: customer.cpf
        };
    } else {
        clientData = {
            fullName: customer.name || 'Cliente LR4.bet',
            doc: customer.cpf || '11144477735'
        };
        if (customer.email && customer.email.trim()) {
            clientData.email = customer.email.trim();
        }
        if (customer.phone && customer.phone.trim()) {
            const phoneDigits = customer.phone.replace(/\D/g, '');
            if (phoneDigits.length >= 10) {
                clientData.phone = phoneDigits;
            }
        }
    }
    
    const paymentData = {
        orderId: orderId,
        expirationTime: 15,
        amount: amount,
        client: clientData
    };
    
    let result;
    const useSimulation = !PAYGATE_CONFIG.useRealAPI || PAYGATE_CONFIG.fallbackToSimulation;
    
    if (useSimulation) {
        console.log('Usando fallback para simulação...');
        
        const pixCode = `00020126580014br.gov.bcb.pix0136${orderId}520400005303986540${amount.toFixed(2)}5802BR5913LR4.bet Casino6009Sao Paulo62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        let qrCodeDataUrl;
        try {
            qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
        } catch (error) {
            console.error('Erro ao gerar QR code:', error);
            qrCodeDataUrl = `data:image/svg+xml;base64,${Buffer.from(`
                <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="300" height="300" fill="white" stroke="black" stroke-width="2"/>
                    <text x="150" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="black">
                        QR Code PIX
                        R$ ${amount.toFixed(2).replace('.', ',')}
                        ${orderId}
                    </text>
                </svg>
            `).toString('base64')}`;
        }
        
        result = {
            success: true,
            data: {
                transaction_id: orderId,
                status: 'pending',
                amount: amount,
                pixHash: qrCodeDataUrl,
                pixCode: pixCode,
                status_date: new Date().toISOString()
            }
        };
    } else {
        try {
            const response = await axios.post(`${PAYGATE_CONFIG.baseUrl}api/v1/pix/create`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${PAYGATE_CONFIG.secretKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            result = {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Erro de conexão PayGate:', error.message);
            if (PAYGATE_CONFIG.fallbackToSimulation) {
                console.log('Usando fallback para simulação...');
                // Código de simulação aqui (mesmo do bloco acima)
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao processar pagamento PIX'
                });
            }
        }
    }
    
    transactions.push({
        id: orderId,
        amount: amount,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    
    res.json(result);
});

// Endpoint para consultar status do PIX
app.get('/api/pix/status/:id', (req, res) => {
    const { id } = req.params;
    
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
        return res.status(404).json({ success: false, error: 'Transação não encontrada' });
    }
    
    res.json({
        success: true,
        data: {
            transaction_id: id,
            status: transaction.status,
            amount: transaction.amount,
            status_date: transaction.createdAt
        }
    });
});

// Sistema de saques
app.get('/api/withdrawals/config', (req, res) => {
    res.json({
        success: true,
        data: withdrawalConfig
    });
});

app.post('/api/withdrawals/create', async (req, res) => {
    const { amount, method, bank, account, agency, cpf, name } = req.body;
    
    if (!amount || !method || !bank || !account || !agency || !cpf || !name) {
        return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios' });
    }
    
    if (amount < withdrawalConfig.minAmount) {
        return res.status(400).json({ success: false, error: `Valor mínimo para saque é R$ ${withdrawalConfig.minAmount.toFixed(2)}` });
    }
    
    if (amount > withdrawalConfig.maxAmount) {
        return res.status(400).json({ success: false, error: `Valor máximo para saque é R$ ${withdrawalConfig.maxAmount.toFixed(2)}` });
    }
    
    const withdrawalId = `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const withdrawal = {
        id: withdrawalId,
        amount: parseFloat(amount),
        method: method,
        bank: bank,
        account: account,
        agency: agency,
        cpf: cpf,
        name: name,
        status: 'pending',
        processingFee: withdrawalConfig.processingFee,
        netAmount: parseFloat(amount) - withdrawalConfig.processingFee,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    withdrawals.push(withdrawal);
    
    // Simular processamento automático para valores baixos
    setTimeout(() => {
        if (amount <= 100) {
            withdrawal.status = 'completed';
            withdrawal.updatedAt = new Date().toISOString();
            console.log('Saque aprovado automaticamente:', withdrawalId);
        }
    }, 5000);
    
    res.json({ success: true, data: withdrawal });
});

app.get('/api/withdrawals/list', (req, res) => {
    const sortedWithdrawals = withdrawals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: sortedWithdrawals });
});

app.get('/api/withdrawals/status/:id', (req, res) => {
    const { id } = req.params;
    
    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) {
        return res.status(404).json({ success: false, error: 'Saque não encontrado' });
    }
    
    res.json({ success: true, data: withdrawal });
});

// Servir arquivos estáticos
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public_html/lr4.bet.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor LR4.Bet rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
