// ===== BR4.BET.BR - SCRIPT COMPLETO =====

class Br4Website {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        this.isAutoPlaying = true;
        
        this.init();
    }

    init() {
        // Verificar se os elementos existem antes de inicializar
        if (document.querySelector('.hero-carousel')) {
            this.initCarousel();
            this.startAutoPlay();
        }
        
        this.initMobileMenu();
        this.initGameCards();
        this.initSmoothScrolling();
        this.initLazyLoading();
        this.initAnimations();
    }

    // ===== CARROSSEL AUTOMÁTICO =====
    initCarousel() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const indicators = document.querySelectorAll('.indicator');
        const slides = document.querySelectorAll('.carousel-slide');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicadores clicáveis
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Pausar autoplay no hover
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Touch/swipe para mobile
        this.initTouchControls();
        
        // Otimizar carregamento das imagens
        this.optimizeImageLoading();
    }

    previousSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;
        
        this.currentSlide = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;
        
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0 || index < 0 || index >= slides.length) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');

        // Verificar se há slides antes de continuar
        if (slides.length === 0) return;

        // Atualizar slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentSlide) {
                slide.classList.add('active');
                slide.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });

        // Atualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            }
        });

        // Reset da animação
        setTimeout(() => {
            const activeSlide = slides[this.currentSlide];
            if (activeSlide) {
                activeSlide.style.animation = '';
            }
        }, 800);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        // Verificar se o carrossel existe antes de iniciar
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (this.isAutoPlaying && carousel) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
    }

    resumeAutoPlay() {
        this.isAutoPlaying = true;
    }

    // ===== CONTROLES TOUCH PARA MOBILE =====
    initTouchControls() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        let startX = 0;
        let endX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - endX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            isDragging = false;
            this.resumeAutoPlay();
        });
    }

    // ===== MENU MOBILE =====
    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const authButtons = document.querySelector('.auth-buttons');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Fechar menu ao clicar em um link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const authButtons = document.querySelector('.auth-buttons');

        if (hamburger && navMenu) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (authButtons) {
                authButtons.classList.toggle('active');
            }

            // Animar hamburger
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }

    closeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const authButtons = document.querySelector('.auth-buttons');

        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            if (authButtons) {
                authButtons.classList.remove('active');
            }

            // Reset hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    // ===== CARDS DE JOGOS =====
    initGameCards() {
        const gameCards = document.querySelectorAll('.game-card');
        const playButtons = document.querySelectorAll('.btn-play');

        // Hover effects
        gameCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });

            // Focus para acessibilidade
            card.addEventListener('focus', () => {
                this.animateCardHover(card, true);
            });

            card.addEventListener('blur', () => {
                this.animateCardHover(card, false);
            });
        });

        // Botões de jogo
        playButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleGamePlay(button);
            });

            // Efeito de clique
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    animateCardHover(card, isHovering) {
        const image = card.querySelector('.game-image img');
        const info = card.querySelector('.game-info');

        if (isHovering) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            if (image) image.style.transform = 'scale(1.1)';
            if (info) info.style.background = 'var(--secondary-color)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            if (image) image.style.transform = 'scale(1)';
            if (info) info.style.background = 'var(--secondary-color)';
        }
    }

    handleGamePlay(button) {
        const gameCard = button.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        const provider = gameCard.querySelector('.provider').textContent;

        // Efeito de clique
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Simular carregamento do jogo
        this.showGameLoading(gameCard, gameName);

        // Aqui você pode adicionar a lógica real para abrir o jogo
        console.log(`Iniciando jogo: ${gameName} (${provider})`);
    }

    showGameLoading(card, gameName) {
        const originalContent = card.innerHTML;
        
        card.innerHTML = `
            <div class="game-loading" style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="width: 40px; height: 40px; border: 3px solid var(--border-color); border-top: 3px solid var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Carregando ${gameName}...</p>
            </div>
        `;

        // Simular tempo de carregamento
        setTimeout(() => {
            card.innerHTML = originalContent;
            this.initGameCards(); // Re-inicializar eventos
        }, 2000);
    }

    // ===== SCROLL SUAVE =====
    initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== LAZY LOADING =====
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antigos
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // ===== ANIMAÇÕES DE ENTRADA =====
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        const animatedElements = document.querySelectorAll('.game-card, .section-header, .footer-section');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ===== OTIMIZAÇÃO DE IMAGENS =====
    optimizeImageLoading() {
        const images = document.querySelectorAll('.carousel-slide img, .game-card img');
        
        images.forEach(img => {
            // Adicionar classe de loading
            img.classList.add('loading');
            
            // Quando a imagem carregar
            img.addEventListener('load', () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            });
            
            // Se a imagem já estiver carregada
            if (img.complete) {
                img.classList.remove('loading');
                img.classList.add('loaded');
            }
            
            // Tratamento de erro
            img.addEventListener('error', () => {
                img.src = 'https://via.placeholder.com/1200x400/2d2d2d/ffffff?text=Imagem+Indisponível';
                img.classList.remove('loading');
            });
        });
    }

    // ===== UTILITÁRIOS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
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

    // ===== NOTIFICAÇÕES =====
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-color);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-card);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--accent-color);
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Botão fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        return notification;
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== PERFORMANCE E OTIMIZAÇÃO =====
    optimizePerformance() {
        // Throttle scroll events
        const throttledScroll = this.throttle(() => {
            this.handleScroll();
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScroll);

        // Debounce resize events
        const debouncedResize = this.debounce(() => {
            this.handleResize();
        }, 250);

        window.addEventListener('resize', debouncedResize);
    }

    handleScroll() {
        const header = document.querySelector('.main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    handleResize() {
        // Ajustar carrossel para diferentes tamanhos de tela
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            if (window.innerWidth <= 768) {
                carousel.style.height = '400px';
            } else if (window.innerWidth <= 480) {
                carousel.style.height = '300px';
            } else {
                carousel.style.height = '500px';
            }
        }
    }

    // ===== INICIALIZAÇÃO =====
    static init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new Br4Website();
            });
        } else {
            new Br4Website();
        }
    }
}

// ===== INICIALIZAR QUANDO A PÁGINA CARREGAR =====
Br4Website.init();

// ===== FUNÇÕES GLOBAIS ADICIONAIS =====

// Funções removidas para evitar conflito

