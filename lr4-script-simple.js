// ===== LR4 BET - SISTEMA SIMPLES E FUNCIONAL =====

console.log('🚀 LR4 Script iniciando...');

// Variáveis globais
let currentScratchType = '';
let userBalance = 1000.00;

// ===== SISTEMA DE DEPÓSITO =====
function openDepositModal() {
    console.log('💰 Abrindo modal de depósito...');
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal de depósito aberto!');
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

function processDeposit(formData) {
    const amount = parseFloat(formData.get('amount'));
    const method = formData.get('method');
    
    console.log('💰 Processando depósito:', amount, method);
    
    userBalance += amount;
    localStorage.setItem('userBalance', userBalance.toString());
    
    // Atualizar display do saldo
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    }
    
    alert(`✅ Depósito de R$ ${amount.toFixed(2).replace('.', ',')} processado com sucesso!`);
    closeDepositModal();
    
    return { success: true, message: 'Depósito processado com sucesso!' };
}

// ===== SISTEMA DE RASPADINHAS =====
function openScratchConfirmModal(scratchType) {
    console.log('🎯 Abrindo modal de confirmação da raspadinha:', scratchType);
    currentScratchType = scratchType;
    
    const modal = document.getElementById('scratchConfirmModal');
    if (modal) {
        // Atualizar informações da raspadinha
        const scratchInfo = getScratchInfo(scratchType);
        
        // Definir ícones por tipo
        const typeIcons = {
            premium: '💎',
            medium: '🎁', 
            basic: '🎯',
            simple: '🎪'
        };
        
        // Atualizar elementos do modal
        const modalTitle = document.getElementById('scratchModalTitle');
        const iconLarge = document.getElementById('scratchIconLarge');
        const priceDisplay = document.getElementById('scratchPriceDisplay');
        const typeDisplay = document.getElementById('scratchTypeDisplay');
        const descriptionDisplay = document.getElementById('scratchDescriptionDisplay');
        const confirmButtonText = document.getElementById('scratchConfirmButtonText');
        
        if (modalTitle) modalTitle.innerHTML = `${scratchInfo.name} <span class="clover-nav" title="Trevo da Sorte">♣</span>`;
        if (iconLarge) iconLarge.textContent = typeIcons[scratchType] || '🎯';
        if (priceDisplay) priceDisplay.textContent = scratchInfo.price;
        if (typeDisplay) typeDisplay.textContent = scratchType.charAt(0).toUpperCase() + scratchType.slice(1);
        if (descriptionDisplay) descriptionDisplay.textContent = scratchInfo.description;
        if (confirmButtonText) confirmButtonText.textContent = `Comprar ${scratchInfo.name}`;
        
        // Atualizar grid de prêmios
        updateScratchPrizesGrid(scratchType);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal de confirmação aberto!');
    } else {
        console.error('❌ Modal de confirmação não encontrado!');
    }
}

function updateScratchPrizesGrid(scratchType) {
    const prizesGrid = document.getElementById('scratchPrizesGrid');
    if (!prizesGrid) return;
    
    const prizesByType = {
        premium: [
            { icon: '📱', name: 'iPhone 15 Pro Max' },
            { icon: '💻', name: 'MacBook Pro M3' },
            { icon: '🎧', name: 'AirPods Pro 2' },
            { icon: '⌚', name: 'Apple Watch' },
            { icon: '🔊', name: 'JBL Boombox' },
            { icon: '💰', name: 'Até R$ 200' }
        ],
        medium: [
            { icon: '🎧', name: 'AirPods Pro 2' },
            { icon: '📱', name: 'Xiaomi Redmi' },
            { icon: '🔊', name: 'JBL Charge 5' },
            { icon: '🎵', name: 'Galaxy Buds' },
            { icon: '🔌', name: 'Fone Bluetooth' },
            { icon: '💰', name: 'Até R$ 100' }
        ],
        basic: [
            { icon: '🔊', name: 'JBL Charge 5' },
            { icon: '🎵', name: 'Fone Bluetooth' },
            { icon: '📻', name: 'Caixinha JBL' },
            { icon: '🔌', name: 'Carregador Wireless' },
            { icon: '🔗', name: 'Cabo USB-C' },
            { icon: '💰', name: 'Até R$ 50' }
        ],
        simple: [
            { icon: '💰', name: 'R$ 100' },
            { icon: '💵', name: 'R$ 50' },
            { icon: '💴', name: 'R$ 20' },
            { icon: '💶', name: 'R$ 10' },
            { icon: '💷', name: 'R$ 5' }
        ]
    };
    
    const prizes = prizesByType[scratchType] || prizesByType.premium;
    
    prizesGrid.innerHTML = prizes.map(prize => `
        <div class="prize-mini">
            <span class="prize-icon">${prize.icon}</span>
            <span class="prize-name">${prize.name}</span>
        </div>
    `).join('');
}

function closeScratchConfirmModal() {
    const modal = document.getElementById('scratchConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function confirmScratchPurchase() {
    const scratchInfo = getScratchInfo(currentScratchType);
    const price = parseFloat(scratchInfo.price.replace('R$ ', '').replace(',', '.'));
    
    console.log('🎯 Confirmando compra da raspadinha:', currentScratchType, price);
    
    // Verificar saldo
    if (userBalance < price) {
        alert('💰 Saldo insuficiente! Faça um depósito para continuar.');
        return;
    }
    
    // Debitar saldo
    userBalance -= price;
    localStorage.setItem('userBalance', userBalance.toString());
    
    // Atualizar display do saldo
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    }
    
    // Fechar modal de confirmação
    closeScratchConfirmModal();
    
    // Abrir modal da raspadinha
    openScratchModal();
}

