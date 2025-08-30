-- Dados de exemplo para popular o banco de dados
-- Execute este arquivo após criar as tabelas com schema.sql

USE showdepremios;

-- Inserir ligas de futebol
INSERT INTO leagues (name, country, sport_category_id, logo) VALUES
('Campeonato Brasileiro Série A', 'Brasil', 1, 'https://via.placeholder.com/100x100/1e40af/ffffff?text=BR'),
('Campeonato Brasileiro Série B', 'Brasil', 1, 'https://via.placeholder.com/100x100/059669/ffffff?text=BR'),
('Copa do Brasil', 'Brasil', 1, 'https://via.placeholder.com/100x100/dc2626/ffffff?text=CB'),
('Libertadores', 'América do Sul', 1, 'https://via.placeholder.com/100x100/7c3aed/ffffff?text=CL'),
('Premier League', 'Inglaterra', 1, 'https://via.placeholder.com/100x100/ea580c/ffffff?text=PL'),
('La Liga', 'Espanha', 1, 'https://via.placeholder.com/100x100/be123c/ffffff?text=LL'),
('Bundesliga', 'Alemanha', 1, 'https://via.placeholder.com/100x100/15803d/ffffff?text=BL'),
('Serie A', 'Itália', 1, 'https://via.placeholder.com/100x100/0d9488/ffffff?text=SA'),
('Ligue 1', 'França', 1, 'https://via.placeholder.com/100x100/0891b2/ffffff?text=L1'),
('Champions League', 'Europa', 1, 'https://via.placeholder.com/100x100/7c2d12/ffffff?text=CL');

-- Inserir ligas de basquete
INSERT INTO leagues (name, country, sport_category_id, logo) VALUES
('NBA', 'Estados Unidos', 2, 'https://via.placeholder.com/100x100/1f2937/ffffff?text=NBA'),
('NBB', 'Brasil', 2, 'https://via.placeholder.com/100x100/374151/ffffff?text=NBB'),
('EuroLeague', 'Europa', 2, 'https://via.placeholder.com/100x100/6b7280/ffffff?text=EL');