// Função para buscar jogos
function searchGames(query) {
    const gameCards = document.querySelectorAll('.game-card');
    const searchTerm = query.toLowerCase();

    gameCards.forEach(card => {
        const gameName = card.querySelector('h3').textContent.toLowerCase();
        const provider = card.querySelector('.provider').textContent.toLowerCase();
        
        if (gameName.includes(searchTerm) || provider.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Função para filtrar por categoria
function filterByCategory(category) {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const section = card.closest('.games-section');
            if (section && section.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// ===== EVENT LISTENERS GLOBAIS =====
document.addEventListener('DOMContentLoaded', () => {
    // Botões de login/registro serão configurados pelos modais

    // Adicionar classes CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .main-header.scrolled {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
        }
        
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--secondary-color);
            padding: 2rem;
            border-top: 1px solid var(--border-color);
            box-shadow: var(--shadow-card);
        }
        
        .auth-buttons.active {
            display: flex !important;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
            padding: 0;
            line-height: 1;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar modais de autenticação
    initAuthModals();
    
    // Verificar estado de autenticação ao carregar a página
    checkAuthStatus();
    
    // Adicionar event listeners para os botões de login e cadastro
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', openRegisterModal);
    }
});

// ===== FUNCIONALIDADES DOS MODAIS =====

// Função para verificar estado de autenticação
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = adminSystem && adminSystem.isAuthenticated;
    
    if (isLoggedIn || isAdmin) {
        updateAuthInterface(true, isAdmin ? 'admin' : 'user');
    } else {
        updateAuthInterface(false);
    }
}

// Função para atualizar interface baseada no estado de autenticação
function updateAuthInterface(isLoggedIn, userType = 'user') {
    const btnAccount = document.getElementById('btnAccount');
    const btnLogin = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');
    const userBalanceSection = document.getElementById('userBalanceSection');
    
    if (isLoggedIn) {
        // Usuário logado - mostrar seção de saldo e botão "Minha Conta"
        if (userBalanceSection) userBalanceSection.style.display = 'flex';
        if (btnAccount) btnAccount.style.display = 'inline-block';
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        
        // Adicionar event listener para o botão "Minha Conta"
        if (btnAccount) {
            btnAccount.onclick = () => openAccountsModal();
        }
        
        // Atualizar saldo do usuário
        updateUserBalance();
        
        // Atualizar informações do usuário se for admin
        if (userType === 'admin') {
            updateUserInfo('Admin Master', 'admin@lr4.bet', true);
        } else {
            const userEmail = localStorage.getItem('userEmail') || 'Usuário';
            updateUserInfo(userEmail, userEmail, false);
        }
    } else {
        // Usuário não logado - mostrar botões de login/cadastro
        if (userBalanceSection) userBalanceSection.style.display = 'none';
        if (btnAccount) btnAccount.style.display = 'none';
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnRegister) btnRegister.style.display = 'inline-block';
    }
}

// Função para atualizar informações do usuário no modal
function updateUserInfo(name, email, isAdmin) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const verificationBadge = document.querySelector('.verification-badge');
    
    if (profileName) profileName.textContent = name;
    if (profileEmail) profileEmail.textContent = email;
    
    if (verificationBadge) {
        if (isAdmin) {
            verificationBadge.innerHTML = '<i class="fas fa-crown"></i> Admin Master';
            verificationBadge.className = 'verification-badge admin';
        } else {
            verificationBadge.innerHTML = '<i class="fas fa-check-circle"></i> Verificado';
            verificationBadge.className = 'verification-badge verified';
        }
    }
}

// Função para abrir modal de contas
function openAccountsModal() {
    const modal = document.getElementById('accountsModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Verificar se é admin para mostrar tab admin
        const adminTab = document.querySelector('.admin-only');
        if (adminTab && adminSystem && adminSystem.isAuthenticated) {
            adminTab.style.display = 'inline-block';
        } else if (adminTab) {
            adminTab.style.display = 'none';
        }
        
        // Inicializar tabs
        initAccountTabs();
    }
}

// Função para inicializar tabs da conta
function initAccountTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Atualizar botões ativos
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Atualizar conteúdo ativo
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Adicionar event listeners para ações admin
    const openDashboardBtn = document.getElementById('openDashboardBtn');
    if (openDashboardBtn) {
        openDashboardBtn.addEventListener('click', () => {
            openAdminCodeModal();
        });
    }
    
    const viewReportsBtn = document.getElementById('viewReportsBtn');
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', () => {
            alert('📊 Relatórios do Sistema\n\nFuncionalidade em desenvolvimento...');
        });
    }
    
    const advancedSettingsBtn = document.getElementById('advancedSettingsBtn');
    if (advancedSettingsBtn) {
        advancedSettingsBtn.addEventListener('click', () => {
            alert('⚙️ Configurações Avançadas\n\nFuncionalidade em desenvolvimento...');
        });
    }
    
    // Adicionar event listener para logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            logout();
        });
    }
}

// Função para abrir modal de código de segurança admin
function openAdminCodeModal() {
    const modal = document.getElementById('adminCodeModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Limpar campo e erro
        const codeInput = document.getElementById('adminSecurityCode');
        const errorSpan = document.getElementById('adminCodeError');
        if (codeInput) codeInput.value = '';
        if (errorSpan) errorSpan.textContent = '';
        
        // Focar no campo
        if (codeInput) codeInput.focus();
    }
}

// Função para fazer logout
function logout() {
    // Limpar dados de autenticação
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Limpar autenticação admin
    if (adminSystem) {
        adminSystem.isAuthenticated = false;
        adminSystem.adminUser = null;
        adminSystem.clearAuthStatus();
    }
    
    // Fechar modal de contas
    closeModal('accountsModal');
    
    // Atualizar interface para usuário não logado
    updateAuthInterface(false);
    
    // Mostrar mensagem de sucesso
    showSuccessModal('✅ Logout realizado com sucesso!');
    setTimeout(() => {
        closeModal('successModal');
    }, 2000);
}

// Função para atualizar saldo do usuário
function updateUserBalance() {
    const userBalance = document.getElementById('userBalance');
    if (userBalance) {
        // Simular saldo do usuário (aqui você pode integrar com sua API)
        const currentBalance = localStorage.getItem('userBalance') || '1000.00';
        userBalance.textContent = `R$ ${parseFloat(currentBalance).toFixed(2).replace('.', ',')}`;
    }
}

// Função para abrir modal de depósito
function openDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Preencher email automaticamente se disponível
        const depositEmail = document.getElementById('depositEmail');
        const userEmail = localStorage.getItem('userEmail');
        if (depositEmail && userEmail) {
            depositEmail.value = userEmail;
        }
    }
}

// Função para processar depósito
function processDeposit(formData) {
    const amount = parseFloat(formData.get('amount'));
    const method = formData.get('method');
    const email = formData.get('email');
    
    // Simular processamento de depósito
    console.log('Processando depósito:', { amount, method, email });
    
    // Adicionar valor ao saldo
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || '1000.00');
    const newBalance = currentBalance + amount;
    localStorage.setItem('userBalance', newBalance.toFixed(2));
    
    // Aqui você pode integrar com sua API de pagamento
    
    // Simular sucesso
    return {
        success: true,
        message: `Depósito de R$ ${amount.toFixed(2).replace('.', ',')} processado com sucesso! Saldo atualizado.`,
        transactionId: 'TXN' + Date.now()
    };
}

// Função para upload de foto de perfil
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
    }
    
    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = e.target.result;
            
            // Salvar no localStorage (em produção, salvaria no servidor)
            localStorage.setItem('profilePhoto', e.target.result);
            
            // Mostrar mensagem de sucesso
            showSuccessModal('✅ Foto de perfil atualizada com sucesso!');
            setTimeout(() => {
                closeModal('successModal');
            }, 2000);
        }
    };
    
    reader.readAsDataURL(file);
}

// ===== SISTEMA DE AFILIADOS =====
function initAffiliateSystem() {
    // Gerar níveis de bônus
    generateBonusLevels();
    
    // Carregar dados salvos
    loadAffiliateData();
    
    // Event listeners
    const btnCopyLink = document.getElementById('btnCopyLink');
    const btnClaimBonus = document.getElementById('btnClaimBonus');
    const btnAffiliateHelp = document.getElementById('btnAffiliateHelp');
    
    if (btnCopyLink) {
        btnCopyLink.addEventListener('click', copyAffiliateLink);
    }
    
    if (btnClaimBonus) {
        btnClaimBonus.addEventListener('click', claimBonus);
    }
    
    if (btnAffiliateHelp) {
        btnAffiliateHelp.addEventListener('click', showAffiliateHelp);
    }
}

function loadAffiliateData() {
    // Carregar dados do localStorage
    const affiliateData = JSON.parse(localStorage.getItem('affiliateData')) || {
        currentBonus: 0, // Começa em 0 até confirmar depósito
        totalReferrals: 0,
        totalEarned: 0,
        referrals: [],
        bonusLevel: 1,
        pendingDeposits: [] // Lista de depósitos pendentes
    };
    
    // Atualizar interface
    updateAffiliateUI(affiliateData);
}

