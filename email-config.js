// ===== CONFIGURAÇÃO DO SISTEMA DE EMAIL =====

const EMAIL_CONFIG = {
    // Configurações SMTP (exemplo com Gmail)
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'seu-email@gmail.com', // Substitua pelo seu email
            pass: 'sua-senha-app' // Substitua pela sua senha de app
        }
    },
    
    // Configurações do remetente
    from: {
        name: 'Lr4.bet - Verificação de Conta',
        email: 'noreply@lr4.bet'
    },
    
    // Assunto dos emails
    subjects: {
        verification: 'Confirme seu email - Lr4.bet',
        welcome: 'Bem-vindo ao Lr4.bet!'
    }
};

// Template do email de verificação
function getVerificationEmailTemplate(userName, verificationCode) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Email - Lr4.bet</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #3b82f6;
                margin-bottom: 10px;
            }
            .verification-code {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                margin: 30px 0;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Lr4.bet</div>
                <h2>Verificação de Email</h2>
            </div>
            
            <p>Olá <strong>${userName}</strong>,</p>
            
            <p>Obrigado por se cadastrar no Lr4.bet! Para ativar sua conta, você precisa verificar seu endereço de email.</p>
            
            <div class="verification-code">
                ${verificationCode}
            </div>
            
            <p>Digite este código no campo de verificação do site para confirmar seu email.</p>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Este código expira em 15 minutos. Se você não solicitou este cadastro, ignore este email.
            </div>
            
            <p>Se você tiver alguma dúvida, entre em contato com nosso suporte.</p>
            
            <div class="footer">
                <p>&copy; 2024 Lr4.bet. Todos os direitos reservados.</p>
                <p>Jogue com responsabilidade. Apostas são permitidas apenas para maiores de 18 anos.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Template do email de boas-vindas
function getWelcomeEmailTemplate(userName) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Lr4.bet!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #3b82f6;
                margin-bottom: 10px;
            }
            .welcome-message {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 30px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b35, #f7931e);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Lr4.bet</div>
                <h2>Bem-vindo!</h2>
            </div>
            
            <div class="welcome-message">
                <h3>🎉 Parabéns, ${userName}!</h3>
                <p>Sua conta foi verificada com sucesso!</p>
            </div>
            
            <p>Sua conta no Lr4.bet está agora ativa e você pode:</p>
            
            <ul>
                <li>🎮 Jogar todos os jogos disponíveis</li>
                <li>⚽ Fazer apostas esportivas</li>
                <li>💰 Depositar e sacar fundos</li>
                <li>🎁 Participar de promoções exclusivas</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="http://localhost:8000/br4-clone.html" class="cta-button">
                    Começar a Jogar
                </a>
            </p>
            
            <p>Se você tiver alguma dúvida, nossa equipe de suporte está sempre pronta para ajudar.</p>
            
            <div class="footer">
                <p>&copy; 2024 Lr4.bet. Todos os direitos reservados.</p>
                <p>Jogue com responsabilidade. Apostas são permitidas apenas para maiores de 18 anos.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAIL_CONFIG, getVerificationEmailTemplate, getWelcomeEmailTemplate };
} else if (typeof window !== 'undefined') {
    window.EMAIL_CONFIG = EMAIL_CONFIG;
    window.getVerificationEmailTemplate = getVerificationEmailTemplate;
    window.getWelcomeEmailTemplate = getWelcomeEmailTemplate;
}
