const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Configurações do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Coloque sua senha do MySQL aqui
    database: 'showdepremios'
};

async function createAdminMaster() {
    try {
        // Conectar ao banco
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado ao banco de dados MySQL');

        // Gerar hash da senha (senha: admin123)
        const password = 'admin123';
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log('✅ Hash da senha gerado');

        // Inserir usuário administrador master
        const [result] = await connection.execute(`
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            'admin_master',
            'admin@showdepremios.com',
            hashedPassword,
            'Administrador',
            'Master',
            '(11) 99999-9999',
            '1990-01-01',
            '123.456.789-00',
            1000000.00,
            true,
            true,
            'active'
        ]);

        const userId = result.insertId;
        console.log('✅ Usuário administrador criado com ID:', userId);

        // Inserir transação de bônus inicial
        await connection.execute(`
            INSERT INTO transactions (
                user_id,
                type,
                amount,
                balance_before,
                balance_after,
                description,
                status,
                reference_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            'bonus',
            1000000.00,
            0.00,
            1000000.00,
            'Bônus inicial para administrador master',
            'completed',
            'ADMIN_MASTER_BONUS_001'
        ]);

        console.log('✅ Transação de bônus criada');

        // Inserir bônus de boas-vindas
        await connection.execute(`
            INSERT INTO bonuses (
                user_id,
                type,
                amount,
                wagering_requirement,
                wagered_amount,
                status
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            userId,
            'welcome',
            1000000.00,
            0.00,
            0.00,
            'completed'
        ]);

        console.log('✅ Bônus de boas-vindas criado');

        // Verificar se foi criado corretamente
        const [users] = await connection.execute(`
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
            WHERE username = ?
        `, ['admin_master']);

        if (users.length > 0) {
            const user = users[0];
            console.log('\n🎉 USUÁRIO ADMINISTRADOR MASTER CRIADO COM SUCESSO!');
            console.log('==================================================');
            console.log(`👤 Username: ${user.username}`);
            console.log(`📧 Email: ${user.email}`);
            console.log(`🔑 Senha: admin123`);
            console.log(`💰 Saldo: R$ ${user.balance.toLocaleString('pt-BR')}`);
            console.log(`👑 Admin: ${user.is_admin ? 'Sim' : 'Não'}`);
            console.log(`✅ Verificado: ${user.is_verified ? 'Sim' : 'Não'}`);
            console.log(`📅 Criado em: ${user.created_at}`);
            console.log('==================================================');
            console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
        }

        await connection.end();
        console.log('\n✅ Conexão com o banco fechada');

    } catch (error) {
        console.error('❌ Erro ao criar usuário administrador:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Dica: Verifique as credenciais do banco de dados no arquivo');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n💡 Dica: O banco de dados "showdepremios" não existe. Execute primeiro o schema.sql');
        }
    }
}

// Executar a função
createAdminMaster();