function updateAffiliateUI(data) {
    const currentBonus = document.getElementById('currentBonus');
    const totalReferrals = document.getElementById('totalReferrals');
    const totalEarned = document.getElementById('totalEarned');
    const btnClaimBonus = document.getElementById('btnClaimBonus');
    const statusCard = document.querySelector('.status-card');
    
    if (currentBonus) currentBonus.textContent = `R$ ${data.currentBonus.toFixed(2).replace('.', ',')}`;
    if (totalReferrals) totalReferrals.textContent = data.totalReferrals;
    if (totalEarned) totalEarned.textContent = `R$ ${data.totalEarned.toFixed(2).replace('.', ',')}`;
    
    // Atualizar botão de resgate
    if (btnClaimBonus) {
        if (data.currentBonus > 0) {
            btnClaimBonus.disabled = false;
            btnClaimBonus.classList.add('available');
            btnClaimBonus.innerHTML = '<i class="fas fa-gift"></i> Resgatar Bônus';
        } else {
            btnClaimBonus.disabled = true;
            btnClaimBonus.classList.remove('available');
            btnClaimBonus.innerHTML = '<i class="fas fa-lock"></i> Bônus Bloqueado';
        }
    }
    
    // Atualizar status card
    if (statusCard) {
        if (data.currentBonus > 0) {
            statusCard.className = 'status-card available';
            statusCard.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <div class="status-content">
                    <h5>Bônus Disponível</h5>
                    <p>Você tem R$ ${data.currentBonus.toFixed(2).replace('.', ',')} disponíveis para resgate!</p>
                </div>
            `;
        } else {
            statusCard.className = 'status-card pending';
            statusCard.innerHTML = `
                <i class="fas fa-clock"></i>
                <div class="status-content">
                    <h5>Bônus Pendente</h5>
                    <p>Seu bônus será liberado após a confirmação do depósito de R$ 20,00 da pessoa convidada.</p>
                </div>
            `;
        }
    }
    
    // Atualizar níveis de bônus
    updateBonusLevels(data.bonusLevel);
    
    // Atualizar histórico de indicações
    updateReferralHistory(data.referrals);
}

function updateBonusLevels(level) {
    const bonusLevels = document.querySelectorAll('.bonus-level');
    bonusLevels.forEach((levelEl, index) => {
        levelEl.classList.remove('active');
        if (parseInt(levelEl.dataset.level) === level) {
            levelEl.classList.add('active');
        }
    });
}

function generateBonusLevels() {
    const bonusLevelsContainer = document.getElementById('bonusLevels');
    if (!bonusLevelsContainer) return;
    
    // Limpar container
    bonusLevelsContainer.innerHTML = '';
    
    // Gerar 100 níveis
    for (let i = 1; i <= 100; i++) {
        const bonusValue = 20 + (i - 1) * 15; // Começa em 20 e aumenta de 15 em 15
        const levelElement = document.createElement('div');
        levelElement.className = 'bonus-level';
        levelElement.dataset.level = i;
        
        levelElement.innerHTML = `
            <span class="level-number">${i}</span>
            <span class="level-bonus">R$ ${bonusValue.toFixed(2).replace('.', ',')}</span>
            <span class="level-status">${i === 1 ? 'Ativo' : 'Bloqueado'}</span>
        `;
        
        bonusLevelsContainer.appendChild(levelElement);
    }
    
    // Inicializar navegação
    initBonusNavigation();
}

function initBonusNavigation() {
    const btnPrev = document.getElementById('btnPrevLevels');
    const btnNext = document.getElementById('btnNextLevels');
    const levelCounter = document.getElementById('levelCounter');
    
    if (!btnPrev || !btnNext || !levelCounter) return;
    
    let currentPage = 0;
    const levelsPerPage = 10;
    const totalPages = Math.ceil(100 / levelsPerPage);
    
    function showLevels(page) {
        const startLevel = page * levelsPerPage + 1;
        const endLevel = Math.min((page + 1) * levelsPerPage, 100);
        
        // Ocultar todos os níveis
        const allLevels = document.querySelectorAll('.bonus-level');
        allLevels.forEach((level, index) => {
            if (index >= startLevel - 1 && index < endLevel) {
                level.style.display = 'block';
            } else {
                level.style.display = 'none';
            }
        });
        
        // Atualizar contador
        levelCounter.textContent = `Níveis ${startLevel}-${endLevel} de 100`;
        
        // Atualizar botões
        btnPrev.disabled = page === 0;
        btnNext.disabled = page === totalPages - 1;
    }
    
    // Event listeners
    btnPrev.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            showLevels(currentPage);
        }
    });
    
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showLevels(currentPage);
        }
    });
    
    // Mostrar primeira página
    showLevels(0);
}

function updateReferralHistory(referrals) {
    const referralList = document.getElementById('referralList');
    if (!referralList) return;
    
    if (referrals.length === 0) {
        referralList.innerHTML = `
            <div class="no-referrals">
                <i class="fas fa-user-plus"></i>
                <p>Nenhuma indicação ainda</p>
                <span>Compartilhe seu link para começar a ganhar!</span>
            </div>
        `;
    } else {
        referralList.innerHTML = referrals.map(referral => {
            let statusText, statusClass, statusIcon;
            
            if (referral.status === 'completed') {
                statusText = '✅ Completo';
                statusClass = 'completed';
                statusIcon = 'fas fa-check-circle';
            } else if (referral.status === 'pending_deposit') {
                statusText = '💰 Depósito Pendente';
                statusClass = 'pending_deposit';
                statusIcon = 'fas fa-clock';
            } else {
                statusText = '⏳ Pendente';
                statusClass = 'pending';
                statusIcon = 'fas fa-clock';
            }
            
            return `
                <div class="referral-item ${statusClass}">
                    <div class="referral-info">
                        <span class="referral-name">${referral.name}</span>
                        <span class="referral-date">${referral.date}</span>
                        ${referral.status === 'pending_deposit' ? `<span class="deposit-required">Depósito: R$ ${referral.depositRequired},00</span>` : ''}
                    </div>
                    <div class="referral-status ${statusClass}">
                        <i class="${statusIcon}"></i>
                        <span>${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function copyAffiliateLink() {
    const affiliateLink = document.getElementById('affiliateLink');
    if (affiliateLink) {
        affiliateLink.select();
        affiliateLink.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            
            // Feedback visual
            const btnCopy = document.getElementById('btnCopyLink');
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            btnCopy.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            setTimeout(() => {
                btnCopy.innerHTML = originalText;
                btnCopy.style.background = 'linear-gradient(135deg, var(--accent-color) 0%, #1d4ed8 100%)';
            }, 2000);
            
            showSuccessModal('✅ Link copiado para a área de transferência!');
        } catch (err) {
            showSuccessModal('❌ Erro ao copiar link');
        }
    }
}

function claimBonus() {
    const affiliateData = JSON.parse(localStorage.getItem('affiliateData')) || {
        currentBonus: 20,
        totalReferrals: 0,
        totalEarned: 0,
        referrals: [],
        bonusLevel: 1
    };
    
    if (affiliateData.currentBonus > 0) {
        // Animação de resgate
        const btnClaim = document.getElementById('btnClaimBonus');
        btnClaim.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resgatando...';
        btnClaim.disabled = true;
        
        setTimeout(() => {
            // Atualizar dados
            affiliateData.totalEarned += affiliateData.currentBonus;
            affiliateData.currentBonus = 0;
            
            // Salvar no localStorage
            localStorage.setItem('affiliateData', JSON.stringify(affiliateData));
            
            // Atualizar interface
            updateAffiliateUI(affiliateData);
            
            // Resetar botão
            btnClaim.innerHTML = '<i class="fas fa-gift"></i> Resgatar Bônus';
            btnClaim.disabled = false;
            
            // Mostrar sucesso
            showSuccessModal(`🎉 Bônus de R$ ${affiliateData.totalEarned.toFixed(2).replace('.', ',')} resgatado com sucesso!`);
            
            // Atualizar saldo do usuário
            updateUserBalance();
        }, 2000);
    } else {
        showSuccessModal('❌ Nenhum bônus disponível para resgate');
    }
}

function showAffiliateHelp() {
    const helpMessage = `
🎯 **Como Funciona o Programa de Afiliados:**

1️⃣ **Cadastro**: Compartilhe seu link único com amigos
2️⃣ **Indicação**: Quando alguém se cadastrar com seu link
3️⃣ **Depósito**: E fizer um depósito mínimo de R$ 20,00
4️⃣ **Bônus**: Você ganha R$ 15,00 por indicação válida
5️⃣ **Progressão**: Seu bônus aumenta a cada indicação
6️⃣ **Resgate**: Resgate seus bônus quando quiser

💰 **Sistema de 100 Níveis:**
• Começa em R$ 20,00
• Aumenta R$ 15,00 por nível
• Nível 1: R$ 20,00
• Nível 10: R$ 155,00
• Nível 50: R$ 755,00
• Nível 100: R$ 1.505,00

🚀 **Dica**: Quanto mais indicações, maior seu bônus!
    `;
    
    alert(helpMessage);
}

// Simular indicação (para demonstração)
function simulateReferral(name) {
    const affiliateData = JSON.parse(localStorage.getItem('affiliateData')) || {
        currentBonus: 0,
        totalReferrals: 0,
        totalEarned: 0,
        referrals: [],
        bonusLevel: 1,
        pendingDeposits: []
    };
    
    // Adicionar nova indicação
    affiliateData.totalReferrals++;
    
    // Calcular novo nível baseado no total de indicações (máximo 100)
    affiliateData.bonusLevel = Math.min(affiliateData.totalReferrals, 100);
    
    // Adicionar ao histórico com status pendente
    affiliateData.referrals.push({
        name: name,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'pending_deposit', // Status pendente até confirmar depósito
        depositRequired: 20
    });
    
    // Adicionar à lista de depósitos pendentes
    affiliateData.pendingDeposits.push({
        name: name,
        amount: 20,
        date: new Date().toLocaleDateString('pt-BR')
    });
    
    // Salvar dados
    localStorage.setItem('affiliateData', JSON.stringify(affiliateData));
    
    // Atualizar interface
    updateAffiliateUI(affiliateData);
    
    // Mostrar mensagem sobre depósito pendente
    showSuccessModal(`🎉 Nova indicação! ${name} se cadastrou com seu link!\n\n⚠️ Bônus será liberado após confirmação do depósito de R$ 20,00.`);
}

// Simular confirmação de depósito (para demonstração)
function simulateDepositConfirmation(name) {
    const affiliateData = JSON.parse(localStorage.getItem('affiliateData')) || {
        currentBonus: 0,
        totalReferrals: 0,
        totalEarned: 0,
        referrals: [],
        bonusLevel: 1,
        pendingDeposits: []
    };
    
    // Encontrar a indicação
    const referral = affiliateData.referrals.find(r => r.name === name);
    if (referral && referral.status === 'pending_deposit') {
        // Atualizar status
        referral.status = 'completed';
        referral.depositConfirmed = true;
        referral.depositDate = new Date().toLocaleDateString('pt-BR');
        
        // Remover da lista de pendentes
        affiliateData.pendingDeposits = affiliateData.pendingDeposits.filter(d => d.name !== name);
        
        // Liberar bônus
        affiliateData.currentBonus += 15;
        
        // Salvar dados
        localStorage.setItem('affiliateData', JSON.stringify(affiliateData));
        
        // Atualizar interface
        updateAffiliateUI(affiliateData);
        
        // Mostrar sucesso
        showSuccessModal(`✅ Depósito confirmado! Bônus de R$ 15,00 liberado para ${name}!`);
    }
}

// ===== SISTEMA FINANCEIRO =====
function initFinancialSystem() {
    // Event listeners para formulários financeiros
    const bankForm = document.getElementById('bankForm');
    const pixForm = document.getElementById('pixForm');
    const depositMethod = document.getElementById('depositMethod');
    
    if (bankForm) {
        bankForm.addEventListener('submit', handleBankFormSubmit);
    }
    
    if (pixForm) {
        pixForm.addEventListener('submit', handlePixFormSubmit);
    }
    
    if (depositMethod) {
        depositMethod.addEventListener('change', handleDepositMethodChange);
    }
    
    // Carregar dados salvos
    loadFinancialData();
    
    // Inicializar formatação de CPF
    initCPFFormatting();
}

function handleBankFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bankData = {
        bankName: formData.get('bankName'),
        bankAgency: formData.get('bankAgency'),
        bankAccount: formData.get('bankAccount'),
        bankCPF: formData.get('bankCPF'),
        accountHolderName: formData.get('accountHolderName'),
        savedAt: new Date().toISOString()
    };
    
    // Salvar dados bancários
    localStorage.setItem('bankData', JSON.stringify(bankData));
    
    // Mostrar sucesso
    showSuccessModal('✅ Dados bancários salvos com sucesso!');
    
    // Resetar formulário
    e.target.reset();
}

function handlePixFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pixData = {
        pixType: formData.get('pixType'),
        pixKey: formData.get('pixKey'),
        pixCPF: formData.get('pixCPF'),
        savedAt: new Date().toISOString()
    };
    
    // Salvar dados PIX
    localStorage.setItem('pixData', JSON.stringify(pixData));
    
    // Mostrar sucesso
    showSuccessModal('✅ Chave PIX salva com sucesso!');
    
    // Resetar formulário
    e.target.reset();
}

function handleDepositMethodChange(e) {
    const cardFields = document.getElementById('cardFields');
    const selectedMethod = e.target.value;
    
    if (selectedMethod === 'credit-card' || selectedMethod === 'debit-card') {
        cardFields.style.display = 'block';
        
        // Mostrar/ocultar campo de parcelas baseado no tipo
        const installmentsField = document.getElementById('cardInstallments');
        if (installmentsField) {
            if (selectedMethod === 'credit-card') {
                installmentsField.style.display = 'block';
            } else {
                installmentsField.style.display = 'none';
            }
        }
    } else {
        cardFields.style.display = 'none';
    }
}

function loadFinancialData() {
    // Carregar dados bancários
    const bankData = JSON.parse(localStorage.getItem('bankData'));
    if (bankData) {
        document.getElementById('bankName').value = bankData.bankName || '';
        document.getElementById('bankAgency').value = bankData.bankAgency || '';
        document.getElementById('bankAccount').value = bankData.bankAccount || '';
        document.getElementById('bankCPF').value = bankData.bankCPF || '';
        document.getElementById('accountHolderName').value = bankData.accountHolderName || '';
    }
    
    // Carregar dados PIX
    const pixData = JSON.parse(localStorage.getItem('pixData'));
    if (pixData) {
        document.getElementById('pixType').value = pixData.pixType || '';
        document.getElementById('pixKey').value = pixData.pixKey || '';
        document.getElementById('pixCPF').value = pixData.pixCPF || '';
    }
}

function initCPFFormatting() {
    // Formatação automática de CPF para campos bancários
    const bankCPF = document.getElementById('bankCPF');
    const pixCPF = document.getElementById('pixCPF');
    
    if (bankCPF) {
        bankCPF.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }
    
    if (pixCPF) {
        pixCPF.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }
}

// ===== SISTEMA DE PERFIL =====
function initProfileSystem() {
    // Event listener para formulário de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileFormSubmit);
    }
    
    // Carregar dados salvos do perfil
    loadProfileData();
    
    // Inicializar formatação de telefone
    initPhoneFormatting();
}

