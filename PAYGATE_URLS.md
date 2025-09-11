# 🔗 URLs da PayGate - Configuração

## 📋 URLs Testadas

### **Produção:**
- `https://api.paygate.com.br/v1/`
- `https://api.paygate.com.br/`

### **Sandbox:**
- `https://api-sandbox.paygate.com.br/v1/`
- `https://api-sandbox.paygate.com.br/`

## 🎯 Endpoints Implementados

### **Criar Pagamento PIX:**
- `POST /pix/charge`
- `POST /pix/payments`

### **Consultar Status:**
- `GET /pix/status/{paymentId}`
- `GET /pix/payments/{paymentId}`

### **Teste de Conexão:**
- `GET /status`
- `GET /health`

## ⚙️ Configuração Atual

```javascript
paygate: {
    name: 'PayGate',
    enabled: true,
    publicKey: '0192c684-3316-72df-ac30-5c7c609e8cb8',
    secretKey: '661be99aedc13ab06d30aa18f55a61829f65c959d561d52efc9e8150ad0f4da3',
    apiUrl: 'https://api.paygate.com.br/v1/',
    sandboxUrl: 'https://api-sandbox.paygate.com.br/v1/',
    sandbox: false // Produção
}
```

## 🔧 Próximos Passos

1. **Verificar URLs corretas** na documentação da PayGate
2. **Testar endpoints** com suas credenciais
3. **Ajustar URLs** se necessário
4. **Configurar webhooks** para notificações

## 📞 Suporte

Se as URLs não funcionarem, entre em contato com o suporte da PayGate para obter:
- URLs corretas da API
- Documentação atualizada
- Exemplos de integração

