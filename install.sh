#!/bin/bash

# Script de instalação do Show de Prêmios
# Sistema de Apostas Esportivas

echo "🚀 Instalando Show de Prêmios - Sistema de Apostas Esportivas"
echo "================================================================"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js versão 16 ou superior."
    echo "📥 Download: https://nodejs.org/"
    exit 1
fi

# Verificar se o MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL não está instalado. Por favor, instale o MySQL versão 8.0 ou superior."
    echo "📥 Download: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js versão 16 ou superior é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo "✅ MySQL $(mysql --version | cut -d' ' -f6 | cut -d',' -f1) detectado"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"

# Configurar banco de dados
echo ""
echo "🗄️ Configurando banco de dados..."

# Solicitar informações do banco
read -p "Host do MySQL (padrão: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Porta do MySQL (padrão: 3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Usuário do MySQL: " DB_USER

read -s -p "Senha do MySQL: " DB_PASSWORD
echo ""

read -p "Nome do banco de dados (padrão: showdepremios): " DB_NAME
DB_NAME=${DB_NAME:-showdepremios}

# Criar arquivo de configuração
echo ""
echo "⚙️ Criando arquivo de configuração..."

# Gerar chaves secretas
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT

# Configurações de Segurança
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET

# Configurações de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Configurações de API Externa (para dados esportivos)
SPORTS_API_KEY=sua_chave_api_esportes
SPORTS_API_URL=https://api.football-data.org/v2
EOF

echo "✅ Arquivo .env criado com sucesso!"

# Criar banco de dados
echo ""
echo "🗄️ Criando banco de dados..."

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -ne 0 ]; then
    echo "❌ Erro ao criar banco de dados"
    exit 1
fi

echo "✅ Banco de dados '$DB_NAME' criado com sucesso!"

# Executar script de criação das tabelas
echo ""
echo "📋 Criando tabelas do banco de dados..."

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Erro ao criar tabelas"
    exit 1
fi

echo "✅ Tabelas criadas com sucesso!"

# Criar usuário administrador
echo ""
echo "👤 Criando usuário administrador..."

read -p "Nome do usuário admin: " ADMIN_USERNAME
read -p "Email do usuário admin: " ADMIN_EMAIL
read -s -p "Senha do usuário admin: " ADMIN_PASSWORD
echo ""

# Hash da senha (usando Node.js)
ADMIN_PASSWORD_HASH=$(node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('$ADMIN_PASSWORD', 12);
console.log(hash);
")

# Inserir usuário admin
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "
INSERT INTO users (username, email, password, first_name, last_name, is_admin, is_verified, status) 
VALUES ('$ADMIN_USERNAME', '$ADMIN_EMAIL', '$ADMIN_PASSWORD_HASH', 'Administrador', 'Sistema', 1, 1, 'active')
ON DUPLICATE KEY UPDATE is_admin = 1, is_verified = 1, status = 'active';
"

if [ $? -ne 0 ]; then
    echo "❌ Erro ao criar usuário administrador"
    exit 1
fi

echo "✅ Usuário administrador criado com sucesso!"

# Criar diretórios necessários
echo ""
echo "📁 Criando diretórios necessários..."

mkdir -p public/uploads
mkdir -p logs

echo "✅ Diretórios criados com sucesso!"

# Configurar permissões
echo ""
echo "🔐 Configurando permissões..."

chmod +x server.js
chmod 644 .env

echo "✅ Permissões configuradas!"

# Testar conexão com banco
echo ""
echo "🔍 Testando conexão com banco de dados..."

node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao conectar com banco de dados:', error.message);
        process.exit(1);
    }
}

testConnection();
"

if [ $? -ne 0 ]; then
    echo "❌ Falha no teste de conexão"
    exit 1
fi

# Instalação concluída
echo ""
echo "🎉 Instalação concluída com sucesso!"
echo "================================================================"
echo ""
echo "📋 Resumo da instalação:"
echo "   • Dependências instaladas"
echo "   • Banco de dados configurado"
echo "   • Tabelas criadas"
echo "   • Usuário administrador criado"
echo "   • Arquivo de configuração criado"
echo ""
echo "🚀 Para iniciar o servidor:"
echo "   npm run dev    # Desenvolvimento"
echo "   npm start      # Produção"
echo ""
echo "🌐 O servidor estará disponível em: http://localhost:3000"
echo ""
echo "👤 Credenciais do administrador:"
echo "   Usuário: $ADMIN_USERNAME"
echo "   Email: $ADMIN_EMAIL"
echo "   Senha: [a senha que você digitou]"
echo ""
echo "📚 Para mais informações, consulte o README.md"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   • Altere as senhas padrão em produção"
echo "   • Configure corretamente as variáveis de email"
echo "   • Configure HTTPS em produção"
echo "   • Faça backup regular do banco de dados"
echo ""
echo "🎯 Boa sorte com seu sistema de apostas!"
echo ""