function openScratchModal() {
    console.log('🎯 Abrindo modal da raspadinha...');
    const modal = document.getElementById('scratchModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Determinar prêmio
        const prize = selectScratchPrize(currentScratchType);
        
        // Criar interface da raspadinha
        createScratchInterface(prize);
        
        console.log('✅ Modal da raspadinha aberto!');
    } else {
        console.error('❌ Modal da raspadinha não encontrado!');
    }
}

function closeScratchModal() {
    const modal = document.getElementById('scratchModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createScratchInterface(prize) {
    const scratchArea = document.getElementById('scratchArea');
    if (!scratchArea) return;
    
    // Definir cores por raridade
    const rarityStyles = {
        legendary: {
            bg: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
            color: '#000',
            border: '#ffd700',
            shadow: '0 0 30px rgba(255, 215, 0, 0.8)',
            icon: '👑',
            particle: '✨'
        },
        epic: {
            bg: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 50%, #9d4edd 100%)',
            color: '#fff',
            border: '#9d4edd',
            shadow: '0 0 30px rgba(157, 78, 221, 0.8)',
            icon: '💎',
            particle: '🔮'
        },
        rare: {
            bg: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #0077b6 100%)',
            color: '#fff',
            border: '#0077b6',
            shadow: '0 0 30px rgba(0, 119, 182, 0.8)',
            icon: '⭐',
            particle: '💫'
        },
        common: {
            bg: 'linear-gradient(135deg, #6c757d 0%, #adb5bd 50%, #6c757d 100%)',
            color: '#fff',
            border: '#6c757d',
            shadow: '0 0 20px rgba(108, 117, 125, 0.6)',
            icon: '🎯',
            particle: '✨'
        }
    };
    
    const style = rarityStyles[prize.rarity] || rarityStyles.common;
    
    scratchArea.innerHTML = `
        <div class="scratch-container">
            <div class="scratch-header">
                <h3 style="color: #333; margin-bottom: 20px; font-size: 24px;">
                    ${style.icon} Raspe para revelar seu prêmio! ${style.icon}
                </h3>
                <div class="scratch-type-display">
                    <span style="background: ${style.bg}; color: ${style.color}; padding: 8px 16px; border-radius: 20px; font-weight: bold; border: 2px solid ${style.border};">
                        ${getScratchInfo(currentScratchType).name}
                    </span>
                </div>
            </div>
            
            <div class="scratch-grid-container">
                <div class="scratch-grid" id="scratchGrid" onclick="startScratching()">
                    <div class="scratch-overlay" id="scratchOverlay">
                        <div class="scratch-pattern">
                            <div class="pattern-row">
                                <span>🍀</span><span>♣</span><span>🎰</span><span>🍀</span><span>♣</span>
                            </div>
                            <div class="pattern-row">
                                <span>♣</span><span>🎰</span><span>🍀</span><span>♣</span><span>🎰</span>
                            </div>
                            <div class="pattern-row">
                                <span>🎰</span><span>🍀</span><span>♣</span><span>🎰</span><span>🍀</span>
                            </div>
                            <div class="pattern-row">
                                <span>🍀</span><span>♣</span><span>🎰</span><span>🍀</span><span>♣</span>
                            </div>
                            <div class="pattern-row">
                                <span>♣</span><span>🎰</span><span>🍀</span><span>♣</span><span>🎰</span>
                            </div>
                        </div>
                        <div class="scratch-instruction">
                            <p>🖱️ Clique e arraste para raspar</p>
                            <p>ou</p>
                            <p>📱 Toque e deslize</p>
                        </div>
                    </div>
                    
                    <div class="prize-content" id="prizeContent" style="display: none;">
                        <div class="prize-reveal" style="background: ${style.bg}; color: ${style.color}; border: 3px solid ${style.border}; box-shadow: ${style.shadow};">
                            <div class="prize-particles">
                                <span class="particle">${style.particle}</span>
                                <span class="particle">${style.particle}</span>
                                <span class="particle">${style.particle}</span>
                                <span class="particle">${style.particle}</span>
                                <span class="particle">${style.particle}</span>
                            </div>
                            <div class="prize-icon-large">${style.icon}</div>
                            <div class="prize-name">${prize.name}</div>
                            <div class="prize-value">R$ ${prize.value.toFixed(2).replace('.', ',')}</div>
                            <div class="prize-rarity prize-rarity-${prize.rarity}">${prize.rarity.toUpperCase()}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="scratch-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <p>Progresso da raspagem: <span id="progressText">0%</span></p>
            </div>
            
            <div id="prizeActions" style="display: none;" class="prize-actions">
                <button class="btn-claim" onclick="claimPrize()" style="background: ${style.bg}; color: ${style.color}; border: 2px solid ${style.border};">
                    <i class="fas fa-gift"></i> Resgatar Prêmio
                </button>
                <button class="btn-close" onclick="closeScratchModal()">
                    <i class="fas fa-times"></i> Fechar
                </button>
            </div>
        </div>
        
        <style>
            .scratch-container {
                padding: 20px;
                text-align: center;
            }
            
            .scratch-type-display {
                margin: 15px 0;
            }
            
            .scratch-grid-container {
                position: relative;
                margin: 30px auto;
                max-width: 400px;
            }
            
            .scratch-grid {
                width: 100%;
                height: 300px;
                position: relative;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                cursor: pointer;
            }
            
            .scratch-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #e0e0e0 25%, #f5f5f5 25%, #f5f5f5 50%, #e0e0e0 50%, #e0e0e0 75%, #f5f5f5 75%);
                background-size: 20px 20px;
                z-index: 2;
                transition: opacity 0.3s ease;
            }
            
            .scratch-pattern {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 3;
            }
            
            .pattern-row {
                display: flex;
                justify-content: center;
                margin: 5px 0;
            }
            
            .pattern-row span {
                font-size: 24px;
                margin: 0 8px;
                animation: sparkle 2s ease-in-out infinite;
            }
            
            .scratch-instruction {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-size: 14px;
                z-index: 4;
            }
            
            .prize-content {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
            }
            
            .prize-reveal {
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                position: relative;
                animation: prizeReveal 1s ease-out;
                max-width: 300px;
                width: 90%;
            }
            
            .prize-particles {
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                overflow: hidden;
                pointer-events: none;
            }
            
            .particle {
                position: absolute;
                font-size: 20px;
                animation: float 3s ease-in-out infinite;
            }
            
            .particle:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
            .particle:nth-child(2) { top: 20%; right: 10%; animation-delay: 0.5s; }
            .particle:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 1s; }
            .particle:nth-child(4) { bottom: 10%; right: 20%; animation-delay: 1.5s; }
            .particle:nth-child(5) { top: 50%; left: 50%; animation-delay: 2s; transform: translate(-50%, -50%); }
            
            .prize-icon-large {
                font-size: 48px;
                margin-bottom: 15px;
            }
            
            .prize-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .prize-value {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 15px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .prize-rarity {
                font-size: 16px;
                font-weight: bold;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .scratch-progress {
                margin: 20px 0;
            }
            
            .progress-bar {
                width: 100%;
                height: 10px;
                background: #e0e0e0;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745, #20c997);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 5px;
            }
            
            .prize-actions {
                margin-top: 20px;
            }
            
            .btn-claim, .btn-close {
                padding: 12px 25px;
                margin: 10px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .btn-claim:hover, .btn-close:hover {
                transform: translateY(-2px);
            }
            
            .btn-close {
                background: #6c757d;
                color: white;
            }
            
            @keyframes sparkle {
                0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            }
            
            @keyframes prizeReveal {
                0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                50% { transform: scale(1.1) rotate(-90deg); opacity: 0.8; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
        </style>
    `;
    
    // Salvar prêmio para a função reveal
    window.currentPrize = prize;
    window.scratchProgress = 0;
}

// ===== SISTEMA DE RASPAGEM INTERATIVA =====
function startScratching() {
    const overlay = document.getElementById('scratchOverlay');
    const prizeContent = document.getElementById('prizeContent');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const prizeActions = document.getElementById('prizeActions');
    
    if (!overlay) return;
    
    let isScratching = false;
    let scratchedAreas = [];
    
    // Event listeners para mouse
    overlay.addEventListener('mousedown', startScratch);
    overlay.addEventListener('mousemove', scratch);
    overlay.addEventListener('mouseup', stopScratch);
    overlay.addEventListener('mouseleave', stopScratch);
    
    // Event listeners para touch (mobile)
    overlay.addEventListener('touchstart', startScratch);
    overlay.addEventListener('touchmove', scratch);
    overlay.addEventListener('touchend', stopScratch);
    
    function startScratch(e) {
        e.preventDefault();
        isScratching = true;
        scratch(e);
    }
    
    function scratch(e) {
        if (!isScratching) return;
        
        e.preventDefault();
        const rect = overlay.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        // Criar área raspada
        createScratchArea(x, y);
        
        // Atualizar progresso
        updateProgress();
    }
    
    function stopScratch() {
        isScratching = false;
    }
    
    function createScratchArea(x, y) {
        const scratchSpot = document.createElement('div');
        scratchSpot.style.position = 'absolute';
        scratchSpot.style.left = (x - 15) + 'px';
        scratchSpot.style.top = (y - 15) + 'px';
        scratchSpot.style.width = '30px';
        scratchSpot.style.height = '30px';
        scratchSpot.style.background = 'transparent';
        scratchSpot.style.borderRadius = '50%';
        scratchSpot.style.pointerEvents = 'none';
        scratchSpot.style.zIndex = '10';
        scratchSpot.className = 'scratch-hole';
        
        overlay.appendChild(scratchSpot);
        scratchedAreas.push({ x, y });
    }
    
    function updateProgress() {
        window.scratchProgress += 2;
        if (window.scratchProgress > 100) window.scratchProgress = 100;
        
        if (progressFill) {
            progressFill.style.width = window.scratchProgress + '%';
        }
        if (progressText) {
            progressText.textContent = Math.round(window.scratchProgress) + '%';
        }
        
        // Revelar prêmio gradualmente
        if (window.scratchProgress >= 30) {
            overlay.style.opacity = 1 - (window.scratchProgress / 100);
        }
        
        // Revelar prêmio completamente
        if (window.scratchProgress >= 80) {
            revealPrize();
        }
    }
}

function revealPrize() {
    const overlay = document.getElementById('scratchOverlay');
    const prizeContent = document.getElementById('prizeContent');
    const prizeActions = document.getElementById('prizeActions');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    if (prizeContent) {
        prizeContent.style.display = 'flex';
    }
    if (prizeActions) {
        prizeActions.style.display = 'block';
    }
    
    // Adicionar efeito sonoro (opcional)
    console.log('🎉 Prêmio revelado:', window.currentPrize);
    
    // Adicionar confetti
    createConfetti();
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    
    document.body.appendChild(confettiContainer);
    
    // Criar confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = ['🎉', '🎊', '✨', '🎈', '🎆'][Math.floor(Math.random() * 5)];
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-50px';
        confetti.style.fontSize = '20px';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
    }
    
    // Remover confetti após animação
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000);
    
    // Adicionar CSS para animação de confetti
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            .scratch-hole {
                box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
            }
        `;
        document.head.appendChild(style);
    }
}

function claimPrize() {
    if (window.currentPrize) {
        const prize = window.currentPrize;
        
        // Simular resgate do prêmio
        alert(`🎉 Parabéns! Você ganhou: ${prize.name}\nValor: R$ ${prize.value.toFixed(2).replace('.', ',')}\nRaridade: ${prize.rarity.toUpperCase()}`);
        
        console.log('🎁 Prêmio resgatado:', prize);
        
        // Fechar modal
        closeScratchModal();
    }
}

// ===== FUNÇÕES AUXILIARES =====
function getScratchInfo(scratchType) {
    const scratches = {
        premium: {
            name: 'Raspadinha Premium Lr4',
            price: 'R$ 50,00',
            description: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!'
        },
        medium: {
            name: 'Raspadinha Média Lr4',
            price: 'R$ 20,00',
            description: 'Chance de ganhar AirPods, Xiaomi, Caixinha JBL e muito mais!'
        },
        basic: {
            name: 'Raspadinha Básica Lr4',
            price: 'R$ 10,00',
            description: 'Chance de ganhar Fone Bluetooth, Carregador, Caixinha JBL e muito mais!'
        },
        simple: {
            name: 'Raspadinha Simples Lr4',
            price: 'R$ 5,00',
            description: 'Chance de ganhar R$ 50, R$ 20, R$ 10 e muito mais!'
        }
    };
    
    return scratches[scratchType] || scratches.premium;
}

function selectScratchPrize(scratchType) {
    const prizes = {
        premium: [
            { name: 'iPhone 15 Pro Max', value: 8000, rarity: 'legendary', probability: 0.5 },
            { name: 'MacBook Pro M3', value: 12000, rarity: 'legendary', probability: 0.3 },
            { name: 'AirPods Pro 2', value: 2000, rarity: 'epic', probability: 2.0 },
            { name: 'Apple Watch Series 9', value: 3000, rarity: 'epic', probability: 1.5 },
            { name: 'JBL Boombox 3', value: 800, rarity: 'rare', probability: 5.0 },
            { name: 'R$ 200,00', value: 200, rarity: 'common', probability: 15.0 },
            { name: 'R$ 100,00', value: 100, rarity: 'common', probability: 25.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 50.7 }
        ],
        medium: [
            { name: 'AirPods Pro 2', value: 2000, rarity: 'legendary', probability: 1.0 },
            { name: 'Xiaomi Redmi Note 13', value: 1200, rarity: 'epic', probability: 2.0 },
            { name: 'JBL Charge 5', value: 600, rarity: 'epic', probability: 3.0 },
            { name: 'Galaxy Buds', value: 400, rarity: 'rare', probability: 8.0 },
            { name: 'Fone Bluetooth JBL', value: 200, rarity: 'rare', probability: 12.0 },
            { name: 'R$ 100,00', value: 100, rarity: 'common', probability: 25.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 49.0 }
        ],
        basic: [
            { name: 'JBL Charge 5', value: 600, rarity: 'epic', probability: 2.0 },
            { name: 'Fone Bluetooth JBL', value: 200, rarity: 'rare', probability: 8.0 },
            { name: 'Caixinha JBL Go 3', value: 150, rarity: 'rare', probability: 10.0 },
            { name: 'Carregador Wireless', value: 100, rarity: 'common', probability: 20.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'common', probability: 60.0 }
        ],
        simple: [
            { name: 'R$ 100,00', value: 100, rarity: 'epic', probability: 2.0 },
            { name: 'R$ 50,00', value: 50, rarity: 'rare', probability: 8.0 },
            { name: 'R$ 20,00', value: 20, rarity: 'common', probability: 25.0 },
            { name: 'R$ 10,00', value: 10, rarity: 'common', probability: 35.0 },
            { name: 'R$ 5,00', value: 5, rarity: 'common', probability: 30.0 }
        ]
    };
    
    const typePrizes = prizes[scratchType] || prizes.premium;
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

// ===== SISTEMA DE LOGIN =====
function checkLoginStatus() {
    console.log('🔍 Verificando status de login...');
    
    // Verificar se há dados de login salvos
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    
    console.log('📊 Status:', { isLoggedIn, userName });
    
    if (isLoggedIn && userName) {
        // Usuário está logado - ocultar botões de login
        hideLoginButtons();
        showUserInfo(userName);
        showUserBalance();
    } else {
        // Simular login automático se não houver dados
        autoLogin();
    }
}

function hideLoginButtons() {
    const btnLogin = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');
    
    if (btnLogin) {
        btnLogin.style.display = 'none';
        console.log('✅ Botão Entrar ocultado');
    }
    
    if (btnRegister) {
        btnRegister.style.display = 'none';
        console.log('✅ Botão Cadastre-se ocultado');
    }
}

function showUserInfo(userName) {
    // Mostrar o botão "Minha Conta" que já existe
    const btnAccount = document.getElementById('btnAccount');
    if (btnAccount) {
        btnAccount.style.display = 'inline-block';
        btnAccount.textContent = 'Minha Conta';
        
        // Adicionar funcionalidade ao botão
        btnAccount.onclick = function() {
            openAccountModal();
        };
        
        console.log('✅ Botão Minha Conta exibido');
    }
}

function openAccountModal() {
    // Usar o modal que já existe no HTML
    const accountModal = document.getElementById('accountsModal');
    if (accountModal) {
        accountModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Verificar se é admin para mostrar aba admin
        if (checkAdminStatus()) {
            const adminTab = document.querySelector('.admin-only');
            if (adminTab) {
                adminTab.style.display = 'inline-block';
            }
            
            // Mostrar aba de caixas se for admin
            const casesTab = document.getElementById('casesTabBtn');
            if (casesTab) {
                casesTab.style.display = 'inline-block';
            }
        }
        
        console.log('📱 Modal Minha Conta aberto');
    }
}

function closeAccountModal() {
    const modal = document.getElementById('accountsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function checkAdminStatus() {
    // Verificar se é admin baseado no email/usuário
    const userName = localStorage.getItem('userName');
    return userName === 'admin' || userName === 'Admin Master';
}

// ===== SISTEMA DE ABAS DO MODAL =====
function initAccountTabs() {
    console.log('📋 Inicializando sistema de abas...');
    
    // Event listeners para as abas
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn') || e.target.closest('.tab-btn')) {
            const tabBtn = e.target.classList.contains('tab-btn') ? e.target : e.target.closest('.tab-btn');
            const tabName = tabBtn.getAttribute('data-tab');
            
            if (tabName) {
                switchTab(tabName);
            }
        }
        
        // Event listener para fechar modal
        if (e.target.classList.contains('close') && e.target.closest('#accountsModal')) {
            closeAccountModal();
        }
    });
}

function switchTab(tabName) {
    console.log('🔄 Mudando para aba:', tabName);
    
    // Remover active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar aba selecionada
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(tabName);
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    
    // Ações especiais para certas abas
    if (tabName === 'admin') {
        openAdminCodeModal();
    }
}

function openAdminCodeModal() {
    // Verificar se modal existe
    let adminCodeModal = document.getElementById('adminCodeModal');
    
    if (!adminCodeModal) {
        // Criar modal de código admin
        adminCodeModal = document.createElement('div');
        adminCodeModal.id = 'adminCodeModal';
        adminCodeModal.className = 'modal';
        adminCodeModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔐 Código de Segurança Admin</h3>
                    <span class="close" onclick="closeAdminCodeModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="adminCodeForm">
                        <div class="form-group">
                            <label for="adminSecurityCode">Digite o código de segurança:</label>
                            <input type="password" id="adminSecurityCode" required>
                            <span id="adminCodeError" class="error-message"></span>
                        </div>
                        <button type="submit" class="btn-primary">Verificar Código</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(adminCodeModal);
        
        // Event listener para o formulário
        document.getElementById('adminCodeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const code = document.getElementById('adminSecurityCode').value;
            const errorSpan = document.getElementById('adminCodeError');
            
            if (code === '3005') {
                // Código correto
                closeAdminCodeModal();
                openAdminPanel();
            } else {
                errorSpan.textContent = 'Código incorreto!';
                errorSpan.style.color = 'red';
            }
        });
    }
    
    adminCodeModal.style.display = 'block';
}

function closeAdminCodeModal() {
    const modal = document.getElementById('adminCodeModal');
    if (modal) {
        modal.style.display = 'none';
        // Voltar para aba perfil
        switchTab('profile');
    }
}

function openAdminPanel() {
    console.log('🔑 Abrindo painel admin...');
    
    // Fechar modal de conta
    closeAccountModal();
    
    // Criar painel admin
    let adminPanel = document.getElementById('adminPanel');
    
    if (!adminPanel) {
        adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-panel-header">
                    <h2>🔑 Painel de Administração</h2>
                    <button class="btn-admin-close" onclick="closeAdminPanel()">×</button>
                </div>
                
                <div class="admin-section">
                    <h3>📊 Estatísticas do Sistema</h3>
                    <div class="admin-stats">
                        <div class="stat-item">
                            <div class="stat-icon">👥</div>
                            <div class="stat-info">
                                <span class="stat-label">Usuários Ativos</span>
                                <span class="stat-value">1,247</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">💰</div>
                            <div class="stat-info">
                                <span class="stat-label">Receita Total</span>
                                <span class="stat-value">R$ 125.430,00</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">🎰</div>
                            <div class="stat-info">
                                <span class="stat-label">Jogos Hoje</span>
                                <span class="stat-value">3,891</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3>⚙️ Controles do Sistema</h3>
                    <div class="admin-controls">
                        <button class="btn-admin-control">
                            👥 Gerenciar Usuários
                        </button>
                        <button class="btn-admin-control">
                            🎰 Gerenciar Jogos
                        </button>
                        <button class="btn-admin-control">
                            📦 Gerenciar Caixas
                        </button>
                        <button class="btn-admin-control">
                            🎁 Gerenciar Promoções
                        </button>
                        <button class="btn-admin-control">
                            ⚙️ Configurações do Sistema
                        </button>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3>👤 Sessão Admin</h3>
                    <div class="session-info">
                        <div class="session-item">
                            <span class="session-label">Usuário:</span>
                            <span class="session-value">Admin Master</span>
                        </div>
                        <div class="session-item">
                            <span class="session-label">Nível:</span>
                            <span class="session-value admin-badge">Admin Master</span>
                        </div>
                    </div>
                    <button class="btn-admin-logout" onclick="adminLogout()">
                        🚪 Sair do Admin
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(adminPanel);
        
        // Adicionar estilos
        addAdminPanelStyles();
    }
    
    adminPanel.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function adminLogout() {
    closeAdminPanel();
    logout();
}

function addAdminPanelStyles() {
    if (document.getElementById('adminPanelStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'adminPanelStyles';
    style.textContent = `
        .admin-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .admin-panel-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 15px;
            padding: 30px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        
        .admin-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ffd700;
            padding-bottom: 15px;
        }
        
        .admin-panel-header h2 {
            color: #ffd700;
            margin: 0;
            font-size: 24px;
        }
        
        .btn-admin-close {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
        }
        
        .admin-section {
            margin-bottom: 25px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 20px;
        }
        
        .admin-section h3 {
            color: #fff;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .admin-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .stat-item {
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .stat-icon {
            font-size: 24px;
        }
        
        .stat-info {
            display: flex;
            flex-direction: column;
        }
        
        .stat-label {
            color: #ccc;
            font-size: 12px;
        }
        
        .stat-value {
            color: #fff;
            font-weight: bold;
            font-size: 16px;
        }
        
        .admin-controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .btn-admin-control {
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-admin-control:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .session-info {
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .session-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: #fff;
        }
        
        .admin-badge {
            background: #ffd700;
            color: #000;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .btn-admin-logout {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            cursor: pointer;
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

function showUserBalance() {
    const userBalanceSection = document.getElementById('userBalanceSection');
    if (userBalanceSection) {
        userBalanceSection.style.display = 'flex';
        console.log('✅ Seção de saldo exibida');
    }
}

function autoLogin() {
    console.log('🔄 Realizando login automático...');
    
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', 'User');
    
    // Atualizar interface
    hideLoginButtons();
    showUserInfo('User');
    showUserBalance();
    
    console.log('✅ Login automático realizado!');
}

function logout() {
    console.log('🚪 Realizando logout...');
    
    // Limpar dados de login
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    
    // Ocultar botão Minha Conta
    const btnAccount = document.getElementById('btnAccount');
    if (btnAccount) {
        btnAccount.style.display = 'none';
    }
    
    // Mostrar botões de login novamente
    const btnLogin = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');
    
    if (btnLogin) btnLogin.style.display = 'inline-block';
    if (btnRegister) btnRegister.style.display = 'inline-block';
    
    console.log('✅ Logout realizado!');
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LR4 Sistema carregado!');
    
    // Verificar se usuário está logado
    checkLoginStatus();
    
    // Configurar saldo inicial
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
        userBalance = parseFloat(savedBalance);
    }
    
    // Atualizar display do saldo
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    }
    
    // Event listener para botão de depósito
    const btnDeposit = document.getElementById('btnDeposit');
    if (btnDeposit) {
        btnDeposit.addEventListener('click', openDepositModal);
        console.log('✅ Botão de depósito configurado!');
    }
    
    // Event listener para formulário de depósito
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        depositForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            processDeposit(formData);
        });
        console.log('✅ Formulário de depósito configurado!');
    }
    
    // Event listeners para fechar modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Inicializar sistema de hover das caixas
    initCaseHoverSystem();
    
    // Inicializar sistema de abas do modal
    initAccountTabs();
    
    console.log('✅ Todos os sistemas configurados e funcionais!');
});

