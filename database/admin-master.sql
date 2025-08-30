-- Script para criar usuário administrador master
-- Execute este script no banco de dados MySQL

USE showdepremios;

-- Inserir usuário administrador master
INSERT INTO users (
    username,
    email,
    password,
    first_name,
    last_name,
    phone,
    birth_date,
    cpf,
    balance,
    is_verified,
    is_admin,
    status
) VALUES (
    'admin_master',
    'admin@showdepremios.com',
    '$2b$10$rQZ8K9mN2pL4vX7wE3sT6uI1oA5bC8dF0gH3jK6lM9nO4pQ7rS2tU5vW8xY1z',
    'Administrador',
    'Master',
    '(11) 99999-9999',
    '1990-01-01',
    '123.456.789-00',
    1000000.00,
    TRUE,
    TRUE,
    'active'
);

-- Inserir transação de bônus inicial
INSERT INTO transactions (
    user_id,
    type,
    amount,
    balance_before,
    balance_after,
    description,
    status,
    reference_id
) VALUES (
    LAST_INSERT_ID(),
    'bonus',
    1000000.00,
    0.00,
    1000000.00,
    'Bônus inicial para administrador master',
    'completed',
    'ADMIN_MASTER_BONUS_001'
);

-- Inserir bônus de boas-vindas
INSERT INTO bonuses (
    user_id,
    type,
    amount,
    wagering_requirement,
    wagered_amount,
    status
) VALUES (
    LAST_INSERT_ID(),
    'welcome',
    1000000.00,
    0.00,
    0.00,
    'completed'
);

-- Verificar se foi criado corretamente
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    balance,
    is_admin,
    is_verified,
    status,
    created_at
FROM users 
WHERE username = 'admin_master';

-- Verificar transação
SELECT 
    t.id,
    t.type,
    t.amount,
    t.balance_before,
    t.balance_after,
    t.description,
    t.status,
    t.created_at
FROM transactions t
JOIN users u ON t.user_id = u.id
WHERE u.username = 'admin_master';

-- Verificar bônus
SELECT 
    b.id,
    b.type,
    b.amount,
    b.status,
    b.created_at
FROM bonuses b
JOIN users u ON b.user_id = u.id
WHERE u.username = 'admin_master';

