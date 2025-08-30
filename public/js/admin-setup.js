// Script para configurar usuário administrador master
// Este script simula a criação do usuário admin no frontend

const AdminSetup = {
    // Usuário administrador master
    adminUser: {
        username: 'admin_master',
        email: 'admin@showdepremios.com',
        password: 'admin123',
        firstName: 'Administrador',
        lastName: 'Master',
        phone: '(11) 99999-9999',
        birthDate: '1990-01-01',
        cpf: '123.456.789-00',
        balance: 1000000.00,
        isVerified: true,
        isAdmin: true,
        status: 'active'
    },

    // Inicializar configuração
    init() {
        console.log('🎯 Inicializando configuração do usuário administrador...');
        this.setupAdminUser();
        this.showAdminCredentials();
    },

    // Configurar usuário admin
    setupAdminUser() {
        // Salvar no localStorage para simular banco de dados
        localStorage.setItem('admin_master', JSON.stringify(this.adminUser));
        
        // Adicionar ao estado da aplicação
        if (typeof AppState !== 'undefined') {
            AppState.adminUsers = AppState.adminUsers || {};
            AppState.adminUsers.admin_master = this.adminUser;
        }

        console.log('✅ Usuário administrador configurado');
    },

    // Mostrar credenciais
    showAdminCredentials() {
        const credentials = `
🎉 USUÁRIO ADMINISTRADOR MASTER CRIADO!
========================================
👤 Username: ${this.adminUser.username}
📧 Email: ${this.adminUser.email}
🔑 Senha: ${this.adminUser.password}
💰 Saldo: R$ ${this.adminUser.balance.toLocaleString('pt-BR')}
👑 Admin: ${this.adminUser.isAdmin ? 'Sim' : 'Não'}
✅ Verificado: ${this.adminUser.isVerified ? 'Sim' : 'Não'}
========================================

🚀 Para testar:
1. Acesse: http://localhost:3000
2. Clique em "Entrar"
3. Use as credenciais acima
4. Verifique o saldo de R$ 1.000.000,00

⚠️  IMPORTANTE: Altere a senha após o primeiro login!
        `;

        console.log(credentials);
        
        // Mostrar notificação na tela
        this.showNotification(credentials);
    },

    // Mostrar notificação
    showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
        `;
        
        notification.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 18px;">👑 Admin Master Criado!</h3>
            <div style="font-size: 14px; margin-bottom: 15px;">
                <strong>Username:</strong> ${this.adminUser.username}<br>
                <strong>Senha:</strong> ${this.adminUser.password}<br>
                <strong>Saldo:</strong> R$ ${this.adminUser.balance.toLocaleString('pt-BR')}
            </div>
            <button id="close-admin-notification" style="
                background: white;
                color: #ff6b35;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">Fechar</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover após 30 segundos
        setTimeout(() => {
            if (notification && notification.parentElement) {
                notification.remove();
            }
        }, 30000);
        
        // Adicionar evento de clique para fechar
        notification.addEventListener('click', (e) => {
            if (e.target === notification || e.target.tagName === 'BUTTON') {
                notification.remove();
            }
        });
        
        // Adicionar evento específico para o botão fechar
        const closeBtn = notification.querySelector('#close-admin-notification');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }
    },

    // Verificar se usuário admin existe
    checkAdminExists() {
        const admin = localStorage.getItem('admin_master');
        return admin ? JSON.parse(admin) : null;
    },

    // Fazer login como admin
    loginAsAdmin() {
        const admin = this.checkAdminExists();
        if (!admin) {
            console.error('❌ Usuário administrador não encontrado');
            return false;
        }

        // Simular login
        if (typeof AppState !== 'undefined') {
            AppState.auth_token = 'admin_master_token_' + Date.now();
            AppState.currentUser = admin;
            AppState.isAuthenticated = true;
            AppState.isAdmin = true;
            
            // Atualizar UI
            if (typeof App !== 'undefined' && App.updateUI) {
                App.updateUI();
            }
            
            console.log('✅ Login como administrador realizado');
            return true;
        }
        
        return false;
    }
};

// Auto-inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    AdminSetup.init();
});

// Expor para uso global
window.AdminSetup = AdminSetup;
