// ===== LR4 BET - SISTEMA UNIFICADO E FUNCIONAL =====

console.log('🚀 LR4 Sistema Unificado iniciando...');

// ===== VARIÁVEIS GLOBAIS =====
let userBalance = 1000.00;
let currentScratchType = 'premium';
let currentCaseType = 'premium';
let isScratching = false;
let scratchProgress = 0;
let availableCases = {};
let currentCasePrize = null;

// ===== SISTEMA DE SALDO =====
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    }
    localStorage.setItem('userBalance', userBalance.toString());
}

function showUserBalance() {
    const userBalanceSection = document.getElementById('userBalanceSection');
    if (userBalanceSection) {
        userBalanceSection.style.display = 'flex';
    }
}

function hideUserBalance() {
    const userBalanceSection = document.getElementById('userBalanceSection');
    if (userBalanceSection) {
        userBalanceSection.style.display = 'none';
    }
}

// ===== SISTEMA DE ADMIN MASTER =====
const ADMIN_CREDENTIALS = {
    email: 'admin@lr4.bet',
    password: 'admin123',
    name: 'Admin Master',
    balance: 10000.00
};

function checkLoginStatus() {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    console.log('🔍 Status de login:', { isAdminLoggedIn, isUserLoggedIn, currentUser });

    if (isAdminLoggedIn) {
        console.log('✅ Admin logado');
        hideLoginButtons();
        showAdminInfo();
        showUserBalance();
    } else if (isUserLoggedIn && currentUser) {
        console.log('✅ Usuário logado:', currentUser.name);
        hideLoginButtons();
        showUserInfo(currentUser);
        showUserBalance();
    } else {
        console.log('❌ Usuário não logado, mostrando botões de login');
        showLoginButtons();
        hideUserBalance();
        resetToGuestMode();
    }
}

function hideLoginButtons() {
    const loginBtn = document.getElementById('btnLogin');
    const registerBtn = document.getElementById('btnRegister');
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
}

function showLoginButtons() {
    const loginBtn = document.getElementById('btnLogin');
    const registerBtn = document.getElementById('btnRegister');
    
    console.log('🔍 Botões de login encontrados:', { loginBtn: !!loginBtn, registerBtn: !!registerBtn });
    
    if (loginBtn) {
        loginBtn.style.display = 'inline-block';
        console.log('✅ Botão de login exibido');
    } else {
        console.error('❌ Botão de login não encontrado!');
    }
    
    if (registerBtn) {
        registerBtn.style.display = 'inline-block';
        console.log('✅ Botão de registro exibido');
    } else {
        console.error('❌ Botão de registro não encontrado!');
    }
}

function showAdminInfo() {
    // Função para mostrar informações do admin (se necessário no futuro)
    console.log('👑 Admin logado:', ADMIN_CREDENTIALS.name);
}

function showUserInfo(user) {
    // Função para mostrar informações do usuário (se necessário no futuro)
    console.log('👤 Usuário logado:', user.name);
}

function resetToGuestMode() {
    // Função para resetar para modo visitante (se necessário no futuro)
    console.log('👤 Modo visitante ativado');
}

function logout() {
    console.log('🚪 Realizando logout...');
    
    // Limpar dados de login
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    
    // Resetar saldo para 0 (usuário não logado)
    userBalance = 0;
    updateBalanceDisplay();
    
    // Fechar modal "Minha Conta" se estiver aberto
    const accountModal = document.getElementById('accountModal');
    if (accountModal) {
        accountModal.classList.remove('show');
        accountModal.style.display = 'none';
        console.log('✅ Modal Minha Conta fechado');
    }
    
    // Atualizar status de login
    checkLoginStatus();
    
    // Mostrar notificação
    showNotification('info', 'Logout Realizado', 'Logout realizado com sucesso!');
    
    console.log('✅ Logout concluído - voltando para página principal');
}

// ===== SISTEMA DE RASPADINHAS NOVO =====
let scratchPrize = null;

// Configurações de probabilidades das raspadinhas
const scratchProbabilities = {
    premium: {
        iphone15: 0.2,      // 0.2% - R$ 5.999
        macbook: 0.1,       // 0.1% - R$ 18.999
        iphone13: 0.3,      // 0.3% - R$ 4.499
        acer: 0.5,          // 0.5% - R$ 6.499
        jbl: 1.0,           // 1.0% - R$ 2.499
        airpods: 1.5,       // 1.5% - R$ 1.299
        money500: 2.0,      // 2.0% - R$ 500
        money100: 5.0,      // 5.0% - R$ 100
        money50: 12.0,      // 12.0% - R$ 50
        money25: 18.0       // 18.0% - R$ 25
    },
    medium: {
        iphone13: 0.3,      // 0.3% - R$ 4.499
        acer: 0.5,          // 0.5% - R$ 6.499
        jbl: 1.0,           // 1.0% - R$ 2.499
        airpods: 1.5,       // 1.5% - R$ 1.299
        xiaomi: 2.0,        // 2.0% - R$ 899
        speaker: 4.0,       // 4.0% - R$ 299
        money200: 5.0,      // 5.0% - R$ 200
        money100: 10.0,     // 10.0% - R$ 100
        money50: 15.0,      // 15.0% - R$ 50
        money25: 20.0       // 20.0% - R$ 25
    },
    basic: {
        airpods: 0.5,       // 0.5% - R$ 1.299
        xiaomi: 1.0,        // 1.0% - R$ 899
        speaker: 2.0,       // 2.0% - R$ 299
        fone: 3.0,          // 3.0% - R$ 199
        money100: 5.0,      // 5.0% - R$ 100
        money50: 10.0,      // 10.0% - R$ 50
        money25: 15.0,      // 15.0% - R$ 25
        money15: 20.0       // 20.0% - R$ 15
    },
    simple: {
        speaker: 1.0,       // 1.0% - R$ 299
        fone: 2.0,          // 2.0% - R$ 199
        carregador: 3.0,    // 3.0% - R$ 99
        money50: 8.0,       // 8.0% - R$ 50
        money25: 12.0,      // 12.0% - R$ 25
        money15: 18.0,      // 18.0% - R$ 15
        money10: 22.0       // 22.0% - R$ 10
    }
};

// Função para obter informações das raspadinhas
function getScratchInfo(type) {
    const scratchTypes = {
        premium: {
            icon: '💎',
            name: 'Raspadinha Premium',
            tier: 'PREMIUM',
            description: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!'
        },
        medium: {
            icon: '🎁',
            name: 'Raspadinha Média',
            tier: 'MÉDIA',
            description: 'Chance de ganhar iPhone 13, Acer Nitro, JBL e muito mais!'
        },
        basic: {
            icon: '🎯',
            name: 'Raspadinha Básica',
            tier: 'BÁSICA',
            description: 'Chance de ganhar AirPods, Xiaomi, JBL Speaker e muito mais!'
        },
        simple: {
            icon: '🎪',
            name: 'Raspadinha Simples',
            tier: 'SIMPLES',
            description: 'Chance de ganhar JBL Speaker, Fone Bluetooth, Carregador e muito mais!'
        }
    };
    
    return scratchTypes[type] || scratchTypes.basic;
}

function getScratchPrice(type) {
    const prices = {
        premium: 50.00,
        medium: 20.00,
        basic: 10.00,
        simple: 5.00
    };
    
    return prices[type] || 10.00;
}

