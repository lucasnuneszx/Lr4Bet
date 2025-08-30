const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'showdepremios',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

// Testar conexão
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar com banco de dados:', error.message);
        process.exit(1);
    }
};

// Executar query com pool
const query = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Erro na query:', error);
        throw error;
    }
};

// Executar query com transação
const transaction = async (callback) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};