// ===== SISTEMA DE HOVER DAS CAIXAS =====
function initCaseHoverSystem() {
    console.log('🎪 Inicializando sistema de hover das caixas...');
    
    const caseCards = document.querySelectorAll('.case-card');
    
    caseCards.forEach((card) => {
        // Garantir que não há animações por padrão
        card.style.animation = 'none';
        card.style.transform = '';
        
        // Apenas shake no hover (já definido no CSS)
        card.addEventListener('mouseenter', () => {
            console.log('🎯 Hover detectado na caixa');
        });
        
        card.addEventListener('mouseleave', () => {
            // Parar qualquer animação ao sair
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.transform = '';
            }, 100);
        });
    });
}

// ===== SISTEMA DE CAIXAS =====
let currentCaseType = '';

function openCaseConfirmModal(caseType) {
    console.log('📦 Abrindo modal de confirmação da caixa:', caseType);
    console.log('🔍 Stack trace:', new Error().stack);
    currentCaseType = caseType;
    
    const modal = document.getElementById('caseConfirmModal');
    if (modal) {
        // Atualizar informações da caixa
        const caseInfo = getCaseInfo(caseType);
        
        // Definir ícones por tipo
        const typeIcons = {
            premium: '💎',
            medium: '🎁', 
            basic: '🎯',
            simple: '🎪'
        };
        
        // Atualizar elementos do modal (se existirem)
        const modalTitle = modal.querySelector('h3');
        const iconLarge = modal.querySelector('.case-icon-large');
        
        if (modalTitle) modalTitle.innerHTML = `${caseInfo.name} <span class="clover-nav" title="Trevo da Sorte">♣</span>`;
        if (iconLarge) iconLarge.textContent = typeIcons[caseType] || '🎁';
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal de confirmação da caixa aberto!');
    } else {
        console.error('❌ Modal de confirmação da caixa não encontrado!');
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
    console.log('🔍 Confirm stack trace:', new Error().stack);
    const caseInfo = getCaseInfo(currentCaseType);
    const price = parseFloat(caseInfo.price.replace('R$ ', '').replace(',', '.'));
    
    console.log('📦 Confirmando abertura da caixa:', currentCaseType, price);
    
    // Verificar saldo
    if (userBalance < price) {
        console.log('💰 Saldo insuficiente para abrir caixa');
        
        // Mostrar mensagem no modal ao invés de alert
        const modal = document.getElementById('caseConfirmModal');
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="insufficient-balance-message">
                <div class="warning-icon">⚠️</div>
                <h3>Saldo Insuficiente</h3>
                <p>Você precisa de R$ ${price.toFixed(2).replace('.', ',')} para abrir esta caixa.</p>
                <p>Seu saldo atual: R$ ${userBalance.toFixed(2).replace('.', ',')}</p>
                <button class="btn-deposit" onclick="closeCaseConfirmModal(); openDepositModal();">
                    Fazer Depósito
                </button>
                <button class="btn-close" onclick="closeCaseConfirmModal()">
                    Fechar
                </button>
            </div>
        `;
        return;
    }
    
    // Debitar saldo
    userBalance -= price;
    localStorage.setItem('userBalance', userBalance.toString());
    
    // Atualizar display do saldo
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
    }
    
    // Fechar modal de confirmação
    closeCaseConfirmModal();
    
    // Abrir modal da caixa (roleta)
    openCaseModal();
}

function openCaseModal() {
    console.log('📦 Abrindo modal da caixa...');
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Determinar prêmio
        const prize = selectCasePrize(currentCaseType);
        
        // Criar animação de abertura da caixa
        createCaseOpeningAnimation(prize);
        
        console.log('✅ Modal da caixa aberto!');
    } else {
        console.error('❌ Modal da caixa não encontrado!');
    }
}

function createCaseOpeningAnimation(prize) {
    const modal = document.getElementById('caseModal');
    const modalBody = modal.querySelector('.modal-body');
    
    // Gerar lista de prêmios para a roleta (incluindo o prêmio vencedor)
    const allPrizes = generateRouletteItems(prize);
    
    // Limpar conteúdo anterior
    modalBody.innerHTML = `
        <div class="compact-roulette">
            <div class="roulette-header-compact">
                <h3>🎰 ${getCaseInfo(currentCaseType).name}</h3>
                <p>Girando a roleta...</p>
            </div>
            
            <div class="roulette-wheel-compact">
                <div class="wheel-pointer">▼</div>
                <div class="wheel-items" id="wheelItems">
                    ${allPrizes.map((item, index) => `
                        <div class="wheel-item ${item.rarity}" data-index="${index}">
                            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=60&fit=crop&crop=center" alt="${item.name}" class="item-image">
                            <div class="item-info">
                                <span class="item-name">${item.name}</span>
                                <span class="item-value">R$ ${item.value.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="wheel-grid-display">
                <div class="grid-3x3">
                    ${allPrizes.slice(0, 9).map((item, index) => `
                        <div class="grid-item ${item.rarity}">
                            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=60&h=45&fit=crop&crop=center" alt="${item.name}">
                            <div class="grid-item-info">
                                <span class="grid-name">${item.name}</span>
                                <span class="grid-value">R$ ${item.value.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="roulette-status">
                <span id="statusText">Girando...</span>
            </div>
            
            <div class="result-overlay hidden" id="resultOverlay">
                <div class="result-card">
                    <div class="result-icon">🎉</div>
                    <h3>Você ganhou!</h3>
                    <div class="won-item">
                        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=75&fit=crop&crop=center" alt="${prize.name}">
                        <div class="won-details">
                            <h4>${prize.name}</h4>
                            <p class="won-value">R$ ${prize.value.toFixed(2).replace('.', ',')}</p>
                            <span class="won-rarity ${prize.rarity}">${prize.rarity.toUpperCase()}</span>
                        </div>
                    </div>
                    <button class="btn-collect-compact" onclick="collectCasePrize()">
                        Coletar Prêmio
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Iniciar som da roleta (se disponível)
    playRouletteSound();
    
    // Iniciar animação de loading dots
    startLoadingAnimation();
    
    // Calcular posição final para o prêmio vencedor
    const winnerIndex = Math.floor(allPrizes.length / 2); // Prêmio no centro
    allPrizes[winnerIndex] = prize; // Garantir que o prêmio correto está no centro
    
    // Iniciar roleta após delay
    setTimeout(() => {
        startRouletteAnimation(winnerIndex, prize);
    }, 1000);
}

function collectCasePrize() {
    const prize = window.currentCasePrize;
    if (prize) {
        // Adicionar prêmio ao saldo
        userBalance += prize.value;
        localStorage.setItem('userBalance', userBalance.toString());
        
        // Atualizar display do saldo
        updateBalanceDisplay();
        
        console.log(`💰 Prêmio de R$ ${prize.value.toFixed(2)} coletado!`);
        
        // Mostrar confirmação
        const prizeContainer = document.querySelector('.prize-container');
        prizeContainer.innerHTML = `
            <div class="collection-success">
                <div class="success-icon">✅</div>
                <h2>Prêmio Coletado!</h2>
                <p>R$ ${prize.value.toFixed(2).replace('.', ',')} foi adicionado ao seu saldo!</p>
                <button class="btn-close-case" onclick="closeCaseModal()">
                    Fechar
                </button>
            </div>
        `;
        
        // Limpar prêmio atual
        window.currentCasePrize = null;
        
        // Fechar modal automaticamente após 3 segundos
        setTimeout(() => {
            closeCaseModal();
        }, 3000);
    }
}

function createConfettiAnimation() {
    const confettiContainer = document.querySelector('.confetti');
    if (!confettiContainer) return;
    
    // Criar múltiplos confettis
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${getRandomColor()};
            left: ${Math.random() * 100}%;
            animation: confettiFall ${2 + Math.random() * 3}s ease-out forwards;
            animation-delay: ${Math.random() * 2}s;
        `;
        confettiContainer.appendChild(confetti);
        
        // Remover após animação
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===== SISTEMA DE ROLETA =====
function generateRouletteItems(winningPrize) {
    const scratchInfo = getScratchInfo(currentCaseType);
    const allPrizes = scratchInfo.prizes || [];
    
    // Criar array com 15 itens (7 antes, 1 vencedor, 7 depois)
    const rouletteItems = [];
    
    // Adicionar prêmios aleatórios antes
    for (let i = 0; i < 7; i++) {
        const randomPrize = allPrizes[Math.floor(Math.random() * allPrizes.length)];
        rouletteItems.push(randomPrize);
    }
    
    // Adicionar o prêmio vencedor no centro
    rouletteItems.push(winningPrize);
    
    // Adicionar prêmios aleatórios depois
    for (let i = 0; i < 7; i++) {
        const randomPrize = allPrizes[Math.floor(Math.random() * allPrizes.length)];
        rouletteItems.push(randomPrize);
    }
    
    return rouletteItems;
}

function getPrizeIcon(prize) {
    const iconMap = {
        'iPhone 15 Pro Max': '📱',
        'iPhone 13': '📱',
        'MacBook Pro': '💻',
        'Acer Nitro': '🖥️',
        'JBL Boombox': '🔊',
        'JBL Charge 5': '🔊',
        'Fone Bluetooth': '🎧',
        'Carregador': '🔌'
    };
    
    // Buscar por palavras-chave no nome do prêmio
    for (const [key, icon] of Object.entries(iconMap)) {
        if (prize.name.includes(key) || prize.name.includes(key.split(' ')[0])) {
            return icon;
        }
    }
    
    // Ícones baseados no valor se não encontrar
    if (prize.value >= 1000) return '💎';
    if (prize.value >= 100) return '🏆';
    if (prize.value >= 50) return '🎁';
    return '💰';
}

function playRouletteSound() {
    try {
        // Criar áudio sintético da roleta usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Frequência base que vai diminuindo
        let frequency = 800;
        const duration = 4000; // 4 segundos
        
        const playTickSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            
            frequency *= 0.98; // Diminuir frequência gradualmente
        };
        
        // Reproduzir ticks com intervalos decrescentes
        let interval = 50;
        let elapsed = 0;
        
        const tickInterval = setInterval(() => {
            playTickSound();
            elapsed += interval;
            interval *= 1.05; // Aumentar intervalo gradualmente (desacelerar)
            
            if (elapsed >= duration) {
                clearInterval(tickInterval);
            }
        }, interval);
        
    } catch (error) {
        console.log('🔇 Áudio não disponível:', error);
    }
}

function startLoadingAnimation() {
    const statusText = document.getElementById('statusText');
    if (!statusText) return;
    
    let dotCount = 0;
    const loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        statusText.textContent = 'Girando' + '.'.repeat(dotCount);
    }, 500);
    
    // Parar após 3 segundos
    setTimeout(() => {
        clearInterval(loadingInterval);
        statusText.textContent = 'Finalizando...';
    }, 3000);
}

function startRouletteAnimation(winnerIndex, prize) {
    const wheelItems = document.getElementById('wheelItems');
    if (!wheelItems) return;
    
    // Calcular deslocamento para centralizar o item vencedor
    const itemWidth = 120; // Largura menor para design compacto
    const containerWidth = wheelItems.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    const winnerOffset = winnerIndex * itemWidth;
    const finalOffset = centerOffset - winnerOffset;
    
    // Adicionar rotações extras para efeito
    const extraRotations = 2; // 2 voltas completas
    const totalItems = wheelItems.children.length;
    const fullRotationOffset = totalItems * itemWidth;
    const totalOffset = finalOffset - (extraRotations * fullRotationOffset);
    
    // Aplicar animação mais rápida e suave
    wheelItems.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheelItems.style.transform = `translateX(${totalOffset}px)`;
    
    // Após animação, mostrar resultado
    setTimeout(() => {
        showCompactResult(prize);
    }, 3200);
}

function showCompactResult(prize) {
    const resultOverlay = document.getElementById('resultOverlay');
    
    if (resultOverlay) {
        resultOverlay.classList.remove('hidden');
        resultOverlay.classList.add('revealed');
        
        // Armazenar prêmio para coleta
        window.currentCasePrize = prize;
        
        // Atualizar status
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = 'Resultado revelado!';
        }
    }
}

function createRouletteConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;
    
    // Criar múltiplos confettis
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${getRandomColor()};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${2 + Math.random() * 3}s ease-out forwards;
            animation-delay: ${Math.random() * 1}s;
        `;
        confettiContainer.appendChild(confetti);
        
        // Remover após animação
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

function closeCaseModal() {
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


function selectCasePrize(caseType) {
    // Usar o mesmo sistema de prêmios das raspadinhas
    const scratchInfo = getScratchInfo(caseType);
    if (scratchInfo.prizes) {
        const prizes = scratchInfo.prizes;
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        const random = Math.random() * totalProbability;
        
        let currentProbability = 0;
        for (const prize of prizes) {
            currentProbability += prize.probability;
            if (random <= currentProbability) {
                return prize;
            }
        }
        
        return prizes[prizes.length - 1];
    }
    
    // Fallback
    return { name: 'R$ 10,00', value: 10, rarity: 'common' };
}

function getCaseInfo(caseType) {
    const cases = {
        premium: {
            name: 'Caixa Premium Lr4',
            price: 'R$ 50,00',
            description: 'Chance de ganhar iPhone 15, MacBook Pro, AirPods e muito mais!'
        },
        medium: {
            name: 'Caixa Média Lr4',
            price: 'R$ 20,00',
            description: 'Chance de ganhar AirPods, Xiaomi, Caixinha JBL e muito mais!'
        },
        basic: {
            name: 'Caixa Básica Lr4',
            price: 'R$ 10,00',
            description: 'Chance de ganhar Fone Bluetooth, Carregador, Caixinha JBL e muito mais!'
        },
        simple: {
            name: 'Caixa Simples Lr4',
            price: 'R$ 5,00',
            description: 'Chance de ganhar R$ 50, R$ 20, R$ 10 e muito mais!'
        }
    };
    
    return cases[caseType] || cases.premium;
}

console.log('📄 LR4 Script carregado completamente!');
