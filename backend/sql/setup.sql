-- ===== SCRIPT DE CONFIGURAÇÃO DO BANCO LR4.BET =====

-- Criar banco de dados (executar como superuser)
-- CREATE DATABASE lr4_bet;

-- Conectar ao banco lr4_bet e executar os comandos abaixo:

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER lr4_user WITH PASSWORD 'lr4_password';
-- GRANT ALL PRIVILEGES ON DATABASE lr4_bet TO lr4_user;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de transações PIX
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
);

-- Tabela de saques
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
);

-- Tabela de caixas abertas
CREATE TABLE IF NOT EXISTS case_openings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    case_type VARCHAR(50) NOT NULL,
    prize_key VARCHAR(100) NOT NULL,
    prize_name VARCHAR(255) NOT NULL,
    prize_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de raspadinhas
CREATE TABLE IF NOT EXISTS scratch_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_type VARCHAR(50) NOT NULL,
    prize_key VARCHAR(100) NOT NULL,
    prize_name VARCHAR(255) NOT NULL,
    prize_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão
INSERT INTO users (email, password, name, balance) 
VALUES ('admin@lr4.bet', 'admin123', 'Admin Master', 10000.00)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    balance = EXCLUDED.balance;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pix_transactions_user_id ON pix_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_pix_transactions_status ON pix_transactions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_case_openings_user_id ON case_openings(user_id);
CREATE INDEX IF NOT EXISTS idx_scratch_cards_user_id ON scratch_cards(user_id);

-- Comentários das tabelas
COMMENT ON TABLE users IS 'Usuários do sistema LR4.Bet';
COMMENT ON TABLE pix_transactions IS 'Transações PIX realizadas';
COMMENT ON TABLE withdrawals IS 'Solicitações de saque';
COMMENT ON TABLE case_openings IS 'Registro de abertura de caixas';
COMMENT ON TABLE scratch_cards IS 'Registro de raspadinhas jogadas';
