// ===== CONFIGURAÇÃO DAS GATEWAYS DE PAGAMENTO =====

const PaymentConfig = {
    // Configurações das Gateways
    gateways: {
        // Stripe - Para cartões internacionais
        stripe: {
            name: 'Stripe',
            enabled: false,
            publicKey: 'pk_test_51234567890abcdef...', // Substitua pela sua chave pública
            secretKey: 'sk_test_51234567890abcdef...', // Substitua pela sua chave secreta
            webhookSecret: 'whsec_...', // Substitua pelo seu webhook secret
            supportedMethods: ['card', 'pix'],
            supportedCurrencies: ['BRL', 'USD'],
            fees: {
                card: 3.49, // 3.49% + R$ 0.39
                pix: 0.99   // 0.99%
            },
            sandbox: true // true para testes, false para produção
        },
        
        // PayGate - Gateway principal (PIX apenas)
        paygate: {
            name: 'PayGate',
            enabled: true,
            publicKey: '0192c684-3316-72df-ac30-5c7c609e8cb8', // Chave pública fornecida
            secretKey: '661be99aedc13ab06d30aa18f55a61829f65c959d561d52efc9e8150ad0f4da3', // Chave privada fornecida
            apiUrl: 'https://api.paygate.com.br/', // Produção
            sandboxUrl: 'https://api-sandbox.paygate.com.br/', // Sandbox
            supportedMethods: ['pix'],
            supportedCurrencies: ['BRL'],
            fees: {
                pix: 0.99
            },
            sandbox: true // Usando sandbox para testes
        },
        
        // PagSeguro - Gateway brasileiro popular
        pagseguro: {
            name: 'PagSeguro',
            enabled: false,
            email: 'seu-email@exemplo.com', // Substitua pelo seu email
            token: 'SEU_TOKEN_PAGSEGURO', // Substitua pelo seu token
            appId: 'SEU_APP_ID', // Substitua pelo seu App ID
            appKey: 'SEU_APP_KEY', // Substitua pela sua App Key
            supportedMethods: ['card', 'pix', 'boleto', 'debit'],
            supportedCurrencies: ['BRL'],
            fees: {
                card: 3.49,
                pix: 0.99,
                boleto: 0.00,
                debit: 1.99
            },
            sandbox: true
        },
        
        // Mercado Pago - Gateway do Mercado Livre
        mercadopago: {
            name: 'Mercado Pago',
            enabled: false,
            publicKey: 'APP_USR_1234567890abcdef...', // Substitua pela sua chave pública
            accessToken: 'APP_USR_1234567890abcdef...', // Substitua pelo seu access token
            supportedMethods: ['card', 'pix', 'boleto', 'debit'],
            supportedCurrencies: ['BRL'],
            fees: {
                card: 3.49,
                pix: 0.99,
                boleto: 0.00,
                debit: 1.99
            },
            sandbox: true
        },
        
        // Pagar.me - Gateway da Stone
        pagarme: {
            name: 'Pagar.me',
            enabled: false, // Desabilitado por padrão
            apiKey: 'ak_test_1234567890abcdef...', // Substitua pela sua API key
            encryptionKey: 'ek_test_1234567890abcdef...', // Substitua pela sua encryption key
            supportedMethods: ['card', 'pix', 'boleto'],
            supportedCurrencies: ['BRL'],
            fees: {
                card: 3.49,
                pix: 0.99,
                boleto: 0.00
            },
            sandbox: true
        }
    },
    
    // Configurações dos métodos de pagamento
    paymentMethods: {
        pix: {
            name: 'PIX',
            icon: '🏦',
            description: 'Pagamento instantâneo via PIX',
            processingTime: 'Instantâneo',
            maxAmount: 10000.00,
            minAmount: 1.00,
            enabled: true
        },
        card: {
            name: 'Cartão de Crédito',
            icon: '💳',
            description: 'Visa, Mastercard, Elo, American Express',
            processingTime: 'Instantâneo',
            maxAmount: 5000.00,
            minAmount: 5.00,
            enabled: true,
            installments: {
                enabled: true,
                maxInstallments: 12,
                freeInstallments: 6
            }
        },
        boleto: {
            name: 'Boleto Bancário',
            icon: '📄',
            description: 'Pagamento em até 3 dias úteis',
            processingTime: '3 dias úteis',
            maxAmount: 10000.00,
            minAmount: 10.00,
            enabled: true,
            dueDays: 3
        },
        debit: {
            name: 'Débito Online',
            icon: '🏧',
            description: 'Débito em conta corrente',
            processingTime: 'Instantâneo',
            maxAmount: 3000.00,
            minAmount: 5.00,
            enabled: true,
            banks: [
                { code: 'itau', name: 'Itaú', logo: '🏦' },
                { code: 'bradesco', name: 'Bradesco', logo: '🏦' },
                { code: 'santander', name: 'Santander', logo: '🏦' },
                { code: 'bb', name: 'Banco do Brasil', logo: '🏦' },
                { code: 'caixa', name: 'Caixa', logo: '🏦' },
                { code: 'nubank', name: 'Nubank', logo: '💜' },
                { code: 'inter', name: 'Inter', logo: '🟠' },
                { code: 'sicoob', name: 'Sicoob', logo: '🏦' }
            ]
        }
    },
    
    // Configurações gerais
    general: {
        defaultCurrency: 'BRL',
        defaultGateway: 'paygate',
        sandboxMode: true,
        webhookUrl: 'https://seu-dominio.com/webhook/payment',
        returnUrl: 'https://seu-dominio.com/payment/success',
        cancelUrl: 'https://seu-dominio.com/payment/cancel',
        notificationUrl: 'https://seu-dominio.com/payment/notification'
    },
    
    // Configurações de segurança
    security: {
        encryptData: true,
        validateCpf: true,
        validateEmail: true,
        requireAddress: false,
        maxAttempts: 3,
        lockoutTime: 300000 // 5 minutos em millisegundos
    },
    
    // Configurações de notificação
    notifications: {
        email: {
            enabled: true,
            fromEmail: 'noreply@lr4.bet',
            fromName: 'LR4.bet'
        },
        sms: {
            enabled: false,
            provider: 'twilio' // ou outro provedor
        }
    },
    
    // Configurações de logs
    logging: {
        enabled: true,
        level: 'info', // debug, info, warn, error
        logFile: 'payment.log'
    }
};

