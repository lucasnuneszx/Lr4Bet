// Sistema admin master

class AdminSystem {
    constructor() {
        this.isAuthenticated = false;
        this.adminUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
    }

    // Abrir painel admin
    openAdminPanel() {
        this.createAdminPanel();
    }

    // Criar painel admin
    createAdminPanel() {
        // Remover painel existente se houver
        const existingPanel = document.getElementById('adminPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'adminPanel';
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-panel-header">
                    <h2>👑 Dashboard Admin</h2>
                    <button class="btn-admin-close" onclick="adminSystem.closeAdminPanel()">
                        <span>✕</span>
                    </button>
                </div>
                
                <div class="admin-section">
                    <h3>📊 Estatísticas em Tempo Real</h3>
                    <div class="admin-stats">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <span class="stat-number">1,247</span>
                            <span class="stat-label">Usuários Ativos</span>
                            <div class="stat-trend positive">+12% hoje</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">💰</div>
                            <span class="stat-number">R$ 45.2K</span>
                            <span class="stat-label">Receita Hoje</span>
                            <div class="stat-trend positive">+8.5% vs ontem</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🎮</div>
                            <span class="stat-number">89</span>
                            <span class="stat-label">Jogos Online</span>
                            <div class="stat-trend neutral">Estável</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🎯</div>
                            <span class="stat-number">94.2%</span>
                            <span class="stat-label">Taxa de Conversão</span>
                            <div class="stat-trend positive">+2.1%</div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3>⚙️ Controles Administrativos</h3>
                    <div class="admin-controls">
                        <button class="btn-admin-control" onclick="adminSystem.manageUsers()">
                            <span class="control-icon">👥</span>
                            <div class="control-content">
                                <span class="control-title">Gerenciar Usuários</span>
                                <span class="control-desc">Ver, editar e banir usuários</span>
                            </div>
                        </button>
                        <button class="btn-admin-control" onclick="adminSystem.manageGames()">
                            <span class="control-icon">🎮</span>
                            <div class="control-content">
                                <span class="control-title">Gerenciar Jogos</span>
                                <span class="control-desc">Adicionar e configurar jogos</span>
                            </div>
                        </button>
                        <button class="btn-admin-control" onclick="adminSystem.manageCases()">
                            <span class="control-icon">📦</span>
                            <div class="control-content">
                                <span class="control-title">Gerenciar Caixas</span>
                                <span class="control-desc">Configurar probabilidades e prêmios</span>
                            </div>
                        </button>
                        <button class="btn-admin-control" onclick="adminSystem.managePromotions()">
                            <span class="control-icon">🎁</span>
                            <div class="control-content">
                                <span class="control-title">Gerenciar Promoções</span>
                                <span class="control-desc">Criar campanhas promocionais</span>
                            </div>
                        </button>
                        <button class="btn-admin-control" onclick="adminSystem.systemSettings()">
                            <span class="control-icon">⚙️</span>
                            <div class="control-content">
                                <span class="control-title">Configurações</span>
                                <span class="control-desc">Ajustes do sistema</span>
                            </div>
                        </button>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3>🔐 Sessão Administrativa</h3>
                    <div class="session-info">
                        <div class="session-item">
                            <span class="session-label">Usuário:</span>
                            <span class="session-value">${this.adminUser}</span>
                        </div>
                        <div class="session-item">
                            <span class="session-label">Tipo:</span>
                            <span class="session-value admin-badge">Admin Master</span>
                            </div>
                        <div class="session-item">
                            <span class="session-label">Último Login:</span>
                            <span class="session-value">${new Date().toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                    <button class="btn-admin-logout" onclick="adminSystem.logout()">
                        <span>🚪</span>
                        <span>Sair da Sessão</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        
        // Adicionar estilos
        this.addAdminPanelStyles();
    }

    // Adicionar estilos do painel
    addAdminPanelStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .admin-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                animation: adminPanelFadeIn 0.5s ease-out;
                box-sizing: border-box;
                overflow: hidden;
            }
            
            @keyframes adminPanelFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .admin-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2.5rem;
                padding-bottom: 1.5rem;
                border-bottom: 2px solid rgba(59, 130, 246, 0.3);
                position: relative;
                width: 100%;
            }
            
