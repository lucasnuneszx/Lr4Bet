// ===== SISTEMA DE DEPÓSITO LR4.BET - PAYGATE INTEGRATION =====
console.log('💰 Deposit System carregado!');

class DepositSystem {
    constructor() {
        this.currentStep = 'amount';
        this.currentPaymentId = null;
        this.paymentStatusInterval = null;
        this.depositData = {
            amount: 0,
            description: '',
            customerData: {}
        };
        this.init();
    }

    init() {
        console.log('🚀 Inicializando sistema de depósito...');
    }

    // Abrir modal de depósito
    openDepositModal() {
        console.log('💰 Abrindo modal de depósito...');
        this.currentStep = 'amount';
        this.depositData = { amount: 0, description: '', customerData: {} };
        
        const modal = document.getElementById('depositModal');
        if (!modal) {
            console.error('❌ Modal de depósito não encontrado!');
            return;
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.showAmountSelection();
    }

    // Fechar modal de depósito
    closeDepositModal() {
        const modal = document.getElementById('depositModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Limpar interval de verificação de status
        if (this.paymentStatusInterval) {
            clearInterval(this.paymentStatusInterval);
            this.paymentStatusInterval = null;
        }
    }

    // Mostrar seleção de valor
    showAmountSelection() {
        const body = document.getElementById('depositBody');
        if (!body) return;

        body.innerHTML = `
            <div class="deposit-step amount-selection">
                <div class="step-header">
                    <div class="step-number">1</div>
                    <h3>Escolha o valor do depósito</h3>
                    <p>Selecione um valor ou digite um valor personalizado</p>
                </div>

                <div class="amount-options">
                    <div class="amount-grid">
                        <button class="amount-btn" onclick="depositSystem.selectAmount(20)">
                            <span class="amount-value">R$ 20,00</span>
                            <span class="amount-bonus">+ R$ 2,00 bônus</span>
                        </button>
                        <button class="amount-btn" onclick="depositSystem.selectAmount(50)">
                            <span class="amount-value">R$ 50,00</span>
                            <span class="amount-bonus">+ R$ 5,00 bônus</span>
                        </button>
                        <button class="amount-btn" onclick="depositSystem.selectAmount(100)">
                            <span class="amount-value">R$ 100,00</span>
                            <span class="amount-bonus">+ R$ 10,00 bônus</span>
                        </button>
                        <button class="amount-btn" onclick="depositSystem.selectAmount(200)">
                            <span class="amount-value">R$ 200,00</span>
                            <span class="amount-bonus">+ R$ 20,00 bônus</span>
                        </button>
                        <button class="amount-btn" onclick="depositSystem.selectAmount(500)">
                            <span class="amount-value">R$ 500,00</span>
                            <span class="amount-bonus">+ R$ 50,00 bônus</span>
                        </button>
                        <button class="amount-btn" onclick="depositSystem.selectAmount(1000)">
                            <span class="amount-value">R$ 1.000,00</span>
                            <span class="amount-bonus">+ R$ 100,00 bônus</span>
                        </button>
                    </div>

                    <div class="custom-amount">
                        <div class="custom-amount-header">
                            <h4>💰 Valor personalizado</h4>
                            <p>Digite o valor desejado (mínimo R$ 10,00)</p>
                        </div>
                        <div class="custom-amount-input">
                            <span class="currency-symbol">R$</span>
                            <input type="number" id="customAmount" placeholder="0,00" min="10" step="0.01">
                            <button class="btn-custom" onclick="depositSystem.useCustomAmount()">Usar</button>
                        </div>
                    </div>
                </div>

                <div class="deposit-info">
                    <div class="info-card">
                        <i class="fas fa-gift"></i>
                        <div class="info-content">
                            <h4>🎁 Bônus de Depósito</h4>
                            <p>Ganhe 10% de bônus em todos os depósitos!</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-bolt"></i>
                        <div class="info-content">
                            <h4>⚡ PIX Instantâneo</h4>
                            <p>Depósitos via PIX são creditados instantaneamente</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-shield-alt"></i>
                        <div class="info-content">
                            <h4>🔒 100% Seguro</h4>
                            <p>Todas as transações são criptografadas e seguras</p>
                        </div>
                    </div>
                </div>

                <div class="deposit-actions">
                    <button class="btn-cancel" onclick="depositSystem.closeDepositModal()">Cancelar</button>
                </div>
            </div>
        `;
    }

    // Selecionar valor
    selectAmount(amount) {
        console.log(`💰 Valor selecionado: R$ ${amount.toFixed(2)}`);
        this.depositData.amount = amount;
        this.depositData.description = `Depósito LR4.bet - R$ ${amount.toFixed(2).replace('.', ',')}`;
        this.showPaymentMethod();
    }

    // Usar valor personalizado
    useCustomAmount() {
        const customInput = document.getElementById('customAmount');
        if (!customInput) return;

        const amount = parseFloat(customInput.value);
        if (!amount || amount < 10) {
            alert('⚠️ Valor mínimo: R$ 10,00');
            return;
        }

        this.selectAmount(amount);
    }

    // Mostrar método de pagamento
    showPaymentMethod() {
        const body = document.getElementById('depositBody');
        if (!body) return;

        const bonus = this.depositData.amount * 0.1;
        const total = this.depositData.amount + bonus;

        body.innerHTML = `
            <div class="deposit-step payment-method">
                <div class="step-header">
                    <div class="step-number">2</div>
                    <h3>Método de pagamento</h3>
                    <p>Escolha como deseja fazer o depósito</p>
                </div>

                <div class="deposit-summary">
                    <div class="summary-card">
                        <div class="summary-item">
                            <span class="label">Valor do depósito:</span>
                            <span class="value">R$ ${this.depositData.amount.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="summary-item bonus">
                            <span class="label">Bônus (10%):</span>
                            <span class="value">+ R$ ${bonus.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="summary-item total">
                            <span class="label">Total creditado:</span>
                            <span class="value">R$ ${total.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                </div>

                <div class="payment-methods">
                    <div class="method-card active" onclick="depositSystem.selectPaymentMethod('pix')">
                        <div class="method-icon">🏦</div>
                        <div class="method-info">
                            <h4>PIX</h4>
                            <p>Pagamento instantâneo</p>
                            <span class="method-features">• Instantâneo • Sem taxa • QR Code</span>
                        </div>
                        <div class="method-arrow">→</div>
                    </div>
                </div>

                <div class="deposit-actions">
                    <button class="btn-back" onclick="depositSystem.showAmountSelection()">← Voltar</button>
                    <button class="btn-cancel" onclick="depositSystem.closeDepositModal()">Cancelar</button>
                </div>
            </div>
        `;
    }

    // Selecionar método de pagamento
    selectPaymentMethod(method) {
        console.log(`💳 Método selecionado: ${method}`);
        
        if (method === 'pix') {
            this.processPixDeposit();
        }
    }

    // Processar depósito PIX
    async processPixDeposit() {
        const body = document.getElementById('depositBody');
        if (!body) return;

        // Mostrar loading
        body.innerHTML = `
            <div class="deposit-step processing">
                <div class="step-header">
                    <div class="step-number">3</div>
                    <h3>Processando depósito</h3>
                    <p>Aguarde enquanto criamos seu pagamento PIX...</p>
                </div>

                <div class="processing-content">
                    <div class="loading-spinner"></div>
                    <div class="processing-steps">
                        <div class="step active">
                            <i class="fas fa-check"></i>
                            <span>Validando dados</span>
                        </div>
                        <div class="step active">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Criando pagamento PIX</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-clock"></i>
                            <span>Gerando QR Code</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Verificar se precisa coletar dados do cliente (apenas para valores >= R$ 500)
        if (this.depositData.amount >= 500) {
            // Fechar modal de depósito e mostrar modal de dados do cliente
            this.closeDepositModal();
            
            // Mostrar modal de dados do cliente
            if (window.customerDataSystem) {
                window.customerDataSystem.showCustomerDataModal({
                    amount: this.depositData.amount,
                    description: this.depositData.description
                });
            } else {
                this.showDepositError('Sistema de dados do cliente não disponível');
            }
        } else {
            // Para valores <= R$ 500, processar pagamento diretamente
            this.processPixPaymentDirectly();
        }
    }

    // Processar pagamento PIX diretamente (para valores <= R$ 500)
    async processPixPaymentDirectly() {
        const body = document.getElementById('depositBody');
        if (!body) return;

        // Mostrar loading
        body.innerHTML = `
            <div class="deposit-step processing">
                <div class="step-header">
                    <div class="step-number">3</div>
                    <h3>Processando depósito</h3>
                    <p>Aguarde enquanto criamos seu pagamento PIX...</p>
                </div>

                <div class="processing-content">
                    <div class="loading-spinner"></div>
                    <div class="processing-steps">
                        <div class="step completed">
                            <i class="fas fa-check"></i>
                            <span>Validando dados</span>
                        </div>
                        <div class="step active">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Criando pagamento PIX</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-clock"></i>
                            <span>Gerando QR Code</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        try {
            // Verificar se PayGate está disponível
            if (typeof window.createPixPayment !== 'function') {
                throw new Error('Sistema de pagamentos não disponível');
            }

            // Criar pagamento PIX com dados padrão válidos (para valores < R$ 500)
            const result = await window.createPixPayment(
                this.depositData.amount,
                this.depositData.description,
                {
                    name: 'Cliente LR4.bet',
                    email: 'cliente@lr4.bet',
                    document: '12345678901', // CPF válido
                    phone: '5511987654321' // Telefone no formato internacional
                }
            );

            if (!result.success) {
                throw new Error(result.error || 'Erro ao criar pagamento PIX');
            }

            // Armazenar ID do pagamento
            this.currentPaymentId = result.paymentId;

            // Mostrar QR Code e detalhes
            this.showPixPayment(result);

        } catch (error) {
            console.error('❌ Erro ao processar PIX:', error);
            this.showDepositError(error.message);
        }
    }

    // Mostrar pagamento PIX
    showPixPayment(paymentData) {
        // Se não há modal de depósito aberto, abrir um novo
        const depositModal = document.getElementById('depositModal');
        if (!depositModal || depositModal.style.display === 'none') {
            this.openDepositModal();
        }
        
        const body = document.getElementById('depositBody');
        if (!body) return;

        const bonus = this.depositData.amount * 0.1;
        const total = this.depositData.amount + bonus;

        body.innerHTML = `
            <div class="deposit-step pix-payment">
                <div class="step-header">
                    <div class="step-number">3</div>
                    <h3>Pagamento PIX</h3>
                    <p>Escaneie o QR Code ou copie o código PIX</p>
                    ${paymentData.simulated ? 
                        (paymentData.isRealQR ? 
                            '<div class="simulation-notice">✅ QR Code Real - Funcional para pagamento</div>' : 
                            '<div class="simulation-notice">🎭 Modo Simulação - Para demonstração</div>'
                        ) : ''}
                </div>

                <div class="pix-payment-content">
                    <div class="payment-summary">
                        <div class="summary-card">
                            <div class="summary-item">
                                <span class="label">Valor:</span>
                                <span class="value">R$ ${paymentData.amount.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div class="summary-item bonus">
                                <span class="label">Bônus:</span>
                                <span class="value">+ R$ ${bonus.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div class="summary-item total">
                                <span class="label">Total:</span>
                                <span class="value">R$ ${total.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>

                    <div class="pix-qr-section">
                        <h4>📱 Escaneie o QR Code</h4>
                        <div class="qr-code-container">
                            <div class="qr-code" id="pixQrCode">
                                ${paymentData.qrCode ? `<img src="${paymentData.qrCode}" alt="QR Code PIX" />` : 'QR Code não disponível'}
                            </div>
                        </div>
                        
                        <div class="pix-copy-section">
                            <h4>📋 Ou copie o código PIX:</h4>
                            <div class="pix-copy-container">
                                <input type="text" id="pixCode" value="${paymentData.qrCodeText || ''}" readonly />
                                <button class="btn-copy" onclick="depositSystem.copyPixCode()">Copiar</button>
                            </div>
                        </div>
                    </div>

                    <div class="payment-status">
                        <div class="status-indicator pending">
                            <div class="status-dot"></div>
                            <span>Aguardando pagamento...</span>
                        </div>
                        <p class="status-message">Após o pagamento, seu saldo será creditado automaticamente.</p>
                    </div>

                    <div class="deposit-actions">
                        <button class="btn-check" onclick="depositSystem.checkPaymentStatus()">Verificar Status</button>
                        <button class="btn-cancel" onclick="depositSystem.closeDepositModal()">Fechar</button>
                    </div>
                </div>
            </div>
        `;

        // Iniciar verificação automática
        this.startPaymentStatusCheck();
    }

    // Copiar código PIX
    copyPixCode() {
        const pixCodeInput = document.getElementById('pixCode');
        if (pixCodeInput) {
            pixCodeInput.select();
            document.execCommand('copy');
            
            const copyBtn = document.querySelector('.btn-copy');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copiado!';
                copyBtn.style.background = '#10b981';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }
        }
    }

    // Verificar status do pagamento
    async checkPaymentStatus() {
        if (!this.currentPaymentId) return;

        try {
            const result = await window.getPaymentStatus(this.currentPaymentId);
            
            if (!result.success) {
                throw new Error(result.error || 'Erro ao consultar status');
            }

            this.updatePaymentStatus(result);

        } catch (error) {
            console.error('❌ Erro ao verificar status:', error);
            this.showDepositError('Erro ao verificar status do pagamento');
        }
    }

    // Atualizar status do pagamento
    updatePaymentStatus(statusData) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusMessage = document.querySelector('.status-message');
        
        if (!statusIndicator || !statusMessage) return;

        // Limpar classes de status
        statusIndicator.className = 'status-indicator';
        
        if (window.paygateIntegration.isPaymentApproved(statusData.status)) {
            statusIndicator.classList.add('approved');
            statusIndicator.innerHTML = `
                <div class="status-dot"></div>
                <span>✅ Pagamento aprovado!</span>
            `;
            statusMessage.textContent = 'Seu depósito foi processado com sucesso!';
            
            // Parar verificação automática
            if (this.paymentStatusInterval) {
                clearInterval(this.paymentStatusInterval);
                this.paymentStatusInterval = null;
            }
            
            // Creditar saldo
            this.creditBalance();
            
            // Fechar modal após 3 segundos
            setTimeout(() => {
                this.closeDepositModal();
                alert('🎉 Depósito aprovado! Saldo creditado com sucesso!');
            }, 3000);
            
        } else if (window.paygateIntegration.isPaymentCancelled(statusData.status)) {
            statusIndicator.classList.add('cancelled');
            statusIndicator.innerHTML = `
                <div class="status-dot"></div>
                <span>❌ Pagamento cancelado</span>
            `;
            statusMessage.textContent = 'O pagamento foi cancelado ou expirou.';
            
        } else if (window.paygateIntegration.isPaymentPending(statusData.status)) {
            statusIndicator.classList.add('pending');
            statusIndicator.innerHTML = `
                <div class="status-dot"></div>
                <span>⏳ Aguardando pagamento...</span>
            `;
            statusMessage.textContent = 'Aguardando confirmação do pagamento.';
        }
    }

