-- Script para criar usuário administrador master
-- Execute este script no banco de dados MySQL

USE showdepremios;

-- Inserir usuário administrador master
-- Senha: admin123 (já hasheada com bcrypt)
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
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5w.mi',
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
    'USUÁRIO ADMIN CRIADO' as status,
    username,
    email,
    balance,
    is_admin,
    is_verified
FROM users 
WHERE username = 'admin_master';

