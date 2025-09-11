// ===== SISTEMA DE DADOS DO CLIENTE =====
console.log('🚀 Customer Data System carregado!');

class CustomerDataSystem {
    constructor() {
        this.currentPaymentData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Formulário de dados do cliente
        const customerForm = document.getElementById('customerDataForm');
        if (customerForm) {
            customerForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Máscaras de input
        this.setupInputMasks();
    }

    setupInputMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('customerCPF');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => this.formatCPF(e));
        }

        // Máscara para telefone
        const phoneInput = document.getElementById('customerPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhone(e));
        }
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('#customerDataForm .form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Formatar CPF
    formatCPF(event) {
        let value = event.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        event.target.value = value;
    }

    // Formatar telefone
    formatPhone(event) {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        event.target.value = value;
    }

    // Validar CPF
    validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Validar email
    validateEmail(email) {
        if (!email) return true; // Email é opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar telefone
    validatePhone(phone) {
        if (!phone) return true; // Telefone é opcional
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Validar campo individual
    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;

            case 'cpf':
                if (!value) {
                    isValid = false;
                    errorMessage = 'CPF é obrigatório';
                } else if (!this.validateCPF(value)) {
                    isValid = false;
                    errorMessage = 'CPF inválido';
                }
                break;

            case 'email':
                if (value && !this.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;

            case 'phone':
                if (value && !this.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Telefone inválido';
                }
                break;
        }

        this.showFieldValidation(input, isValid, errorMessage);
        return isValid;
    }

    // Mostrar validação do campo
    showFieldValidation(input, isValid, errorMessage = '') {
        const errorElement = document.getElementById(input.name + 'Error');
        
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
            if (errorElement) {
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            }
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }
    }

    // Limpar erro do campo
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(input.name + 'Error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Validar formulário completo
    validateForm() {
        const inputs = document.querySelectorAll('#customerDataForm .form-input[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // Processar envio do formulário
    handleFormSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormError('Por favor, corrija os erros no formulário');
            return;
        }

        const formData = new FormData(event.target);
        const customerData = {
            name: formData.get('name').trim(),
            document: formData.get('cpf').replace(/\D/g, ''), // Remove formatação
            email: formData.get('email').trim() || '',
            phone: formData.get('phone').replace(/\D/g, '') || '' // Remove formatação
        };

        console.log('✅ Dados do cliente validados:', customerData);
        
        // Fechar modal de dados e continuar com o pagamento
        this.closeCustomerDataModal();
        
        // Processar pagamento com os dados do cliente
        if (this.currentPaymentData) {
            this.processPaymentWithCustomerData(customerData);
        }
    }

    // Processar pagamento com dados do cliente
    async processPaymentWithCustomerData(customerData) {
        try {
            const { amount, description } = this.currentPaymentData;
            
            console.log('🔄 Processando pagamento com dados do cliente...');
            
            // Usar a integração PayGate existente
            if (window.paygateIntegration) {
                const result = await window.paygateIntegration.createPixPayment(
                    amount, 
                    description, 
                    customerData
                );
                
                if (result.success) {
                    this.showPaymentSuccess(result);
                } else {
                    this.showPaymentError('Erro ao processar pagamento');
                }
            } else {
                throw new Error('Sistema de pagamento não disponível');
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar pagamento:', error);
            this.showPaymentError(error.message);
        }
    }

    // Mostrar modal de dados do cliente
    showCustomerDataModal(paymentData) {
        this.currentPaymentData = paymentData;
        
        // Limpar formulário
        const form = document.getElementById('customerDataForm');
        if (form) {
            form.reset();
            // Limpar validações
            const inputs = form.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.classList.remove('error', 'valid');
            });
            const errors = form.querySelectorAll('.error-message');
            errors.forEach(error => error.classList.remove('show'));
        }
        
        // Mostrar modal
        const modal = document.getElementById('customerDataModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Fechar modal de dados do cliente
    closeCustomerDataModal() {
        const modal = document.getElementById('customerDataModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.currentPaymentData = null;
    }

    // Mostrar erro no formulário
    showFormError(message) {
        console.error('❌ Erro no formulário:', message);
        // Aqui você pode mostrar uma notificação de erro
    }

    // Mostrar sucesso do pagamento
    showPaymentSuccess(result) {
        console.log('✅ Pagamento processado com sucesso:', result);
        // Mostrar QR Code do pagamento
        if (window.depositSystem) {
            window.depositSystem.showPixPayment(result);
        }
    }

    // Mostrar erro do pagamento
    showPaymentError(message) {
        console.error('❌ Erro no pagamento:', message);
        // Aqui você pode mostrar uma notificação de erro
        if (window.depositSystem) {
            window.depositSystem.showPaymentError(message);
        }
    }
}

// Instanciar sistema de dados do cliente
const customerDataSystem = new CustomerDataSystem();

// Funções globais
window.customerDataSystem = customerDataSystem;

// Função para mostrar modal de dados do cliente
window.showCustomerDataModal = function(paymentData) {
    customerDataSystem.showCustomerDataModal(paymentData);
};

// Função para fechar modal de dados do cliente
window.closeCustomerDataModal = function() {
    customerDataSystem.closeCustomerDataModal();
};

console.log('🎯 Customer Data System pronto para uso!');
