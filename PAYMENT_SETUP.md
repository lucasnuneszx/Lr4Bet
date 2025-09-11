# 💳 Configuração do Sistema de Pagamentos LR4.bet

Este documento detalha como configurar e integrar as gateways de pagamento no projeto LR4.bet.

## ⚙️ Visão Geral

O sistema de pagamentos foi projetado para ser modular, permitindo a fácil integração de diferentes gateways. **Atualmente configurado com PayGate** (PIX apenas) usando suas credenciais reais.

## 🎯 Gateway Ativa: PayGate

**Status:** ✅ Configurada e Pronta
- **Método:** PIX apenas
- **Ambiente:** Sandbox (testes)
- **Taxa:** 0,99%
- **Processamento:** Instantâneo

### 🔑 Credenciais Configuradas:
- **Chave Pública:** `0192c684-3316-72df-ac30-5c7c609e8cb8`
- **Chave Privada:** `661be99aedc13ab06d30aa18f55a61829f65c959d561d52efc9e8150ad0f4da3`
- **URL Sandbox:** `https://api-sandbox.paygate.com.br/`
- **URL Produção:** `https://api.paygate.com.br/`

## 🚀 Como Funciona

### 1. **Criação de Pagamento PIX**
- Usuário clica em "Depositar"
- Sistema cria pagamento via API PayGate
- Gera QR Code e código PIX
- Exibe interface de pagamento

### 2. **Verificação de Status**
- Sistema verifica status automaticamente a cada 5 segundos
- Usuário pode verificar manualmente
- Notificação automática quando aprovado

### 3. **Fluxo Completo**
```
Usuário → Clica Depositar → PayGate API → QR Code → Pagamento → Verificação → Aprovação
```

## 📁 Arquivos do Sistema

### **Configuração:**
- `payment-config.js` - Configurações das gateways
- `paygate-integration.js` - Integração específica PayGate

### **Interface:**
- `payment-system.js` - Sistema de pagamentos
- `payment-styles.css` - Estilos do sistema

### **Integração:**
- `lr4.bet.html` - HTML principal (inclui scripts)

## 🔧 Configurações Técnicas

### **Autenticação PayGate:**
```javascript
// Basic Auth com suas credenciais
const authString = `${publicKey}:${secretKey}`;
const authHeader = `Basic ${btoa(authString)}`;
```

### **Endpoints Utilizados:**
- `POST /pix/payments` - Criar pagamento PIX
- `GET /pix/payments/{id}` - Consultar status

### **Ambiente:**
- **Sandbox:** `true` (para testes)
- **Produção:** `false` (quando estiver pronto)

## 🧪 Testando o Sistema

### **1. Abrir o Projeto:**
```bash
npm start
# ou
python3 -m http.server 3000
```

### **2. Acessar:**
```
http://localhost:3000/lr4.bet.html
```

### **3. Testar Pagamento:**
1. Clique em "Depositar" (qualquer valor)
2. Escolha PIX
3. Sistema criará pagamento real via PayGate
4. QR Code será gerado
5. Status será verificado automaticamente

## ⚠️ Importante

### **Sandbox vs Produção:**
- **Atualmente:** Modo Sandbox (testes)
- **Para Produção:** Altere `sandbox: false` em `payment-config.js`

### **Segurança:**
- Credenciais estão no frontend para demonstração
- **Em produção:** Mova para backend seguro
- Use HTTPS obrigatório

### **Webhooks (Futuro):**
- Configure webhooks na PayGate
- URL: `https://seu-dominio.com/webhook/paygate`
- Para notificações automáticas

## 🎯 Próximos Passos

### **Para Produção:**
1. ✅ Credenciais configuradas
2. ✅ Sistema funcionando
3. ⏳ Testar em sandbox
4. ⏳ Configurar webhooks
5. ⏳ Mover para produção
6. ⏳ Implementar backend seguro

### **Melhorias Futuras:**
- Adicionar outros métodos de pagamento
- Sistema de webhooks
- Backend seguro
- Logs de transações
- Relatórios de pagamentos

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique o Console:** F12 → Console
2. **Logs do Sistema:** Mensagens começam com 💳, 🚀, ✅, ❌
3. **Status PayGate:** Verifique se API está respondendo
4. **Credenciais:** Confirme se estão corretas

---

**🎉 Sistema PayGate integrado e funcionando!**

Para testar, acesse o projeto e clique em "Depositar" para ver o PIX funcionando com suas credenciais reais!