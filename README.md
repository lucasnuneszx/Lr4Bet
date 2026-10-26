# LR4.bet

Site de jogos (caixas e raspadinhas) com depósito via PIX pela PayGate e solicitação de saques. Frontend estático em HTML/CSS/JS e backend em Node.js/Express.

## Stack

- Frontend: HTML, CSS e JavaScript puro, Font Awesome
- Backend: Node.js, Express, QRCode
- Banco: PostgreSQL (opcional, usado por `server-with-db.js`)
- Pagamentos: API PayGate (PIX), com modo de simulação

## Rodando localmente

```bash
cd backend
npm install
node server.js
```

A aplicação sobe em `http://localhost:3001` e serve o frontend da pasta `frontend/`. O `./start.sh` na raiz faz o mesmo.

Para usar o servidor com PostgreSQL:

```bash
psql -U postgres -c "CREATE DATABASE lr4_bet;"
psql -U postgres -d lr4_bet -f backend/sql/setup.sql
cd backend && node server-with-db.js
```

## Variáveis de ambiente

Arquivo `backend/.env` (lidas em `backend/config.js`):

- `PORT`, `NODE_ENV`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `PAYGATE_PUBLIC_KEY`, `PAYGATE_SECRET_KEY`, `PAYGATE_BASE_URL`, `PAYGATE_WEBHOOK_SECRET`
- `PAYGATE_USE_REAL_API`, `PAYGATE_FALLBACK_TO_SIMULATION`

`backend/env.production` é um modelo com essas chaves; o `deploy.sh` copia ele para `.env`.

## Estrutura

```
backend/
  server.js             servidor de desenvolvimento (PayGate, caixas, saques, estáticos)
  server-with-db.js     mesmo fluxo persistindo no PostgreSQL
  server-production.js  servidor de produção (serve public_html/)
  database.js           pool e criação de tabelas
  config.js             configuração via variáveis de ambiente
  sql/setup.sql         schema do banco
frontend/
  lr4.bet.html          página principal
  lr4-unified.js        lógica do site
  *.css                 estilos
admin-system.js         painel admin (versão anterior do frontend)
lr4-script.js           script da versão anterior do frontend
deploy.sh               gera public_html/ para upload na Hostinger
```

## Deploy

`./deploy.sh` instala as dependências de produção, cria o `.env` e copia `frontend/` para `public_html/`, que é enviada para a Hostinger. O servidor de produção usa `backend/package-production.json` (`server-production.js`).

## Endpoints principais

- `GET /api/health`
- `POST /api/pix/create`, `GET /api/pix/status/:id`, `POST /api/webhook/paygate`
- `GET /api/cases/available`, `POST /api/cases/open`
- `GET /api/withdrawals/config`, `POST /api/withdrawals/create`, `GET /api/withdrawals/list`, `GET /api/withdrawals/status/:id`
