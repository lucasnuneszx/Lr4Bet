// ===== SISTEMA DE VERIFICAÇÃO DE EMAIL =====

class EmailVerificationSystem {
    constructor() {
        this.verificationCodes = new Map(); // Armazenar códigos temporariamente
        this.codeExpiration = 15 * 60 * 1000; // 15 minutos em millisegundos
        this.init();
    }

    init() {
        // Limpar códigos expirados a cada minuto
        setInterval(() => this.cleanExpiredCodes(), 60000);
    }

    // Gerar código de verificação de 6 dígitos
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Armazenar código de verificação
    storeVerificationCode(email, code) {
        const expirationTime = Date.now() + this.codeExpiration;
        this.verificationCodes.set(email, {
            code: code,
            expiresAt: expirationTime,
            attempts: 0
        });
    }

    // Verificar código
    verifyCode(email, code) {
        const storedData = this.verificationCodes.get(email);
        
        if (!storedData) {
            return { valid: false, message: 'Código expirado ou não encontrado.' };
        }

        if (Date.now() > storedData.expiresAt) {
            this.verificationCodes.delete(email);
            return { valid: false, message: 'Código expirado. Solicite um novo.' };
        }

        if (storedData.attempts >= 3) {
            this.verificationCodes.delete(email);
            return { valid: false, message: 'Muitas tentativas. Solicite um novo código.' };
        }

        if (storedData.code === code) {
            this.verificationCodes.delete(email);
            return { valid: true, message: 'Código verificado com sucesso!' };
        } else {
            storedData.attempts++;
            return { valid: false, message: 'Código incorreto. Tentativas restantes: ' + (3 - storedData.attempts) };
        }
    }

    // Limpar códigos expirados
    cleanExpiredCodes() {
        const now = Date.now();
        for (const [email, data] of this.verificationCodes.entries()) {
            if (now > data.expiresAt) {
                this.verificationCodes.delete(email);
            }
        }
    }

    // Simular envio de email (em produção, integrar com serviço real)
    async sendVerificationEmail(email, userName, code) {
        try {
            // Simular delay de envio
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Em produção, usar biblioteca como nodemailer
            console.log('📧 Email de verificação enviado para:', email);
            console.log('🔐 Código de verificação:', code);
            console.log('👤 Nome do usuário:', userName);
            
            // Armazenar código para verificação
            this.storeVerificationCode(email, code);
            
            return { success: true, message: 'Email de verificação enviado com sucesso!' };
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            return { success: false, message: 'Erro ao enviar email. Tente novamente.' };
        }
    }

    // Simular envio de email de boas-vindas
    async sendWelcomeEmail(email, userName) {
        try {
            // Simular delay de envio
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🎉 Email de boas-vindas enviado para:', email);
            console.log('👤 Nome do usuário:', userName);
            
            return { success: true, message: 'Email de boas-vindas enviado!' };
        } catch (error) {
            console.error('❌ Erro ao enviar email de boas-vindas:', error);
            return { success: false, message: 'Erro ao enviar email de boas-vindas.' };
        }
    }

    // Reenviar código de verificação
    async resendVerificationCode(email, userName) {
        // Remover código anterior se existir
        this.verificationCodes.delete(email);
        
        // Gerar novo código
        const newCode = this.generateVerificationCode();
        
        // Enviar novo email
        return await this.sendVerificationEmail(email, userName, newCode);
    }
}

// Instância global do sistema
const emailVerification = new EmailVerificationSystem();

// Funções globais para uso nos modais
window.sendVerificationEmail = (email, userName) => {
    const code = emailVerification.generateVerificationCode();
    return emailVerification.sendVerificationEmail(email, userName, code);
};

window.verifyEmailCode = (email, code) => {
    return emailVerification.verifyCode(email, code);
};

window.resendVerificationCode = (email, userName) => {
    return emailVerification.resendVerificationCode(email, userName);
};

window.sendWelcomeEmail = (email, userName) => {
    return emailVerification.sendWelcomeEmail(email, userName);
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailVerificationSystem;
} else if (typeof window !== 'undefined') {
    window.EmailVerificationSystem = EmailVerificationSystem;
}
