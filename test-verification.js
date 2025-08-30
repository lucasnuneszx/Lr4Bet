// ===== SISTEMA DE TESTE SIMPLIFICADO =====

// Código de verificação global
let currentVerificationCode = '';

// Gerar código de teste
function generateTestCode() {
    currentVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return currentVerificationCode;
}

// Simular envio de email
function simulateEmailVerification(email, userName) {
    const code = generateTestCode();
    
    return {
        success: true,
        message: 'Email enviado com sucesso!',
        code: code
    };
}

// Verificar código
function testVerification(email, code) {
    if (code === currentVerificationCode) {
        return { valid: true, message: 'Código verificado!' };
    } else {
        return { valid: false, message: 'Código incorreto!' };
    }
}

// Reenviar código
function resendTestCode(email, userName) {
    return simulateEmailVerification(email, userName);
}

// Expor funções globalmente
window.simulateEmailVerification = simulateEmailVerification;
window.testVerification = testVerification;
window.resendTestCode = resendTestCode;
window.generateTestCode = generateTestCode;

// Gerar código inicial
generateTestCode();