// ===== SISTEMA DE CAIXAS =====
function initCaseSystem() {
    // Carregar configurações de probabilidades
    loadCaseProbabilities();
    
    // Inicializar sistema de som
    initCaseSounds();
}

// Configurações de probabilidades das caixas por tipo
let caseProbabilities = {
    premium: {
        // Prêmios de alto valor (R$ 50+)
        iphone15: 0.3,      // 0.3% - R$ 5.999
        macbook: 0.2,       // 0.2% - R$ 18.999
        iphone13: 0.5,      // 0.5% - R$ 4.499
        acer: 0.8,          // 0.8% - R$ 6.499
        jbl: 1.5,           // 1.5% - R$ 2.499
        airpods: 2.0,       // 2.0% - R$ 1.299
        money500: 3.0,      // 3.0% - R$ 500
        money100: 8.0,      // 8.0% - R$ 100
        money50: 15.0,      // 15.0% - R$ 50
        money25: 20.0       // 20.0% - R$ 25
    },
    medium: {
        // Prêmios de médio valor (R$ 20+)
        iphone13: 0.5,      // 0.5% - R$ 4.499
        acer: 1.0,          // 1.0% - R$ 6.499
        jbl: 1.5,           // 1.5% - R$ 2.499
        airpods: 2.5,       // 2.5% - R$ 1.299
        xiaomi: 3.0,        // 3.0% - R$ 899
        speaker: 4.0,       // 4.0% - R$ 299
        money200: 5.0,      // 5.0% - R$ 200
        money100: 10.0,     // 10.0% - R$ 100
        money50: 15.0,      // 15.0% - R$ 50
        money25: 20.0       // 20.0% - R$ 25
    },
    basic: {
        // Prêmios de baixo valor (R$ 10+)
        airpods: 1.0,       // 1.0% - R$ 1.299
        xiaomi: 2.0,        // 2.0% - R$ 899
        speaker: 3.0,       // 3.0% - R$ 299
        fone: 4.0,          // 4.0% - R$ 199
        money100: 8.0,      // 8.0% - R$ 100
        money50: 12.0,      // 12.0% - R$ 50
        money25: 18.0,      // 18.0% - R$ 25
        money15: 25.0       // 25.0% - R$ 15
    },
    simple: {
        // Prêmios de valor mínimo (R$ 5+)
        speaker: 2.0,       // 2.0% - R$ 299
        fone: 3.0,          // 3.0% - R$ 199
        carregador: 5.0,    // 5.0% - R$ 99
        money50: 10.0,      // 10.0% - R$ 50
        money25: 15.0,      // 15.0% - R$ 25
        money15: 20.0,      // 20.0% - R$ 15
        money10: 25.0       // 25.0% - R$ 10
    }
};

