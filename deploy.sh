#!/bin/bash

# Script de Deploy para Hostinger
echo "Iniciando deploy do LR4.Bet para Hostinger..."

echo "Instalando dependências..."
cd backend
npm install --production

echo "Configurando ambiente de produção..."
cp env.production .env

echo "Criando estrutura de diretórios..."
cd ..
mkdir -p public_html
cp -r frontend/* public_html/

echo "Configurando permissões..."
chmod 755 public_html
chmod 644 public_html/*

echo "Deploy preparado! Agora faça upload para a Hostinger."
echo "Próximos passos:"
echo "   1. Compactar a pasta 'public_html'"
echo "   2. Fazer upload via File Manager da Hostinger"
echo "   3. Configurar banco de dados PostgreSQL"
echo "   4. Configurar Node.js no painel"
