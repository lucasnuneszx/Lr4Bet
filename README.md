# 🎰 Lr4.bet - Plataforma de Cassino Online

## 📋 Descrição

**Lr4.bet** é uma plataforma completa de cassino online e apostas esportivas, desenvolvida com tecnologias modernas e design profissional. O projeto inclui sistema de autenticação, painel administrativo, sistema de caixas estilo CS:GO, área de afiliados e muito mais.

## ✨ Funcionalidades Principais

### 🎮 Sistema de Caixas
- **Abertura de caixas** estilo CS:GO
- **Roleta girando** por 6 segundos
- **Prêmios variados** (iPhone, MacBook, JBL, etc.)
- **Sistema de probabilidades** configurável
- **Opções de vender/resgatar** prêmios

### 🔐 Sistema de Autenticação
- **Login/Registro** com validação CPF
- **Verificação de email** com código 6 dígitos
- **Verificação de idade** (mínimo 18 anos)
- **Sistema de sessões** seguro

### 👑 Painel Administrativo
- **Dashboard completo** com estatísticas
- **Controle de probabilidades** das caixas
- **Gestão de usuários** e transações
- **Sistema de relatórios** avançado

### 💰 Sistema Financeiro
- **Depósitos** via PIX e cartão
- **Gestão de saldo** em tempo real
- **Histórico de transações** completo
- **Integração bancária** brasileira

### 🤝 Sistema de Afiliados
- **100 níveis** de bônus
- **Links únicos** para cada usuário
- **Sistema CPA** (Cost Per Acquisition)
- **Cofres resgatáveis** com valores crescentes

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** semântico e responsivo
- **CSS3** com animações avançadas
- **JavaScript ES6+** vanilla
- **FontAwesome** para ícones
- **Animações CSS** personalizadas

### Backend
- **Node.js** com Express.js
- **MySQL2** para banco de dados
- **JWT** para autenticação
- **bcryptjs** para criptografia
- **Nodemailer** para emails

### Recursos
- **Responsivo** para todos dispositivos
- **PWA** ready
- **SEO** otimizado
- **Performance** otimizada
- **Acessibilidade** implementada

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+
- MySQL 8.0+
- Git

### Passos
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lr4.bet.git
cd lr4.bet

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Configure o banco de dados
mysql -u root -p < database/schema.sql

# Execute o projeto
npm start
```

## 📁 Estrutura do Projeto

```
lr4.bet/
├── config/                 # Configurações
├── database/              # Scripts SQL
├── public/                # Arquivos públicos
│   ├── css/              # Estilos
│   ├── js/               # JavaScript
│   └── index.html        # Página principal
├── routes/                # Rotas da API
├── server.js             # Servidor principal
├── package.json          # Dependências
└── README.md             # Este arquivo
```

## 🎯 Funcionalidades em Destaque

### 🎁 Sistema de Caixas
- **Modal de confirmação** antes da abertura
- **Roleta 3x3** com prêmios visuais
- **Animações suaves** e profissionais
- **Sistema de som** para imersão
- **Probabilidades configuráveis** via admin

### 🎨 Design System
- **Tema escuro** profissional
- **Gradientes azuis** consistentes
- **Animações CSS** otimizadas
- **Responsividade** completa
- **Acessibilidade** implementada

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=lr4bet

# JWT
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

## 📱 Responsividade

O projeto é totalmente responsivo e funciona perfeitamente em:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🎨 Personalização

### Cores Principais
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1d4ed8;
  --accent-color: #22c55e;
  --background-dark: #0f172a;
  --text-primary: #ffffff;
  --text-secondary: #e5e7eb;
}
```

### Animações
- **Transições suaves** em todos elementos
- **Hover effects** interativos
- **Loading states** para feedback visual
- **Micro-interações** para UX

## 🚀 Deploy

### Produção
```bash
# Build do projeto
npm run build

# Start em produção
NODE_ENV=production npm start
```

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.

## 👨‍💻 Desenvolvedor

**Desenvolvido por Lucas Nunes**

---

## 🎯 Roadmap

### ✅ Concluído
- [x] Sistema de autenticação
- [x] Painel administrativo
- [x] Sistema de caixas
- [x] Área de afiliados
- [x] Sistema financeiro
- [x] Design responsivo

### 🚧 Em Desenvolvimento
- [ ] Sistema de trade-up
- [ ] Integração com pagamentos
- [ ] Sistema de notificações
- [ ] App mobile

### 📋 Planejado
- [ ] Sistema de torneios
- [ ] Chat em tempo real
- [ ] Sistema de conquistas
- [ ] Integração com criptomoedas

---

**🎰 Lr4.bet - O Futuro dos Cassinos Online!** 🚀