// Função para obter configuração de uma gateway
function getGatewayConfig(gatewayName) {
    return PaymentConfig.gateways[gatewayName] || null;
}

// Função para obter configuração de um método de pagamento
function getPaymentMethodConfig(methodName) {
    return PaymentConfig.paymentMethods[methodName] || null;
}

// Função para verificar se uma gateway está habilitada
function isGatewayEnabled(gatewayName) {
    const gateway = getGatewayConfig(gatewayName);
    return gateway && gateway.enabled;
}

// Função para verificar se um método de pagamento está habilitado
function isPaymentMethodEnabled(methodName) {
    const method = getPaymentMethodConfig(methodName);
    return method && method.enabled;
}

// Função para obter gateways habilitadas
function getEnabledGateways() {
    return Object.keys(PaymentConfig.gateways).filter(gateway => 
        isGatewayEnabled(gateway)
    );
}

// Função para obter métodos de pagamento habilitados
function getEnabledPaymentMethods() {
    return Object.keys(PaymentConfig.paymentMethods).filter(method => 
        isPaymentMethodEnabled(method)
    );
}

// Função para validar valor de pagamento
function validatePaymentAmount(amount, method) {
    const methodConfig = getPaymentMethodConfig(method);
    if (!methodConfig) return false;
    
    return amount >= methodConfig.minAmount && amount <= methodConfig.maxAmount;
}

// Função para calcular taxa de pagamento
function calculatePaymentFee(amount, method, gateway) {
    const gatewayConfig = getGatewayConfig(gateway);
    if (!gatewayConfig || !gatewayConfig.fees[method]) return 0;
    
    const feePercentage = gatewayConfig.fees[method];
    return (amount * feePercentage) / 100;
}

// Função para obter configuração de parcelamento
function getInstallmentConfig(method, gateway) {
    const methodConfig = getPaymentMethodConfig(method);
    const gatewayConfig = getGatewayConfig(gateway);
    
    if (!methodConfig || !methodConfig.installments) return null;
    
    return {
        enabled: methodConfig.installments.enabled,
        maxInstallments: methodConfig.installments.maxInstallments,
        freeInstallments: methodConfig.installments.freeInstallments,
        gateway: gatewayConfig
    };
}

// Exportar configurações (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentConfig;
}

// Log de inicialização
console.log('💳 Configuração de pagamentos carregada');
console.log('🔧 Gateways habilitadas:', getEnabledGateways());
console.log('💳 Métodos habilitados:', getEnabledPaymentMethods());
console.log('🧪 Modo sandbox:', PaymentConfig.general.sandboxMode);
