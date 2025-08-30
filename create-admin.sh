#!/bin/bash

# Script para criar usuário administrador master
# Autor: Sistema Show de Prêmios
# Data: $(date)

echo "🎯 CRIANDO USUÁRIO ADMINISTRADOR MASTER"
echo "========================================"

# Verificar se o MySQL está rodando
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL não está rodando. Inicie o serviço primeiro."
    exit 1
fi

# Verificar se o banco existe
echo "🔍 Verificando banco de dados..."
if ! mysql -u root -e "USE showdepremios;" 2>/dev/null; then
    echo "❌ Banco de dados 'showdepremios' não existe."
    echo "💡 Execute primeiro: mysql -u root < database/schema.sql"
    exit 1
fi

echo "✅ Banco de dados encontrado"

# Executar script SQL
echo "👤 Criando usuário administrador..."
if mysql -u root showdepremios < database/create-admin-simple.sql; then
    echo "✅ Usuário administrador criado com sucesso!"
    echo ""
    echo "🎉 CREDENCIAIS DE ACESSO:"
    echo "=========================="
    echo "👤 Username: admin_master"
    echo "📧 Email: admin@showdepremios.com"
    echo "🔑 Senha: admin123"
    echo "💰 Saldo: R$ 1.000.000,00"
    echo "👑 Admin: Sim"
    echo "=========================="
    echo ""
    echo "⚠️  IMPORTANTE: Altere a senha após o primeiro login!"
    echo ""
    echo "🚀 Para testar, acesse: http://localhost:3000"
    echo "   Use as credenciais acima para fazer login"
else
    echo "❌ Erro ao criar usuário administrador"
    exit 1
fi

