// Sistema de Raspadinha Digital
const ScratchSystem = {
    // Configurações da raspadinha
    config: {
        scratchThreshold: 0.3, // 30% da superfície deve ser raspada
        scratchRadius: 20,
        scratchColor: '#666',
        scratchPattern: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'2\' fill=\'%23666\'/%3E%3C/svg%3E")'
    },

    // Estado da raspadinha atual
    currentScratch: null,
    isScratching: false,
    scratchCanvas: null,
    scratchContext: null,
    scratchedPixels: 0,
    totalPixels: 0,
    isPrizeRevealed: false, // Evitar múltiplos prêmios
    isProcessing: false, // Evitar múltiplas requisições

    // Inicializar sistema
    init: () => {
        console.log('🎯 Inicializando sistema de raspadinha...');
        ScratchSystem.bindEvents();
        ScratchSystem.loadScratchCards();
    },

    // Vincular eventos
    bindEvents: () => {
        // Botões de ação
        const buyScratchBtn = document.getElementById('buy-scratch-btn');
        const newScratchBtn = document.getElementById('new-scratch-btn');
        const claimPrizeBtn = document.getElementById('claim-prize-btn');

        if (buyScratchBtn) {
            buyScratchBtn.addEventListener('click', ScratchSystem.buyNewScratch);
        }

        if (newScratchBtn) {
            newScratchBtn.addEventListener('click', ScratchSystem.resetScratch);
        }

        if (claimPrizeBtn) {
            claimPrizeBtn.addEventListener('click', ScratchSystem.claimPrize);
        }

        // Eventos de mouse para raspagem
        document.addEventListener('mousedown', ScratchSystem.startScratching);
        document.addEventListener('mousemove', ScratchSystem.scratch);
        document.addEventListener('mouseup', ScratchSystem.stopScratching);
        document.addEventListener('mouseleave', ScratchSystem.stopScratching);

        // Eventos de toque para mobile
        document.addEventListener('touchstart', ScratchSystem.startScratching);
        document.addEventListener('touchmove', ScratchSystem.scratch);
        document.addEventListener('touchend', ScratchSystem.stopScratching);
    },

    // Carregar cartas de raspadinha
    loadScratchCards: () => {
        const scratchGrid = document.getElementById('scratch-grid');
        if (!scratchGrid) return;

        const scratchCards = [
            {
                id: 1,
                name: 'Clássica',
                price: 5.00,
                description: 'Raspadinha tradicional com prêmios de R$ 1 a R$ 100',
                image: '🎯',
                color: '#ff6b35'
            },
            {
                id: 2,
                name: 'Premium',
                price: 10.00,
                description: 'Raspadinha premium com prêmios de R$ 10 a R$ 500',
                image: '💎',
                color: '#f7931e'
            },
            {
                id: 3,
                name: 'Mega',
                price: 20.00,
                description: 'Raspadinha mega com prêmios de R$ 50 a R$ 1.000',
                image: '🚀',
                color: '#e74c3c'
            },
            {
                id: 4,
                name: 'Especial',
                price: 50.00,
                description: 'Raspadinha especial com prêmios de R$ 100 a R$ 5.000',
                image: '👑',
                color: '#9b59b6'
            }
        ];

        scratchGrid.innerHTML = scratchCards.map(card => `
            <div class="scratch-card-item" data-id="${card.id}" data-price="${card.price}">
                <div class="card-header" style="background: ${card.color}">
                    <div class="card-icon">${card.image}</div>
                    <h3>${card.name}</h3>
                </div>
                <div class="card-body">
                    <p>${card.description}</p>
                    <div class="card-price">R$ ${card.price.toFixed(2)}</div>
                    <button class="btn btn-primary btn-full buy-scratch-btn" data-id="${card.id}">
                        Comprar Raspadinha
                    </button>
                </div>
            </div>
        `).join('');

        // Vincular eventos de compra
        scratchGrid.querySelectorAll('.buy-scratch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cardId = e.target.dataset.id;
                const card = scratchCards.find(c => c.id == cardId);
                ScratchSystem.openScratchModal(card);
            });
        });
    },

    // Abrir modal da raspadinha
    openScratchModal: (card) => {
        if (!AppState.isAuthenticated) {
            ModalManager.open('login-modal');
            return;
        }

        ScratchSystem.currentScratch = card;
        ScratchSystem.isPrizeRevealed = false;
        ScratchSystem.isProcessing = false;
        ModalManager.open('scratch-modal');
        ScratchSystem.initializeScratch();
    },

    // Inicializar raspadinha
    initializeScratch: () => {
        const scratchCard = document.getElementById('scratch-card');
        const scratchSurface = document.getElementById('scratch-surface');
        
        if (!scratchCard || !scratchSurface) return;

        // Criar canvas para raspagem
        ScratchSystem.createScratchCanvas(scratchSurface);
        
        // Resetar estado
        ScratchSystem.scratchedPixels = 0;
        ScratchSystem.isScratching = false;
        ScratchSystem.isPrizeRevealed = false;
        
        // Mostrar instruções
        scratchSurface.style.display = 'block';
        document.getElementById('scratch-result').style.display = 'none';
        document.getElementById('buy-scratch-btn').style.display = 'block';
        document.getElementById('new-scratch-btn').style.display = 'none';
    },

    // Criar canvas da raspadinha
    createScratchCanvas: (container) => {
        // Remover canvas anterior se existir
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        // Criar novo canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar tamanho
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.cursor = 'crosshair';
        
        // Preencher com padrão de raspadinha
        ctx.fillStyle = ScratchSystem.config.scratchColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adicionar padrão
        const pattern = new Image();
        pattern.onload = () => {
            const patternCanvas = document.createElement('canvas');
            const patternCtx = patternCanvas.getContext('2d');
            patternCanvas.width = 20;
            patternCanvas.height = 20;
            patternCtx.drawImage(pattern, 0, 0, 20, 20);
            
            const fillPattern = ctx.createPattern(patternCanvas, 'repeat');
            ctx.fillStyle = fillPattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        pattern.src = ScratchSystem.config.scratchPattern;
        
        // Adicionar ao container
        container.appendChild(canvas);
        
        // Armazenar referências
        ScratchSystem.scratchCanvas = canvas;
        ScratchSystem.scratchContext = ctx;
        ScratchSystem.totalPixels = canvas.width * canvas.height;
        
        // Vincular eventos do canvas
        canvas.addEventListener('mousedown', ScratchSystem.startScratching);
        canvas.addEventListener('mousemove', ScratchSystem.scratch);
        canvas.addEventListener('mouseup', ScratchSystem.stopScratching);
        canvas.addEventListener('mouseleave', ScratchSystem.stopScratching);
        
        // Eventos de toque
        canvas.addEventListener('touchstart', ScratchSystem.startScratching);
        canvas.addEventListener('touchmove', ScratchSystem.scratch);
        canvas.addEventListener('touchend', ScratchSystem.stopScratching);
    },

    // Iniciar raspagem
    startScratching: (e) => {
        if (!ScratchSystem.scratchCanvas || ScratchSystem.isPrizeRevealed) return;
        
        ScratchSystem.isScratching = true;
        ScratchSystem.scratch(e);
    },

    // Raspar com animação melhorada
    scratch: (e) => {
        if (!ScratchSystem.isScratching || !ScratchSystem.scratchCanvas || ScratchSystem.isPrizeRevealed) return;
        
        e.preventDefault();
        
        const canvas = ScratchSystem.scratchCanvas;
        const ctx = ScratchSystem.scratchContext;
        const rect = canvas.getBoundingClientRect();
        
        // Obter coordenadas do mouse/toque
        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Calcular posição relativa ao canvas
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);
        
        // Adicionar efeito de partículas para melhor feedback visual
        ScratchSystem.addScratchParticles(ctx, x, y);
        
        // Raspar área circular com gradiente para efeito mais realista
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        
        // Criar gradiente radial para efeito de raspagem mais suave
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, ScratchSystem.config.scratchRadius);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(0.7, 'rgba(0,0,0,0.8)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(x, y, ScratchSystem.config.scratchRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Contar pixels raspados
        ScratchSystem.countScratchedPixels();
        
        // Verificar se terminou
        if (ScratchSystem.scratchedPixels / ScratchSystem.totalPixels >= ScratchSystem.config.scratchThreshold) {
            ScratchSystem.revealPrize();
        }
    },

    // Adicionar partículas de raspagem para feedback visual
    addScratchParticles: (ctx, x, y) => {
        // Criar pequenas partículas que voam ao raspar
        for (let i = 0; i < 3; i++) {
            const particleX = x + (Math.random() - 0.5) * 20;
            const particleY = y + (Math.random() - 0.5) * 20;
            const size = Math.random() * 3 + 1;
            
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    },

    // Parar raspagem
    stopScratching: () => {
        ScratchSystem.isScratching = false;
    },

    // Contar pixels raspados
    countScratchedPixels: () => {
        if (!ScratchSystem.scratchCanvas) return;
        
        const canvas = ScratchSystem.scratchCanvas;
        const ctx = ScratchSystem.scratchContext;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let scratched = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) { // Pixel transparente (raspado)
                scratched++;
            }
        }
        
        ScratchSystem.scratchedPixels = scratched;
    },

    // Revelar prêmio (apenas uma vez)
    revealPrize: () => {
        if (ScratchSystem.isPrizeRevealed || ScratchSystem.isProcessing) return;
        
        ScratchSystem.isPrizeRevealed = true;
        ScratchSystem.isProcessing = true;
        
        // Adicionar efeito de revelação com animação
        ScratchSystem.addRevealAnimation();
        
        // Gerar prêmio aleatório baseado no tipo da raspadinha
        const prize = ScratchSystem.generatePrize();
        
        // Mostrar resultado com delay para a animação
        setTimeout(() => {
            ScratchSystem.showPrizeResult(prize);
        }, 800);
    },

    // Adicionar animação de revelação
    addRevealAnimation: () => {
        const scratchCard = document.getElementById('scratch-card');
        if (!scratchCard) return;
        
        // Adicionar classe de animação
        scratchCard.classList.add('revealing');
        
        // Efeito de brilho
        const glow = document.createElement('div');
        glow.className = 'prize-glow';
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%);
            border-radius: 20px;
            animation: prizeGlow 1s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        scratchCard.appendChild(glow);
        
        // Remover após animação
        setTimeout(() => {
            if (glow.parentElement) {
                glow.remove();
            }
            scratchCard.classList.remove('revealing');
        }, 1000);
    },

    // Mostrar resultado do prêmio
    showPrizeResult: (prize) => {
        const scratchSurface = document.getElementById('scratch-surface');
        const scratchResult = document.getElementById('scratch-result');
        const prizeText = document.getElementById('prize-text');
        const prizeDescription = document.getElementById('prize-description');
        
        if (scratchSurface && scratchResult && prizeText && prizeDescription) {
            scratchSurface.style.display = 'none';
            scratchResult.style.display = 'block';
            
            // Atualizar texto do prêmio com formatação
            prizeText.innerHTML = prize.message;
            prizeDescription.innerHTML = prize.description;
            
            // Mostrar valor do prêmio na área específica
            const prizeValueDisplay = document.getElementById('prize-value-display');
            if (prizeValueDisplay) {
                prizeValueDisplay.style.display = 'block';
                
                let valueHTML = '';
                if (prize.type === 'money') {
                    valueHTML = `
                        <div class="prize-value-money">
                            <div class="prize-amount-large">${prize.formattedValue}</div>
                            <div class="prize-type-label">Prêmio em Dinheiro</div>
                        </div>
                    `;
                } else if (prize.type === 'product') {
                    valueHTML = `
                        <div class="prize-value-product">
                            <div class="prize-product-name">${prize.formattedValue}</div>
                            <div class="prize-product-value">Valor: R$ ${prize.value.toLocaleString('pt-BR')}</div>
                        </div>
                    `;
                } else if (prize.type === 'gift_card') {
                    valueHTML = `
                        <div class="prize-value-gift">
                            <div class="prize-gift-name">${prize.formattedValue}</div>
                            <div class="prize-gift-value">Valor: R$ ${prize.value.toLocaleString('pt-BR')}</div>
                        </div>
                    `;
                } else {
                    valueHTML = `
                        <div class="prize-value-free">
                            <div class="prize-free-name">${prize.formattedValue}</div>
                            <div class="prize-free-desc">Use quando quiser!</div>
                        </div>
                    `;
                }
                
                prizeValueDisplay.innerHTML = valueHTML;
            }
            
            // Mostrar botões de ação
            document.getElementById('buy-scratch-btn').style.display = 'none';
            document.getElementById('new-scratch-btn').style.display = 'block';
            
            // Salvar prêmio no estado
            ScratchSystem.currentScratch.prize = prize;
            
            // Mostrar notificação com valor real
            ScratchSystem.showPrizeNotification(prize);
        }
        
        ScratchSystem.isProcessing = false;
    },

    // Gerar prêmio com valores reais
    generatePrize: () => {
        const card = ScratchSystem.currentScratch;
        
        // Definir faixas de prêmios baseadas no preço da carta
        let prizeRanges;
        
        if (card.price >= 50) {
            // Carta Especial (R$ 50) - Prêmios maiores
            prizeRanges = {
                money: { min: 100, max: 5000, probability: 0.4 },
                product: { min: 200, max: 3000, probability: 0.3 },
                gift_card: { min: 100, max: 1000, probability: 0.2 },
                free_scratch: { probability: 0.1 }
            };
        } else if (card.price >= 20) {
            // Carta Mega (R$ 20) - Prêmios médios
            prizeRanges = {
                money: { min: 50, max: 1000, probability: 0.5 },
                product: { min: 100, max: 1500, probability: 0.3 },
                gift_card: { min: 50, max: 500, probability: 0.2 }
            };
        } else if (card.price >= 10) {
            // Carta Premium (R$ 10) - Prêmios pequenos
            prizeRanges = {
                money: { min: 10, max: 500, probability: 0.6 },
                product: { min: 50, max: 800, probability: 0.3 },
                gift_card: { min: 25, max: 300, probability: 0.1 }
            };
        } else {
            // Carta Clássica (R$ 5) - Prêmios básicos
            prizeRanges = {
                money: { min: 1, max: 100, probability: 0.7 },
                product: { min: 20, max: 300, probability: 0.2 },
                gift_card: { min: 10, max: 150, probability: 0.1 }
            };
        }
        
        // Selecionar tipo de prêmio baseado na probabilidade
        const random = Math.random();
        let selectedType = 'money';
        let cumulativeProbability = 0;
        
        for (const [type, config] of Object.entries(prizeRanges)) {
            cumulativeProbability += config.probability;
            if (random <= cumulativeProbability) {
                selectedType = type;
                break;
            }
        }
        
        // Gerar prêmio específico
        let prize;
        switch (selectedType) {
            case 'money':
                const moneyValue = Math.floor(Math.random() * 
                    (prizeRanges.money.max - prizeRanges.money.min + 1)) + 
                    prizeRanges.money.min;
                prize = {
                    type: 'money',
                    message: `🎉 PARABÉNS! Você ganhou R$ ${moneyValue.toLocaleString('pt-BR')}!`,
                    description: `Seu prêmio de R$ ${moneyValue.toLocaleString('pt-BR')} será creditado em sua conta.`,
                    value: moneyValue,
                    formattedValue: `R$ ${moneyValue.toLocaleString('pt-BR')}`
                };
                break;
                
            case 'product':
                const productValue = Math.floor(Math.random() * 
                    (prizeRanges.product.max - prizeRanges.product.min + 1)) + 
                    prizeRanges.product.min;
                const products = [
                    'Smartphone Premium',
                    'Fone de Ouvido Bluetooth',
                    'Smartwatch',
                    'Tablet',
                    'Console de Videogame',
                    'Notebook',
                    'Câmera Digital',
                    'Drone'
                ];
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                prize = {
                    type: 'product',
                    message: `🎁 INCRÍVEL! Você ganhou um ${randomProduct}!`,
                    description: `Produto no valor de R$ ${productValue.toLocaleString('pt-BR')}. Entraremos em contato para entrega.`,
                    value: productValue,
                    formattedValue: randomProduct
                };
                break;
                
            case 'gift_card':
                const giftValue = Math.floor(Math.random() * 
                    (prizeRanges.gift_card.max - prizeRanges.gift_card.min + 1)) + 
                    prizeRanges.gift_card.min;
                const stores = [
                    'Amazon',
                    'Magazine Luiza',
                    'Americanas',
                    'Casas Bahia',
                    'Ricardo Eletro',
                    'Fast Shop',
                    'Submarino',
                    'Extra'
                ];
                const randomStore = stores[Math.floor(Math.random() * stores.length)];
                prize = {
                    type: 'gift_card',
                    message: `🎫 SUCESSO! Você ganhou um Vale-Presente da ${randomStore}!`,
                    description: `Vale no valor de R$ ${giftValue.toLocaleString('pt-BR')} para usar na ${randomStore}.`,
                    value: giftValue,
                    formattedValue: `Vale ${randomStore} - R$ ${giftValue.toLocaleString('pt-BR')}`
                };
                break;
                
            case 'free_scratch':
                prize = {
                    type: 'free_scratch',
                    message: '🎯 BOA! Você ganhou uma Raspadinha Grátis!',
                    description: 'Use quando quiser para tentar ganhar mais prêmios.',
                    value: 0,
                    formattedValue: 'Raspadinha Grátis'
                };
                break;
                
            default:
                prize = {
                    type: 'money',
                    message: '🎉 PARABÉNS! Você ganhou R$ 50!',
                    description: 'Seu prêmio será creditado em sua conta.',
                    value: 50,
                    formattedValue: 'R$ 50,00'
                };
        }
        
        // Adicionar informações da carta
        prize.cardType = card.name;
        prize.cardPrice = card.price;
        
        return prize;
    },

    // Mostrar notificação de prêmio
    showPrizeNotification: (prize) => {
        // Criar notificação personalizada
        const notification = document.createElement('div');
        notification.className = 'prize-notification';
        
        // Definir cor baseada no tipo de prêmio
        let bgColor, icon;
        switch (prize.type) {
            case 'money':
                bgColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                icon = '💰';
                break;
            case 'product':
                bgColor = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                icon = '🎁';
                break;
            case 'gift_card':
                bgColor = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
                icon = '🎫';
                break;
            case 'free_scratch':
                bgColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                icon = '🎯';
                break;
            default:
                bgColor = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
                icon = '🎉';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${bgColor};
            color: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            animation: prizeNotification 0.5s ease-out;
            border: 3px solid rgba(255, 255, 255, 0.2);
        `;
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="prize-icon-large">${icon}</div>
                <button class="notification-close-btn" onclick="this.closest('.prize-notification').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <h3 style="margin: 1rem 0; font-size: 1.5rem; font-weight: 700;">${prize.message}</h3>
            <p style="margin-bottom: 1.5rem; opacity: 0.9; line-height: 1.6;">${prize.description}</p>
            <div class="prize-details" style="background: rgba(255, 255, 255, 0.2); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">${prize.formattedValue}</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Carta: ${prize.cardType} (R$ ${prize.cardPrice.toFixed(2).replace('.', ',')})</div>
            </div>
            <button onclick="this.closest('.prize-notification').remove()" style="
                background: white;
                color: #374151;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 1rem;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🎉 Continuar Jogando!
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover após 10 segundos
        setTimeout(() => {
            if (notification && notification.parentElement) {
                notification.remove();
            }
        }, 10000);
        
        // Adicionar evento de clique para fechar
        notification.addEventListener('click', (e) => {
            if (e.target === notification) {
                notification.remove();
            }
        });
    },

    // Comprar nova raspadinha via API
    buyNewScratch: async () => {
        if (!ScratchSystem.currentScratch || ScratchSystem.isProcessing) return;
        
        ScratchSystem.isProcessing = true;
        
        try {
            // Verificar se o usuário está autenticado
            if (!AppState.isAuthenticated) {
                Utils.showNotification('Você precisa estar logado para comprar raspadinhas!', 'error');
                return;
            }

            // Verificar saldo
            if (AppState.userBalance < ScratchSystem.currentScratch.price) {
                Utils.showNotification('Saldo insuficiente para comprar esta raspadinha!', 'error');
                return;
            }

            // Fazer requisição para a API
            const response = await fetch('/api/scratch/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    scratchType: ScratchSystem.currentScratch.name,
                    price: ScratchSystem.currentScratch.price
                })
            });

            const result = await response.json();

            if (result.success) {
                // Atualizar saldo do usuário
                AppState.userBalance = result.newBalance;
                
                // Atualizar saldo no usuário atual
                if (AppState.currentUser) {
                    AppState.currentUser.balance = result.newBalance;
                    localStorage.setItem('current_user', JSON.stringify(AppState.currentUser));
                }
                
                // Atualizar saldo no localStorage
                localStorage.setItem('user_balance', result.newBalance.toString());
                
                // Atualizar UI
                if (typeof App !== 'undefined' && App.updateUI) {
                    App.updateUI();
                }
                
                // Mostrar notificação de sucesso
                Utils.showNotification('Raspadinha comprada com sucesso!', 'success');
                
                // Resetar para nova raspadinha
                ScratchSystem.resetScratch();
            } else {
                Utils.showNotification(result.message || 'Erro ao comprar raspadinha!', 'error');
            }
        } catch (error) {
            console.error('Erro ao comprar raspadinha:', error);
            Utils.showNotification('Erro ao comprar raspadinha. Tente novamente!', 'error');
        } finally {
            ScratchSystem.isProcessing = false;
        }
    },

    // Resetar raspadinha
    resetScratch: () => {
        ScratchSystem.initializeScratch();
    },

    // Resgatar prêmio
    claimPrize: () => {
        if (!ScratchSystem.currentScratch || !ScratchSystem.currentScratch.prize || ScratchSystem.isProcessing) return;
        
        ScratchSystem.isProcessing = true;
        
        const prize = ScratchSystem.currentScratch.prize;
        
        // Mostrar notificação de resgate
        let message;
        if (prize.type === 'money') {
            message = `🎉 Prêmio de ${prize.formattedValue} resgatado com sucesso! Será creditado em sua conta.`;
        } else if (prize.type === 'product') {
            message = `🎁 Produto ${prize.formattedValue} resgatado! Entraremos em contato para entrega.`;
        } else if (prize.type === 'gift_card') {
            message = `🎫 Vale-presente ${prize.formattedValue} resgatado! Verifique seu email.`;
        } else {
            message = `🎯 ${prize.formattedValue} resgatado! Use quando quiser.`;
        }
        
        Utils.showNotification(message, 'success');
        
        // Fechar modal
        ModalManager.close('scratch-modal');
        
        // Limpar estado
        ScratchSystem.currentScratch = null;
        ScratchSystem.isPrizeRevealed = false;
        
        ScratchSystem.isProcessing = false;
    }
};

// Inicializar sistema quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    ScratchSystem.init();
});

// Exportar para uso global
window.ScratchSystem = ScratchSystem;
