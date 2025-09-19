# 🗄️ INTEGRAÇÃO POSTGRESQL - LR4.BET

## 📋 PASSO A PASSO COMPLETO

### **1. INSTALAÇÃO DO POSTGRESQL**

#### **Windows:**
1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Defina senha para usuário `postgres`
4. Mantenha a porta padrão `5432`

#### **macOS:**
```bash
# Via Homebrew
brew install postgresql
brew services start postgresql

# Ou baixe o instalador em: https://www.postgresql.org/download/macosx/
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **2. INSTALAÇÃO DO PGADMIN 4**

#### **Windows/macOS:**
1. Baixe em: https://www.pgadmin.org/download/
2. Execute o instalador
3. Configure senha master para pgAdmin

#### **Linux:**
```bash
# Ubuntu/Debian
sudo apt install pgadmin4

# Ou baixe o .deb em: https://www.pgadmin.org/download/
```

### **3. CONFIGURAÇÃO DO BANCO DE DADOS**

#### **3.1. Conectar ao PostgreSQL:**
```bash
# Via terminal
psql -U postgres -h localhost

# Ou abra o pgAdmin 4 e conecte ao servidor local
```

#### **3.2. Criar banco de dados:**
```sql
-- Conectar como superuser
CREATE DATABASE lr4_bet;
```

#### **3.3. Executar script de configuração:**
```bash
# No terminal, dentro da pasta backend
psql -U postgres -d lr4_bet -f sql/setup.sql
```

### **4. CONFIGURAÇÃO DA APLICAÇÃO**

#### **4.1. Instalar dependências:**
```bash
cd /Users/L7/raspadinha/backend
npm install pg dotenv
```

#### **4.2. Configurar variáveis de ambiente:**
Crie o arquivo `.env` na pasta `backend/`:
```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lr4_bet
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres

# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações PayGate
PAYGATE_PUBLIC_KEY=pk_test_1234567890abcdef
PAYGATE_SECRET_KEY=sk_test_1234567890abcdef1234567890abcdef
PAYGATE_BASE_URL=https://sandbox.paygate.com.br/
PAYGATE_WEBHOOK_SECRET=webhook_secret_key_123
PAYGATE_USE_REAL_API=false
PAYGATE_FALLBACK_TO_SIMULATION=true
```

### **5. EXECUTAR APLICAÇÃO COM BANCO**

#### **5.1. Parar servidor atual:**
```bash
# No terminal onde está rodando o servidor
Ctrl + C
```

#### **5.2. Iniciar servidor com banco:**
```bash
cd /Users/L7/raspadinha/backend
node server-with-db.js
```

### **6. VERIFICAÇÃO DA INTEGRAÇÃO**

#### **6.1. Testar conexão:**
```bash
curl http://localhost:3001/api/db/test
```

#### **6.2. Verificar health check:**
```bash
curl http://localhost:3001/api/health
```

### **7. ESTRUTURA DO BANCO DE DADOS**

#### **Tabelas criadas:**
- `users` - Usuários do sistema
- `pix_transactions` - Transações PIX
- `withdrawals` - Solicitações de saque
- `case_openings` - Abertura de caixas
- `scratch_cards` - Raspadinhas jogadas

#### **Usuário padrão:**
- **Email:** admin@lr4.bet
- **Senha:** admin123
- **Saldo:** R$ 10.000,00

### **8. COMANDOS ÚTEIS PGADMIN 4**

#### **8.1. Conectar ao servidor:**
1. Abra pgAdmin 4
2. Clique em "Add New Server"
3. **Name:** LR4.Bet Local
4. **Host:** localhost
5. **Port:** 5432
6. **Username:** postgres
7. **Password:** sua_senha

#### **8.2. Visualizar dados:**
```sql
-- Ver usuários
SELECT * FROM users;

-- Ver transações PIX
SELECT * FROM pix_transactions ORDER BY created_at DESC;

-- Ver saques
SELECT * FROM withdrawals ORDER BY created_at DESC;

-- Ver aberturas de caixas
SELECT * FROM case_openings ORDER BY created_at DESC;
```

### **9. BACKUP E RESTAURAÇÃO**

#### **9.1. Backup:**
```bash
pg_dump -U postgres -h localhost lr4_bet > backup_lr4_bet.sql
```

#### **9.2. Restauração:**
```bash
psql -U postgres -h localhost -d lr4_bet < backup_lr4_bet.sql
```

### **10. MONITORAMENTO**

#### **10.1. Logs do servidor:**
```bash
# Ver logs em tempo real
tail -f /var/log/postgresql/postgresql-*.log

# Ou no pgAdmin 4: Tools > Log Manager
```

#### **10.2. Performance:**
```sql
-- Ver conexões ativas
SELECT * FROM pg_stat_activity;

-- Ver tamanho das tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **11. TROUBLESHOOTING**

#### **11.1. Erro de conexão:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

#### **11.2. Erro de permissão:**
```sql
-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE lr4_bet TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

#### **11.3. Erro de porta:**
```bash
# Verificar portas em uso
netstat -tulpn | grep :5432

# Alterar porta no postgresql.conf se necessário
```

### **12. PRODUÇÃO**

#### **12.1. Configurações de segurança:**
```sql
-- Criar usuário específico para aplicação
CREATE USER lr4_app WITH PASSWORD 'senha_forte_aqui';
GRANT CONNECT ON DATABASE lr4_bet TO lr4_app;
GRANT USAGE ON SCHEMA public TO lr4_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lr4_app;
```

#### **12.2. SSL em produção:**
```env
# No .env de produção
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

---

## ✅ **CHECKLIST DE CONFIGURAÇÃO**

- [ ] PostgreSQL instalado e rodando
- [ ] pgAdmin 4 instalado e configurado
- [ ] Banco `lr4_bet` criado
- [ ] Tabelas criadas via script SQL
- [ ] Usuário admin inserido
- [ ] Dependências npm instaladas
- [ ] Arquivo `.env` configurado
- [ ] Servidor com banco rodando
- [ ] Teste de conexão bem-sucedido
- [ ] Frontend funcionando com banco

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Testar todas as funcionalidades** com banco de dados
2. **Configurar backup automático**
3. **Implementar logs de auditoria**
4. **Configurar monitoramento de performance**
5. **Preparar para deploy em produção**

---

**🎉 Parabéns! Seu sistema LR4.Bet agora está integrado com PostgreSQL!**