-- Inserir times de futebol brasileiro
INSERT INTO teams (name, short_name, logo, league_id) VALUES
-- Série A
('Flamengo', 'FLA', 'https://via.placeholder.com/40x40/1e40af/ffffff?text=FL', 1),
('Palmeiras', 'PAL', 'https://via.placeholder.com/40x40/059669/ffffff?text=PA', 1),
('Corinthians', 'COR', 'https://via.placeholder.com/40x40/6b7280/ffffff?text=CO', 1),
('São Paulo', 'SPO', 'https://via.placeholder.com/40x40/dc2626/ffffff?text=SP', 1),
('Santos', 'SAN', 'https://via.placeholder.com/40x40/7c3aed/ffffff?text=SA', 1),
('Grêmio', 'GRE', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=GR', 1),
('Internacional', 'INT', 'https://via.placeholder.com/40x40/be123c/ffffff?text=IN', 1),
('Atlético Mineiro', 'CAM', 'https://via.placeholder.com/40x40/15803d/ffffff?text=AM', 1),
('Cruzeiro', 'CRU', 'https://via.placeholder.com/40x40/0d9488/ffffff?text=CR', 1),
('Vasco da Gama', 'VAS', 'https://via.placeholder.com/40x40/0891b2/ffffff?text=VA', 1),
('Botafogo', 'BOT', 'https://via.placeholder.com/40x40/7c2d12/ffffff?text=BO', 1),
('Fluminense', 'FLU', 'https://via.placeholder.com/40x40/92400e/ffffff?text=FL', 1);

-- Inserir times de futebol europeu
INSERT INTO teams (name, short_name, logo, league_id) VALUES
-- Premier League
('Manchester City', 'MCI', 'https://via.placeholder.com/40x40/1e40af/ffffff?text=MC', 5),
('Manchester United', 'MUN', 'https://via.placeholder.com/40x40/dc2626/ffffff?text=MU', 5),
('Liverpool', 'LIV', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=LI', 5),
('Chelsea', 'CHE', 'https://via.placeholder.com/40x40/0891b2/ffffff?text=CH', 5),
('Arsenal', 'ARS', 'https://via.placeholder.com/40x40/be123c/ffffff?text=AR', 5),
('Tottenham', 'TOT', 'https://via.placeholder.com/40x40/7c3aed/ffffff?text=TO', 5);

-- La Liga
('Real Madrid', 'RMA', 'https://via.placeholder.com/40x40/6b7280/ffffff?text=RM', 6),
('Barcelona', 'BAR', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=BA', 6),
('Atlético Madrid', 'ATM', 'https://via.placeholder.com/40x40/dc2626/ffffff?text=AM', 6),
('Sevilla', 'SEV', 'https://via.placeholder.com/40x40/059669/ffffff?text=SE', 6);

-- Bundesliga
('Bayern Munich', 'BAY', 'https://via.placeholder.com/40x40/1e40af/ffffff?text=BM', 7),
('Borussia Dortmund', 'BVB', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=BD', 7),
('RB Leipzig', 'RBL', 'https://via.placeholder.com/40x40/059669/ffffff?text=RL', 7);

-- Serie A
('Juventus', 'JUV', 'https://via.placeholder.com/40x40/6b7280/ffffff?text=JU', 8),
('Inter Milan', 'INT', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=IM', 8),
('AC Milan', 'MIL', 'https://via.placeholder.com/40x40/dc2626/ffffff?text=AC', 8),
('Napoli', 'NAP', 'https://via.placeholder.com/40x40/7c3aed/ffffff?text=NA', 8);

-- Times de basquete
INSERT INTO teams (name, short_name, logo, league_id) VALUES
-- NBA
('Los Angeles Lakers', 'LAL', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=LA', 11),
('Boston Celtics', 'BOS', 'https://via.placeholder.com/40x40/059669/ffffff?text=BC', 11),
('Golden State Warriors', 'GSW', 'https://via.placeholder.com/40x40/1e40af/ffffff?text=GS', 11),
('Chicago Bulls', 'CHI', 'https://via.placeholder.com/40x40/dc2626/ffffff?text=CB', 11),
('Miami Heat', 'MIA', 'https://via.placeholder.com/40x40/7c3aed/ffffff?text=MH', 11);

-- NBB
('Flamengo Basquete', 'FLA', 'https://via.placeholder.com/40x40/1e40af/ffffff?text=FB', 12),
('Franca Basquete', 'FRA', 'https://via.placeholder.com/40x40/059669/ffffff?text=FB', 12),
('Bauru Basquete', 'BAU', 'https://via.placeholder.com/40x40/ea580c/ffffff?text=BB', 12);

-- Inserir jogos de exemplo
INSERT INTO matches (home_team_id, away_team_id, league_id, match_date, status) VALUES
-- Jogos brasileiros
(1, 4, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 'scheduled'),
(2, 3, 1, DATE_ADD(NOW(), INTERVAL 3 DAY), 'scheduled'),
(5, 6, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled'),
(7, 8, 1, DATE_ADD(NOW(), INTERVAL 4 DAY), 'scheduled'),
(9, 10, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), 'scheduled'),
(11, 12, 1, DATE_ADD(NOW(), INTERVAL 6 DAY), 'scheduled'),

-- Jogos europeus
(13, 14, 5, DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled'),
(15, 16, 5, DATE_ADD(NOW(), INTERVAL 2 DAY), 'scheduled'),
(17, 18, 6, DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled'),
(19, 20, 6, DATE_ADD(NOW(), INTERVAL 3 DAY), 'scheduled'),
(21, 22, 7, DATE_ADD(NOW(), INTERVAL 2 DAY), 'scheduled'),
(23, 24, 8, DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled'),

-- Jogos ao vivo (para demonstração)
(1, 3, 1, NOW(), 'live'),
(13, 16, 5, NOW(), 'live'),

-- Jogos finalizados
(2, 5, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'finished'),
(6, 9, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'finished'),
(14, 17, 6, DATE_SUB(NOW(), INTERVAL 3 DAY), 'finished');

-- Atualizar placares dos jogos finalizados
UPDATE matches SET home_score = 2, away_score = 1 WHERE id = 19;
UPDATE matches SET home_score = 0, away_score = 3 WHERE id = 20;
UPDATE matches SET home_score = 1, away_score = 1 WHERE id = 21;

-- Inserir odds para os jogos
INSERT INTO odds (match_id, bet_type_id, selection, odds_value) VALUES
-- Jogos brasileiros - Resultado Final
(1, 1, 'Casa', 1.85),
(1, 1, 'Empate', 3.20),
(1, 1, 'Fora', 4.10),

(2, 1, 'Casa', 2.10),
(2, 1, 'Empate', 3.00),
(2, 1, 'Fora', 3.50),

(3, 1, 'Casa', 1.95),
(3, 1, 'Empate', 3.10),
(3, 1, 'Fora', 3.80),

-- Jogos europeus - Resultado Final
(7, 4, 'Casa', 1.75),
(7, 4, 'Empate', 3.40),
(7, 4, 'Fora', 4.50),

(8, 4, 'Casa', 2.25),
(8, 4, 'Empate', 3.20),
(8, 4, 'Fora', 3.10),

-- Ambas Marcam
(1, 2, 'Sim', 1.65),
(1, 2, 'Não', 2.20),

(2, 2, 'Sim', 1.80),
(2, 2, 'Não', 2.00),

-- Mais de 2.5 Gols
(1, 3, 'Sim', 1.90),
(1, 3, 'Não', 1.90),

(2, 3, 'Sim', 2.10),
(2, 3, 'Não', 1.70),

-- Total de Pontos (Basquete)
(7, 5, 'Mais de 200.5', 1.85),
(7, 5, 'Menos de 200.5', 1.95);

-- Inserir usuários de exemplo (senhas: 123456)
INSERT INTO users (username, email, password, first_name, last_name, phone, birth_date, cpf, balance, is_verified, status) VALUES
('joao123', 'joao@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5QqQqQq', 'João', 'Silva', '(11) 99999-9999', '1990-05-15', '123.456.789-01', 150.00, 1, 'active'),
('maria456', 'maria@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5QqQqQq', 'Maria', 'Santos', '(11) 88888-8888', '1985-08-22', '987.654.321-00', 75.50, 1, 'active'),
('pedro789', 'pedro@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5QqQqQq', 'Pedro', 'Oliveira', '(11) 77777-7777', '1992-12-10', '456.789.123-45', 200.00, 1, 'active'),
('ana321', 'ana@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5QqQqQq', 'Ana', 'Costa', '(11) 66666-6666', '1988-03-25', '789.123.456-78', 50.00, 1, 'active');

-- Inserir apostas de exemplo
INSERT INTO user_bets (user_id, match_id, bet_type_id, selection, odds_value, stake_amount, potential_win, status) VALUES
(2, 1, 1, 'Casa', 1.85, 20.00, 37.00, 'pending'),
(2, 2, 1, 'Empate', 3.00, 15.00, 45.00, 'pending'),
(3, 3, 2, 'Sim', 1.65, 25.00, 41.25, 'pending'),
(4, 7, 4, 'Casa', 1.75, 30.00, 52.50, 'pending'),
(2, 8, 4, 'Fora', 3.10, 10.00, 31.00, 'pending');

-- Inserir transações de exemplo
INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, status) VALUES
(2, 'deposit', 100.00, 0.00, 100.00, 'Depósito via PIX', 'completed'),
(2, 'bet', 20.00, 100.00, 80.00, 'Aposta criada - ID: 1', 'completed'),
(2, 'bet', 15.00, 80.00, 65.00, 'Aposta criada - ID: 2', 'completed'),
(3, 'deposit', 200.00, 0.00, 200.00, 'Depósito via cartão', 'completed'),
(3, 'bet', 25.00, 200.00, 175.00, 'Aposta criada - ID: 3', 'completed'),
(4, 'deposit', 50.00, 0.00, 50.00, 'Depósito via boleto', 'completed'),
(4, 'bet', 30.00, 50.00, 20.00, 'Aposta criada - ID: 4', 'completed');

-- Inserir bônus de exemplo
INSERT INTO bonuses (user_id, type, amount, wagering_requirement, status) VALUES
(2, 'welcome', 50.00, 250.00, 'active'),
(3, 'welcome', 100.00, 500.00, 'active'),
(4, 'welcome', 25.00, 125.00, 'active');

-- Atualizar saldos dos usuários
UPDATE users SET balance = 65.00 WHERE id = 2;
UPDATE users SET balance = 175.00 WHERE id = 3;
UPDATE users SET balance = 20.00 WHERE id = 4;

-- Inserir configurações adicionais do sistema
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Show de Prêmios', 'Nome do site'),
('site_description', 'A melhor plataforma de apostas esportivas do Brasil', 'Descrição do site'),
('contact_email', 'contato@showdepremios.com', 'Email de contato'),
('support_phone', '0800 123 4567', 'Telefone de suporte'),
('max_concurrent_users', '1000', 'Máximo de usuários simultâneos'),
('maintenance_mode', 'false', 'Modo de manutenção'),
('registration_enabled', 'true', 'Registro de usuários habilitado'),
('demo_mode', 'false', 'Modo de demonstração'),
('currency', 'BRL', 'Moeda padrão'),
('timezone', 'America/Sao_Paulo', 'Fuso horário padrão');

-- Criar tabela de ações administrativas (se não existir)
CREATE TABLE IF NOT EXISTS admin_actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id INT NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Inserir ações administrativas de exemplo
INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details) VALUES
(1, 'user_created', 'user', 2, 'Usuário joao123 criado automaticamente'),
(1, 'user_created', 'user', 3, 'Usuário maria456 criado automaticamente'),
(1, 'user_created', 'user', 4, 'Usuário pedro789 criado automaticamente'),
(1, 'user_created', 'user', 5, 'Usuário ana321 criado automaticamente'),
(1, 'system_setup', 'system', 1, 'Configuração inicial do sistema'),
(1, 'data_import', 'system', 1, 'Importação de dados de exemplo');

-- Criar índices adicionais para melhor performance
CREATE INDEX IF NOT EXISTS idx_matches_league_date ON matches(league_id, match_date);
CREATE INDEX IF NOT EXISTS idx_odds_match_type ON odds(match_id, bet_type_id);
CREATE INDEX IF NOT EXISTS idx_user_bets_match ON user_bets(match_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, created_at);

-- Inserir estatísticas de exemplo para times
-- Estas seriam calculadas dinamicamente em produção
INSERT INTO team_stats (team_id, total_matches, wins, draws, losses, goals_for, goals_against, points) VALUES
(1, 38, 25, 8, 5, 68, 25, 83),
(2, 38, 23, 10, 5, 62, 28, 79),
(3, 38, 20, 12, 6, 58, 32, 72),
(4, 38, 18, 10, 10, 52, 38, 64),
(5, 38, 16, 12, 10, 48, 40, 60);

-- Criar tabela de estatísticas de times (se não existir)
CREATE TABLE IF NOT EXISTS team_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    total_matches INT DEFAULT 0,
    wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    losses INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    UNIQUE KEY unique_team (team_id)
);

-- Inserir configurações de pagamento
INSERT INTO payment_methods (name, code, is_active, min_amount, max_amount, fees_percentage) VALUES
('PIX', 'pix', 1, 10.00, 10000.00, 0.00),
('Cartão de Crédito', 'credit_card', 1, 20.00, 5000.00, 2.99),
('Boleto Bancário', 'boleto', 1, 10.00, 2000.00, 0.00),
('Transferência Bancária', 'bank_transfer', 1, 50.00, 50000.00, 0.00),
('Carteira Digital', 'digital_wallet', 1, 5.00, 1000.00, 1.50);

-- Criar tabela de métodos de pagamento (se não existir)
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    min_amount DECIMAL(10,2) DEFAULT 0.00,
    max_amount DECIMAL(10,2) DEFAULT 999999.99,
    fees_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações de notificações
INSERT INTO notification_settings (user_id, email_notifications, sms_notifications, push_notifications, bet_results, promotions, news) VALUES
(2, 1, 0, 1, 1, 1, 0),
(3, 1, 1, 1, 1, 1, 1),
(4, 1, 0, 0, 1, 0, 0),
(5, 1, 1, 1, 1, 1, 1);

-- Criar tabela de configurações de notificação (se não existir)
CREATE TABLE IF NOT EXISTS notification_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    bet_results BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT TRUE,
    news BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user (user_id)
);

-- Inserir configurações de KYC (Know Your Customer)
INSERT INTO kyc_settings (user_id, document_verified, address_verified, phone_verified, status, verification_date) VALUES
(2, 1, 1, 1, 'verified', NOW()),
(3, 1, 0, 1, 'pending', NULL),
(4, 0, 0, 1, 'pending', NULL),
(5, 1, 1, 0, 'pending', NULL);

-- Criar tabela de configurações KYC (se não existir)
CREATE TABLE IF NOT EXISTS kyc_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_verified BOOLEAN DEFAULT FALSE,
    address_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verification_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user (user_id)
);

-- Finalizar inserção de dados
SELECT 'Dados de exemplo inseridos com sucesso!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_teams FROM teams;
SELECT COUNT(*) as total_matches FROM matches;
SELECT COUNT(*) as total_odds FROM odds;