function openScratchConfirmModal(type) {
    console.log('🎫 Abrindo modal de confirmação da raspadinha:', type);
    
    currentScratchType = type;
    
    const modal = document.getElementById('scratchConfirmModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Atualizar informações da raspadinha
        updateScratchConfirmInfo(type);
    }
}

function updateScratchConfirmInfo(type) {
    const scratchInfo = getScratchInfo(type);
    const price = getScratchPrice(type);
    
    // Atualizar elementos do modal
    const scratchIconEl = document.getElementById('confirmScratchIcon');
    const scratchNameEl = document.getElementById('confirmScratchName');
    const scratchPriceEl = document.getElementById('confirmScratchPrice');
    const scratchTypeEl = document.getElementById('confirmScratchType');
    const scratchValueEl = document.getElementById('confirmScratchValue');
    const userBalanceEl = document.getElementById('confirmScratchUserBalance');
    const remainingBalanceEl = document.getElementById('confirmScratchRemainingBalance');
    const scratchDescriptionEl = document.getElementById('confirmScratchDescription');
    
    if (scratchIconEl) scratchIconEl.textContent = scratchInfo.icon;
    if (scratchNameEl) scratchNameEl.textContent = scratchInfo.name;
    if (scratchPriceEl) scratchPriceEl.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    if (scratchTypeEl) scratchTypeEl.textContent = scratchInfo.tier;
    if (scratchValueEl) scratchValueEl.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    if (userBalanceEl) userBalanceEl.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    if (remainingBalanceEl) remainingBalanceEl.textContent = `R$ ${(userBalance - price).toFixed(2).replace('.', ',')}`;
    if (scratchDescriptionEl) scratchDescriptionEl.textContent = scratchInfo.description;
}

function confirmScratchPurchase() {
    console.log('✅ Confirmando compra da raspadinha:', currentScratchType);
    
    const price = getScratchPrice(currentScratchType);
    
    if (userBalance < price) {
        showNotification('warning', 'Saldo Insuficiente', 'Faça um depósito primeiro para continuar.');
        closeScratchConfirmModal();
        return;
    }
    
    // Deduzir do saldo
    userBalance -= price;
    updateBalanceDisplay();
    
    // Fechar modal de confirmação
    closeScratchConfirmModal();
    
    // Abrir modal da raspadinha
    openScratchModal();
    
    showNotification('success', 'Raspadinha Comprada', `${getScratchInfo(currentScratchType).name} comprada com sucesso!`);
}

function openScratchModal() {
    console.log('🎫 Abrindo modal da raspadinha');
    
    const modal = document.getElementById('scratchModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Iniciar animação de raspagem
        startScratchAnimation();
    }
}

function startScratchAnimation() {
    const scratchCard = document.getElementById('scratchCard');
    const scratchSurface = document.getElementById('scratchSurface');
    const scratchContent = document.getElementById('scratchContent');
    const scratchingText = document.getElementById('scratchingText');
    
    // Reset da animação
    if (scratchSurface) scratchSurface.classList.remove('scratched');
    if (scratchContent) scratchContent.classList.remove('revealed');
    
    // Textos de raspagem
    const scratchingTexts = [
        'Raspe para revelar seu prêmio!',
        'Clique na área laranja para raspar',
        'Continue raspando...',
        'Quase lá...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
        if (scratchingText && textIndex < scratchingTexts.length) {
            scratchingText.textContent = scratchingTexts[textIndex];
            textIndex++;
        } else {
            clearInterval(textInterval);
        }
    }, 2000);
    
    // Adicionar evento de clique na superfície
    if (scratchSurface) {
        scratchSurface.onclick = function() {
            if (!isScratching) {
                isScratching = true;
                scratchSurface();
            }
        };
    }
}

function scratchSurface() {
    console.log('🎫 Raspando superfície...');
    
    const scratchSurface = document.getElementById('scratchSurface');
    const scratchContent = document.getElementById('scratchContent');
    const scratchingText = document.getElementById('scratchingText');
    
    if (scratchSurface) {
        scratchSurface.classList.add('scratched');
    }
    
    // Gerar prêmio
    const prize = selectScratchPrize(currentScratchType);
    scratchPrize = prize;
    
    // Mostrar prêmio após 1 segundo
    setTimeout(() => {
        if (scratchContent) {
            scratchContent.classList.add('revealed');
            
            // Atualizar informações do prêmio
            const prizeName = document.getElementById('scratchPrizeName');
            const prizeValue = document.getElementById('scratchPrizeValue');
            
            if (prizeName) prizeName.textContent = prize.name;
            if (prizeValue) prizeValue.textContent = `R$ ${prize.value.toFixed(2).replace('.', ',')}`;
        }
        
        if (scratchingText) {
            scratchingText.textContent = 'Prêmio revelado!';
        }
        
        // Mostrar resultado após 2 segundos
        setTimeout(() => {
            showScratchResult(prize);
        }, 2000);
    }, 1000);
}

function selectScratchPrize(type) {
    const probabilities = scratchProbabilities[type] || scratchProbabilities.basic;
    const random = Math.random() * 100;
    
    let cumulativeProbability = 0;
    
    for (const [prizeKey, probability] of Object.entries(probabilities)) {
        cumulativeProbability += probability;
        if (random <= cumulativeProbability) {
            return getPrizeInfo(prizeKey);
        }
    }
    
    // Fallback para prêmio menor
    return getPrizeInfo('money10');
}

function getPrizeInfo(prizeKey) {
    const prizes = {
        iphone15: { name: 'iPhone 15 Pro Max', value: 5999, icon: '📱' },
        macbook: { name: 'MacBook Pro M3', value: 18999, icon: '💻' },
        iphone13: { name: 'iPhone 13', value: 4499, icon: '📱' },
        acer: { name: 'Acer Nitro 5', value: 6499, icon: '💻' },
        jbl: { name: 'JBL Boombox 3', value: 2499, icon: '🔊' },
        airpods: { name: 'AirPods Pro', value: 1299, icon: '🎧' },
        xiaomi: { name: 'Xiaomi Redmi Note', value: 899, icon: '📱' },
        speaker: { name: 'JBL Speaker', value: 299, icon: '🔊' },
        fone: { name: 'Fone Bluetooth', value: 199, icon: '🎧' },
        carregador: { name: 'Carregador Wireless', value: 99, icon: '🔌' },
        money500: { name: 'R$ 500,00', value: 500, icon: '💰' },
        money200: { name: 'R$ 200,00', value: 200, icon: '💰' },
        money100: { name: 'R$ 100,00', value: 100, icon: '💰' },
        money50: { name: 'R$ 50,00', value: 50, icon: '💰' },
        money25: { name: 'R$ 25,00', value: 25, icon: '💰' },
        money15: { name: 'R$ 15,00', value: 15, icon: '💰' },
        money10: { name: 'R$ 10,00', value: 10, icon: '💰' }
    };
    
    return prizes[prizeKey] || prizes.money10;
}

function showScratchResult(prize) {
    const scratchResult = document.getElementById('scratchResult');
    const resultPrizeName = document.getElementById('resultScratchPrizeName');
    const resultPrizeValue = document.getElementById('resultScratchPrizeValue');
    
    if (scratchResult) {
        scratchResult.style.display = 'block';
    }
    
    if (resultPrizeName) resultPrizeName.textContent = prize.name;
    if (resultPrizeValue) resultPrizeValue.textContent = `R$ ${prize.value.toFixed(2).replace('.', ',')}`;
    
    // Adicionar prêmio ao saldo
    userBalance += prize.value;
    updateBalanceDisplay();
    
    showNotification('success', 'Parabéns!', `Você ganhou ${prize.name}!`);
}

