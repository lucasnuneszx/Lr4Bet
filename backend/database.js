// ===== CONEXÃO COM BANCO DE DADOS POSTGRESQL =====

const { Pool } = require('pg');
const config = require('./config');

// Pool de conexões PostgreSQL
const pool = new Pool(config.database);

// Testar conexão
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
        return false;
    }
}

// Executar query
async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Query executada:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Erro na query:', error.message);
        throw error;
    }
}

// Inicializar tabelas
async function initializeTables() {
    try {
        console.log('🔧 Inicializando tabelas do banco de dados...');
        
        // Tabela de usuários
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                balance DECIMAL(10,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabela de transações PIX
        await query(`
            CREATE TABLE IF NOT EXISTS pix_transactions (
                id SERIAL PRIMARY KEY,
                transaction_id VARCHAR(255) UNIQUE NOT NULL,
                user_id INTEGER REFERENCES users(id),
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                pix_code TEXT,
                qr_code TEXT,
                customer_data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabela de saques
        await query(`
            CREATE TABLE IF NOT EXISTS withdrawals (
                id SERIAL PRIMARY KEY,
                withdrawal_id VARCHAR(255) UNIQUE NOT NULL,
                user_id INTEGER REFERENCES users(id),
                amount DECIMAL(10,2) NOT NULL,
                method VARCHAR(50) NOT NULL,
                bank VARCHAR(10) NOT NULL,
                account VARCHAR(50) NOT NULL,
                agency VARCHAR(20) NOT NULL,
                cpf VARCHAR(14) NOT NULL,
                name VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                processing_fee DECIMAL(10,2) DEFAULT 2.50,
                net_amount DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabela de caixas abertas
        await query(`
            CREATE TABLE IF NOT EXISTS case_openings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                case_type VARCHAR(50) NOT NULL,
                prize_key VARCHAR(100) NOT NULL,
                prize_name VARCHAR(255) NOT NULL,
                prize_value DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabela de raspadinhas
        await query(`
            CREATE TABLE IF NOT EXISTS scratch_cards (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                card_type VARCHAR(50) NOT NULL,
                prize_key VARCHAR(100) NOT NULL,
                prize_name VARCHAR(255) NOT NULL,
                prize_value DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Inserir usuário admin padrão
        await query(`
            INSERT INTO users (email, password, name, balance) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE SET
                password = EXCLUDED.password,
                name = EXCLUDED.name,
                balance = EXCLUDED.balance
        `, ['admin@lr4.bet', 'admin123', 'Admin Master', 10000.00]);
        
        console.log('✅ Tabelas inicializadas com sucesso!');
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar tabelas:', error.message);
        return false;
    }
}

// Fechar pool de conexões
async function closePool() {
    try {
        await pool.end();
        console.log('✅ Pool de conexões PostgreSQL fechado.');
    } catch (error) {
        console.error('❌ Erro ao fechar pool:', error.message);
    }
}

module.exports = {
    pool,
    query,
    testConnection,
    initializeTables,
    closePool
};
