// Sistema de Autenticação para Show de Prêmios
const AuthSystem = {
    // Inicializar sistema de autenticação
    init: () => {
        console.log('🔐 Inicializando sistema de autenticação...');
        AuthSystem.bindEvents();
    },

    // Vincular eventos
    bindEvents: () => {
        // Formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', AuthSystem.handleLogin);
        }

        // Formulário de registro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', AuthSystem.handleRegister);
        }

        // Alternar entre modais
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');

        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.close('login-modal');
                ModalManager.open('register-modal');
            });
        }

        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.close('register-modal');
                ModalManager.open('login-modal');
            });
        }

        // Validação em tempo real
        AuthSystem.setupRealTimeValidation();
    },

    // Configurar validação em tempo real
    setupRealTimeValidation: () => {
        // Configurar força da senha
        const passwordInput = document.getElementById('register-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                AuthSystem.updatePasswordStrength(e.target.value);
            });
        }
        // Validação de CPF
        const cpfInput = document.getElementById('register-cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                const cpf = e.target.value;
                if (cpf.length >= 11) {
                    if (Utils.validateCPF(cpf)) {
                        e.target.style.borderColor = '#10b981';
                        AuthSystem.showFieldValidation(e.target, 'CPF válido!', 'success');
                    } else {
                        e.target.style.borderColor = '#ef4444';
                        AuthSystem.showFieldValidation(e.target, 'CPF inválido!', 'error');
                    }
                } else {
                    e.target.style.borderColor = '#e5e7eb';
                    AuthSystem.hideFieldValidation(e.target);
                }
            });
        }

        // Validação de email
        const emailInput = document.getElementById('register-email');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                const email = e.target.value;
                if (email.length > 0) {
                    if (Utils.validateEmail(email)) {
                        e.target.style.borderColor = '#10b981';
                        AuthSystem.showFieldValidation(e.target, 'Email válido!', 'success');
                    } else {
                        e.target.style.borderColor = '#ef4444';
                        AuthSystem.showFieldValidation(e.target, 'Email inválido!', 'error');
                    }
                } else {
                    e.target.style.borderColor = '#e5e7eb';
                    AuthSystem.hideFieldValidation(e.target);
                }
            });
        }

        // Validação de senha
        const passwordInput = document.getElementById('register-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                if (password.length > 0) {
                    if (Utils.validatePassword(password)) {
                        e.target.style.borderColor = '#10b981';
                        AuthSystem.showFieldValidation(e.target, 'Senha válida!', 'success');
                    } else {
                        e.target.style.borderColor = '#ef4444';
                        AuthSystem.showFieldValidation(e.target, 'Senha deve ter pelo menos 6 caracteres!', 'error');
                    }
                } else {
                    e.target.style.borderColor = '#e5e7eb';
                    AuthSystem.hideFieldValidation(e.target);
                }
            });
        }

        // Validação de confirmação de senha
        const confirmPasswordInput = document.getElementById('register-confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', (e) => {
                const confirmPassword = e.target.value;
                const password = passwordInput?.value || '';
                
                if (confirmPassword.length > 0) {
                    if (confirmPassword === password) {
                        e.target.style.borderColor = '#10b981';
                        AuthSystem.showFieldValidation(e.target, 'Senhas coincidem!', 'success');
                    } else {
                        e.target.style.borderColor = '#ef4444';
                        AuthSystem.showFieldValidation(e.target, 'Senhas não coincidem!', 'error');
                    }
                } else {
                    e.target.style.borderColor = '#e5e7eb';
                    AuthSystem.hideFieldValidation(e.target);
                }
            });
        }
    },

    // Mostrar validação do campo
    showFieldValidation: (field, message, type) => {
        // Remover validação anterior
        AuthSystem.hideFieldValidation(field);

        // Criar elemento de validação
        const validation = document.createElement('div');
        validation.className = `field-validation field-validation-${type}`;
        validation.textContent = message;
        validation.style.cssText = `
            font-size: 12px;
            margin-top: 4px;
            color: ${type === 'success' ? '#10b981' : '#ef4444'};
            font-weight: 500;
        `;

        // Inserir após o campo
        field.parentNode.appendChild(validation);
    },

    // Esconder validação do campo
    hideFieldValidation: (field) => {
        const existingValidation = field.parentNode.querySelector('.field-validation');
        if (existingValidation) {
            existingValidation.remove();
        }
    },

    // Tratar login
    handleLogin: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Validação básica
        if (!email || !password) {
            Utils.showNotification('Por favor, preencha todos os campos!', 'error');
            return;
        }

        try {
            Utils.showLoading();
            
            // Em produção, aqui seria uma chamada para a API
            // Simulando delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar se é o usuário admin
            const adminUser = localStorage.getItem('admin_master');
            let user = null;
            let isAdmin = false;

            if (adminUser) {
                const admin = JSON.parse(adminUser);
                if ((email === admin.username || email === admin.email) && password === admin.password) {
                    // Login como administrador
                    user = admin;
                    isAdmin = true;
                }
            }

            // Se não for admin, verificar usuário teste
            if (!user && email === 'teste@teste.com' && password === '123456') {
                user = {
                    id: 1,
                    username: 'Usuário Teste',
                    email: email,
                    balance: 150.00
                };
            }

            if (user) {
                // Login bem-sucedido
                const token = btoa(JSON.stringify(user));
                if (remember) {
                    localStorage.setItem('auth_token', token);
                } else {
                    sessionStorage.setItem('auth_token', token);
                }

                // Atualizar estado
                AppState.isAuthenticated = true;
                AppState.currentUser = user;
                AppState.userBalance = user.balance || 0;
                AppState.isAdmin = isAdmin;
                
                // Salvar no localStorage para persistência
                localStorage.setItem('current_user', JSON.stringify(user));
                localStorage.setItem('is_admin', isAdmin.toString());

                // Atualizar UI
                App.updateUI();

                // Fechar modal
                ModalManager.close('login-modal');

                // Mostrar mensagem de sucesso
                if (isAdmin) {
                    Utils.showNotification('Login como administrador realizado com sucesso! Bem-vindo, Master!', 'success');
                } else {
                    Utils.showNotification('Login realizado com sucesso! Bem-vindo de volta!', 'success');
                }

                // Redirecionar para raspadinhas (opcional)
                setTimeout(() => {
                    const raspadinhasSection = document.getElementById('raspadinhas');
                    if (raspadinhasSection) {
                        raspadinhasSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1000);

            } else {
                // Credenciais inválidas
                Utils.showNotification('Email ou senha incorretos!', 'error');
            }

        } catch (error) {
            console.error('Erro no login:', error);
            Utils.showNotification('Erro ao fazer login. Tente novamente!', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Tratar registro
    handleRegister: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const firstName = formData.get('first_name');
        const lastName = formData.get('last_name');
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const phone = formData.get('phone');
        const birthDate = formData.get('birth_date');
        const cpf = formData.get('cpf');
        const terms = formData.get('terms');
        const newsletter = formData.get('newsletter');

        // Validação completa
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !birthDate || !cpf || !terms) {
            Utils.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showNotification('As senhas não coincidem!', 'error');
            return;
        }

        if (!Utils.validateEmail(email)) {
            Utils.showNotification('Email inválido!', 'error');
            return;
        }

        if (!Utils.validateCPF(cpf)) {
            Utils.showNotification('CPF inválido!', 'error');
            return;
        }

        if (!Utils.validatePassword(password)) {
            Utils.showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        // Verificar idade mínima (18 anos)
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < birth.getDate())) {
            Utils.showNotification('Você deve ter pelo menos 18 anos para se cadastrar!', 'error');
            return;
        }

        try {
            Utils.showLoading();
            
            // Em produção, aqui seria uma chamada para a API
            // Simulando delay de rede
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular registro bem-sucedido
            const user = {
                id: Math.floor(Math.random() * 10000) + 1,
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                birthDate: birthDate,
                balance: 50.00, // Bônus de boas-vindas
                createdAt: new Date().toISOString()
            };

            // Salvar token
            const token = btoa(JSON.stringify(user));
            localStorage.setItem('auth_token', token);

            // Atualizar estado
            AppState.isAuthenticated = true;
            AppState.currentUser = user;
            AppState.userBalance = user.balance;

            // Atualizar UI
            App.updateUI();

            // Fechar modal
            ModalManager.close('register-modal');

            // Mostrar mensagem de sucesso
            Utils.showNotification('Cadastro realizado com sucesso! Você ganhou R$ 50,00 de bônus de boas-vindas!', 'success');

            // Mostrar modal de boas-vindas
            setTimeout(() => {
                AuthSystem.showWelcomeModal(user);
            }, 1000);

        } catch (error) {
            console.error('Erro no registro:', error);
            Utils.showNotification('Erro ao fazer cadastro. Tente novamente!', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Mostrar modal de boas-vindas
    showWelcomeModal: (user) => {
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'modal active';
        welcomeModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎉 Bem-vindo ao Show de Prêmios!</h3>
                </div>
                <div style="padding: 2rem; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎁</div>
                    <h2 style="color: #10b981; margin-bottom: 1rem;">Parabéns pelo cadastro!</h2>
                    <p style="color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">
                        Olá <strong>${user.firstName}</strong>! Seu cadastro foi realizado com sucesso.
                    </p>
                    <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 15px; padding: 1.5rem; margin-bottom: 2rem;">
                        <h3 style="color: #10b981; margin-bottom: 0.5rem;">🎯 Bônus de Boas-vindas</h3>
                        <p style="color: #059669; font-size: 1.2rem; font-weight: 600;">
                            Você ganhou <strong>R$ 50,00</strong> para começar a jogar!
                        </p>
                        <p style="color: #6b7280; font-size: 0.9rem; margin-top: 0.5rem;">
                            + 3 raspadinhas grátis para experimentar
                        </p>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove(); document.getElementById('raspadinhas').scrollIntoView({behavior: 'smooth'})">
                            🎯 Começar a Jogar
                        </button>
                        <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                            Explorar Site
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(welcomeModal);
        document.body.style.overflow = 'hidden';

        // Fechar modal ao clicar fora
        welcomeModal.addEventListener('click', (e) => {
            if (e.target === welcomeModal) {
                welcomeModal.remove();
                document.body.style.overflow = '';
            }
        });
    },

    // Esqueci minha senha
    handleForgotPassword: async (email) => {
        if (!email || !Utils.validateEmail(email)) {
            Utils.showNotification('Por favor, insira um email válido!', 'error');
            return;
        }

        try {
            Utils.showLoading();
            
            // Em produção, aqui seria uma chamada para a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            Utils.showNotification('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
            
        } catch (error) {
            console.error('Erro ao enviar email de recuperação:', error);
            Utils.showNotification('Erro ao enviar email de recuperação. Tente novamente!', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Atualizar força da senha
    updatePasswordStrength: (password) => {
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (!strengthFill || !strengthText) return;
        
        let strength = 0;
        let text = '';
        let className = '';
        
        // Verificar comprimento
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        
        // Verificar se contém números
        if (/\d/.test(password)) strength += 1;
        
        // Verificar se contém letras maiúsculas
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Verificar se contém caracteres especiais
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
        
        // Definir classe e texto baseado na força
        if (strength <= 2) {
            className = 'weak';
            text = 'Senha fraca';
        } else if (strength <= 3) {
            className = 'medium';
            text = 'Senha média';
        } else {
            className = 'strong';
            text = 'Senha forte';
        }
        
        // Aplicar mudanças
        strengthFill.className = `strength-fill ${className}`;
        strengthText.textContent = text;
    }
};

// Inicializar sistema quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    AuthSystem.init();
});

// Função global para mostrar/ocultar senha
window.togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
};

// Exportar para uso global
window.AuthSystem = AuthSystem;
