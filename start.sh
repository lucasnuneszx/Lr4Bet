#!/bin/bash

echo "Iniciando LR4.bet com PayGate..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Instalando..."
    # Instalar Node.js (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    else
        echo "Por favor, instale o Node.js manualmente: https://nodejs.org/"
        exit 1
    fi
fi

# Instalar dependências do backend
echo "Instalando dependências do backend..."
cd backend && npm install && cd ..

# Iniciar servidor unificado (backend + frontend)
echo "Iniciando servidor unificado..."
cd backend && node server.js &
SERVER_PID=$!
cd ..

echo "Servidor iniciado!"
echo "Aplicação: http://localhost:3001"
echo "API: http://localhost:3001/api/"
echo ""
echo "Para parar o servidor, pressione Ctrl+C"

# Função para parar servidor
cleanup() {
    echo ""
    echo "Parando servidor..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait
