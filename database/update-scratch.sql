-- Script para atualizar o banco de dados com suporte às raspadinhas
-- Execute este script no seu banco de dados MySQL

USE showdepremios;

-- Adicionar novos tipos de transação à tabela existente
ALTER TABLE transactions 
MODIFY COLUMN type ENUM('deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund', 'scratch_purchase', 'scratch_prize') NOT NULL;

-- Criar tabela de raspadinhas jogadas
CREATE TABLE IF NOT EXISTS scratch_cards (
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

-- Criar índices para melhor performance
CREATE INDEX idx_scratch_cards_user_id ON scratch_cards(user_id);
CREATE INDEX idx_scratch_cards_created_at ON scratch_cards(created_at);
CREATE INDEX idx_scratch_cards_prize_type ON scratch_cards(prize_type);

-- Inserir dados de exemplo para teste (opcional)
INSERT INTO scratch_cards (user_id, scratch_type, price, prize_type, prize_value, prize_description, status) VALUES
(1, 'Clássica', 5.00, 'money', 25.00, 'Prêmio em dinheiro de R$ 25,00', 'completed'),
(1, 'Premium', 10.00, 'product', 150.00, 'Smartphone Premium', 'completed'),
(1, 'Mega', 20.00, 'gift_card', 75.00, 'Vale-presente Amazon R$ 75,00', 'completed');

-- Verificar se a atualização foi bem-sucedida
SELECT 'Tabela scratch_cards criada com sucesso!' as status;
SELECT COUNT(*) as total_scratch_cards FROM scratch_cards;