// Tipo de caixa atual
let currentCaseType = 'premium';

// Função para obter informações das caixas
function getCaseInfo(caseType) {
    const cases = {
        premium: {
            name: 'Caixa Premium Lr4',
            price: 'R$ 50,00',
            description: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!',
            icon: '💎'
        },
        medium: {
            name: 'Caixa Média Lr4',
            price: 'R$ 20,00',
            description: 'Chance de ganhar iPhone 13, Xiaomi, AirPods e muito mais!',
            icon: '🎁'
        },
        basic: {
            name: 'Caixa Básica Lr4',
            price: 'R$ 10,00',
            description: 'Chance de ganhar AirPods, Xiaomi, Caixinha JBL e muito mais!',
            icon: '🎯'
        },
        simple: {
            name: 'Caixa Simples Lr4',
            price: 'R$ 5,00',
            description: 'Chance de ganhar Caixinha JBL, Fone Bluetooth, Carregador e muito mais!',
            icon: '🎪'
        }
    };
    
    return cases[caseType] || cases.premium;
}

// Sistema de som para caixas
let caseSounds = {
    spin: null,
    win: null,
    open: null
};

function initCaseSounds() {
    // Criar áudios para as caixas
    caseSounds.spin = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    caseSounds.win = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    caseSounds.open = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
}

function loadCaseProbabilities() {
    const saved = localStorage.getItem('caseProbabilities');
    if (saved) {
        caseProbabilities = JSON.parse(saved);
    }
}

function saveCaseProbabilities() {
    localStorage.setItem('caseProbabilities', JSON.stringify(caseProbabilities));
}

function openCaseConfirmModal(caseType = 'premium') {
    currentCaseType = caseType;
    const modal = document.getElementById('caseConfirmModal');
    if (modal) {
        // Atualizar informações da caixa no modal
        const caseInfo = getCaseInfo(caseType);
        const modalTitle = modal.querySelector('.modal-title');
        const modalPrice = modal.querySelector('.case-price-display');
        const modalDescription = modal.querySelector('.case-description-display');
        
        if (modalTitle) modalTitle.textContent = caseInfo.name;
        if (modalPrice) modalPrice.textContent = `Preço: ${caseInfo.price}`;
        if (modalDescription) modalDescription.textContent = caseInfo.description;
        
        // Verificar se o usuário tem saldo suficiente
        const casePrice = parseFloat(caseInfo.price.replace('R$ ', '').replace(',', '.'));
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '1000.00');
        
        // Atualizar botão de confirmação baseado no saldo
        const confirmBtn = modal.querySelector('.btn-confirm');
        if (confirmBtn) {
            if (currentBalance < casePrice) {
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Saldo Insuficiente';
                confirmBtn.style.opacity = '0.5';
            } else {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirmar Compra';
                confirmBtn.style.opacity = '1';
            }
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCaseConfirmModal() {
    const modal = document.getElementById('caseConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function confirmOpenCase() {
    // Verificar se o usuário tem saldo suficiente
    const caseInfo = getCaseInfo(currentCaseType);
    const casePrice = parseFloat(caseInfo.price.replace('R$ ', '').replace(',', '.'));
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || '1000.00');
    
    if (currentBalance < casePrice) {
        showSuccessModal('❌ Saldo insuficiente! Faça um depósito para continuar.');
        setTimeout(() => closeModal('successModal'), 3000);
        return;
    }
    
    // Debitar o saldo
    const newBalance = currentBalance - casePrice;
    localStorage.setItem('userBalance', newBalance.toFixed(2));
    
    // Atualizar saldo na interface
    updateUserBalance();
    
    // Fechar modal de confirmação
    closeCaseConfirmModal();
    
    // Abrir modal da roleta
    openCaseModal();
}

function openCaseModal() {
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Resetar estado da roleta
        resetCaseWheel();
    }
}

function closeCaseModal() {
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function resetCaseWheel() {
    const wheel = document.querySelector('.case-prize-wheel');
    const spinBtn = document.getElementById('spinCaseBtn');
    
    if (wheel) wheel.classList.remove('spinning');
    if (spinBtn) {
        spinBtn.classList.remove('spinning');
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<span class="clover-spin-large">♣</span><span class="spin-text">Girar Caixa</span>';
    }
}

function spinCase() {
    const spinBtn = document.getElementById('spinCaseBtn');
    const wheel = document.querySelector('.case-prize-wheel');
    const prizeItems = document.querySelectorAll('.prize-item');
    
    if (!spinBtn || !wheel) return;
    
    // Desabilitar botão durante o giro
    spinBtn.disabled = true;
    spinBtn.classList.add('spinning');
    wheel.classList.add('spinning');
    
    // Tocar som de giro
    if (caseSounds.spin) {
        caseSounds.spin.currentTime = 0;
        caseSounds.spin.play().catch(() => {});
    }
    
    // Determinar prêmio baseado nas probabilidades
    const prize = determinePrize();
    
    // Efeito de embaralhamento dos itens
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
        prizeItems.forEach((item, index) => {
            // Aplicar transformações aleatórias para embaralhar
            const randomX = (Math.random() - 0.5) * 30;
            const randomY = (Math.random() - 0.5) * 30;
            const randomRotate = (Math.random() - 0.5) * 30;
            const randomScale = 0.7 + Math.random() * 0.6;
            
            item.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
            item.style.zIndex = Math.floor(Math.random() * 10) + 1;
        });
        
        shuffleCount++;
        if (shuffleCount >= 30) {
            clearInterval(shuffleInterval);
        }
    }, 80);
    
    // Criar efeito de giro realista
    let rotations = 0;
    const totalRotations = 20; // 20 rotações completas
    const duration = 6000; // 6 segundos
    const interval = 50; // Atualizar a cada 50ms
    const steps = duration / interval;
    const rotationPerStep = (totalRotations * 360) / steps;
    
    const spinAnimation = setInterval(() => {
        rotations += rotationPerStep;
        wheel.style.transform = `rotate(${rotations}deg)`;
        
        if (rotations >= totalRotations * 360) {
            clearInterval(spinAnimation);
            
            // Resetar posições dos itens
            prizeItems.forEach((item, index) => {
                item.style.transform = '';
                item.style.zIndex = '';
            });
            
            // Parar animações
            spinBtn.classList.remove('spinning');
            wheel.classList.remove('spinning');
            
            // Fechar modal da roleta
            closeCaseModal();
            
            // Mostrar modal de resultado
            showCaseResult(prize);
            
            // Salvar no histórico
            saveCaseHistory(prize);
        }
    }, interval);
}

