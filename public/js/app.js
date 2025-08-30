// Configurações da aplicação
const APP_CONFIG = {
    name: 'Show de Prêmios',
    version: '1.0.0',
    apiUrl: '/api',
    debug: true
};

// Estado global da aplicação
const AppState = {
    isAuthenticated: false,
    currentUser: null,
    userBalance: 0,
    isAdmin: false,
    notifications: [],
    isLoading: false
};

// Utilitários
const Utils = {
    // Formatação de moeda
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatação de data
    formatDate: (date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Validação de CPF
    validateCPF: (cpf) => {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        
        // Verificar dígitos repetidos
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validar primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = sum % 11;
        let digit1 = remainder < 2 ? 0 : 11 - remainder;
        
        // Validar segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = sum % 11;
        let digit2 = remainder < 2 ? 0 : 11 - remainder;
        
        return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
    },

    // Validação de email
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validação de senha
    validatePassword: (password) => {
        return password.length >= 6;
    },

    // Mostrar notificação
    showNotification: (message, type = 'info', duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Evento de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remover
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
        
        // Adicionar ao estado
        AppState.notifications.push(notification);
    },

    // Mostrar loading
    showLoading: () => {
        AppState.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },

    // Esconder loading
    hideLoading: () => {
        AppState.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },

    // Debounce
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Sistema de roteamento simples
const Router = {
    routes: {},
    
    // Registrar rota
    register: (path, handler) => {
        Router.routes[path] = handler;
    },
    
    // Navegar para rota
    navigate: (path) => {
        if (Router.routes[path]) {
            Router.routes[path]();
        }
        
        // Atualizar URL
        if (history.pushState) {
            history.pushState(null, null, path);
        }
        
        // Atualizar navegação ativa
        Router.updateActiveNav(path);
    },
    
    // Atualizar navegação ativa
    updateActiveNav: (path) => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }
};

// Gerenciador de modais
const ModalManager = {
    // Abrir modal
    open: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Fechar modal
    close: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Fechar todos os modais
    closeAll: () => {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
};

// Navegação mobile
const MobileNav = {
    init: () => {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Fechar menu ao clicar em um link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
};

// Gerenciador de scroll
const ScrollManager = {
    init: () => {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const header = document.querySelector('.header');
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = currentScrollTop;
        }, 100));
    }
};

// Gerenciador de tema
const ThemeManager = {
    currentTheme: 'light',
    
    init: () => {
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('theme') || 'light';
        ThemeManager.setTheme(savedTheme);
        
        // Vincular evento do botão
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', ThemeManager.toggleTheme);
        }
        
        console.log('🎨 Sistema de tema inicializado');
    },
    
    setTheme: (theme) => {
        ThemeManager.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Atualizar ícone
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Atualizar título do botão
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.title = theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro';
        }
        
        console.log(`🎨 Tema alterado para: ${theme}`);
    },
    
    toggleTheme: () => {
        const newTheme = ThemeManager.currentTheme === 'light' ? 'dark' : 'light';
        ThemeManager.setTheme(newTheme);
    }
};

// Aplicação principal
const App = {
    // Inicializar aplicação
    init: () => {
        console.log('🚀 Inicializando Show de Prêmios...');
        
        // Inicializar componentes
        MobileNav.init();
        ScrollManager.init();
        ThemeManager.init();
        
        // Verificar autenticação
        App.checkAuth();
        
        // Carregar dados iniciais
        App.loadInitialData();
        
        // Vincular eventos
        App.bindEvents();
        
        console.log('✅ Aplicação inicializada com sucesso!');
    },
    
    // Verificar autenticação
    checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        const currentUser = localStorage.getItem('current_user');
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        const userBalance = localStorage.getItem('user_balance');
        
        if (token && currentUser) {
            try {
                // Restaurar estado do usuário
                const user = JSON.parse(currentUser);
                AppState.isAuthenticated = true;
                AppState.currentUser = user;
                AppState.userBalance = parseFloat(userBalance) || user.balance || 0;
                AppState.isAdmin = isAdmin;
                
                // Atualizar UI
                App.updateUI();
                console.log('✅ Estado do usuário restaurado:', user.username);
                console.log('💰 Saldo restaurado:', AppState.userBalance);
            } catch (error) {
                console.error('Erro ao restaurar usuário:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_user');
                localStorage.removeItem('is_admin');
                localStorage.removeItem('user_balance');
            }
        }
    },
    
    // Fazer logout
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('user_balance');
        
        AppState.isAuthenticated = false;
        AppState.currentUser = null;
        AppState.userBalance = 0;
        AppState.isAdmin = false;
        
        App.updateUI();
        Utils.showNotification('Logout realizado com sucesso!', 'info');
    },
    
    // Atualizar interface
    updateUI: () => {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const userMenu = document.getElementById('user-menu');
        const username = document.getElementById('username');
        const userBalance = document.getElementById('user-balance');
        
        if (AppState.isAuthenticated) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            
            if (username) {
                let displayName = AppState.currentUser?.username || 'Usuário';
                // Adicionar indicador visual para admin
                if (AppState.isAdmin) {
                    displayName += ' <span style="color: #ff6b35; font-size: 12px;">👑</span>';
                }
                username.innerHTML = displayName;
            }
            
            if (userBalance) {
                // Mostrar saldo correto (admin ou usuário normal)
                const balance = AppState.currentUser?.balance || AppState.userBalance || 0;
                userBalance.textContent = Utils.formatCurrency(balance);
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (registerBtn) registerBtn.style.display = 'inline-block';
            if (userMenu) userMenu.style.display = 'none';
        }
    },
    
    // Carregar dados iniciais
    loadInitialData: async () => {
        // Em produção, aqui seriam carregados dados da API
        console.log('📊 Carregando dados iniciais...');
    },
    
    // Vincular eventos
    bindEvents: () => {
        // Botões de autenticação
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const heroLoginBtn = document.getElementById('hero-login-btn');
        const heroRegisterBtn = document.getElementById('hero-register-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => ModalManager.open('login-modal'));
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => ModalManager.open('register-modal'));
        }
        
        if (heroLoginBtn) {
            heroLoginBtn.addEventListener('click', () => ModalManager.open('login-modal'));
        }
        
        if (heroRegisterBtn) {
            heroRegisterBtn.addEventListener('click', () => ModalManager.open('register-modal'));
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', App.logout);
        }
        
        // Fechar modais
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    ModalManager.close(modal.id);
                }
            });
        });
        
        // Fechar modais ao clicar fora
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    ModalManager.close(modal.id);
                }
            });
        });
        
        // Navegação suave
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Formulário de suporte
        const supportForm = document.getElementById('support-form');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                Utils.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                supportForm.reset();
            });
        }
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', App.init);

// Exportar para uso global
window.App = App;
window.AppState = AppState;
window.Utils = Utils;
window.Router = Router;
window.ModalManager = ModalManager;
window.ThemeManager = ThemeManager;
