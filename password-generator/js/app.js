class PasswordGenerator {
    constructor() {
        // Character sets
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            special: '!@#$%^&*-=+_?'
        };

        // Similar characters to exclude
        this.similarChars = '0O1lI';

        // DOM elements
        this.passwordDisplay = document.getElementById('passwordDisplay');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSpecial = document.getElementById('includeSpecial');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        this.generateBtn = document.getElementById('generateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.togglePasswordBtn = document.getElementById('togglePasswordBtn');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notificationText');
        this.generateMultipleBtn = document.getElementById('generateMultipleBtn');
        this.multipleCount = document.getElementById('multipleCount');
        this.multiplePasswordsContainer = document.getElementById('multiplePasswordsContainer');
        this.historyContainer = document.getElementById('historyContainer');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

        // State
        this.passwordHistory = [];
        this.isPasswordVisible = false;

        this.init();
    }

    init() {
        // Load history from session storage
        this.loadHistory();

        // Event listeners
        this.lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.resetBtn.addEventListener('click', () => this.resetSettings());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
        this.generateMultipleBtn.addEventListener('click', () => this.generateMultiplePasswords());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Character type checkboxes
        [this.includeUppercase, this.includeLowercase, this.includeNumbers, this.includeSpecial, this.excludeSimilar].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updatePasswordStrength());
        });

        // Generate initial password
        this.generatePassword();
    }

    updateLengthDisplay() {
        this.lengthValue.textContent = this.lengthSlider.value;
        this.updatePasswordStrength();
    }

    getCharacterSet() {
        let charset = '';
        
        if (this.includeUppercase.checked) {
            charset += this.charSets.uppercase;
        }
        if (this.includeLowercase.checked) {
            charset += this.charSets.lowercase;
        }
        if (this.includeNumbers.checked) {
            charset += this.charSets.numbers;
        }
        if (this.includeSpecial.checked) {
            charset += this.charSets.special;
        }

        // Exclude similar characters if option is checked
        if (this.excludeSimilar.checked && charset) {
            charset = charset.split('').filter(char => !this.similarChars.includes(char)).join('');
        }

        return charset;
    }

    generateSecurePassword(length, charset) {
        if (!charset || length < 1) {
            return '';
        }

        // Use cryptographically secure random number generation
        const passwordArray = new Uint32Array(length);
        window.crypto.getRandomValues(passwordArray);

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[passwordArray[i] % charset.length];
        }

        return password;
    }

    ensureCharacterTypes(password, charset) {
        // Ensure at least one character from each selected type is present
        const requirements = [];
        
        if (this.includeUppercase.checked) {
            requirements.push({ chars: this.charSets.uppercase, name: 'uppercase' });
        }
        if (this.includeLowercase.checked) {
            requirements.push({ chars: this.charSets.lowercase, name: 'lowercase' });
        }
        if (this.includeNumbers.checked) {
            requirements.push({ chars: this.charSets.numbers, name: 'numbers' });
        }
        if (this.includeSpecial.checked) {
            requirements.push({ chars: this.charSets.special, name: 'special' });
        }

        // Apply similar character exclusion to requirements
        if (this.excludeSimilar.checked) {
            requirements.forEach(req => {
                req.chars = req.chars.split('').filter(char => !this.similarChars.includes(char)).join('');
            });
        }

        // Check if password meets all requirements
        const meetsRequirements = requirements.every(req => 
            password.split('').some(char => req.chars.includes(char))
        );

        if (!meetsRequirements) {
            // Regenerate if requirements not met
            return this.generateSecurePassword(password.length, charset);
        }

        return password;
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const charset = this.getCharacterSet();

        if (!charset) {
            this.showNotification('Please select at least one character type!', 'error');
            return;
        }

        let password = this.generateSecurePassword(length, charset);
        password = this.ensureCharacterTypes(password, charset);

        this.passwordDisplay.value = password;
        this.updatePasswordStrength();
        this.addToHistory(password);

        // Reset visibility to hidden when new password is generated
        if (this.isPasswordVisible) {
            this.togglePasswordVisibility();
        }
    }

    calculatePasswordStrength(password) {
        if (!password) return { score: 0, text: '-', color: 'bg-gray-300' };

        let score = 0;
        const length = password.length;

        // Length score
        if (length >= 16) score += 40;
        else if (length >= 12) score += 30;
        else if (length >= 8) score += 20;
        else score += 10;

        // Character variety score
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*\-=+_?]/.test(password);

        if (hasUppercase) score += 15;
        if (hasLowercase) score += 15;
        if (hasNumbers) score += 15;
        if (hasSpecial) score += 15;

        // Determine strength level
        let text, color;
        if (score >= 80) {
            text = 'Very Strong';
            color = 'bg-green-600';
        } else if (score >= 60) {
            text = 'Strong';
            color = 'bg-green-500';
        } else if (score >= 40) {
            text = 'Medium';
            color = 'bg-yellow-500';
        } else {
            text = 'Weak';
            color = 'bg-red-500';
        }

        return { score, text, color };
    }

    updatePasswordStrength() {
        const password = this.passwordDisplay.value;
        const strength = this.calculatePasswordStrength(password);

        this.strengthBar.style.width = `${strength.score}%`;
        this.strengthBar.className = `h-full transition-all duration-300 ${strength.color}`;
        this.strengthText.textContent = strength.text;
        this.strengthText.className = `text-sm font-semibold ${strength.color.replace('bg-', 'text-')}`;
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.passwordDisplay.type = this.isPasswordVisible ? 'text' : 'password';
        this.toggleIcon.textContent = this.isPasswordVisible ? '🙈' : '👁️';
    }

    copyToClipboard() {
        const password = this.passwordDisplay.value;
        
        if (!password) {
            this.showNotification('No password to copy!', 'error');
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            this.showNotification('Password copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy password', 'error');
        });
    }

    showNotification(message, type = 'success') {
        this.notificationText.textContent = message;
        this.notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        this.notification.classList.remove('hidden');

        setTimeout(() => {
            this.notification.classList.add('hidden');
        }, 3000);
    }

    resetSettings() {
        this.lengthSlider.value = 16;
        this.includeUppercase.checked = true;
        this.includeLowercase.checked = true;
        this.includeNumbers.checked = true;
        this.includeSpecial.checked = true;
        this.excludeSimilar.checked = false;
        this.updateLengthDisplay();
        this.generatePassword();
    }

    generateMultiplePasswords() {
        const count = parseInt(this.multipleCount.value);
        const length = parseInt(this.lengthSlider.value);
        const charset = this.getCharacterSet();

        if (!charset) {
            this.showNotification('Please select at least one character type!', 'error');
            return;
        }

        this.multiplePasswordsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            let password = this.generateSecurePassword(length, charset);
            password = this.ensureCharacterTypes(password, charset);

            const passwordItem = document.createElement('div');
            passwordItem.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors';
            
            const passwordSpan = document.createElement('span');
            passwordSpan.className = 'font-mono text-sm break-all flex-1';
            passwordSpan.textContent = password;
            
            const copyButton = document.createElement('button');
            copyButton.className = 'ml-3 p-2 text-blue-600 hover:text-blue-800 transition-colors';
            copyButton.textContent = '📋';
            copyButton.title = 'Copy password';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(password).then(() => {
                    this.showNotification('Password copied!', 'success');
                });
            };

            passwordItem.appendChild(passwordSpan);
            passwordItem.appendChild(copyButton);
            this.multiplePasswordsContainer.appendChild(passwordItem);
        }
    }

    addToHistory(password) {
        const timestamp = new Date().toLocaleString();
        this.passwordHistory.unshift({ password, timestamp });

        // Keep only last 10 passwords
        if (this.passwordHistory.length > 10) {
            this.passwordHistory = this.passwordHistory.slice(0, 10);
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.passwordHistory.length === 0) {
            this.historyContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No passwords generated yet</p>';
            return;
        }

        this.historyContainer.innerHTML = '';

        this.passwordHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'flex-1';
            
            const passwordSpan = document.createElement('div');
            passwordSpan.className = 'font-mono text-sm break-all mb-1';
            passwordSpan.textContent = item.password;
            
            const timeSpan = document.createElement('div');
            timeSpan.className = 'text-xs text-gray-500';
            timeSpan.textContent = item.timestamp;
            
            infoDiv.appendChild(passwordSpan);
            infoDiv.appendChild(timeSpan);
            
            const copyButton = document.createElement('button');
            copyButton.className = 'ml-3 p-2 text-blue-600 hover:text-blue-800 transition-colors';
            copyButton.textContent = '📋';
            copyButton.title = 'Copy password';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(item.password).then(() => {
                    this.showNotification('Password copied!', 'success');
                });
            };

            historyItem.appendChild(infoDiv);
            historyItem.appendChild(copyButton);
            this.historyContainer.appendChild(historyItem);
        });
    }

    saveHistory() {
        try {
            sessionStorage.setItem('passwordHistory', JSON.stringify(this.passwordHistory));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    loadHistory() {
        try {
            const saved = sessionStorage.getItem('passwordHistory');
            if (saved) {
                this.passwordHistory = JSON.parse(saved);
                this.renderHistory();
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.passwordHistory = [];
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear password history?')) {
            this.passwordHistory = [];
            sessionStorage.removeItem('passwordHistory');
            this.renderHistory();
            this.showNotification('History cleared!', 'success');
        }
    }
}

// Initialize the password generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});
