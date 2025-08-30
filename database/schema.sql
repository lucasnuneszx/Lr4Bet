-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS showdepremios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE showdepremios;

-- Tabela de usuários
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    cpf VARCHAR(14) UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'suspended', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias esportivas
CREATE TABLE sport_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de ligas/campeonatos
CREATE TABLE leagues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100),
    sport_category_id INT,
    logo VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_category_id) REFERENCES sport_categories(id)
);

-- Tabela de times
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(50),
    logo VARCHAR(255),
    league_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (league_id) REFERENCES leagues(id)
);

-- Tabela de jogos/partidas
CREATE TABLE matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    league_id INT NOT NULL,
    match_date DATETIME NOT NULL,
    status ENUM('scheduled', 'live', 'finished', 'cancelled') DEFAULT 'scheduled',
    home_score INT DEFAULT NULL,
    away_score INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id),
    FOREIGN KEY (league_id) REFERENCES leagues(id)
);

-- Tabela de tipos de apostas
CREATE TABLE bet_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sport_category_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_category_id) REFERENCES sport_categories(id)
);

-- Tabela de odds (probabilidades)
CREATE TABLE odds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    bet_type_id INT NOT NULL,
    selection VARCHAR(100) NOT NULL,
    odds_value DECIMAL(8,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (bet_type_id) REFERENCES bet_types(id)
);

-- Tabela de apostas dos usuários
CREATE TABLE user_bets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    match_id INT NOT NULL,
    bet_type_id INT NOT NULL,
    selection VARCHAR(100) NOT NULL,
    odds_value DECIMAL(8,2) NOT NULL,
    stake_amount DECIMAL(10,2) NOT NULL,
    potential_win DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'won', 'lost', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (bet_type_id) REFERENCES bet_types(id)
);

-- Tabela de transações financeiras
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund', 'scratch_purchase', 'scratch_prize') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de raspadinhas jogadas
CREATE TABLE scratch_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    scratch_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    prize_type ENUM('money', 'product', 'gift_card', 'free_scratch') NOT NULL,
    prize_value DECIMAL(10,2) DEFAULT 0.00,
    prize_description TEXT,
    status ENUM('pending', 'completed', 'claimed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de bonificações
CREATE TABLE bonuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('welcome', 'deposit', 'loyalty', 'promotional') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    wagering_requirement DECIMAL(10,2) DEFAULT 0.00,
    wagered_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'completed', 'expired') DEFAULT 'active',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de configurações do sistema
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados iniciais
INSERT INTO sport_categories (name, slug, icon) VALUES
('Futebol', 'futebol', '⚽'),
('Basquete', 'basquete', '🏀'),
('Tênis', 'tenis', '🎾'),
('Vôlei', 'volei', '🏐'),
('Handebol', 'handebol', '🤾');

INSERT INTO bet_types (name, description, sport_category_id) VALUES
('Resultado Final', 'Apostar no resultado final da partida', 1),
('Ambas Marcam', 'Apostar se ambas as equipes marcarão', 1),
('Mais de 2.5 Gols', 'Apostar se haverá mais de 2.5 gols', 1),
('Resultado Final', 'Apostar no resultado final da partida', 2),
('Total de Pontos', 'Apostar no total de pontos da partida', 2);

INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('min_deposit', '10.00', 'Valor mínimo para depósito'),
('min_withdrawal', '20.00', 'Valor mínimo para saque'),
('max_bet', '1000.00', 'Valor máximo por aposta'),
('welcome_bonus', '100.00', 'Bônus de boas-vindas'),
('bonus_percentage', '100', 'Porcentagem do bônus de depósito');

-- Criar índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_user_bets_user_id ON user_bets(user_id);
CREATE INDEX idx_user_bets_status ON user_bets(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
