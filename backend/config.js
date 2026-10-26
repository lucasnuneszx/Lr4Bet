// Configurações do sistema LR4.bet

module.exports = {
    // Configurações do Banco de Dados PostgreSQL
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'lr4_bet',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '3005',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    
    // Configurações do Servidor
    server: {
        port: process.env.PORT || 3001,
        environment: process.env.NODE_ENV || 'development'
    },
    
    // Configurações PayGate
    paygate: {
        publicKey: process.env.PAYGATE_PUBLIC_KEY || 'pk_test_1234567890abcdef',
        secretKey: process.env.PAYGATE_SECRET_KEY || 'sk_test_1234567890abcdef1234567890abcdef',
        baseUrl: process.env.PAYGATE_BASE_URL || 'https://sandbox.paygate.com.br/',
        webhookSecret: process.env.PAYGATE_WEBHOOK_SECRET || 'webhook_secret_key_123',
        useRealAPI: process.env.PAYGATE_USE_REAL_API === 'true' || false,
        fallbackToSimulation: process.env.PAYGATE_FALLBACK_TO_SIMULATION === 'true' || true
    }
};