function closeScratchConfirmModal() {
    const modal = document.getElementById('scratchConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeScratchModal() {
    const modal = document.getElementById('scratchModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Reset das variáveis
    isScratching = false;
    scratchPrize = null;
}

// ===== SISTEMA DE CAIXAS =====

// Funções auxiliares para informações das caixas
function getCaseInfo(type) {
    const cases = {
        premium: {
            icon: '💎',
            name: 'Caixa Premium',
            tier: 'PREMIUM',
            description: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!'
        },
        medium: {
            icon: '🎁',
            name: 'Caixa Média',
            tier: 'MÉDIA',
            description: 'Chance de ganhar iPhone 13, Acer Nitro, JBL e muito mais!'
        },
        basic: {
            icon: '🎯',
            name: 'Caixa Básica',
            tier: 'BÁSICA',
            description: 'Chance de ganhar AirPods, Xiaomi, JBL Speaker e muito mais!'
        },
        simple: {
            icon: '🎪',
            name: 'Caixa Simples',
            tier: 'SIMPLES',
            description: 'Chance de ganhar JBL Speaker, Fone Bluetooth, Carregador e muito mais!'
        }
    };
    
    return cases[type] || cases.basic;
}

function getCasePrice(type) {
    const prices = {
        premium: 50.00,
        medium: 20.00,
        basic: 10.00,
        simple: 5.00
    };
    
    return prices[type] || 10.00;
}
function openCaseConfirmModal(type) {
    console.log('📦 Abrindo modal de confirmação da caixa:', type);
    
    currentCaseType = type;
    
    const modal = document.getElementById('caseConfirmModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Atualizar informações da caixa
        updateCaseConfirmInfo(type);
    }
}

function updateCaseConfirmInfo(type) {
    const caseInfo = getCaseInfo(type);
    const price = getCasePrice(type);
    
    // Atualizar elementos do modal
    const caseIconEl = document.getElementById('confirmCaseIcon');
    const caseNameEl = document.getElementById('confirmCaseName');
    const casePriceEl = document.getElementById('confirmCasePrice');
    const caseTypeEl = document.getElementById('confirmCaseType');
    const caseValueEl = document.getElementById('confirmCaseValue');
    const userBalanceEl = document.getElementById('confirmUserBalance');
    const remainingBalanceEl = document.getElementById('confirmRemainingBalance');
    const caseDescriptionEl = document.getElementById('confirmCaseDescription');
    
    if (caseIconEl) caseIconEl.textContent = caseInfo.icon;
    if (caseNameEl) caseNameEl.textContent = caseInfo.name;
    if (casePriceEl) casePriceEl.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    if (caseTypeEl) caseTypeEl.textContent = caseInfo.tier;
    if (caseValueEl) caseValueEl.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    if (userBalanceEl) userBalanceEl.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    if (remainingBalanceEl) remainingBalanceEl.textContent = `R$ ${(userBalance - price).toFixed(2).replace('.', ',')}`;
    if (caseDescriptionEl) caseDescriptionEl.textContent = caseInfo.description;
}

async function confirmOpenCase() {
    console.log('✅ Confirmando abertura da caixa:', currentCaseType);
    
    const price = getCasePrice(currentCaseType);
    
    if (userBalance < price) {
        showNotification('warning', 'Saldo Insuficiente', 'Faça um depósito primeiro para continuar.');
        closeCaseConfirmModal();
        return;
    }
    
    try {
        // Fazer requisição para o backend
        const response = await fetch('http://localhost:3001/api/cases/open', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                caseType: currentCaseType,
                userBalance: userBalance
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Atualizar saldo
            userBalance = data.newBalance;
            updateBalanceDisplay();
            
            // Fechar modal de confirmação
            closeCaseConfirmModal();
            
            // Abrir modal da caixa com roleta
            openCaseModal(data.prize);
        } else {
            showNotification('error', 'Erro ao Abrir Caixa', data.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao abrir caixa:', error);
        showNotification('error', 'Erro de Conexão', 'Tente novamente em alguns instantes.');
    }
}

function openCaseModal(prize) {
    console.log('🎰 Abrindo modal da caixa');
    
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Iniciar animação de abertura
        startCaseOpeningAnimation(prize);
    }
}

function startCaseOpeningAnimation(prize) {
    const caseBox = document.getElementById('caseBox');
    const prizeDisplay = document.getElementById('prizeDisplay');
    const openingText = document.getElementById('openingText');
    const caseResult = document.getElementById('caseResult');
    
    // Reset da animação
    if (caseBox) caseBox.classList.remove('opening');
    if (prizeDisplay) prizeDisplay.classList.remove('show');
    if (caseResult) caseResult.style.display = 'none';
    
    // Textos de abertura
    const openingTexts = [
        'Abrindo sua caixa...',
        'Verificando prêmios...',
        'Quase lá...',
        'Revelando seu prêmio...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
        if (openingText && textIndex < openingTexts.length) {
            openingText.textContent = openingTexts[textIndex];
            textIndex++;
        } else {
            clearInterval(textInterval);
        }
    }, 800);
    
    // Iniciar animação da caixa após 2 segundos
    setTimeout(() => {
        if (caseBox) {
            caseBox.classList.add('opening');
        }
        
        // Mostrar prêmio após 1 segundo
        setTimeout(() => {
            if (prizeDisplay) {
                prizeDisplay.classList.add('show');
                
                // Atualizar informações do prêmio
                const prizeName = document.getElementById('prizeName');
                const prizeValue = document.getElementById('prizeValue');
                
                if (prizeName) prizeName.textContent = prize.name;
                if (prizeValue) prizeValue.textContent = `R$ ${prize.value.toFixed(2).replace('.', ',')}`;
            }
            
            // Mostrar resultado após 2 segundos
            setTimeout(() => {
                showCaseResult(prize);
            }, 2000);
        }, 1000);
    }, 2000);
}

function showCaseResult(prize) {
    const caseResult = document.getElementById('caseResult');
    const resultPrizeName = document.getElementById('resultPrizeName');
    const resultPrizeValue = document.getElementById('resultPrizeValue');
    
    if (caseResult) {
        caseResult.style.display = 'block';
    }
    
    if (resultPrizeName) resultPrizeName.textContent = prize.name;
    if (resultPrizeValue) resultPrizeValue.textContent = `R$ ${prize.value.toFixed(2).replace('.', ',')}`;
}

function closeCaseConfirmModal() {
    const modal = document.getElementById('caseConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeCaseModal() {
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createCaseOpeningAnimation(prize) {
    const caseArea = document.getElementById('caseArea');
    if (!caseArea) return;
    
    caseArea.innerHTML = `
        <div class="case-opening-container">
            <div class="case-opening-header">
                <h3>Abrindo Caixa ${getCaseTypeName(currentCaseType)}</h3>
                <div class="case-type">${getCaseTypeName(currentCaseType)}</div>
            </div>
            <div class="case-opening-content">
                <div class="case-box" id="caseBox">
                    <div class="case-lid">
                        <div class="case-lid-handle"></div>
                    </div>
                    <div class="case-body">
                        <div class="case-pattern">
                            <div class="pattern-grid">
                                <div class="symbol">🍀</div>
                                <div class="symbol">♣</div>
                                <div class="symbol">🎰</div>
                                <div class="symbol">🍀</div>
                                <div class="symbol">♣</div>
                                <div class="symbol">🎰</div>
                                <div class="symbol">🍀</div>
                                <div class="symbol">♣</div>
                                <div class="symbol">🎰</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="case-result" id="caseResult" style="display: none;">
                    <div class="prize-display">
                        <div class="prize-icon">🎁</div>
                        <div class="prize-text">
                            <h3 id="casePrizeName">Parabéns!</h3>
                            <p id="casePrizeValue">Você ganhou!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="case-actions">
                <button class="btn btn-secondary" onclick="closeCaseModal()">Fechar</button>
                <button class="btn btn-primary" onclick="collectCasePrize()" id="collectCaseBtn" style="display: none;">Coletar Prêmio</button>
            </div>
        </div>
    `;
    
    // Iniciar animação
    startCaseAnimation(prize);
}

function startCaseAnimation(prize) {
    const caseBox = document.getElementById('caseBox');
    const caseResult = document.getElementById('caseResult');
    const collectBtn = document.getElementById('collectCaseBtn');
    
    // Animação de abertura da caixa
    setTimeout(() => {
        if (caseBox) {
            caseBox.classList.add('opening');
        }
    }, 500);
    
    // Revelar resultado após 2 segundos
    setTimeout(() => {
        if (caseResult) {
            caseResult.style.display = 'block';
        }
        
        if (collectBtn) {
            collectBtn.style.display = 'inline-block';
        }
        
        // Atualizar display do prêmio
        const prizeName = document.getElementById('casePrizeName');
        const prizeValue = document.getElementById('casePrizeValue');
        
        if (prizeName) prizeName.textContent = prize.name;
        if (prizeValue) prizeValue.textContent = `Valor: R$ ${prize.value.toFixed(2).replace('.', ',')}`;
        
        // Efeito de confete
        createConfettiEffect();
    }, 2000);
}

function collectCasePrize() {
    console.log('🎁 Coletando prêmio da caixa...');
    closeCaseModal();
    showNotification('success', 'Prêmio Coletado', 'Prêmio coletado com sucesso! Verifique seu saldo.');
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(type, title, message, duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">
                <span class="notification-icon">${icons[type] || 'ℹ️'}</span>
                <span>${title}</span>
            </div>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove após o tempo especificado
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('slide-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
    
    return notification;
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.classList.add('slide-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===== SISTEMA DE DEPÓSITO =====
let selectedDepositAmount = 0;
let customerInfo = null;
let currentPaymentData = null;
let paymentTimer = null;
let paymentStatusCheck = null;

function openDepositModal() {
    console.log('💰 Abrindo modal de depósito...');
    
    const modal = document.getElementById('depositModal');
    console.log('Modal encontrado:', modal);
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('Modal exibido com sucesso');
        
        // Reset do modal
        resetDepositModal();
    } else {
        console.error('❌ Modal de depósito não encontrado!');
    }
}

function closeDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function resetDepositModal() {
    selectedDepositAmount = 0;
    
    // Remover seleção de todas as opções
    const options = document.querySelectorAll('.deposit-item');
    options.forEach(option => option.classList.remove('selected'));
    
    // Limpar campo personalizado
    const customAmount = document.getElementById('customAmount');
    if (customAmount) {
        customAmount.value = '';
    }
    
    // Ocultar valor selecionado
    const selectedAmount = document.getElementById('selectedAmount');
    if (selectedAmount) {
        selectedAmount.style.display = 'none';
    }
    
    // Desabilitar botão de confirmação
    const confirmBtn = document.getElementById('confirmDepositBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }
}

function selectDepositAmount(amount) {
    console.log('💰 Selecionando valor:', amount);
    
    selectedDepositAmount = amount;
    
    // Remover seleção de todas as opções
    const options = document.querySelectorAll('.deposit-item');
    options.forEach(option => option.classList.remove('selected'));
    
    // Selecionar a opção clicada
    const selectedOption = document.querySelector(`[data-value="${amount}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Limpar campo personalizado
    const customAmount = document.getElementById('customAmount');
    if (customAmount) {
        customAmount.value = '';
    }
    
    // Mostrar valor selecionado
    showSelectedAmount(amount);
}

function showSelectedAmount(amount) {
    const selectedAmount = document.getElementById('selectedAmount');
    const amountValue = document.getElementById('amountValue');
    const confirmBtn = document.getElementById('confirmDepositBtn');
    
    if (selectedAmount && amountValue) {
        selectedAmount.style.display = 'block';
        amountValue.textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
    }
    
    if (confirmBtn) {
        confirmBtn.disabled = false;
    }
}

// Event listener para campo personalizado
document.addEventListener('input', function(e) {
    if (e.target.id === 'customAmount') {
        const value = parseFloat(e.target.value);
        if (value && value > 0) {
            selectedDepositAmount = value;
            
            // Remover seleção de opções pré-definidas
            const options = document.querySelectorAll('.deposit-option');
            options.forEach(option => option.classList.remove('selected'));
            
            // Mostrar valor selecionado
            showSelectedAmount(value);
        } else {
            selectedDepositAmount = 0;
            const selectedAmount = document.getElementById('selectedAmount');
            const confirmBtn = document.getElementById('confirmDepositBtn');
            
            if (selectedAmount) {
                selectedAmount.style.display = 'none';
            }
            
            if (confirmBtn) {
                confirmBtn.disabled = true;
            }
        }
    }
});

async function processDeposit() {
    if (selectedDepositAmount <= 0) {
        showNotification('warning', 'Valor Inválido', 'Por favor, selecione um valor válido para o depósito.');
        return;
    }
    
    // Verificar se é um valor alto (500+)
    if (selectedDepositAmount >= 500) {
        console.log('💰 Valor alto detectado, solicitando informações adicionais:', selectedDepositAmount);
        openCustomerInfoModal();
        return;
    }
    
    console.log('💰 Processando depósito real:', selectedDepositAmount);
    
    try {
        // Criar pagamento PIX real
        const response = await fetch('http://localhost:3001/api/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: selectedDepositAmount,
                description: `Deposito LR4.bet - R$ ${selectedDepositAmount.toFixed(2)}`,
                customer: {
                    name: 'Admin Master',
                    cpf: '11144477735'
                }
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Armazenar dados do pagamento
            currentPaymentData = data.payment;
            
            // Fechar modal de depósito
            closeDepositModal();
            
            // Abrir modal de pagamento PIX
            openPixPaymentModal();
        } else {
            showNotification('error', 'Erro no Depósito', data.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao processar depósito:', error);
        showNotification('error', 'Erro no Depósito', 'Erro ao processar depósito. Verifique sua conexão e tente novamente.');
    }
}

// ===== MODAL DE INFORMAÇÕES DO CLIENTE =====
function openCustomerInfoModal() {
    console.log('📋 Abrindo modal de informações do cliente...');
    
    const modal = document.getElementById('customerInfoModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Preencher apenas campos obrigatórios
        document.getElementById('customerName').value = 'Admin Master';
        document.getElementById('customerCpf').value = '111.444.777-35';
        // Deixar outros campos vazios
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerCity').value = '';
        document.getElementById('customerState').value = '';
        document.getElementById('customerZipCode').value = '';
        
        // Adicionar máscaras
        addInputMasks();
    }
}

function closeCustomerInfoModal() {
    console.log('📋 Fechando modal de informações do cliente...');
    
    const modal = document.getElementById('customerInfoModal');
    if (modal) {
        modal.style.display = 'none';
        resetCustomerInfoForm();
    }
}

function resetCustomerInfoForm() {
    const form = document.querySelector('#customerInfoModal form');
    if (form) {
        form.reset();
    }
    customerInfo = null;
}

function addInputMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById('customerCpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Máscara para telefone
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Máscara para CEP
    const zipInput = document.getElementById('customerZipCode');
    if (zipInput) {
        zipInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
}

function proceedWithHighValueDeposit() {
    console.log('📋 Processando depósito de alto valor...');
    
    // Validar apenas campos obrigatórios
    const name = document.getElementById('customerName').value.trim();
    const cpf = document.getElementById('customerCpf').value.replace(/\D/g, '');
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.replace(/\D/g, '');
    
    if (!name || name.length < 2) {
        showNotification('error', 'Nome Inválido', 'Nome é obrigatório e deve ter pelo menos 2 caracteres.');
        return;
    }
    
    if (!cpf || cpf.length !== 11) {
        showNotification('error', 'CPF Inválido', 'Por favor, digite um CPF válido.');
        return;
    }
    
    // Validar email apenas se fornecido
    if (email && !isValidEmail(email)) {
        showNotification('error', 'Email Inválido', 'Por favor, digite um email válido ou deixe em branco.');
        return;
    }
    
    // Validar telefone apenas se fornecido
    if (phone && phone.length < 10) {
        showNotification('error', 'Telefone Inválido', 'Por favor, digite um telefone válido ou deixe em branco.');
        return;
    }
    
    // Coletar informações do cliente
    customerInfo = {
        name: name,
        email: email,
        cpf: cpf,
        phone: phone,
        address: document.getElementById('customerAddress').value.trim(),
        city: document.getElementById('customerCity').value.trim(),
        state: document.getElementById('customerState').value,
        zipCode: document.getElementById('customerZipCode').value.replace(/\D/g, '')
    };
    
    console.log('📋 Informações do cliente coletadas:', customerInfo);
    
    // Fechar modal de informações
    closeCustomerInfoModal();
    
    // Processar depósito com informações do cliente
    processDepositWithCustomerInfo();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function processDepositWithCustomerInfo() {
    console.log('💰 Processando depósito de alto valor com informações do cliente:', selectedDepositAmount);
    
    try {
        // Fazer requisição para o backend com informações do cliente
        const response = await fetch('http://localhost:3001/api/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: selectedDepositAmount,
                description: `Deposito LR4.bet - R$ ${selectedDepositAmount.toFixed(2)}`,
                customer: {
                    name: customerInfo.name,
                    cpf: customerInfo.cpf,
                    email: customerInfo.email || '',
                    phone: customerInfo.phone || '',
                    address: customerInfo.address || '',
                    city: customerInfo.city || '',
                    state: customerInfo.state || '',
                    zipCode: customerInfo.zipCode || ''
                }
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Armazenar dados do pagamento
            currentPaymentData = data.payment;
            
            // Fechar modal de depósito
            closeDepositModal();
            
            // Abrir modal de pagamento PIX
            openPixPaymentModal();
        } else {
            showNotification('error', 'Erro no Depósito', data.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao processar depósito:', error);
        showNotification('error', 'Erro no Depósito', 'Erro ao processar depósito. Verifique sua conexão e tente novamente.');
    }
}

// ===== MODAL DE PAGAMENTO PIX =====
function openPixPaymentModal() {
    console.log('💳 Abrindo modal de pagamento PIX...');
    
    const modal = document.getElementById('pixPaymentModal');
    if (modal && currentPaymentData) {
        modal.style.display = 'flex';
        
        // Atualizar valor do depósito
        document.getElementById('pixAmount').textContent = `R$ ${selectedDepositAmount.toFixed(2).replace('.', ',')}`;
        
        // Exibir QR Code
        displayQRCode();
        
        // Exibir código PIX
        displayPixCode();
        
        // Iniciar timer de pagamento
        startPaymentTimer();
        
        // Iniciar verificação de status
        startPaymentStatusCheck();
        
        // Adicionar event listeners para alternar entre QR Code e código PIX
        addPixOptionListeners();
    }
}

function closePixPaymentModal() {
    console.log('💳 Fechando modal de pagamento PIX...');
    
    const modal = document.getElementById('pixPaymentModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Limpar timers
        if (paymentTimer) {
            clearInterval(paymentTimer);
            paymentTimer = null;
        }
        
        if (paymentStatusCheck) {
            clearInterval(paymentStatusCheck);
            paymentStatusCheck = null;
        }
        
        // Limpar dados do pagamento
        currentPaymentData = null;
    }
}

function displayQRCode() {
    const qrContainer = document.getElementById('qrCodeDisplay');
    if (currentPaymentData && currentPaymentData.qrCode) {
        qrContainer.innerHTML = `
            <div class="qr-code-wrapper">
                <img src="${currentPaymentData.qrCode}" alt="QR Code PIX" class="qr-code-image">
                <div class="qr-code-info">
                    <p class="qr-code-label">Escaneie o QR Code com seu app de pagamento</p>
                    <p class="qr-code-value">Valor: R$ ${selectedDepositAmount.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        `;
    } else {
        qrContainer.innerHTML = `
            <div class="qr-code-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>QR Code não disponível</p>
            </div>
        `;
    }
}

function displayPixCode() {
    const pixCodeInput = document.getElementById('pixCode');
    if (currentPaymentData && currentPaymentData.pixCode) {
        pixCodeInput.value = currentPaymentData.pixCode;
    } else {
        pixCodeInput.value = 'Código PIX não disponível';
    }
}

function copyPixCode() {
    const pixCodeInput = document.getElementById('pixCode');
    pixCodeInput.select();
    pixCodeInput.setSelectionRange(0, 99999); // Para mobile
    
    try {
        document.execCommand('copy');
        showNotification('success', 'Código Copiado', 'Código PIX copiado para a área de transferência!');
    } catch (err) {
        showNotification('error', 'Erro ao Copiar', 'Não foi possível copiar o código PIX.');
    }
}

function addPixOptionListeners() {
    const qrOption = document.getElementById('qrCodeOption');
    const pixOption = document.getElementById('pixCodeOption');
    
    if (qrOption && pixOption) {
        qrOption.addEventListener('click', () => {
            qrOption.classList.add('active');
            pixOption.classList.remove('active');
        });
        
        pixOption.addEventListener('click', () => {
            pixOption.classList.add('active');
            qrOption.classList.remove('active');
        });
    }
}

function startPaymentTimer() {
    let timeLeft = 15 * 60; // 15 minutos em segundos
    const timerElement = document.getElementById('paymentTimer');
    
    paymentTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(paymentTimer);
            paymentTimer = null;
            
            // Marcar como expirado
            const statusElement = document.querySelector('.payment-status');
            if (statusElement) {
                statusElement.classList.add('expired');
                statusElement.querySelector('.status-info span').textContent = 'Status: Pagamento expirado';
            }
            
            showNotification('warning', 'Pagamento Expirado', 'O tempo para pagamento expirou. Inicie um novo depósito.');
        }
    }, 1000);
}

function startPaymentStatusCheck() {
    // Verificar status a cada 10 segundos
    paymentStatusCheck = setInterval(async () => {
        if (currentPaymentData && currentPaymentData.orderId) {
            await checkPaymentStatus();
        }
    }, 10000);
}

async function checkPaymentStatus() {
    if (!currentPaymentData || !currentPaymentData.orderId) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/pix/status/${currentPaymentData.orderId}`);
        const data = await response.json();
        
        if (data.success && data.status === 'paid') {
            // Pagamento confirmado
            clearInterval(paymentTimer);
            clearInterval(paymentStatusCheck);
            
            // Atualizar saldo
            userBalance += selectedDepositAmount;
            updateBalanceDisplay();
            
            // Atualizar status visual
            const statusElement = document.querySelector('.payment-status');
            if (statusElement) {
                statusElement.classList.add('paid');
                statusElement.querySelector('.status-info span').textContent = 'Status: Pagamento confirmado';
            }
            
            showNotification('success', 'Pagamento Confirmado', `Depósito de R$ ${selectedDepositAmount.toFixed(2).replace('.', ',')} confirmado! Seu saldo foi atualizado.`);
            
            // Fechar modal após 3 segundos
            setTimeout(() => {
                closePixPaymentModal();
            }, 3000);
            
        } else if (data.success && data.status === 'expired') {
            // Pagamento expirado
            clearInterval(paymentTimer);
            clearInterval(paymentStatusCheck);
            
            const statusElement = document.querySelector('.payment-status');
            if (statusElement) {
                statusElement.classList.add('expired');
                statusElement.querySelector('.status-info span').textContent = 'Status: Pagamento expirado';
            }
        }
    } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
    }
}

// ===== MODAL MINHA CONTA =====
function openAccountModal() {
    console.log('👤 Abrindo modal Minha Conta...');
    
    const modal = document.getElementById('accountModal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Atualizar informações do usuário
        updateAccountInfo();
        
        // Adicionar event listeners
        addAccountEventListeners();
    }
}

function closeAccountModal() {
    console.log('👤 Fechando modal Minha Conta...');
    
    const modal = document.getElementById('accountModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

function updateAccountInfo() {
    // Atualizar nome e email
    document.getElementById('accountUserName').textContent = 'Admin Master';
    document.getElementById('accountUserEmail').textContent = 'admin@lr4.bet';
    
    // Atualizar saldo
    const balanceElement = document.getElementById('accountBalance');
    if (balanceElement) {
        balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    }
}

function addAccountEventListeners() {
    // Event listener para o formulário de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Event listener para o formulário de segurança
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Event listener para filtro de transações
    const transactionFilter = document.getElementById('transactionFilter');
    if (transactionFilter) {
        transactionFilter.addEventListener('change', filterTransactions);
    }
    
    // Adicionar máscaras aos inputs
    addInputMasksToAccount();
    
    // Event listener para fechar modal ao clicar no X
    const closeBtn = document.querySelector('#accountModal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAccountModal);
    }
    
    // Event listener para fechar modal ao clicar fora dele
    const modal = document.getElementById('accountModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAccountModal();
            }
        });
    }
    
    // Event listener para fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('accountModal');
            if (modal && modal.classList.contains('show')) {
                closeAccountModal();
            }
        }
    });
}

function switchAccountTab(tabName) {
    console.log('🔄 Alternando para aba:', tabName);
    
    // Remover active de todas as abas
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar aba selecionada
    const tabButton = document.querySelector(`[onclick="switchAccountTab('${tabName}')"]`);
    const tabContent = document.getElementById(`${tabName}Tab`);
    
    if (tabButton) tabButton.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
}

function handleProfileUpdate(e) {
    e.preventDefault();
    console.log('💾 Atualizando perfil...');
    
    const formData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        cpf: document.getElementById('profileCpf').value,
        birthDate: document.getElementById('profileBirthDate').value
    };
    
    // Validar dados
    if (!formData.name || formData.name.length < 2) {
        showNotification('error', 'Nome Inválido', 'Nome deve ter pelo menos 2 caracteres.');
        return;
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        showNotification('error', 'Email Inválido', 'Por favor, digite um email válido.');
        return;
    }
    
    // Simular atualização (em produção, enviaria para o backend)
    showNotification('success', 'Perfil Atualizado', 'Suas informações foram atualizadas com sucesso!');
    
    // Atualizar dados na interface
    document.getElementById('accountUserName').textContent = formData.name;
    document.getElementById('accountUserEmail').textContent = formData.email;
}

function handlePasswordChange(e) {
    e.preventDefault();
    console.log('🔒 Alterando senha...');
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar senha atual
    if (currentPassword !== ADMIN_CREDENTIALS.password) {
        showNotification('error', 'Senha Incorreta', 'A senha atual está incorreta.');
        return;
    }
    
    // Validar nova senha
    if (newPassword.length < 6) {
        showNotification('error', 'Senha Fraca', 'A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('error', 'Senhas Diferentes', 'As senhas não coincidem.');
        return;
    }
    
    // Simular alteração de senha
    showNotification('success', 'Senha Alterada', 'Sua senha foi alterada com sucesso!');
    
    // Limpar formulário
    resetSecurityForm();
}

function resetProfileForm() {
    document.getElementById('profileForm').reset();
    document.getElementById('profileName').value = 'Admin Master';
    document.getElementById('profileEmail').value = 'admin@lr4.bet';
    document.getElementById('profilePhone').value = '(11) 99999-9999';
    document.getElementById('profileCpf').value = '000.000.000-00';
    document.getElementById('profileBirthDate').value = '1990-01-01';
}

function resetSecurityForm() {
    document.getElementById('securityForm').reset();
}

function addInputMasksToAccount() {
    // Máscara para telefone no perfil
    const phoneInput = document.getElementById('profilePhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Máscara para CPF no perfil
    const cpfInput = document.getElementById('profileCpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
}

function filterTransactions() {
    const filter = document.getElementById('transactionFilter').value;
    const transactions = document.querySelectorAll('.transaction-item');
    
    transactions.forEach(transaction => {
        const isDeposit = transaction.querySelector('.fa-plus-circle');
        const isGame = transaction.querySelector('.fa-ticket-alt');
        const isPrize = transaction.querySelector('.fa-gift');
        
        let show = true;
        
        switch (filter) {
            case 'deposits':
                show = !!isDeposit;
                break;
            case 'games':
                show = !!isGame;
                break;
            case 'withdrawals':
                show = false; // Não temos saques ainda
                break;
            case 'all':
            default:
                show = true;
                break;
        }
        
        transaction.style.display = show ? 'flex' : 'none';
    });
}

function refreshTransactions() {
    console.log('🔄 Atualizando histórico de transações...');
    showNotification('info', 'Histórico Atualizado', 'Lista de transações atualizada.');
}

// ===== FUNÇÕES AUXILIARES =====
function getScratchTypeName(type) {
    const names = {
        premium: 'Premium',
        medium: 'Média',
        basic: 'Básica',
        simple: 'Simples'
    };
    return names[type] || 'Premium';
}

function getScratchDescription(type) {
    const descriptions = {
        premium: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!',
        medium: 'Chance de ganhar iPhone 13, Xiaomi, AirPods e muito mais!',
        basic: 'Chance de ganhar AirPods, Xiaomi, Caixinha JBL e muito mais!',
        simple: 'Chance de ganhar Caixinha JBL, Fone Bluetooth, Carregador e muito mais!'
    };
    return descriptions[type] || 'Chance de ganhar prêmios incríveis!';
}

function getScratchPrice(type) {
    const prices = {
        premium: 50.00,
        medium: 20.00,
        basic: 10.00,
        simple: 5.00
    };
    return prices[type] || 50.00;
}

function getCaseTypeName(type) {
    const names = {
        premium: 'Premium',
        medium: 'Média',
        basic: 'Básica',
        simple: 'Simples'
    };
    return names[type] || 'Premium';
}

function getCaseDescription(type) {
    const descriptions = {
        premium: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!',
        medium: 'Chance de ganhar iPhone 13, Xiaomi, AirPods e muito mais!',
        basic: 'Chance de ganhar AirPods, Xiaomi, Caixinha JBL e muito mais!',
        simple: 'Chance de ganhar Caixinha JBL, Fone Bluetooth, Carregador e muito mais!'
    };
    return descriptions[type] || 'Chance de ganhar prêmios incríveis!';
}

function getCasePrice(type) {
    const prices = {
        premium: 50.00,
        medium: 20.00,
        basic: 10.00,
        simple: 5.00
    };
    return prices[type] || 50.00;
}

function selectScratchPrize(type) {
    const prizes = {
        premium: [
            { name: 'iPhone 15 Pro Max', value: 8000, probability: 0.5 },
            { name: 'MacBook Pro M3', value: 12000, probability: 0.3 },
            { name: 'AirPods Pro 2', value: 2000, probability: 2.0 },
            { name: 'R$ 200,00', value: 200, probability: 15.0 },
            { name: 'R$ 100,00', value: 100, probability: 25.0 },
            { name: 'R$ 50,00', value: 50, probability: 57.2 }
        ],
        medium: [
            { name: 'AirPods Pro 2', value: 2000, probability: 1.0 },
            { name: 'Xiaomi Redmi Note 13', value: 1200, probability: 2.0 },
            { name: 'JBL Charge 5', value: 600, probability: 3.0 },
            { name: 'R$ 100,00', value: 100, probability: 25.0 },
            { name: 'R$ 50,00', value: 50, probability: 69.0 }
        ],
        basic: [
            { name: 'JBL Charge 5', value: 600, probability: 2.0 },
            { name: 'Fone Bluetooth JBL', value: 200, probability: 8.0 },
            { name: 'R$ 50,00', value: 50, probability: 90.0 }
        ],
        simple: [
            { name: 'R$ 100,00', value: 100, probability: 2.0 },
            { name: 'R$ 50,00', value: 50, probability: 8.0 },
            { name: 'R$ 20,00', value: 20, probability: 25.0 },
            { name: 'R$ 10,00', value: 10, probability: 35.0 },
            { name: 'R$ 5,00', value: 5, probability: 30.0 }
        ]
    };
    
    const typePrizes = prizes[type] || prizes.premium;
    const totalProbability = typePrizes.reduce((sum, prize) => sum + prize.probability, 0);
    const random = Math.random() * totalProbability;
    
    let currentProbability = 0;
    for (const prize of typePrizes) {
        currentProbability += prize.probability;
        if (random <= currentProbability) {
            return prize;
        }
    }
    
    return typePrizes[typePrizes.length - 1];
}

function createConfettiEffect() {
    // Efeito simples de confete
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)];
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// ===== MODAIS =====
function closeScratchConfirmModal() {
    const modal = document.getElementById('scratchConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeScratchModal() {
    const modal = document.getElementById('scratchModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeCaseConfirmModal() {
    const modal = document.getElementById('caseConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeCaseModal() {
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== SISTEMA DE LOGIN/CADASTRO =====
function openLoginModal() {
    console.log('🔐 Abrindo modal de login...');
    
    const modal = document.getElementById('loginModal');
    console.log('🔍 Modal encontrado:', !!modal);
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal de login exibido');
    } else {
        console.error('❌ Modal de login não encontrado!');
        showNotification('error', 'Erro', 'Modal de login não encontrado!');
    }
}

function openRegisterModal() {
    console.log('📝 Abrindo modal de cadastro...');
    
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function switchToLogin() {
    closeAuthModal('registerModal');
    openLoginModal();
}

function switchToRegister() {
    closeAuthModal('loginModal');
    openRegisterModal();
}

function closeAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Funções de switch removidas - apenas admin

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('warning', 'Campos Obrigatórios', 'Por favor, preencha todos os campos.');
        return;
    }
    
    // Verificar credenciais do admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Login do admin
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'true');
        
        // Configurar saldo do admin
        userBalance = ADMIN_CREDENTIALS.balance;
        updateBalanceDisplay();
        
        closeAuthModal('loginModal');
        checkLoginStatus();
        
        showNotification('success', 'Login Realizado', 'Bem-vindo, Admin Master!');
        return;
    }
    
    // Verificar usuários cadastrados
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        console.log('✅ Login de usuário bem-sucedido:', user.name);
        
        // Salvar dados de login
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Configurar saldo do usuário
        userBalance = user.balance;
        updateBalanceDisplay();
        
        closeAuthModal('loginModal');
        checkLoginStatus();
        
        showNotification('success', 'Login Realizado', `Bem-vindo, ${user.name}!`);
        return;
    }
    
    // Credenciais inválidas
    showNotification('error', 'Credenciais Inválidas', 'Email ou senha incorretos.');
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleRegister() {
    console.log('📝 Processando cadastro...');
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validações
    if (!name || !email || !password || !confirmPassword) {
        showNotification('error', 'Campos Obrigatórios', 'Todos os campos são obrigatórios.');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('error', 'Senhas Diferentes', 'As senhas não coincidem.');
        return;
    }
    
    if (password.length < 6) {
        showNotification('error', 'Senha Fraca', 'A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('error', 'Email Inválido', 'Digite um email válido.');
        return;
    }
    
    // Verificar se já existe um usuário com este email
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.find(user => user.email === email)) {
        showNotification('error', 'Email Já Cadastrado', 'Este email já está em uso.');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // Em produção, usar hash
        balance: 100.00, // Saldo inicial
        createdAt: new Date().toISOString()
    };
    
    // Salvar usuário
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Fechar modal
    closeAuthModal('registerModal');
    
    // Mostrar sucesso
    showNotification('success', 'Cadastro Realizado', `Bem-vindo, ${name}! Sua conta foi criada com sucesso.`);
    
    console.log('✅ Usuário cadastrado:', newUser);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LR4 Sistema Unificado carregado!');
    
    // Limpar dados de login para forçar login manual
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('isAdmin');
    
    // Verificar status de login (agora sempre deslogado)
    console.log('🔍 Verificando status de login...');
    checkLoginStatus();
    
    // Configurar saldo inicial (sempre 0 para usuário não logado)
    userBalance = 0;
    updateBalanceDisplay();
    
    // Event listeners
    const btnDeposit = document.getElementById('btnDeposit');
    if (btnDeposit) {
        btnDeposit.addEventListener('click', openDepositModal);
        console.log('✅ Event listener do botão de depósito adicionado');
    } else {
        console.error('❌ Botão de depósito não encontrado!');
    }
    
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', openLoginModal);
        console.log('✅ Event listener do botão de login adicionado');
    } else {
        console.error('❌ Botão de login não encontrado!');
    }
    
    const btnRegister = document.getElementById('btnRegister');
    if (btnRegister) {
        btnRegister.addEventListener('click', openRegisterModal);
        console.log('✅ Event listener do botão de registro adicionado');
    } else {
        console.error('❌ Botão de registro não encontrado!');
    }
    
    // Event listeners para formulários
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'loginForm') {
            e.preventDefault();
            handleLogin();
        }
        if (e.target.id === 'registerForm') {
            e.preventDefault();
            handleRegister();
        }
    });
    
    // Inicializar sistema de saques
    initWithdrawalSystem();
    
    console.log('✅ Sistema inicializado com sucesso!');
});