function determinePrize() {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    // Usar probabilidades do tipo de caixa atual
    const currentProbabilities = caseProbabilities[currentCaseType];
    
    for (const [prize, probability] of Object.entries(currentProbabilities)) {
        cumulative += probability;
        if (random <= cumulative) {
            return prize;
        }
    }
    
    // Fallback para prêmio menor baseado no tipo
    const fallbacks = {
        premium: 'money15',
        medium: 'money10',
        basic: 'money5',
        simple: 'money5'
    };
    
    return fallbacks[currentCaseType] || 'money15';
}

function showCaseResult(prize) {
    const prizeData = getPrizeData(prize);
    
    // Tocar som de vitória
    if (caseSounds.win) {
        caseSounds.win.currentTime = 0;
        caseSounds.win.play().catch(() => {});
    }
    
    // Atualizar dados do prêmio no modal
    const wonPrizeImage = document.getElementById('wonPrizeImage');
    const wonPrizeName = document.getElementById('wonPrizeName');
    const wonPrizeValue = document.getElementById('wonPrizeValue');
    const wonPrizeRarity = document.getElementById('wonPrizeRarity');
    
    if (wonPrizeImage) wonPrizeImage.src = `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop&crop=center`;
    if (wonPrizeName) wonPrizeName.textContent = prizeData.name;
    if (wonPrizeValue) wonPrizeValue.textContent = prizeData.value;
    if (wonPrizeRarity) {
        wonPrizeRarity.textContent = prizeData.rarity.toUpperCase();
        wonPrizeRarity.className = `prize-rarity ${prizeData.rarity}`;
    }
    
    // Mostrar modal de resultado
    const modal = document.getElementById('caseResultModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCaseResultModal() {
    const modal = document.getElementById('caseResultModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function redeemPrize() {
    const prizeName = document.getElementById('wonPrizeName').textContent;
    const prizeValue = document.getElementById('wonPrizeValue').textContent;
    
    // Calcular valor do prêmio
    const value = parseFloat(prizeValue.replace('R$ ', '').replace('.', '').replace(',', '.'));
    
    // Creditar o saldo (prêmio resgatado)
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || '1000.00');
    const newBalance = currentBalance + value;
    localStorage.setItem('userBalance', newBalance.toFixed(2));
    
    // Atualizar saldo na interface
    updateUserBalance();
    
    // Mostrar mensagem de sucesso
    showSuccessModal(`🎁 Prêmio ${prizeName} resgatado com sucesso! Valor de R$ ${value.toLocaleString('pt-BR')} creditado na sua conta.`);
    
    // Fechar modal de resultado
    closeCaseResultModal();
    
    // Resetar botão da roleta
    const spinBtn = document.getElementById('spinCaseBtn');
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<span class="clover-spin-large">♣</span><span class="spin-text">Girar Caixa</span>';
    }
}

function sellPrize() {
    const prizeName = document.getElementById('wonPrizeName').textContent;
    const prizeValue = document.getElementById('wonPrizeValue').textContent;
    
    // Calcular valor da venda
    const value = parseFloat(prizeValue.replace('R$ ', '').replace('.', '').replace(',', '.'));
    const sellValue = value * 0.8; // Vender por 80% do valor
    
    // Creditar o saldo
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || '1000.00');
    const newBalance = currentBalance + sellValue;
    localStorage.setItem('userBalance', newBalance.toFixed(2));
    
    // Atualizar saldo na interface
    updateUserBalance();
    
    // Mostrar mensagem de sucesso
    showSuccessModal(`💰 Prêmio ${prizeName} vendido por R$ ${sellValue.toLocaleString('pt-BR')}! Valor creditado na sua conta.`);
    
    // Fechar modal de resultado
    closeCaseResultModal();
    
    // Resetar botão da roleta
    const spinBtn = document.getElementById('spinCaseBtn');
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<span class="clover-spin-large">♣</span><span class="spin-text">Girar Caixa</span>';
    }
}

function getPrizeData(prize) {
    const prizes = {
        // Prêmios Premium (Alto Valor)
        iphone15: { name: 'iPhone 15', value: 'R$ 5.999', rarity: 'legendary' },
        macbook: { name: 'MacBook Pro', value: 'R$ 18.999', rarity: 'legendary' },
        iphone13: { name: 'iPhone 13', value: 'R$ 4.499', rarity: 'epic' },
        acer: { name: 'Acer Nitro', value: 'R$ 6.499', rarity: 'epic' },
        jbl: { name: 'JBL Boombox', value: 'R$ 2.499', rarity: 'rare' },
        airpods: { name: 'AirPods Pro', value: 'R$ 1.299', rarity: 'rare' },
        
        // Prêmios Médio Valor
        xiaomi: { name: 'Xiaomi Redmi', value: 'R$ 899', rarity: 'uncommon' },
        speaker: { name: 'Caixinha JBL', value: 'R$ 299', rarity: 'uncommon' },
        fone: { name: 'Fone Bluetooth', value: 'R$ 199', rarity: 'common' },
        carregador: { name: 'Carregador Wireless', value: 'R$ 99', rarity: 'common' },
        
        // Prêmios em Dinheiro
        money500: { name: 'R$ 500', value: 'R$ 500', rarity: 'rare' },
        money200: { name: 'R$ 200', value: 'R$ 200', rarity: 'uncommon' },
        money100: { name: 'R$ 100', value: 'R$ 100', rarity: 'uncommon' },
        money50: { name: 'R$ 50', value: 'R$ 50', rarity: 'common' },
        money25: { name: 'R$ 25', value: 'R$ 25', rarity: 'common' },
        money15: { name: 'R$ 15', value: 'R$ 15', rarity: 'common' },
        money10: { name: 'R$ 10', value: 'R$ 10', rarity: 'common' },
        money5: { name: 'R$ 5', value: 'R$ 5', rarity: 'common' }
    };
    
    return prizes[prize] || prizes.money15;
}

