// ===== SISTEMA DE PAGAMENTOS LR4.BET =====
console.log('💳 Payment System carregado!');

let currentPaymentAmount = 0;
let currentPaymentDescription = '';
let currentPaymentId = null;
let paymentStatusInterval = null;

function openPaymentModal(amount, description) {
    console.log(`💰 Abrindo modal de pagamento para: R$ ${amount.toFixed(2)} - ${description}`);
    currentPaymentAmount = amount;
    currentPaymentDescription = description;
    currentPaymentId = null;

    const modal = document.getElementById('paymentModal');
    if (!modal) {
        console.error('❌ Modal de pagamento não encontrado!');
        return;
    }

    document.getElementById('paymentAmountDisplay').textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
    document.getElementById('paymentDescriptionDisplay').textContent = description;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    showPaymentMethodSelection();
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Limpar interval de verificação de status
    if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
        paymentStatusInterval = null;
    }
}

function showPaymentMethodSelection() {
    const content = document.getElementById('paymentModalContent');
    if (!content) return;

    content.innerHTML = `
        <div class="payment-header">
            <h2>💳 Escolha a forma de pagamento</h2>
            <button class="close-btn" onclick="closePaymentModal()">×</button>
        </div>
        
        <div class="payment-info">
            <div class="payment-amount">
                <span class="amount-label">Valor:</span>
                <span class="amount-value" id="paymentAmountDisplay">R$ ${currentPaymentAmount.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="payment-description">
                <span class="description-label">Descrição:</span>
                <span class="description-value" id="paymentDescriptionDisplay">${currentPaymentDescription}</span>
            </div>
        </div>

        <div class="payment-methods">
            <div class="method-card active" onclick="selectPaymentMethod('pix')">
                <div class="method-icon">🏦</div>
                <div class="method-info">
                    <h3>PIX</h3>
                    <p>Pagamento instantâneo</p>
                    <span class="method-fee">Taxa: 0,99%</span>
                </div>
                <div class="method-arrow">→</div>
            </div>
        </div>

        <div class="payment-actions">
            <button class="btn-cancel" onclick="closePaymentModal()">Cancelar</button>
        </div>
    `;
}

function selectPaymentMethod(method) {
    console.log(`🎯 Método selecionado: ${method}`);
    
    if (method === 'pix') {
        processPixPayment();
    }
}

async function processPixPayment() {
    const content = document.getElementById('paymentModalContent');
    if (!content) return;

    // Mostrar loading
    content.innerHTML = `
        <div class="payment-header">
            <h2>🏦 Processando PIX</h2>
            <button class="close-btn" onclick="closePaymentModal()">×</button>
        </div>
        
        <div class="payment-loading">
            <div class="loading-spinner"></div>
            <p>Criando pagamento PIX...</p>
        </div>
    `;

    try {
        // Verificar se a integração PayGate está disponível
        if (typeof window.createPixPayment !== 'function') {
            throw new Error('Integração PayGate não disponível');
        }

        // Criar pagamento PIX
        const result = await window.createPixPayment(
            currentPaymentAmount,
            currentPaymentDescription,
            {
                name: 'Cliente LR4.bet',
                email: 'cliente@lr4.bet',
                document: '00000000000'
            }
        );

        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar pagamento PIX');
        }

        currentPaymentId = result.paymentId;
        showPixPaymentDetails(result);

        // Iniciar verificação de status
        startPaymentStatusCheck();

    } catch (error) {
        console.error('❌ Erro ao processar PIX:', error);
        showPaymentError(error.message);
    }
}

