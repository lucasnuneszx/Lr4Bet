# 🎰 LR4.Bet - Sistema de Apostas e Jogos

## 📋 Descrição

Sistema completo de apostas e jogos com integração PostgreSQL, incluindo:

- 🎲 **Sistema de Caixas** com diferentes níveis de prêmios
- 🎫 **Raspadinhas** interativas
- 💰 **Sistema de Depósitos** via PIX
- 💸 **Sistema de Saques** com processamento automático
- 🗄️ **Banco de Dados PostgreSQL** para persistência
- 🔐 **Autenticação** de usuários
- 📊 **Painel Administrativo** via pgAdmin 4

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Servidor principal
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **PayGate API** - Integração de pagamentos PIX
- **QRCode** - Geração de códigos QR

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização e animações
- **JavaScript** - Lógica e interatividade
- **Font Awesome** - Ícones

### Banco de Dados
- **PostgreSQL 17** - Banco principal
- **pgAdmin 4** - Interface administrativa

## 📁 Estrutura do Projeto

```
raspadinha/
├── backend/
│   ├── server.js              # Servidor principal
│   ├── server-with-db.js      # Servidor com integração PostgreSQL
│   ├── database.js            # Configuração do banco
│   ├── config.js              # Configurações centralizadas
│   ├── sql/
│   │   └── setup.sql          # Script de criação das tabelas
│   └── package.json           # Dependências Node.js
├── frontend/
│   ├── lr4.bet.html           # Página principal
│   ├── lr4-styles.css         # Estilos principais
│   ├── lr4-unified.js         # JavaScript unificado
│   └── payment-styles.css     # Estilos de pagamento
├── INTEGRACAO_POSTGRESQL.md   # Guia de integração
├── README.md                  # Este arquivo
└── .gitignore                 # Arquivos ignorados pelo Git
```

## 🛠️ Instalação e Configuração

### 1. Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL 17
- pgAdmin 4

### 2. Instalação do Backend
```bash
cd backend
npm install
```

### 3. Configuração do Banco de Dados
```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE lr4_bet;"

# Executar script de configuração
psql -U postgres -d lr4_bet -f sql/setup.sql
```

### 4. Configuração das Variáveis de Ambiente
Criar arquivo `.env` na pasta `backend/`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lr4_bet
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
PORT=3001
NODE_ENV=development
```

### 5. Executar o Sistema
```bash
# Backend (com banco de dados)
cd backend
node server-with-db.js

# Frontend
cd frontend
python3 -m http.server 3000
```

## 🎮 Funcionalidades

### Sistema de Caixas
- **4 tipos de caixas**: Premium, Média, Básica e Simples
- **Sistema de probabilidades** configurável
- **Animações** de abertura
- **Histórico** de prêmios

### Sistema de Raspadinhas
- **Interface interativa** com efeito de raspagem
- **Diferentes tipos** de cartas
- **Sistema de prêmios** baseado em probabilidades
- **Animações** realistas

### Sistema de Pagamentos
- **Depósitos via PIX** com QR Code
- **Integração PayGate** (sandbox/produção)
- **Validação** de dados do cliente
- **Status** em tempo real

### Sistema de Saques
- **Processamento automático** para valores baixos
- **Múltiplos métodos**: PIX, TED, DOC
- **Validação** de dados bancários
- **Histórico** completo

### Autenticação
- **Login** seguro
- **Sessão** persistente
- **Controle de acesso** por usuário

## 🗄️ Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema
- `pix_transactions` - Transações PIX
- `withdrawals` - Solicitações de saque
- `case_openings` - Abertura de caixas
- `scratch_cards` - Raspadinhas jogadas

### Usuário Padrão
- **Email**: admin@lr4.bet
- **Senha**: admin123
- **Saldo**: R$ 10.000,00

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

### Pagamentos
- `POST /api/pix/create` - Criar pagamento PIX
- `GET /api/pix/status/:id` - Consultar status

### Saques
- `GET /api/withdrawals/config` - Configurações
- `POST /api/withdrawals/create` - Criar saque
- `GET /api/withdrawals/list` - Listar saques
- `GET /api/withdrawals/status/:id` - Status do saque

### Jogos
- `GET /api/cases/available` - Caixas disponíveis
- `POST /api/cases/open` - Abrir caixa
- `GET /api/scratch/available` - Raspadinhas disponíveis
- `POST /api/scratch/play` - Jogar raspadinha

### Sistema
- `GET /api/health` - Health check
- `GET /api/db/test` - Teste de conexão com banco

## 🎨 Interface

### Design
- **Tema escuro** moderno
- **Gradientes** e animações
- **Responsivo** para mobile
- **Ícones** Font Awesome

### Componentes
- **Modais** interativos
- **Notificações** em tempo real
- **Formulários** validados
- **Gráficos** de progresso

## 🔒 Segurança

- **Validação** de dados no frontend e backend
- **Sanitização** de inputs
- **Controle de sessão** seguro
- **Logs** de auditoria

## 📊 Monitoramento

- **Logs** detalhados no console
- **Métricas** de performance
- **Status** de conexão com banco
- **Histórico** de transações

## 🚀 Deploy

### Desenvolvimento
```bash
# Backend
cd backend && node server-with-db.js

# Frontend
cd frontend && python3 -m http.server 3000
```

### Produção
- Configurar variáveis de ambiente
- Usar PM2 para gerenciar processos
- Configurar SSL/HTTPS
- Backup automático do banco

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação
- Verifique os logs do sistema

---

**🎯 LR4.Bet - Sistema completo de apostas e jogos com tecnologia de ponta!**