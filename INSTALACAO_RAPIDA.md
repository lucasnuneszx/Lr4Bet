# 🚀 Instalação Rápida - Show de Prêmios Raspadinha Digital

## ⚡ Instalação Automática (Recomendado)

### 1. Execute o script de instalação
```bash
./install.sh
```

### 2. Inicie o servidor
```bash
npm run dev
```

### 3. Acesse o site
🌐 **http://localhost:3000**

---

## 🔧 Instalação Manual

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o ambiente
```bash
# Copie o arquivo de configuração
cp env.local .env

# Edite as configurações necessárias
nano .env
```

### 3. Configure o banco de dados
```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script de criação
source database/schema.sql
```

### 4. Inicie o servidor
```bash
npm run dev
```

---

## 🎯 Credenciais de Teste

### Usuário Demo
- **Email**: `teste@teste.com`
- **Senha**: `123456`

### Novo Cadastro
- **Bônus**: R$ 50,00 + 3 raspadinhas grátis
- **Validação**: CPF, email, idade mínima 18 anos

---

## 🎮 Funcionalidades Principais

### ✅ **Sistema de Raspadinha**
- 🎯 **4 Tipos**: Clássica (R$ 5), Premium (R$ 10), Mega (R$ 20), Especial (R$ 50)
- 🎨 **Raspagem Realista**: Canvas HTML5 com efeitos visuais
- 🎁 **Sistema de Prêmios**: Dinheiro, produtos, vales-presente, jogos
- 📱 **Responsivo**: Funciona em todos os dispositivos

### ✅ **Sistema de Usuários**
- 👤 **Cadastro Completo**: Validação em tempo real
- 🔐 **Login Seguro**: JWT e sessões
- 💰 **Gestão de Saldo**: Controle financeiro
- 📊 **Histórico**: Todas as jogadas registradas

### ✅ **Interface Moderna**
- 🎨 **Design Profissional**: Cores e tipografia modernas
- 📱 **Mobile First**: Otimizado para smartphones
- ⚡ **Performance**: Carregamento rápido e suave
- 🌐 **Navegadores**: Chrome, Firefox, Safari, Edge

---

## 🚀 Como Usar

### 1. **Acesse o Site**
- Abra: `http://localhost:3000`
- Navegue pelas seções

### 2. **Faça Login/Cadastro**
- Clique em "Entrar" ou "Cadastrar"
- Use as credenciais de teste ou crie nova conta

### 3. **Jogue Raspadinhas**
- Escolha o tipo de raspadinha
- Clique em "Comprar Raspadinha"
- Use o mouse para raspar
- Revele seu prêmio!

### 4. **Resgate Prêmios**
- Clique em "Resgatar Prêmio"
- Prêmio creditado automaticamente

---

## 🔧 Personalização

### **Alterar Nome/Logo**
```html
<!-- Edite public/index.html -->
<div class="logo">
    <i class="fas fa-trophy"></i>
    <h1>SEU NOME AQUI</h1>
</div>
```

### **Alterar Cores**
```css
/* Edite public/css/styles.css */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f59e0b;
}
```

### **Alterar Prêmios**
```javascript
// Edite public/js/scratch.js
const prizes = [
    // Adicione seus prêmios aqui
];
```

---

## 📱 Teste em Dispositivos

### **Desktop**
- Chrome, Firefox, Safari, Edge
- Resolução: 1920x1080, 1366x768

### **Mobile**
- iOS Safari, Chrome Android
- Resolução: 375x667, 414x896

### **Tablet**
- iPad, Android Tablet
- Resolução: 768x1024, 1024x768

---

## 🚨 Solução de Problemas

### **Servidor não inicia**
```bash
# Verifique se a porta 3000 está livre
lsof -i :3000

# Mate processos se necessário
kill -9 [PID]
```

### **Erro de dependências**
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### **Erro de banco de dados**
```bash
# Verifique se MySQL está rodando
sudo service mysql status

# Teste conexão
mysql -u root -p
```

### **Problemas de permissão**
```bash
# Dê permissões necessárias
chmod +x install.sh
chmod 755 public/
```

---

## 📊 Status do Sistema

### ✅ **Funcionando**
- Frontend responsivo
- Sistema de raspadinha
- Autenticação de usuários
- Interface moderna
- Validações em tempo real

### 🔄 **Em Desenvolvimento**
- Sistema de pagamentos
- Integração com APIs
- App mobile
- Chat ao vivo

---

## 🎯 Próximos Passos

### **Personalização**
1. Altere nome e logo
2. Personalize cores
3. Configure prêmios
4. Adicione conteúdo

### **Funcionalidades**
1. Sistema de pagamentos
2. Integração com APIs
3. Relatórios e analytics
4. Sistema de afiliados

---

## 📞 Suporte

- **Email**: suporte@showdepremios.com
- **Telefone**: 0800 123 4567
- **Chat**: Disponível 24/7 no site
- **Documentação**: [docs.showdepremios.com](https://docs.showdepremios.com)

---

## ⚠️ Aviso Legal

Este é um sistema de entretenimento. Jogue com responsabilidade. Raspadinhas são permitidas apenas para maiores de 18 anos. Os prêmios são reais e podem ser resgatados conforme as regras da plataforma.

---

**🎯 Boa sorte com sua raspadinha digital!**