function showPixPaymentDetails(paymentData) {
    const content = document.getElementById('paymentModalContent');
    if (!content) return;

    content.innerHTML = `
        <div class="payment-header">
            <h2>🏦 Pagamento PIX</h2>
            <button class="close-btn" onclick="closePaymentModal()">×</button>
        </div>
        
        <div class="pix-payment-details">
            <div class="pix-info">
                <div class="pix-amount">
                    <span class="amount-label">Valor:</span>
                    <span class="amount-value">R$ ${paymentData.amount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="pix-description">
                    <span class="description-label">Descrição:</span>
                    <span class="description-value">${currentPaymentDescription}</span>
                </div>
            </div>

            <div class="pix-qr-section">
                <h3>📱 Escaneie o QR Code</h3>
                <div class="qr-code-container">
                    <div class="qr-code" id="pixQrCode">
                        ${paymentData.qrCode ? `<img src="${paymentData.qrCode}" alt="QR Code PIX" />` : 'QR Code não disponível'}
                    </div>
                </div>
                
                <div class="pix-copy-section">
                    <h4>📋 Ou copie o código PIX:</h4>
                    <div class="pix-copy-container">
                        <input type="text" id="pixCode" value="${paymentData.qrCodeText || ''}" readonly />
                        <button class="btn-copy" onclick="copyPixCode()">Copiar</button>
                    </div>
                </div>
            </div>

            <div class="pix-status">
                <div class="status-indicator pending">
                    <div class="status-dot"></div>
                    <span>Aguardando pagamento...</span>
                </div>
                <p class="status-message">Após o pagamento, você será notificado automaticamente.</p>
            </div>

            <div class="payment-actions">
                <button class="btn-cancel" onclick="closePaymentModal()">Cancelar</button>
                <button class="btn-check" onclick="checkPaymentStatus()">Verificar Status</button>
            </div>
        </div>
    `;
}

function copyPixCode() {
    const pixCodeInput = document.getElementById('pixCode');
    if (pixCodeInput) {
        pixCodeInput.select();
        document.execCommand('copy');
        
        // Mostrar feedback visual
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

async function checkPaymentStatus() {
    if (!currentPaymentId) return;

    try {
        const result = await window.getPaymentStatus(currentPaymentId);
        
        if (!result.success) {
            throw new Error(result.error || 'Erro ao consultar status');
        }

        updatePaymentStatus(result);

    } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        showPaymentError('Erro ao verificar status do pagamento');
    }
}

function updatePaymentStatus(statusData) {
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
        statusMessage.textContent = 'Seu pagamento foi processado com sucesso!';
        
        // Parar verificação automática
        if (paymentStatusInterval) {
            clearInterval(paymentStatusInterval);
            paymentStatusInterval = null;
        }
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
            closePaymentModal();
            // Aqui você pode adicionar lógica para creditar o saldo
            alert('Pagamento aprovado! Saldo creditado com sucesso!');
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

function startPaymentStatusCheck() {
    // Verificar status a cada 5 segundos
    paymentStatusInterval = setInterval(() => {
        checkPaymentStatus();
    }, 5000);
}

function showPaymentError(message) {
    const content = document.getElementById('paymentModalContent');
    if (!content) return;

    content.innerHTML = `
        <div class="payment-header">
            <h2>❌ Erro no Pagamento</h2>
            <button class="close-btn" onclick="closePaymentModal()">×</button>
        </div>
        
        <div class="payment-error">
            <div class="error-icon">⚠️</div>
            <h3>Erro ao processar pagamento</h3>
            <p>${message}</p>
            
            <div class="payment-actions">
                <button class="btn-retry" onclick="showPaymentMethodSelection()">Tentar Novamente</button>
                <button class="btn-cancel" onclick="closePaymentModal()">Cancelar</button>
            </div>
        </div>
    `;
}

// Função para simular pagamento (fallback se PayGate não estiver disponível)
function simulatePayment() {
    const content = document.getElementById('paymentModalContent');
    if (!content) return;

    content.innerHTML = `
        <div class="payment-header">
            <h2>🏦 Simulação PIX</h2>
            <button class="close-btn" onclick="closePaymentModal()">×</button>
        </div>
        
        <div class="simulation-notice">
            <div class="notice-icon">⚠️</div>
            <h3>Modo Simulação</h3>
            <p>A integração PayGate não está disponível. Este é um modo de demonstração.</p>
            
            <div class="simulation-actions">
                <button class="btn-simulate" onclick="simulatePaymentSuccess()">Simular Pagamento Aprovado</button>
                <button class="btn-cancel" onclick="closePaymentModal()">Cancelar</button>
            </div>
        </div>
    `;
}

function simulatePaymentSuccess() {
    alert('Pagamento simulado com sucesso! Saldo creditado!');
    closePaymentModal();
}

// Verificar se PayGate está disponível ao carregar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof window.paygateIntegration === 'undefined') {
            console.warn('⚠️ PayGate Integration não disponível, usando modo simulação');
        } else {
            console.log('✅ PayGate Integration disponível');
        }
    }, 1000);
});

console.log('🎯 Payment System pronto!');