    // Creditar saldo
    creditBalance() {
        const bonus = this.depositData.amount * 0.1;
        const total = this.depositData.amount + bonus;
        
        // Atualizar saldo global
        if (typeof userBalance !== 'undefined') {
            userBalance += total;
            localStorage.setItem('userBalance', userBalance.toString());
            
            // Atualizar display do saldo
            const balanceElement = document.getElementById('userBalance');
            if (balanceElement) {
                balanceElement.textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
            }
        }
        
        console.log(`💰 Saldo creditado: R$ ${total.toFixed(2)} (R$ ${this.depositData.amount.toFixed(2)} + R$ ${bonus.toFixed(2)} bônus)`);
    }

    // Iniciar verificação automática
    startPaymentStatusCheck() {
        // Verificar status a cada 5 segundos
        this.paymentStatusInterval = setInterval(() => {
            this.checkPaymentStatus();
        }, 5000);
    }

    // Mostrar erro
    showDepositError(message) {
        const body = document.getElementById('depositBody');
        if (!body) return;

        body.innerHTML = `
            <div class="deposit-step error">
                <div class="error-content">
                    <div class="error-icon">⚠️</div>
                    <h3>Erro no Depósito</h3>
                    <p>${message}</p>
                    
                    <div class="deposit-actions">
                        <button class="btn-retry" onclick="depositSystem.showAmountSelection()">Tentar Novamente</button>
                        <button class="btn-cancel" onclick="depositSystem.closeDepositModal()">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Instanciar sistema de depósito
const depositSystem = new DepositSystem();

// Funções globais para compatibilidade
window.openDepositModal = function() {
    depositSystem.openDepositModal();
};

window.closeDepositModal = function() {
    depositSystem.closeDepositModal();
};

console.log('🎯 Deposit System pronto!');