function saveCaseHistory(prize) {
    const history = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    const prizeData = getPrizeData(prize);
    
    history.push({
        prize: prize,
        name: prizeData.name,
        value: prizeData.value,
        rarity: prizeData.rarity,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('caseHistory', JSON.stringify(history));
}

// Função para admin controlar probabilidades
function updateCaseProbability(caseType, prize, newProbability) {
    if (caseProbabilities[caseType] && caseProbabilities[caseType].hasOwnProperty(prize)) {
        caseProbabilities[caseType][prize] = parseFloat(newProbability);
        saveCaseProbabilities();
        return true;
    }
    return false;
}

// Função para obter estatísticas das caixas
function getCaseStats() {
    const history = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    const stats = {
        totalOpened: history.length,
        totalValue: 0,
        prizesByRarity: {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0
        }
    };
    
    history.forEach(item => {
        const value = parseFloat(item.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        stats.totalValue += value;
        
        if (stats.prizesByRarity[item.rarity] !== undefined) {
            stats.prizesByRarity[item.rarity]++;
        }
    });
    
    return stats;
}

// Função para salvar probabilidades das caixas
function saveCaseProbabilities() {
    const prizes = ['iphone15', 'iphone13', 'macbook', 'acer', 'jbl', 'money500', 'money50', 'money20', 'money15'];
    
    prizes.forEach(prize => {
        const input = document.getElementById(`prob-${prize}`);
        if (input) {
            const value = parseFloat(input.value);
            if (!isNaN(value) && value >= 0 && value <= 100) {
                updateCaseProbability(prize, value);
            }
        }
    });
    
    showSuccessModal('✅ Probabilidades das caixas salvas com sucesso!');
}

// Função para atualizar estatísticas das caixas
function refreshCaseStats() {
    const stats = getCaseStats();
    
    // Atualizar valores na interface
    document.getElementById('totalCases').textContent = stats.totalOpened;
    document.getElementById('totalValue').textContent = `R$ ${stats.totalValue.toLocaleString('pt-BR')}`;
    document.getElementById('legendaryPrizes').textContent = stats.prizesByRarity.legendary;
    document.getElementById('epicPrizes').textContent = stats.prizesByRarity.epic;
    document.getElementById('rarePrizes').textContent = stats.prizesByRarity.rare;
    document.getElementById('uncommonPrizes').textContent = stats.prizesByRarity.uncommon;
    document.getElementById('commonPrizes').textContent = stats.prizesByRarity.common;
    
    showSuccessModal('✅ Estatísticas das caixas atualizadas!');
}

// Função para carregar probabilidades na interface
function loadCaseProbabilitiesToUI() {
    const caseTypes = ['premium', 'medium', 'basic', 'simple'];
    
    caseTypes.forEach(caseType => {
        const prizes = Object.keys(caseProbabilities[caseType]);
        
        prizes.forEach(prize => {
            const input = document.getElementById(`prob-${caseType}-${prize}`);
            if (input && caseProbabilities[caseType][prize] !== undefined) {
                input.value = caseProbabilities[caseType][prize];
            }
        });
    });
}

// Função para mostrar aba de caixas apenas para admin
function showCasesTabForAdmin() {
    const casesTabBtn = document.getElementById('casesTabBtn');
    if (casesTabBtn && adminSystem.isAuthenticated) {
        casesTabBtn.style.display = 'block';
    }
}

function handleProfileFormSubmit(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = new FormData(e.target);
    const profileData = {
        firstName: formData.get('profileFirstName'),
        lastName: formData.get('profileLastName'),
        phone: formData.get('profilePhone'),
        birthDate: formData.get('profileBirth'),
        address: formData.get('profileAddress'),
        city: formData.get('profileCity'),
        state: formData.get('profileState'),
        zipCode: formData.get('profileZip'),
        savedAt: new Date().toISOString()
    };
    
    // Salvar dados no localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Atualizar interface com novos dados
    updateProfileInterface(profileData);
    
    // Mostrar mensagem de sucesso
    showSuccessModal('✅ Dados pessoais salvos com sucesso!');
    
    // Resetar formulário (opcional - comentado para manter dados visíveis)
    // e.target.reset();
}

function loadProfileData() {
    // Carregar dados salvos do perfil
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    if (profileData) {
        // Preencher campos com dados salvos
        const firstNameField = document.getElementById('profileFirstName');
        const lastNameField = document.getElementById('profileLastName');
        const phoneField = document.getElementById('profilePhone');
        const birthField = document.getElementById('profileBirth');
        const addressField = document.getElementById('profileAddress');
        const cityField = document.getElementById('profileCity');
        const stateField = document.getElementById('profileState');
        const zipField = document.getElementById('profileZip');
        
        if (firstNameField) firstNameField.value = profileData.firstName || '';
        if (lastNameField) lastNameField.value = profileData.lastName || '';
        if (phoneField) phoneField.value = profileData.phone || '';
        if (birthField) birthField.value = profileData.birthDate || '';
        if (addressField) addressField.value = profileData.address || '';
        if (cityField) cityField.value = profileData.city || '';
        if (stateField) stateField.value = profileData.state || '';
        if (zipField) zipField.value = profileData.zipCode || '';
        
        // Atualizar interface com dados carregados
        updateProfileInterface(profileData);
    }
}

function updateProfileInterface(profileData) {
    // Atualizar nome exibido no cabeçalho do perfil
    const profileName = document.getElementById('profileName');
    if (profileName && profileData.firstName && profileData.lastName) {
        profileName.textContent = `${profileData.firstName} ${profileData.lastName}`;
    }
    
    // Atualizar email (se disponível)
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            profileEmail.textContent = userEmail;
        }
    }
}

function initPhoneFormatting() {
    // Formatação automática de telefone
    const phoneField = document.getElementById('profilePhone');
    if (phoneField) {
        phoneField.addEventListener('input', (e) => {
            e.target.value = formatPhone(e.target.value);
        });
    }
}

function formatPhone(value) {
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');
    
    // Aplica máscara (11) 99999-9999
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
    
    return value;
}

// Inicializar funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para upload de foto
    const btnChangePhoto = document.getElementById('btnChangePhoto');
    const photoUpload = document.getElementById('photoUpload');
    
    if (btnChangePhoto && photoUpload) {
        btnChangePhoto.addEventListener('click', () => {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    // Carregar foto salva se existir
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = savedPhoto;
        }
    }
    
    // Inicializar sistema de afiliados
    initAffiliateSystem();
    
    // Inicializar sistema financeiro
    initFinancialSystem();
    
    // Inicializar sistema de perfil
    initProfileSystem();
    
    // Inicializar sistema de caixas
    initCaseSystem();
    
    // Verificar se é admin para mostrar aba de caixas
    if (adminSystem.isAuthenticated) {
        showCasesTabForAdmin();
        loadCaseProbabilitiesToUI();
    }
});

// Função para abrir modal de login
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Função para abrir modal de cadastro
function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar modais
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para fechar modal de sucesso
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para mostrar modal de sucesso
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Função para mostrar modal de verificação de email
function showEmailVerificationModal(email, userName) {
    document.getElementById('verificationEmail').textContent = email;
    document.getElementById('emailVerificationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Iniciar contador regressivo
    startVerificationCountdown();
    
    // Configurar formulário de verificação
    setupVerificationForm(email, userName);
}

// Validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(9)) !== digit1) return false;
    
    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cpf.charAt(10)) === digit2;
}

// Formatar CPF automaticamente
function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        input.value = value;
    }
}

// Verificar idade automaticamente
function checkAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return age - 1;
    }
    return age;
}

// Contador regressivo para verificação de email
let countdownInterval = null;

function startVerificationCountdown() {
    let timeLeft = 15 * 60; // 15 minutos em segundos
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('countdown').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').textContent = 'Expirado';
            document.getElementById('verificationCode').disabled = true;
            document.getElementById('resendCodeBtn').disabled = false;
        }
        
        timeLeft--;
    }, 1000);
}