// ===== SISTEMA DE SAQUE =====
let withdrawalConfig = {
    minAmount: 10.00,
    maxAmount: 10000.00,
    processingFee: 2.50
};

// Carregar configurações de saque
async function loadWithdrawalConfig() {
    try {
        const response = await fetch('http://localhost:3001/api/withdrawals/config');
        const data = await response.json();
        
        if (data.success) {
            withdrawalConfig = data.data;
            console.log('✅ Configurações de saque carregadas:', withdrawalConfig);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar configurações de saque:', error);
    }
}

// Atualizar resumo do saque
function updateWithdrawalSummary() {
    const amount = parseFloat(document.getElementById('withdrawalAmount').value) || 0;
    const fee = withdrawalConfig.processingFee;
    const total = amount - fee;
    
    document.getElementById('summaryAmount').textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
    document.getElementById('summaryFee').textContent = `R$ ${fee.toFixed(2).replace('.', ',')}`;
    document.getElementById('summaryTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Resetar formulário de saque
function resetWithdrawalForm() {
    document.getElementById('withdrawalForm').reset();
    updateWithdrawalSummary();
}

// Processar solicitação de saque
async function processWithdrawal(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const withdrawalData = {
        amount: parseFloat(formData.get('withdrawalAmount')),
        method: formData.get('withdrawalMethod'),
        bank: formData.get('withdrawalBank'),
        account: formData.get('withdrawalAccount'),
        agency: formData.get('withdrawalAgency'),
        cpf: formData.get('withdrawalCpf'),
        name: formData.get('withdrawalName')
    };
    
    console.log('💸 Processando saque:', withdrawalData);
    
    // Validar saldo
    if (withdrawalData.amount > userBalance) {
        showNotification('❌ Saldo insuficiente para realizar o saque.', 'error');
        return;
    }
    
    // Validar valor mínimo
    if (withdrawalData.amount < withdrawalConfig.minAmount) {
        showNotification(`❌ Valor mínimo para saque é R$ ${withdrawalConfig.minAmount.toFixed(2).replace('.', ',')}.`, 'error');
        return;
    }
    
    // Validar valor máximo
    if (withdrawalData.amount > withdrawalConfig.maxAmount) {
        showNotification(`❌ Valor máximo para saque é R$ ${withdrawalConfig.maxAmount.toFixed(2).replace('.', ',')}.`, 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3001/api/withdrawals/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(withdrawalData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('✅ Saque solicitado com sucesso!', 'success');
            resetWithdrawalForm();
            loadWithdrawalsHistory();
            
            // Atualizar saldo (simular dedução)
            userBalance -= withdrawalData.amount;
            updateBalanceDisplay();
            
            // Iniciar verificação de status para valores baixos
            if (withdrawalData.amount <= 100) {
                checkWithdrawalStatus(data.data.id);
            }
            
            console.log('✅ Saque criado:', data.data);
        } else {
            showNotification(`❌ Erro: ${data.error}`, 'error');
        }
        
    } catch (error) {
        console.error('❌ Erro ao processar saque:', error);
        showNotification('❌ Erro ao processar saque. Tente novamente.', 'error');
    }
}

// Verificar status do saque
async function checkWithdrawalStatus(withdrawalId) {
    try {
        const response = await fetch(`http://localhost:3001/api/withdrawals/status/${withdrawalId}`);
        const data = await response.json();
        
        if (data.success && data.data.status === 'completed') {
            showNotification('🎉 Saque processado com sucesso!', 'success');
            loadWithdrawalsHistory(); // Recarregar histórico
        } else if (data.success && data.data.status === 'pending') {
            // Verificar novamente em 3 segundos
            setTimeout(() => checkWithdrawalStatus(withdrawalId), 3000);
        }
    } catch (error) {
        console.error('❌ Erro ao verificar status do saque:', error);
    }
}

// Carregar histórico de saques
async function loadWithdrawalsHistory() {
    try {
        const response = await fetch('http://localhost:3001/api/withdrawals/list');
        const data = await response.json();
        
        if (data.success) {
            displayWithdrawalsHistory(data.data);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar histórico de saques:', error);
    }
}

// Exibir histórico de saques
function displayWithdrawalsHistory(withdrawals) {
    const container = document.getElementById('withdrawalsList');
    
    if (withdrawals.length === 0) {
        container.innerHTML = `
            <div class="no-withdrawals">
                <i class="fas fa-inbox"></i>
                <p>Nenhum saque realizado ainda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = withdrawals.map(withdrawal => {
        const statusClass = withdrawal.status === 'completed' ? 'completed' : 'pending';
        const statusIcon = withdrawal.status === 'completed' ? 'fa-check-circle' : 'fa-clock';
        const methodText = withdrawal.method.toUpperCase();
        const bankName = getBankName(withdrawal.bank);
        const date = new Date(withdrawal.createdAt).toLocaleString('pt-BR');
        
        return `
            <div class="withdrawal-item">
                <div class="withdrawal-icon">
                    <i class="fas ${statusIcon}"></i>
                </div>
                <div class="withdrawal-details">
                    <h6>${methodText} - ${bankName}</h6>
                    <p>${date}</p>
                    <span class="withdrawal-status ${statusClass}">${getStatusText(withdrawal.status)}</span>
                </div>
                <div class="withdrawal-amount">
                    R$ ${withdrawal.amount.toFixed(2).replace('.', ',')}
                </div>
            </div>
        `;
    }).join('');
}

// Obter nome do banco
function getBankName(bankCode) {
    const banks = {
        '001': 'Banco do Brasil',
        '341': 'Itaú',
        '033': 'Santander',
        '104': 'Caixa Econômica',
        '237': 'Bradesco',
        '260': 'Nu Pagamentos',
        '336': 'Banco C6',
        '422': 'Banco Safra'
    };
    return banks[bankCode] || 'Banco';
}

// Obter texto do status
function getStatusText(status) {
    const statusTexts = {
        'pending': 'Processando',
        'completed': 'Processado',
        'rejected': 'Rejeitado'
    };
    return statusTexts[status] || status;
}

// Aplicar máscara de CPF
function applyCpfMask(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

// Inicializar sistema de saques
function initWithdrawalSystem() {
    // Carregar configurações
    loadWithdrawalConfig();
    
    // Event listeners
    const withdrawalForm = document.getElementById('withdrawalForm');
    if (withdrawalForm) {
        withdrawalForm.addEventListener('submit', processWithdrawal);
    }
    
    const amountInput = document.getElementById('withdrawalAmount');
    if (amountInput) {
        amountInput.addEventListener('input', updateWithdrawalSummary);
    }
    
    const cpfInput = document.getElementById('withdrawalCpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            applyCpfMask(this);
        });
    }
    
    // Carregar histórico
    loadWithdrawalsHistory();
    
    console.log('✅ Sistema de saques inicializado');
}

console.log('✅ LR4 Sistema Unificado carregado com sucesso!');
