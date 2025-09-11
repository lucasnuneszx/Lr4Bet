// ===== SERVIDOR BACKEND PARA PAYGATE =====
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Configurações PayGate
const PAYGATE_CONFIG = {
    publicKey: '0192c684-3316-72df-ac30-5c7c609e8cb8',
    secretKey: '661be99aedc13ab06d30aa18f55a61829f65c959d561d52efc9e8150ad0f4da3',
    baseUrl: 'https://api.paygate.com.br/', // Usando produção
    webhookSecret: 'webhook_secret_key_123' // Chave para validar webhooks
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
        
        const { amount, description, customerData } = req.body;
        
        // Validar dados obrigatórios apenas para valores >= R$ 500
        if (amount >= 500) {
            if (!customerData?.name || customerData.name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
                });
            }
            
            if (!customerData?.document || customerData.document.trim().length < 11) {
                return res.status(400).json({
                    success: false,
                    error: 'CPF é obrigatório e deve ser válido'
                });
            }
            
            // Validar formato do CPF (básico)
            const cpfNumbers = customerData.document.replace(/\D/g, '');
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
            const cpfNumbers = customerData.document.replace(/\D/g, '');
            
            clientData = {
                fullName: customerData.name.trim(),
                doc: cpfNumbers,
                email: customerData.email ? customerData.email.trim() : ''
            };
            
            // Adicionar telefone apenas se fornecido e válido
            if (customerData.phone && customerData.phone.trim()) {
                const phoneDigits = customerData.phone.replace(/\D/g, '');
                if (phoneDigits.length >= 10) {
                    clientData.phone = phoneDigits;
                }
            }
        } else {
            // Para valores < R$ 500, usar dados padrão válidos
            clientData = {
                fullName: 'Cliente LR4.bet',
                doc: '12345678901', // CPF válido para testes
                email: 'cliente@lr4.bet'
            };
        }

        const paymentData = {
            orderId: orderId,
            expirationTime: 15,
            amount: parseFloat(amount.toFixed(2)),
            client: clientData
        };

        console.log('📤 Enviando dados para PayGate:', JSON.stringify(paymentData, null, 2));

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
        console.log('📥 Resposta PayGate - Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Erro detalhado PayGate:', errorData);
            throw new Error(`PayGate API Error: ${response.status} - ${errorData.message || response.statusText}`);
        }

                    const result = await response.json();
                    console.log('✅ Pagamento PIX criado:', result);
                    console.log('🆔 ID do Pagamento:', result.data?.transaction_id || orderId);
                    console.log('📊 Status:', result.data?.status || 'pending');
                    console.log('💰 Valor:', parseFloat(result.data?.amount) || amount);
                    console.log('🔗 Link do Painel:', `https://dashboard.paygate.com.br/transactions/${result.data?.transaction_id || orderId}`);

                    res.json({
                        success: true,
                        paymentId: result.data?.transaction_id || orderId,
                        qrCode: result.data?.pixHash || result.qrCode,
                        qrCodeText: result.data?.pixHash || result.qrCodeText,
                        expiresAt: result.data?.expiration || result.expiresAt,
                        status: result.data?.status || 'pending',
                        amount: parseFloat(result.data?.amount) || amount,
                        simulated: false,
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

// 3. Webhook PayGate
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor PayGate Proxy rodando na porta ${PORT}`);
    console.log(`📡 Endpoints disponíveis:`);
    console.log(`   POST /api/pix/create - Criar pagamento PIX`);
    console.log(`   GET  /api/pix/status/:id - Consultar status`);
    console.log(`   POST /api/webhook/paygate - Webhook PayGate`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/test-connection - Testar conexão`);
});

module.exports = app;
