# 🎰 LR4.bet - Integração PayGate

Sistema completo de apostas com integração PayGate para pagamentos PIX.

## 🚀 Início Rápido

### Opção 1: Script Automático
```bash
./start.sh
```

### Opção 2: Manual
```bash
# 1. Instalar dependências do backend
cd backend && npm install && cd ..

# 2. Iniciar backend (terminal 1)
cd backend && node server.js

# 3. Iniciar frontend (terminal 2)
cd frontend && python3 -m http.server 3000
```

## 📡 Endpoints

### Backend (Porta 3001)
- `POST /api/pix/create` - Criar pagamento PIX
- `GET /api/pix/status/:id` - Consultar status
- `POST /api/webhook/paygate` - Webhook PayGate
- `GET /api/health` - Health check
- `GET /api/test-connection` - Testar conexão

### Frontend (Porta 3000)
- `http://localhost:3000/lr4.bet.html` - Interface principal

## 🔧 Configuração

### PayGate
- **Chaves:** Configuradas em `server.js`
- **Ambiente:** Produção (sandbox desabilitado)
- **Webhook:** `http://seu-dominio.com/api/webhook/paygate`

### CORS
- **Backend:** Configurado para aceitar requisições do frontend
- **Frontend:** Chama backend em `localhost:3001`

## 🎯 Funcionalidades

### ✅ Implementado
- [x] Backend proxy para PayGate
- [x] CORS configurado
- [x] Webhook PayGate
- [x] QR Code real da PayGate
- [x] Consulta de status
- [x] Validação de assinatura webhook
- [x] Health check
- [x] Teste de conexão

### 🔄 Fluxo de Pagamento
1. **Frontend** → **Backend** → **PayGate API**
2. **PayGate** → **Webhook** → **Backend**
3. **Backend** → **Frontend** (status atualizado)

## 🛠️ Desenvolvimento

### Estrutura
```
├── backend/              # Backend Node.js
│   ├── server.js         # Servidor Express
│   └── package.json      # Dependências Node.js
├── frontend/             # Frontend HTML/CSS/JS
│   ├── lr4.bet.html     # Interface principal
│   ├── paygate-integration.js # Integração PayGate
│   ├── lr4-styles.css   # Estilos principais
│   ├── lr4-script-simple.js # Script principal
│   ├── payment-config.js # Configuração pagamentos
│   ├── deposit-system.js # Sistema de depósito
│   ├── deposit-styles.css # Estilos depósito
│   ├── payment-system.js # Sistema de pagamento
│   └── payment-styles.css # Estilos pagamento
├── start.sh              # Script de inicialização
└── README.md             # Este arquivo
```

### Dependências
- **Backend:** Express, CORS, Crypto
- **Frontend:** Vanilla JavaScript
- **Servidor:** Python HTTP Server

## 🔐 Segurança

### Webhook
- **Validação:** HMAC-SHA256
- **Secret:** Configurado em `server.js`
- **Headers:** `X-Signature`

### CORS
- **Origem:** `http://localhost:3000`
- **Métodos:** GET, POST
- **Headers:** Content-Type, Authorization

## 📱 Teste

1. **Acesse:** `http://localhost:3000/lr4.bet.html`
2. **Clique:** "Depositar"
3. **Digite:** Valor (ex: R$ 10,00)
4. **Escaneie:** QR Code com app bancário
5. **Pague:** Sistema detecta automaticamente

## 🐛 Troubleshooting

### Erro "Failed to fetch"
- ✅ **Resolvido:** Backend proxy implementado

### QR Code inválido
- ✅ **Resolvido:** Dados corretos da documentação

### Pagamento não detectado
- ✅ **Resolvido:** Webhook configurado

## 📞 Suporte

- **PayGate:** https://dev.paygate.com.br/doc/
- **Documentação:** README.md
- **Logs:** Console do navegador e terminal

---

**🎉 Sistema 100% funcional com PayGate!**