// Configurar formulário de verificação
function setupVerificationForm(email, userName) {
    const verificationForm = document.getElementById('verificationForm');
    const resendBtn = document.getElementById('resendCodeBtn');
    
    // Formulário de verificação
    verificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const code = document.getElementById('verificationCode').value;
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;
        
        try {
            const result = testVerification(email, code);
            
            if (result.valid) {
                // Email verificado com sucesso
                showSuccessModal('Email verificado com sucesso! Sua conta foi ativada.');
                
                // Enviar email de boas-vindas
                await sendWelcomeEmail(email, userName);
                
                setTimeout(() => {
                    closeModal('successModal');
                    closeModal('emailVerificationModal');
                    
                    // Limpar contador
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                    }
                }, 3000);
            } else {
                document.getElementById('verificationError').textContent = result.message;
            }
        } catch (error) {
            document.getElementById('verificationError').textContent = 'Erro ao verificar código. Tente novamente.';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Botão de reenvio
    resendBtn.addEventListener('click', async () => {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Reenviando...';
        
        try {
            const result = resendTestCode(email, userName);
            
            if (result.success) {
                showSuccessModal('Novo código enviado com sucesso!');
                setTimeout(() => closeModal('successModal'), 2000);
                
                // Reiniciar contador
                startVerificationCountdown();
                
                // Limpar campo de código
                document.getElementById('verificationCode').value = '';
                document.getElementById('verificationError').textContent = '';
                document.getElementById('verificationCode').disabled = false;
            } else {
                showSuccessModal('Erro ao reenviar código: ' + result.message);
                setTimeout(() => closeModal('successModal'), 3000);
            }
        } catch (error) {
            showSuccessModal('Erro ao reenviar código. Tente novamente.');
            setTimeout(() => closeModal('successModal'), 3000);
        } finally {
            resendBtn.disabled = false;
            resendBtn.textContent = 'Reenviar Código';
        }
    });
}

// Inicializar modais de autenticação
function initAuthModals() {
    // Elementos dos modais
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const successModal = document.getElementById('successModal');
    
    // Botões de fechar
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.closest('.modal').id;
            closeModal(modalId);
            
            // Limpar contador se for modal de verificação
            if (modalId === 'emailVerificationModal' && countdownInterval) {
                clearInterval(countdownInterval);
            }
            
            // Fechar modal admin se necessário
            if (modalId === 'adminModal') {
                // Modal admin fechado
            }
        });
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Alternar entre modais
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openRegisterModal();
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openLoginModal();
        });
    }
    
    // Formatação automática de CPF
    const cpfInput = document.getElementById('registerCPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', () => formatCPF(cpfInput));
    }
    
    // Verificação de idade
    const birthInput = document.getElementById('registerBirth');
    if (birthInput) {
        birthInput.addEventListener('change', () => {
            const age = checkAge(birthInput.value);
            const ageError = document.getElementById('ageError');
            
            if (age < 18) {
                ageError.textContent = 'Você deve ter pelo menos 18 anos para se cadastrar.';
                birthInput.classList.add('error');
            } else {
                ageError.textContent = '';
                birthInput.classList.remove('error');
            }
        });
    }
    
    // Validação de CPF
    if (cpfInput) {
        cpfInput.addEventListener('blur', () => {
            const cpfError = document.getElementById('cpfError');
            
            if (!validateCPF(cpfInput.value)) {
                cpfError.textContent = 'CPF inválido.';
                cpfInput.classList.add('error');
            } else {
                cpfError.textContent = '';
                cpfInput.classList.remove('error');
            }
        });
    }
    
    // Validação de senha
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            const passwordError = document.getElementById('passwordError');
            
            if (passwordInput.value !== confirmPasswordInput.value) {
                passwordError.textContent = 'As senhas não coincidem.';
                confirmPasswordInput.classList.add('error');
            } else {
                passwordError.textContent = '';
                confirmPasswordInput.classList.remove('error');
            }
        });
    }
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Verificar se é login admin
            if (email === 'admin' && password === 'master123') {
                // Login admin bem-sucedido
                adminSystem.isAuthenticated = true;
                adminSystem.adminUser = 'admin';
                adminSystem.saveAuthStatus();
                
                // Atualizar interface para usuário logado
                updateAuthInterface(true, 'admin');
                
                showSuccessModal('👑 Login Admin realizado com sucesso!');
                setTimeout(() => {
                    closeModal('successModal');
                    closeModal('loginModal');
                }, 2000);
            } else if (email === 'admin' && password !== 'master123') {
                // Usuário admin com senha incorreta
                showSuccessModal('❌ Senha incorreta para usuário admin!');
                setTimeout(() => closeModal('successModal'), 3000);
            } else if (email === 'admin' && !password) {
                // Usuário admin sem senha
                showSuccessModal('❌ Digite a senha para usuário admin!');
                setTimeout(() => closeModal('successModal'), 3000);
            } else {
                // Login normal (aqui você pode integrar com sua API)
                console.log('Login normal:', { email, password });
                
                // Simular login bem-sucedido
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Atualizar interface para usuário logado
                updateAuthInterface(true, 'user');
                
                showSuccessModal('✅ Login realizado com sucesso!');
                setTimeout(() => {
                    closeModal('successModal');
                    closeModal('loginModal');
                }, 2000);
            }
        });
    }
    
    // Formulário de cadastro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Validações finais
            if (!validateCPF(data.cpf)) {
                document.getElementById('cpfError').textContent = 'CPF inválido.';
                return;
            }
            
            const age = checkAge(data.birth);
            if (age < 18) {
                document.getElementById('ageError').textContent = 'Você deve ter pelo menos 18 anos.';
                return;
            }
            
            if (data.password !== data.confirmPassword) {
                document.getElementById('passwordError').textContent = 'As senhas não coincidem.';
                return;
            }
            
            // Mostrar loading
            const submitBtn = e.target.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Enviar email de verificação (usando sistema de teste)
                const emailResult = simulateEmailVerification(data.email, data.name);
                
                if (emailResult.success) {
                    // Fechar modal de cadastro
                    closeModal('registerModal');
                    
                    // Mostrar modal de verificação
                    showEmailVerificationModal(data.email, data.name);
                    
                    // Resetar formulário
                    e.target.reset();
                } else {
                    showSuccessModal('Erro ao enviar email: ' + emailResult.message);
                }
                    } catch (error) {
            showSuccessModal('Erro ao processar cadastro. Tente novamente.');
        } finally {
            // Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Formulário de código de segurança admin
    const adminCodeForm = document.getElementById('adminCodeForm');
    if (adminCodeForm) {
        adminCodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const code = document.getElementById('adminSecurityCode').value;
            const errorSpan = document.getElementById('adminCodeError');
            
            if (code === '3005') {
                // Código correto - abrir dashboard admin
                closeModal('adminCodeModal');
                closeModal('accountsModal');
                
                // Abrir dashboard admin
                if (adminSystem && adminSystem.openAdminPanel) {
                    adminSystem.openAdminPanel();
                }
            } else {
                // Código incorreto
                if (errorSpan) {
                    errorSpan.textContent = 'Código de segurança incorreto.';
                }
                // Limpar campo
                document.getElementById('adminSecurityCode').value = '';
            }
        });
    }
    
    // Botão de depósito
    const btnDeposit = document.getElementById('btnDeposit');
    if (btnDeposit) {
        btnDeposit.addEventListener('click', () => {
            openDepositModal();
        });
    }
    
    // Botão de refresh do saldo
    const btnRefreshBalance = document.getElementById('btnRefreshBalance');
    if (btnRefreshBalance) {
        btnRefreshBalance.addEventListener('click', () => {
            updateUserBalance();
            // Adicionar efeito de rotação
            btnRefreshBalance.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                btnRefreshBalance.style.transform = 'rotate(0deg)';
            }, 500);
        });
    }
    
    // Formulário de depósito
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const result = processDeposit(formData);
            
            if (result.success) {
                showSuccessModal(result.message);
                setTimeout(() => {
                    closeModal('successModal');
                    closeModal('depositModal');
                    // Atualizar saldo após depósito
                    updateUserBalance();
                }, 2000);
            } else {
                showSuccessModal('Erro ao processar depósito. Tente novamente.');
                setTimeout(() => closeModal('successModal'), 3000);
            }
        });
    }
}
}

// ===== EXPORTAR PARA USO EXTERNO =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Br4Website;
} else if (typeof window !== 'undefined') {
    window.Br4Website = Br4Website;
}
