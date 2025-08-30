// Script de teste para o usuário administrador
const AdminTest = {
    init() {
        console.log('🧪 Iniciando testes do usuário administrador...');
        this.testAdminCreation();
        this.testAdminLogin();
    },

    // Testar criação do admin
    testAdminCreation() {
        console.log('📋 Testando criação do usuário admin...');
        
        const admin = localStorage.getItem('admin_master');
        if (admin) {
            const adminData = JSON.parse(admin);
            console.log('✅ Usuário admin encontrado:', adminData);
            console.log('💰 Saldo:', adminData.balance);
            console.log('👑 Admin:', adminData.isAdmin);
        } else {
            console.log('❌ Usuário admin não encontrado');
        }
    },

    // Testar login do admin
    testAdminLogin() {
        console.log('🔐 Testando login do usuário admin...');
        
        // Simular login
        const admin = localStorage.getItem('admin_master');
        if (admin) {
            const adminData = JSON.parse(admin);
            
            // Simular login bem-sucedido
            AppState.isAuthenticated = true;
            AppState.currentUser = adminData;
            AppState.userBalance = adminData.balance;
            AppState.isAdmin = true;
            
            // Salvar no localStorage
            localStorage.setItem('auth_token', 'admin_test_token_' + Date.now());
            localStorage.setItem('current_user', JSON.stringify(adminData));
            localStorage.setItem('is_admin', 'true');
            
            console.log('✅ Login simulado com sucesso');
            console.log('👤 Usuário:', AppState.currentUser.username);
            console.log('💰 Saldo:', AppState.userBalance);
            console.log('👑 Admin:', AppState.isAdmin);
            
            // Atualizar UI
            if (typeof App !== 'undefined' && App.updateUI) {
                App.updateUI();
                console.log('✅ UI atualizada');
            }
        } else {
            console.log('❌ Não foi possível testar login - admin não encontrado');
        }
    },

    // Limpar dados de teste
    clearTestData() {
        console.log('🧹 Limpando dados de teste...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('is_admin');
        
        AppState.isAuthenticated = false;
        AppState.currentUser = null;
        AppState.userBalance = 0;
        AppState.isAdmin = false;
        
        if (typeof App !== 'undefined' && App.updateUI) {
            App.updateUI();
        }
        
        console.log('✅ Dados de teste limpos');
    },

    // Mostrar status atual
    showStatus() {
        console.log('📊 Status atual do sistema:');
        console.log('🔐 Autenticado:', AppState.isAuthenticated);
        console.log('👤 Usuário atual:', AppState.currentUser);
        console.log('💰 Saldo:', AppState.userBalance);
        console.log('👑 Admin:', AppState.isAdmin);
        
        console.log('📦 LocalStorage:');
        console.log('  - auth_token:', localStorage.getItem('auth_token') ? 'Presente' : 'Ausente');
        console.log('  - current_user:', localStorage.getItem('current_user') ? 'Presente' : 'Ausente');
        console.log('  - is_admin:', localStorage.getItem('is_admin') ? 'Presente' : 'Ausente');
        console.log('  - admin_master:', localStorage.getItem('admin_master') ? 'Presente' : 'Ausente');
    }
};

// Auto-inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para outros scripts carregarem
    setTimeout(() => {
        AdminTest.init();
    }, 1000);
});

// Expor para uso global
window.AdminTest = AdminTest;

// Comandos úteis para o console
console.log('🧪 AdminTest disponível no console. Use:');
console.log('  - AdminTest.showStatus() - Ver status atual');
console.log('  - AdminTest.testAdminLogin() - Testar login');
console.log('  - AdminTest.clearTestData() - Limpar dados');

