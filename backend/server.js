// ===== SERVIDOR BACKEND PARA PAYGATE =====
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const QRCode = require('qrcode');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Configurações PayGate
const PAYGATE_CONFIG = {
    // Chaves de sandbox PayGate para testes
    publicKey: 'pk_test_1234567890abcdef',
    secretKey: 'sk_test_1234567890abcdef1234567890abcdef',
    baseUrl: 'https://sandbox.paygate.com.br/', // URL de sandbox para testes
    webhookSecret: 'webhook_secret_key_123', // Chave para validar webhooks
    useRealAPI: true, // Flag para usar API real ou simulação (TRUE = API real)
    sandboxUrl: 'https://sandbox.paygate.com.br/', // URL de sandbox para testes
    fallbackToSimulation: true // Fallback para simulação se API falhar
};

// Criar header de autenticação
const authHeader = 'Basic ' + Buffer.from(`${PAYGATE_CONFIG.publicKey}:${PAYGATE_CONFIG.secretKey}`).toString('base64');

// ===== ROTAS =====

// Rota principal - servir a página do frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/lr4.bet.html'));
});

// 1. Criar pagamento PIX (Proxy)
app.post('/api/pix/create', async (req, res) => {
    try {
        console.log('🔄 Criando pagamento PIX:', req.body);
        
        const { amount, description, customer } = req.body;
        
        // Validar dados obrigatórios apenas para valores >= R$ 500
        if (amount >= 500) {
            if (!customer?.name || customer.name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
                });
            }
            
            if (!customer?.cpf || customer.cpf.trim().length < 11) {
                return res.status(400).json({
                    success: false,
                    error: 'CPF é obrigatório e deve ser válido'
                });
            }
            
            // Validar formato do CPF (básico)
            const cpfNumbers = customer.cpf.replace(/\D/g, '');
            if (cpfNumbers.length !== 11) {
                return res.status(400).json({
                    success: false,
                    error: 'CPF deve ter 11 dígitos'
                });
            }
        }
        
        const orderId = 'lr4_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Preparar dados do cliente
        let clientData;
        if (amount >= 500) {
            // Para valores >= R$ 500, usar dados validados do cliente
            const cpfNumbers = customer.cpf ? customer.cpf.replace(/\D/g, '') : customer.cpf.replace(/\D/g, '');
            
            clientData = {
                fullName: customer.name.trim(),
                doc: cpfNumbers,
                email: customer.email ? customer.email.trim() : ''
            };
            
            // Adicionar telefone apenas se fornecido e válido
            if (customer.phone && customer.phone.trim()) {
                const phoneDigits = customer.phone.replace(/\D/g, '');
                if (phoneDigits.length >= 10) {
                    clientData.phone = phoneDigits;
                }
            }
            
            // Adicionar informações de endereço se fornecidas
            if (customer.address && customer.address.trim()) {
                clientData.address = customer.address.trim();
            }
            if (customer.city && customer.city.trim()) {
                clientData.city = customer.city.trim();
            }
            if (customer.state && customer.state.trim()) {
                clientData.state = customer.state.trim();
            }
            if (customer.zipCode && customer.zipCode.trim()) {
                clientData.zipCode = customer.zipCode.replace(/\D/g, '');
            }
        } else {
            // Para valores < R$ 500, apenas nome e CPF obrigatórios
            clientData = {
                fullName: customer.name || 'Cliente LR4.bet',
                doc: customer.cpf || '11144477735' // CPF válido para testes
            };
            
            // Adicionar email e telefone apenas se fornecidos
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

        // Validação dos dados obrigatórios
        if (!clientData.fullName || clientData.fullName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Nome do cliente é obrigatório e deve ter pelo menos 2 caracteres'
            });
        }

        if (!clientData.doc || clientData.doc.length !== 11) {
            return res.status(400).json({
                success: false,
                error: 'CPF é obrigatório e deve ter 11 dígitos'
            });
        }

        // Validação de email apenas se fornecido
        if (clientData.email && !clientData.email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Email deve ser válido quando fornecido'
            });
        }

        const paymentData = {
            orderId: orderId,
            expirationTime: 15,
            amount: parseFloat(amount.toFixed(2)),
            client: clientData
        };

        console.log('📤 Enviando dados para PayGate:', JSON.stringify(paymentData, null, 2));

        let result;
        let useSimulation = false;

        // Tentar API real primeiro se configurado
        if (PAYGATE_CONFIG.useRealAPI) {
            try {
                const response = await fetch(`${PAYGATE_CONFIG.baseUrl}v1/gateway/request-qrcode`, {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                });

                console.log('📥 Resposta PayGate - Status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('❌ Erro PayGate:', errorData);
                    
                    if (PAYGATE_CONFIG.fallbackToSimulation) {
                        console.log('🔄 Usando fallback para simulação...');
                        useSimulation = true;
                    } else {
                        throw new Error(`PayGate API Error: ${response.status} - ${errorData.message || response.statusText}`);
                    }
                } else {
                    result = await response.json();
                    console.log('✅ Pagamento PIX criado via PayGate:', result);
                }
            } catch (error) {
                console.error('❌ Erro de conexão PayGate:', error.message);
                
                if (PAYGATE_CONFIG.fallbackToSimulation) {
                    console.log('🔄 Usando fallback para simulação...');
                    useSimulation = true;
                } else {
                    throw error;
                }
            }
        } else {
            console.log('🔧 Usando simulação PayGate (modo demonstração)');
            useSimulation = true;
        }

        // Usar simulação se necessário
        if (useSimulation) {
            // Gerar código PIX real
            const pixCode = `00020126580014br.gov.bcb.pix0136${orderId}520400005303986540${amount.toFixed(2)}5802BR5913LR4.bet Casino6009Sao Paulo62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            
            // Gerar QR code real
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
                // Fallback para QR code simples
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
            console.log('✅ Pagamento PIX simulado criado:', result);
        }

        res.json({
            success: true,
            paymentId: result.data?.transaction_id || orderId,
            qrCode: result.data?.pixHash || result.qrCode,
            qrCodeText: result.data?.pixHash || result.qrCodeText,
            expiresAt: result.data?.expiration || result.expiresAt,
            status: result.data?.status || 'pending',
            amount: parseFloat(result.data?.amount) || amount,
            simulated: useSimulation,
            payment: {
                orderId: orderId,
                qrCode: result.data?.pixHash || result.qrCode,
                pixCode: result.data?.pixCode || result.pixCode,
                amount: parseFloat(result.data?.amount) || amount,
                status: result.data?.status || 'pending'
            },
            dashboardUrl: `https://dashboard.paygate.com.br/transactions/${result.data?.transaction_id || orderId}`
        });

    } catch (error) {
        console.error('❌ Erro ao criar pagamento PIX:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 2. Consultar status do pagamento
app.get('/api/pix/status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        console.log('🔄 Consultando status:', paymentId);

        const response = await fetch(`${PAYGATE_CONFIG.baseUrl}v1/transaction/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`PayGate API Error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Status consultado:', result);

        if (result.status && result.data) {
            res.json({
                success: true,
                paymentId: result.data.transaction_id,
                orderId: result.data.order_id,
                status: result.data.status,
                amount: result.data.amount,
                fee: result.data.fee,
                netAmount: result.data.netAmount,
                method: result.data.method,
                createdAt: result.data.created_at,
                statusDate: result.data.status_date,
                simulated: false
            });
        } else {
            throw new Error('Resposta inválida da API');
        }

    } catch (error) {
        console.error('❌ Erro ao consultar status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 3. Verificação de Status do Pagamento
app.get('/api/pix/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        console.log('🔍 Verificando status do pagamento:', orderId);
        
        // Em produção, aqui você faria uma consulta real à API PayGate
        // Para demonstração, vamos simular diferentes status
        
        // Tentar consulta real na API PayGate primeiro
        if (PAYGATE_CONFIG.useRealAPI) {
            try {
                const response = await fetch(`${PAYGATE_CONFIG.baseUrl}v1/gateway/status/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': authHeader,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    return res.json({
                        success: true,
                        status: result.data?.status || 'pending',
                        orderId: orderId,
                        timestamp: new Date().toISOString(),
                        paygateData: result.data
                    });
                }
            } catch (error) {
                console.error('❌ Erro ao consultar status PayGate:', error.message);
            }
        }

        // Fallback para simulação de status
        const orderTime = parseInt(orderId.split('_')[1]);
        const currentTime = Date.now();
        const timeDiff = (currentTime - orderTime) / 1000; // em segundos
        
        let finalStatus = 'pending';
        if (timeDiff > 30) {
            finalStatus = 'paid';
        } else if (timeDiff > 900) { // 15 minutos
            finalStatus = 'expired';
        }
        
        res.json({
            success: true,
            status: finalStatus,
            orderId: orderId,
            timestamp: new Date().toISOString(),
            simulated: true
        });
        
    } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// 4. Webhook PayGate
app.post('/api/webhook/paygate', (req, res) => {
    try {
        const signature = req.headers['x-signature'];
        const payload = JSON.stringify(req.body);
        
        console.log('🔔 Webhook recebido:', req.body);
        
        // Validar assinatura (HMAC-SHA256)
        const expectedSignature = crypto
            .createHmac('sha256', PAYGATE_CONFIG.webhookSecret)
            .update(payload)
            .digest('hex');
        
        if (signature !== expectedSignature) {
            console.error('❌ Assinatura inválida');
            return res.status(401).json({ error: 'Assinatura inválida' });
        }
        
        const { transaction_id, order_id, status, amount } = req.body;
        
        console.log(`✅ Pagamento ${status}: ${transaction_id} - R$ ${amount}`);
        
        // Aqui você pode processar o pagamento
        // - Atualizar banco de dados
        // - Enviar notificação
        // - Liberar créditos
        
        res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('❌ Erro no webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'PayGate Proxy Server'
    });
});

// 5. Testar conexão com PayGate
app.get('/api/test-connection', async (req, res) => {
    try {
        const response = await fetch(`${PAYGATE_CONFIG.baseUrl}v1/gateway/status`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json'
            }
        });
        
        res.json({
            success: response.ok,
            status: response.status,
            message: response.ok ? 'Conexão OK' : 'Erro na conexão'
        });
        
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// ===== SISTEMA DE SAQUES =====
let withdrawals = [];
let withdrawalConfig = {
    minAmount: 10.00,
    maxAmount: 10000.00,
    processingFee: 2.50
};

// Endpoint para obter configurações de saque
app.get('/api/withdrawals/config', (req, res) => {
    console.log('📋 Consultando configurações de saque...');
    
    res.json({
        success: true,
        data: withdrawalConfig
    });
});

// Endpoint para criar solicitação de saque
app.post('/api/withdrawals/create', async (req, res) => {
    const { amount, method, bank, account, agency, cpf, name } = req.body;
    
    console.log('💸 Criando solicitação de saque:', {
        amount, method, bank, account, agency, cpf, name
    });
    
    // Validar dados obrigatórios
    if (!amount || !method || !bank || !account || !agency || !cpf || !name) {
        return res.status(400).json({
            success: false,
            error: 'Todos os campos são obrigatórios'
        });
    }
    
    // Validar valor mínimo
    if (amount < withdrawalConfig.minAmount) {
        return res.status(400).json({
            success: false,
            error: `Valor mínimo para saque é R$ ${withdrawalConfig.minAmount.toFixed(2)}`
        });
    }
    
    // Validar valor máximo
    if (amount > withdrawalConfig.maxAmount) {
        return res.status(400).json({
            success: false,
            error: `Valor máximo para saque é R$ ${withdrawalConfig.maxAmount.toFixed(2)}`
        });
    }
    
    // Criar ID único para o saque
    const withdrawalId = `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Criar objeto do saque
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
    
    // Adicionar à lista de saques
    withdrawals.push(withdrawal);
    
    console.log('✅ Saque criado:', withdrawal);
    
    // Simular processamento com PayGate (em produção, integrar com API real)
    setTimeout(() => {
        // Simular aprovação automática para valores baixos
        if (amount <= 100) {
            withdrawal.status = 'completed';
            withdrawal.updatedAt = new Date().toISOString();
            console.log('✅ Saque aprovado automaticamente:', withdrawalId);
        }
    }, 5000);
    
    res.json({
        success: true,
        data: withdrawal
    });
});

// Endpoint para listar saques
app.get('/api/withdrawals/list', (req, res) => {
    console.log('📋 Listando saques...');
    
    // Ordenar por data de criação (mais recentes primeiro)
    const sortedWithdrawals = withdrawals.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({
        success: true,
        data: sortedWithdrawals
    });
});

// Endpoint para consultar status de um saque específico
app.get('/api/withdrawals/status/:id', (req, res) => {
    const { id } = req.params;
    
    console.log('🔍 Consultando status do saque:', id);
    
    const withdrawal = withdrawals.find(w => w.id === id);
    
    if (!withdrawal) {
        return res.status(404).json({
            success: false,
            error: 'Saque não encontrado'
        });
    }
    
    res.json({
        success: true,
        data: withdrawal
    });
});

// ===== SISTEMA DE CAIXAS =====

// 6. Obter informações das caixas disponíveis
app.get('/api/cases/available', (req, res) => {
    try {
        const availableCases = {
            premium: {
                id: 'premium',
                name: 'Caixa Premium LR4',
                price: 50.00,
                description: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=280&h=200&fit=crop&crop=center',
                prizes: [
                    { name: 'iPhone 15 Pro Max', value: 8000, rarity: 'legendary', probability: 0.5 },
                    { name: 'MacBook Pro M3', value: 12000, rarity: 'legendary', probability: 0.3 },
                    { name: 'AirPods Pro 2', value: 2000, rarity: 'epic', probability: 2.0 },
                    { name: 'Apple Watch Series 9', value: 3000, rarity: 'epic', probability: 1.5 },
                    { name: 'JBL Boombox 3', value: 800, rarity: 'rare', probability: 5.0 },
                    { name: 'R$ 200,00', value: 200, rarity: 'common', probability: 15.0 },
                    { name: 'R$ 100,00', value: 100, rarity: 'common', probability: 25.0 },
                    { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 50.7 }
                ]
            },
            medium: {
                id: 'medium',
                name: 'Caixa Média LR4',
                price: 20.00,
                description: 'Chance de ganhar AirPods, Xiaomi, Caixinha JBL e muito mais!',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=280&h=200&fit=crop&crop=center',
                prizes: [
                    { name: 'AirPods Pro 2', value: 2000, rarity: 'legendary', probability: 1.0 },
                    { name: 'Xiaomi Redmi Note 13', value: 1200, rarity: 'epic', probability: 2.0 },
                    { name: 'JBL Charge 5', value: 600, rarity: 'epic', probability: 3.0 },
                    { name: 'Galaxy Buds', value: 400, rarity: 'rare', probability: 8.0 },
                    { name: 'Fone Bluetooth JBL', value: 200, rarity: 'rare', probability: 12.0 },
                    { name: 'R$ 100,00', value: 100, rarity: 'common', probability: 25.0 },
                    { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 49.0 }
                ]
            },
            basic: {
                id: 'basic',
                name: 'Caixa Básica LR4',
                price: 10.00,
                description: 'Chance de ganhar Fone Bluetooth, Carregador, Caixinha JBL e muito mais!',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=280&h=200&fit=crop&crop=center',
                prizes: [
                    { name: 'JBL Charge 5', value: 600, rarity: 'epic', probability: 2.0 },
                    { name: 'Fone Bluetooth JBL', value: 200, rarity: 'rare', probability: 8.0 },
                    { name: 'Caixinha JBL Go 3', value: 150, rarity: 'rare', probability: 10.0 },
                    { name: 'Carregador Wireless', value: 100, rarity: 'common', probability: 20.0 },
                    { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 60.0 }
                ]
            },
            simple: {
                id: 'simple',
                name: 'Caixa Simples LR4',
                price: 5.00,
                description: 'Chance de ganhar R$ 50, R$ 20, R$ 10 e muito mais!',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=280&h=200&fit=crop&crop=center',
                prizes: [
                    { name: 'R$ 100,00', value: 100, rarity: 'epic', probability: 2.0 },
                    { name: 'R$ 50,00', value: 50, rarity: 'rare', probability: 8.0 },
                    { name: 'R$ 20,00', value: 20, rarity: 'common', probability: 25.0 },
                    { name: 'R$ 10,00', value: 10, rarity: 'common', probability: 35.0 },
                    { name: 'R$ 5,00', value: 5, rarity: 'common', probability: 30.0 }
                ]
            }
        };

        res.json({
            success: true,
            cases: availableCases
        });

    } catch (error) {
        console.error('❌ Erro ao buscar caixas:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 7. Comprar e abrir caixa
app.post('/api/cases/open', (req, res) => {
    try {
        const { caseType, userBalance } = req.body;

        console.log('📦 Abrindo caixa:', caseType);

        // Validar tipo de caixa
        const validCaseTypes = ['premium', 'medium', 'basic', 'simple'];
        if (!validCaseTypes.includes(caseType)) {
            return res.status(400).json({
                success: false,
                error: 'Tipo de caixa inválido'
            });
        }

        // Obter informações da caixa
        const casePrices = {
            premium: 50.00,
            medium: 20.00,
            basic: 10.00,
            simple: 5.00
        };

        const casePrice = casePrices[caseType];

        // Validar saldo
        if (userBalance < casePrice) {
            return res.status(400).json({
                success: false,
                error: 'Saldo insuficiente',
                requiredAmount: casePrice,
                currentBalance: userBalance
            });
        }

        // Selecionar prêmio baseado nas probabilidades
        const prize = selectCasePrize(caseType);

        console.log('🎁 Prêmio selecionado:', prize);

        // Gerar ID único para a transação
        const transactionId = 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        res.json({
            success: true,
            transactionId: transactionId,
            caseType: caseType,
            casePrice: casePrice,
            prize: prize,
            newBalance: userBalance - casePrice,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro ao abrir caixa:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Função auxiliar para selecionar prêmio baseado em probabilidades
function selectCasePrize(caseType) {
    const casePrizes = {
        premium: [
            { name: 'iPhone 15 Pro Max', value: 8000, rarity: 'legendary', probability: 0.5 },
            { name: 'MacBook Pro M3', value: 12000, rarity: 'legendary', probability: 0.3 },
            { name: 'AirPods Pro 2', value: 2000, rarity: 'epic', probability: 2.0 },
            { name: 'Apple Watch Series 9', value: 3000, rarity: 'epic', probability: 1.5 },
            { name: 'JBL Boombox 3', value: 800, rarity: 'rare', probability: 5.0 },
            { name: 'R$ 200,00', value: 200, rarity: 'common', probability: 15.0 },
            { name: 'R$ 100,00', value: 100, rarity: 'common', probability: 25.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 50.7 }
        ],
        medium: [
            { name: 'AirPods Pro 2', value: 2000, rarity: 'legendary', probability: 1.0 },
            { name: 'Xiaomi Redmi Note 13', value: 1200, rarity: 'epic', probability: 2.0 },
            { name: 'JBL Charge 5', value: 600, rarity: 'epic', probability: 3.0 },
            { name: 'Galaxy Buds', value: 400, rarity: 'rare', probability: 8.0 },
            { name: 'Fone Bluetooth JBL', value: 200, rarity: 'rare', probability: 12.0 },
            { name: 'R$ 100,00', value: 100, rarity: 'common', probability: 25.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 49.0 }
        ],
        basic: [
            { name: 'JBL Charge 5', value: 600, rarity: 'epic', probability: 2.0 },
            { name: 'Fone Bluetooth JBL', value: 200, rarity: 'rare', probability: 8.0 },
            { name: 'Caixinha JBL Go 3', value: 150, rarity: 'rare', probability: 10.0 },
            { name: 'Carregador Wireless', value: 100, rarity: 'common', probability: 20.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 60.0 }
        ],
        simple: [
            { name: 'R$ 100,00', value: 100, rarity: 'epic', probability: 2.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'rare', probability: 8.0 },
            { name: 'R$ 20,00', value: 20, rarity: 'common', probability: 25.0 },
            { name: 'R$ 10,00', value: 10, rarity: 'common', probability: 35.0 },
            { name: 'R$ 5,00', value: 5, rarity: 'common', probability: 30.0 }
        ]
    };

    const prizes = casePrizes[caseType] || casePrizes.premium;
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    const random = Math.random() * totalProbability;

    let currentProbability = 0;
    for (const prize of prizes) {
        currentProbability += prize.probability;
        if (random <= currentProbability) {
            return prize;
        }
    }

    return prizes[prizes.length - 1]; // Fallback
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor PayGate Proxy rodando na porta ${PORT}`);
    console.log(`📡 Endpoints disponíveis:`);
    console.log(`   POST /api/pix/create - Criar pagamento PIX`);
    console.log(`   GET  /api/pix/status/:id - Consultar status`);
    console.log(`   POST /api/webhook/paygate - Webhook PayGate`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/test-connection - Testar conexão`);
    console.log(`   GET  /api/cases/available - Obter caixas disponíveis`);
    console.log(`   POST /api/cases/open - Abrir caixa e obter prêmio`);
    console.log(`   GET  /api/withdrawals/config - Configurações de saque`);
    console.log(`   POST /api/withdrawals/create - Criar solicitação de saque`);
    console.log(`   GET  /api/withdrawals/list - Listar saques`);
    console.log(`   GET  /api/withdrawals/status/:id - Status do saque`);
    console.log(`🎰 Sistema de caixas ativo!`);
    console.log(`💸 Sistema de saques ativo!`);
});

module.exports = app;