            .admin-panel-header::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2));
                border-radius: 2px;
            }
            
            .admin-panel-header h2 {
                color: #ffffff;
                margin: 0;
                font-size: 2.8rem;
                font-weight: 800;
                text-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
                filter: none;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                letter-spacing: 1px;
            }
            
            .btn-admin-close {
                background: rgba(26, 26, 26, 0.8);
                backdrop-filter: blur(10px);
                color: var(--text-primary);
                border: none;
                padding: 1rem 1.5rem;
                border-radius: 15px;
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: 600;
                transition: all 0.3s ease;
                min-width: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .btn-admin-close:hover {
                background: rgba(231, 76, 60, 0.1);
                border-color: #c0392b;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(231, 76, 60, 0.3);
            }
            
            .admin-panel-content {
                background: rgba(26, 26, 26, 0.9);
                backdrop-filter: blur(20px);
                border: none;
                border-radius: 25px;
                padding: 3rem;
                max-width: 900px;
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
                position: relative;
                margin: 0;
                transform: none;
                left: 0;
                right: 0;
            }
            
            .admin-panel-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
                border-radius: 25px;
                z-index: -1;
                opacity: 0.5;
            }
            
            .admin-section {
                margin-bottom: 2.5rem;
                padding: 2rem;
                background: rgba(26, 26, 26, 0.8);
                backdrop-filter: blur(15px);
                border-radius: 20px;
                border: none;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .admin-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--primary-color), var(--gradient-blue));
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .admin-section:hover::before {
                opacity: 1;
            }
            
            .admin-section:hover {
                border-color: var(--primary-color);
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(59, 130, 246, 0.2);
            }
            
            .admin-section h3 {
                color: #ffffff;
                margin-bottom: 1.5rem;
                font-size: 1.5rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                filter: none;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
            }
            
            .admin-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 1.5rem;
            }
            
            .stat-card {
                background: rgba(26, 26, 26, 0.95);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                border: none;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .stat-card:hover::before {
                opacity: 1;
            }
            
            .stat-card:hover {
                border-color: var(--primary-color);
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
            }
            
            .stat-number {
                display: block;
                font-size: 2.5rem;
                font-weight: 800;
                color: #ffffff;
                margin-bottom: 0.8rem;
                text-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
                filter: none;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .stat-label {
                color: #e5e7eb;
                font-size: 1rem;
                font-weight: 600;
                opacity: 1;
            }
            
            .admin-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 1.5rem;
            }
            
            .btn-admin-control {
                background: rgba(26, 26, 26, 0.8);
                backdrop-filter: blur(15px);
                color: var(--text-primary);
                border: none;
                padding: 1.5rem;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                min-height: 80px;
                position: relative;
                overflow: hidden;
            }
            
            .btn-admin-control::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .btn-admin-control:hover::before {
                left: 100%;
            }
            
            .btn-admin-control:hover {
                background: rgba(59, 130, 246, 0.1);
                border-color: var(--gradient-blue);
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
            }
            
            .btn-admin-logout {
                background: rgba(26, 26, 26, 0.8);
                backdrop-filter: blur(15px);
                color: var(--text-primary);
                border: none;
                padding: 1rem 2rem;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 1.5rem;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1rem;
            }
            
            .btn-admin-logout:hover {
                background: rgba(231, 76, 60, 0.1);
                border-color: #c0392b;
                transform: translateY(-3px);
                box-shadow: 0 12px 30px rgba(231, 76, 60, 0.4);
            }
            
            /* Scrollbar personalizada */
            .admin-panel-content::-webkit-scrollbar {
                width: 12px;
            }
            
            .admin-panel-content::-webkit-scrollbar-track {
                background: rgba(26, 26, 26, 0.5);
                border-radius: 10px;
            }
            
            .admin-panel-content::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, var(--accent-color) 0%, #1d4ed8 100%);
                border-radius: 10px;
                border: 2px solid rgba(26, 26, 26, 0.5);
                transition: all 0.3s ease;
            }
            
            .admin-panel-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #1d4ed8 0%, var(--accent-color) 100%);
                transform: scale(1.05);
            }
            
            /* Elementos adicionais */
            .stat-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                opacity: 0.8;
            }
            
            .stat-trend {
                font-size: 0.85rem;
                font-weight: 600;
                margin-top: 0.5rem;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                display: inline-block;
            }
            
            .stat-trend.positive {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .stat-trend.neutral {
                background: rgba(156, 163, 175, 0.2);
                color: #9ca3af;
                border: 1px solid rgba(156, 163, 175, 0.3);
            }
            
            .control-icon {
                font-size: 2rem;
                margin-right: 1rem;
            }
            
            .control-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
            }
            
            .control-title {
                font-size: 1.1rem;
                font-weight: 700;
                margin-bottom: 0.3rem;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }
            
            .control-desc {
                font-size: 0.85rem;
                color: #d1d5db;
                opacity: 1;
                line-height: 1.3;
                font-weight: 500;
            }
            
            .session-info {
                background: rgba(26, 26, 26, 0.5);
                border-radius: 15px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                border: 1px solid var(--border-color);
            }
            
            .session-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.8rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .session-item:last-child {
                border-bottom: none;
            }
            
            .session-label {
                color: #d1d5db;
                font-weight: 600;
            }
            
            .session-value {
                color: var(--text-primary);
                font-weight: 600;
            }
            
            .admin-badge {
                background: linear-gradient(135deg, var(--primary-color), var(--gradient-blue));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 700;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                border: 1px solid var(--primary-color);
            }
            
            /* Responsividade */
            @media (max-width: 768px) {
                .admin-panel {
                    padding: 0;
                    overflow: hidden;
                }
                
                .admin-panel-content {
                    padding: 2rem;
                    max-height: 90vh;
                    width: 95%;
                    max-width: 95%;
                    margin: 0;
                    left: 0;
                    right: 0;
                    transform: none;
                }
                
                .admin-panel-header h2 {
                    font-size: 2rem;
                }
                
                .admin-stats {
                    grid-template-columns: 1fr;
                }
                
                .admin-controls {
                    grid-template-columns: 1fr;
                }
                
                .stat-card {
                    padding: 1.5rem;
                }
                
                .stat-number {
                    font-size: 2rem;
                }
                
                .control-content {
                    text-align: center;
                    align-items: center;
                }
                
                .session-info {
                    padding: 1rem;
                }
                
                .session-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.3rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Fechar painel admin
    closeAdminPanel() {
        const panel = document.getElementById('adminPanel');
        if (panel) {
            panel.remove();
        }
    }

    // Gerenciar usuários
    manageUsers() {
        alert('👥 Sistema de Gerenciamento de Usuários\n\nFuncionalidade em desenvolvimento...');
    }

    // Gerenciar jogos
    manageGames() {
        alert('🎮 Sistema de Gerenciamento de Jogos\n\nFuncionalidade em desenvolvimento...');
    }

    // Gerenciar caixas
    manageCases() {
        this.createCaseManagementPanel();
    }

    // Criar painel de gerenciamento de caixas
    createCaseManagementPanel() {
        // Remover painel existente se houver
        const existingPanel = document.getElementById('caseManagementPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'caseManagementPanel';
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-panel-header">
                    <h2>📦 Gerenciamento de Caixas</h2>
                    <button class="btn-admin-close" onclick="adminSystem.closeCaseManagementPanel()">
                        <span>✕</span>
                    </button>
                </div>
                
                <div class="admin-section">
                    <h3>🎯 Configuração de Probabilidades</h3>
                    <div class="case-controls">
                        <div class="case-type-section">
                            <h4>💎 Caixa Premium (R$ 50,00)</h4>
                            <div class="probability-controls">
                                <div class="prob-item">
                                    <label>iPhone 15 (R$ 5.999):</label>
                                    <input type="number" id="prob-premium-iphone15" min="0" max="100" step="0.1" value="0.2">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>MacBook Pro (R$ 18.999):</label>
                                    <input type="number" id="prob-premium-macbook" min="0" max="100" step="0.1" value="0.1">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>iPhone 13 (R$ 4.499):</label>
                                    <input type="number" id="prob-premium-iphone13" min="0" max="100" step="0.1" value="0.3">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Acer Nitro (R$ 6.499):</label>
                                    <input type="number" id="prob-premium-acer" min="0" max="100" step="0.1" value="0.5">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>JBL Boombox (R$ 2.499):</label>
                                    <input type="number" id="prob-premium-jbl" min="0" max="100" step="0.1" value="1.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>AirPods Pro (R$ 1.299):</label>
                                    <input type="number" id="prob-premium-airpods" min="0" max="100" step="0.1" value="1.5">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 500:</label>
                                    <input type="number" id="prob-premium-money500" min="0" max="100" step="0.1" value="2.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 100:</label>
                                    <input type="number" id="prob-premium-money100" min="0" max="100" step="0.1" value="5.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 50:</label>
                                    <input type="number" id="prob-premium-money50" min="0" max="100" step="0.1" value="12.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 25:</label>
                                    <input type="number" id="prob-premium-money25" min="0" max="100" step="0.1" value="18.0">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="case-type-section">
                            <h4>🎁 Caixa Média (R$ 20,00)</h4>
                            <div class="probability-controls">
                                <div class="prob-item">
                                    <label>iPhone 13 (R$ 4.499):</label>
                                    <input type="number" id="prob-medium-iphone13" min="0" max="100" step="0.1" value="0.3">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Acer Nitro (R$ 6.499):</label>
                                    <input type="number" id="prob-medium-acer" min="0" max="100" step="0.1" value="0.5">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>JBL Boombox (R$ 2.499):</label>
                                    <input type="number" id="prob-medium-jbl" min="0" max="100" step="0.1" value="1.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>AirPods Pro (R$ 1.299):</label>
                                    <input type="number" id="prob-medium-airpods" min="0" max="100" step="0.1" value="1.5">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Xiaomi Redmi (R$ 899):</label>
                                    <input type="number" id="prob-medium-xiaomi" min="0" max="100" step="0.1" value="2.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Caixinha JBL (R$ 299):</label>
                                    <input type="number" id="prob-medium-speaker" min="0" max="100" step="0.1" value="4.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 200:</label>
                                    <input type="number" id="prob-medium-money200" min="0" max="100" step="0.1" value="5.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 100:</label>
                                    <input type="number" id="prob-medium-money100" min="0" max="100" step="0.1" value="10.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 50:</label>
                                    <input type="number" id="prob-medium-money50" min="0" max="100" step="0.1" value="15.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 25:</label>
                                    <input type="number" id="prob-medium-money25" min="0" max="100" step="0.1" value="20.0">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="case-type-section">
                            <h4>🎯 Caixa Básica (R$ 10,00)</h4>
                            <div class="probability-controls">
                                <div class="prob-item">
                                    <label>AirPods Pro (R$ 1.299):</label>
                                    <input type="number" id="prob-basic-airpods" min="0" max="100" step="0.1" value="0.5">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Xiaomi Redmi (R$ 899):</label>
                                    <input type="number" id="prob-basic-xiaomi" min="0" max="100" step="0.1" value="1.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Caixinha JBL (R$ 299):</label>
                                    <input type="number" id="prob-basic-speaker" min="0" max="100" step="0.1" value="2.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Fone Bluetooth (R$ 199):</label>
                                    <input type="number" id="prob-basic-fone" min="0" max="100" step="0.1" value="3.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 100:</label>
                                    <input type="number" id="prob-basic-money100" min="0" max="100" step="0.1" value="5.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 50:</label>
                                    <input type="number" id="prob-basic-money50" min="0" max="100" step="0.1" value="10.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 25:</label>
                                    <input type="number" id="prob-basic-money25" min="0" max="100" step="0.1" value="15.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 15:</label>
                                    <input type="number" id="prob-basic-money15" min="0" max="100" step="0.1" value="20.0">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="case-type-section">
                            <h4>🎪 Caixa Simples (R$ 5,00)</h4>
                            <div class="probability-controls">
                                <div class="prob-item">
                                    <label>Caixinha JBL (R$ 299):</label>
                                    <input type="number" id="prob-simple-speaker" min="0" max="100" step="0.1" value="1.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Fone Bluetooth (R$ 199):</label>
                                    <input type="number" id="prob-simple-fone" min="0" max="100" step="0.1" value="2.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>Carregador Wireless (R$ 99):</label>
                                    <input type="number" id="prob-simple-carregador" min="0" max="100" step="0.1" value="3.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 50:</label>
                                    <input type="number" id="prob-simple-money50" min="0" max="100" step="0.1" value="8.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 25:</label>
                                    <input type="number" id="prob-simple-money25" min="0" max="100" step="0.1" value="12.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 15:</label>
                                    <input type="number" id="prob-simple-money15" min="0" max="100" step="0.1" value="18.0">
                                    <span>%</span>
                                </div>
                                <div class="prob-item">
                                    <label>R$ 10:</label>
                                    <input type="number" id="prob-simple-money10" min="0" max="100" step="0.1" value="22.0">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-actions">
                        <button class="btn-admin-save" onclick="adminSystem.saveCaseProbabilities()">
                            <span>💾</span>
                            <span>Salvar Configurações</span>
                        </button>
                        <button class="btn-admin-reset" onclick="adminSystem.resetCaseProbabilities()">
                            <span>🔄</span>
                            <span>Resetar para Padrão</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        
        // Adicionar estilos
        this.addCaseManagementStyles();
        
        // Carregar probabilidades atuais
        this.loadCaseProbabilitiesToUI();
    }

    // Adicionar estilos do painel de gerenciamento de caixas
    addCaseManagementStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .case-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .case-type-section {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 12px;
                padding: 1.5rem;
                backdrop-filter: blur(10px);
            }
            
            .case-type-section h4 {
                color: #ffffff;
                margin: 0 0 1.5rem 0;
                font-size: 1.2rem;
                font-weight: 600;
                text-align: center;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(59, 130, 246, 0.3);
            }
            
            .probability-controls {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }
            
            .prob-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .prob-item label {
                color: #ffffff;
                font-size: 0.9rem;
                font-weight: 500;
                min-width: 150px;
                flex-shrink: 0;
            }
            
            .prob-item input {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 6px;
                color: #ffffff;
                padding: 0.4rem 0.6rem;
                font-size: 0.9rem;
                width: 80px;
                text-align: center;
            }
            
            .prob-item input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
            }
            
            .prob-item span {
                color: #ffffff;
                font-size: 0.9rem;
                font-weight: 500;
                min-width: 20px;
            }
            
            .admin-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
            }
            
            .btn-admin-save, .btn-admin-reset {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-admin-save {
                background: linear-gradient(135deg, #10b981, #059669);
                color: #ffffff;
            }
            
            .btn-admin-save:hover {
                background: linear-gradient(135deg, #059669, #047857);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            
            .btn-admin-reset {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: #ffffff;
            }
            
            .btn-admin-reset:hover {
                background: linear-gradient(135deg, #d97706, #b45309);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // Gerenciar promoções
    managePromotions() {
        alert('🎁 Sistema de Gerenciamento de Promoções\n\nFuncionalidade em desenvolvimento...');
    }

    // Fechar painel de gerenciamento de caixas
    closeCaseManagementPanel() {
        const panel = document.getElementById('caseManagementPanel');
        if (panel) {
            panel.remove();
        }
    }

    // Carregar probabilidades na interface
    loadCaseProbabilitiesToUI() {
        if (typeof caseProbabilities === 'undefined') return;
        
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

    // Salvar probabilidades das caixas
    saveCaseProbabilities() {
        if (typeof caseProbabilities === 'undefined') return;
        
        const caseTypes = ['premium', 'medium', 'basic', 'simple'];
        
        caseTypes.forEach(caseType => {
            const prizes = Object.keys(caseProbabilities[caseType]);
            
            prizes.forEach(prize => {
                const input = document.getElementById(`prob-${caseType}-${prize}`);
                if (input) {
                    const newValue = parseFloat(input.value);
                    if (!isNaN(newValue) && newValue >= 0) {
                        caseProbabilities[caseType][prize] = newValue;
                    }
                }
            });
        });
        
        // Salvar no localStorage
        if (typeof saveCaseProbabilities === 'function') {
            saveCaseProbabilities();
        }
        
        alert('✅ Configurações de probabilidades salvas com sucesso!');
    }

    // Resetar probabilidades para padrão
    resetCaseProbabilities() {
        if (confirm('⚠️ Tem certeza que deseja resetar todas as probabilidades para os valores padrão?')) {
            // Recarregar a página para resetar
            location.reload();
        }
    }

    // Configurações do sistema
    systemSettings() {
        alert('⚙️ Configurações do Sistema\n\nFuncionalidade em desenvolvimento...');
    }

    // Logout
    logout() {
        this.isAuthenticated = false;
        this.adminUser = null;
        this.clearAuthStatus();
        this.closeAdminPanel();
        alert('🚪 Logout realizado com sucesso!');
    }

    // Salvar status de autenticação
    saveAuthStatus() {
        localStorage.setItem('adminAuth', JSON.stringify({
            isAuthenticated: true,
            user: this.adminUser,
            timestamp: Date.now()
        }));
    }

    // Limpar status de autenticação
    clearAuthStatus() {
        localStorage.removeItem('adminAuth');
    }

    // Verificar status de autenticação
    checkAuthStatus() {
        const authData = localStorage.getItem('adminAuth');
        if (authData) {
            const auth = JSON.parse(authData);
            const now = Date.now();
            const sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
            
            if (now - auth.timestamp < sessionTimeout) {
                this.isAuthenticated = true;
                this.adminUser = auth.user;
            } else {
                this.clearAuthStatus();
            }
        }
    }
}

// Instância global do sistema admin
const adminSystem = new AdminSystem();

// Expor para uso global
window.adminSystem = adminSystem;
