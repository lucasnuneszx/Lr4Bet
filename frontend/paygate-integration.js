// ===== INTEGRAÇÃO PAYGATE - SISTEMA REAL =====
console.log('🚀 PayGate Integration carregado!');

class PayGateIntegration {
    constructor() {
        this.config = null;
        this.baseUrl = null;
        this.authHeader = null;
        this.init();
    }

    init() {
        // Aguardar carregamento da configuração
        if (typeof PaymentConfig !== 'undefined') {
            this.setupConfig();
        } else {
            // Aguardar um pouco e tentar novamente
            setTimeout(() => this.init(), 100);
        }
    }

    setupConfig() {
        this.config = PaymentConfig.gateways.paygate;
        if (!this.config || !this.config.enabled) {
            console.error('❌ PayGate não configurado ou desabilitado');
            return;
        }

        // Definir URL base (sandbox ou produção)
        this.baseUrl = this.config.sandbox ? this.config.sandboxUrl : this.config.apiUrl;
        
        // Criar header de autenticação Basic Auth
        const authString = `${this.config.publicKey}:${this.config.secretKey}`;
        this.authHeader = `Basic ${btoa(authString)}`;

        // Verificar se a URL está acessível
        this.testConnection();

        console.log('✅ PayGate configurado:', {
            name: this.config.name,
            environment: this.config.sandbox ? 'Sandbox' : 'Produção',
            baseUrl: this.baseUrl,
            methods: this.config.supportedMethods
        });
    }

    // Testar conexão com a API
    async testConnection() {
        try {
            console.log('🔄 Testando conexão com PayGate...');
            // Tentar endpoint de status ou health
            const response = await fetch(`${this.baseUrl}gateway/status`, {
                method: 'GET',
                headers: {
                    'Authorization': this.authHeader,
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ Conexão com PayGate OK');
                this.connectionStatus = 'connected';
            } else {
                console.warn('⚠️ PayGate retornou status:', response.status);
                this.connectionStatus = 'error';
            }
        } catch (error) {
            console.warn('⚠️ Erro ao conectar com PayGate:', error.message);
            this.connectionStatus = 'error';
        }
    }

    // Criar pagamento PIX
    async createPixPayment(amount, description, customerData = {}) {
        if (!this.config) {
            throw new Error('PayGate não configurado');
        }

        // Usar backend proxy para evitar CORS
        console.log('🔄 Criando pagamento PIX via backend...');

        try {
            const response = await fetch('http://localhost:3001/api/pix/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    description: description,
                    customerData: {
                        name: customerData.name || '',
                        document: customerData.document || '',
                        phone: customerData.phone || '',
                        email: customerData.email || ''
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Erro no backend: ${response.status} - ${errorData.error || response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Pagamento PIX criado via backend:', result);

            return result;

        } catch (error) {
            console.error('❌ Erro ao criar pagamento PIX:', error);
            // Marcar conexão como erro
            this.connectionStatus = 'error';
            throw error;
        }
    }

    // Simular pagamento PIX
    simulatePixPayment(amount, description, useRealQR = false) {
        const paymentId = 'sim_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        let qrCodeText, qrCodeUrl;
        
        if (useRealQR) {
            // Para valores acima de R$ 500,00, usar informações da documentação
            if (amount > 500) {
                // QR Code com informações completas da documentação
                const merchantName = "LR4.BET";
                const merchantCity = "SAO PAULO";
                const transactionId = paymentId;
                const amountStr = amount.toFixed(2);
                
                // Formato PIX válido com todas as informações necessárias
                qrCodeText = `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${amountStr}5802BR59${merchantName.length.toString().padStart(2, '0')}${merchantName}60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}62070503***6304`;
            } else {
                // QR Code simples para valores menores
                qrCodeText = `00020126580014br.gov.bcb.pix0136${paymentId}520400005303986540${amount.toFixed(2)}5802BR5913LR4.BET6009SAO PAULO62070503***6304`;
            }
            qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeText)}`;
        } else {
            // QR Code de demonstração
            qrCodeText = `00020126580014br.gov.bcb.pix0136${paymentId}520400005303986540${amount.toFixed(2)}5802BR5913LR4.BET6009SAO PAULO62070503***6304`;
            qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeText)}`;
        }

        console.log('🎭 Pagamento PIX simulado criado:', {
            paymentId,
            amount,
            description,
            useRealQR
        });

        return {
            success: true,
            paymentId: paymentId,
            qrCode: qrCodeUrl,
            qrCodeText: qrCodeText,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
            status: 'pending',
            amount: amount,
            simulated: true,
            isRealQR: useRealQR
        };
    }

    // Consultar status do pagamento
    async getPaymentStatus(paymentId) {
        if (!this.config) {
            throw new Error('PayGate não configurado');
        }

        // Se for um pagamento simulado, simular status
        if (paymentId.startsWith('sim_')) {
            return this.simulatePaymentStatus(paymentId);
        }

        try {
            console.log('🔄 Consultando status via backend:', paymentId);

            const response = await fetch(`http://localhost:3001/api/pix/status/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Erro no backend: ${response.status} - ${errorData.error || response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Status consultado via backend:', result);

            return result;

        } catch (error) {
            console.error('❌ Erro ao consultar status:', error);
            throw error;
        }
    }

    // Simular status do pagamento
    simulatePaymentStatus(paymentId, isRealPayment = false) {
        // Simular que o pagamento foi aprovado após alguns segundos
        const createdTime = parseInt(paymentId.split('_')[1]);
        const elapsedTime = Date.now() - createdTime;
        
        // Se passou mais de 10 segundos, aprovar o pagamento
        if (elapsedTime > 10000) {
            return {
                success: true,
                paymentId: paymentId,
                status: 'paid',
                amount: 0, // Será preenchido pelo sistema de depósito
                paidAt: new Date().toISOString(),
                createdAt: new Date(createdTime).toISOString(),
                simulated: !isRealPayment,
                isRealPayment: isRealPayment
            };
        } else {
            return {
                success: true,
                paymentId: paymentId,
                status: 'pending',
                amount: 0,
                paidAt: null,
                createdAt: new Date(createdTime).toISOString(),
                simulated: !isRealPayment,
                isRealPayment: isRealPayment
            };
        }
    }

    // Verificar se o pagamento foi aprovado
    isPaymentApproved(status) {
        const approvedStatuses = ['paid', 'approved', 'completed'];
        return approvedStatuses.includes(status?.toLowerCase());
    }

    // Verificar se o pagamento foi cancelado
    isPaymentCancelled(status) {
        const cancelledStatuses = ['cancelled', 'canceled', 'failed', 'expired'];
        return cancelledStatuses.includes(status?.toLowerCase());
    }

    // Verificar se o pagamento está pendente
    isPaymentPending(status) {
        const pendingStatuses = ['pending', 'waiting_payment', 'processing'];
        return pendingStatuses.includes(status?.toLowerCase());
    }
}

// Instanciar integração PayGate
const paygateIntegration = new PayGateIntegration();

// Funções globais para uso no sistema de pagamentos
window.PayGateIntegration = PayGateIntegration;
window.paygateIntegration = paygateIntegration;

// Função para criar pagamento PIX (compatibilidade com sistema existente)
window.createPixPayment = async function(amount, description, customerData) {
    return await paygateIntegration.createPixPayment(amount, description, customerData);
};

// Função para consultar status (compatibilidade com sistema existente)
window.getPaymentStatus = async function(paymentId) {
    return await paygateIntegration.getPaymentStatus(paymentId);
};

console.log('🎯 PayGate Integration pronto para uso!');
