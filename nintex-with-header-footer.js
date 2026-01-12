/* ================================================
   NINTEX FORMS - AUTO HEADER & FOOTER INJECTION
   Automatically adds professional header and footer
   ================================================ */

(function() {
    'use strict';
    
    // Configuration - Customize these values
    const CONFIG = {
        header: {
            enabled: true,
            title: 'Expense Claim Form',
            subtitle: 'Please complete all required fields below',
            logo: '', // URL to your company logo (optional)
            showInfo: true,
            info: {
                formNumber: 'AUTO', // 'AUTO' for auto-generation, or specific number
                department: 'Finance',
                date: 'AUTO' // 'AUTO' for current date, or specific date
            }
        },
        footer: {
            enabled: true,
            leftText: 'Company Name © 2026',
            subText: 'All rights reserved. Confidential information.',
            links: [
                { text: 'Privacy Policy', url: '#' },
                { text: 'Terms of Use', url: '#' },
                { text: 'Help & Support', url: '#' }
            ]
        }
    };
    
    // Wait for Nintex form to be ready
    if (typeof NWF !== 'undefined' && NWF.FormFiller) {
        NWF.FormFiller.Events.RegisterAfterReady(initializeFormWithHeaderFooter);
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFormWithHeaderFooter);
        } else {
            initializeFormWithHeaderFooter();
        }
    }
    
    function initializeFormWithHeaderFooter() {
        console.log('Nintex Form with Header/Footer Scripts Loaded');
        
        // Add header and footer
        if (CONFIG.header.enabled) {
            addHeader();
        }
        if (CONFIG.footer.enabled) {
            addFooter();
        }
        
        // Run all other enhancements
        enhanceThemeEntries();
        enhanceDateFields();
        enhanceNumberFields();
        enhanceTextareas();
        enhanceButtons();
        enhanceRepeaters();
        addFormValidation();
        improveAccessibility();
        addCalculations();
    }
    
    /**
     * Add header to form
     */
    function addHeader() {
        const formContainer = document.querySelector('.nf-form-cont');
        if (!formContainer) return;
        
        // Check if header already exists
        if (document.querySelector('.nf-form-header')) return;
        
        // Generate form number
        const formNumber = CONFIG.header.info.formNumber === 'AUTO' 
            ? 'F-' + Date.now().toString().slice(-6)
            : CONFIG.header.info.formNumber;
        
        // Get current date
        const currentDate = CONFIG.header.info.date === 'AUTO'
            ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : CONFIG.header.info.date;
        
        // Create header HTML
        const headerHTML = `
            <div class="nf-form-header">
                <div class="nf-form-header-content">
                    <div class="nf-form-header-left">
                        <h1 class="nf-form-header-title">${CONFIG.header.title}</h1>
                        <p class="nf-form-header-subtitle">${CONFIG.header.subtitle}</p>
                        ${CONFIG.header.showInfo ? `
                        <div class="nf-form-header-info">
                            <div class="nf-form-header-info-item">
                                <span class="nf-form-header-info-label">Form Number</span>
                                <span class="nf-form-header-info-value">${formNumber}</span>
                            </div>
                            <div class="nf-form-header-info-item">
                                <span class="nf-form-header-info-label">Department</span>
                                <span class="nf-form-header-info-value">${CONFIG.header.info.department}</span>
                            </div>
                            <div class="nf-form-header-info-item">
                                <span class="nf-form-header-info-label">Date</span>
                                <span class="nf-form-header-info-value">${currentDate}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    ${CONFIG.header.logo ? `
                    <div class="nf-form-header-right">
                        <img src="${CONFIG.header.logo}" alt="Company Logo" class="nf-form-header-logo" />
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Insert header at the beginning of form
        formContainer.insertAdjacentHTML('afterbegin', headerHTML);
    }
    
    /**
     * Add footer to form
     */
    function addFooter() {
        const formContainer = document.querySelector('.nf-form-cont');
        if (!formContainer) return;
        
        // Check if footer already exists
        if (document.querySelector('.nf-form-footer')) return;
        
        // Create links HTML
        const linksHTML = CONFIG.footer.links.map((link, index) => {
            const divider = index < CONFIG.footer.links.length - 1 
                ? '<span class="nf-form-footer-divider"></span>' 
                : '';
            return `<a href="${link.url}" class="nf-form-footer-link">${link.text}</a>${divider}`;
        }).join('');
        
        // Create footer HTML
        const footerHTML = `
            <div class="nf-form-footer">
                <div class="nf-form-footer-content">
                    <div class="nf-form-footer-left">
                        <p class="nf-form-footer-text">${CONFIG.footer.leftText}</p>
                        <p class="nf-form-footer-subtext">${CONFIG.footer.subText}</p>
                    </div>
                    <div class="nf-form-footer-right">
                        ${linksHTML}
                    </div>
                </div>
            </div>
        `;
        
        // Insert footer at the end of form
        formContainer.insertAdjacentHTML('beforeend', footerHTML);
    }
    
    /**
     * Enhance theme-entry containers
     */
    function enhanceThemeEntries() {
        const themeEntries = document.querySelectorAll('.theme-entry');
        
        themeEntries.forEach(function(entry) {
            const input = entry.querySelector('input, textarea, select');
            
            if (input) {
                const label = entry.querySelector('label');
                if (label && !input.placeholder && input.type !== 'checkbox' && input.type !== 'radio') {
                    const labelText = label.textContent.trim().replace('*', '').trim();
                    if (labelText && labelText.length < 50) {
                        input.placeholder = 'Enter ' + labelText.toLowerCase();
                    }
                }
                
                if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'url') {
                    input.addEventListener('blur', function() {
                        this.value = this.value.trim();
                    });
                }
            }
        });
    }
    
    /**
     * Enhance date fields
     */
    function enhanceDateFields() {
        const dateFields = document.querySelectorAll('.theme-entry input[type="date"], .nf-input-datetime input, .nf-date-picker input');
        
        dateFields.forEach(function(dateField) {
            const fieldName = (dateField.name || dateField.id || '').toLowerCase();
            const themeEntry = dateField.closest('.theme-entry');
            const label = themeEntry ? themeEntry.querySelector('label') : null;
            const labelText = label ? label.textContent.toLowerCase() : '';
            
            const pastDateKeywords = ['expense', 'date', 'when', 'receipt', 'purchase', 'transaction', 'invoice'];
            const isPastDate = pastDateKeywords.some(keyword => 
                fieldName.includes(keyword) || labelText.includes(keyword)
            );
            
            if (isPastDate) {
                const today = new Date().toISOString().split('T')[0];
                dateField.max = today;
            }
            
            dateField.addEventListener('change', function() {
                validateDateField(this);
            });
        });
    }
    
    function validateDateField(dateField) {
        if (!dateField.value) return;
        
        const selectedDate = new Date(dateField.value);
        const maxDate = dateField.max ? new Date(dateField.max) : null;
        
        if (maxDate && selectedDate > maxDate) {
            showNintexError(dateField, 'Please select a date that is not in the future');
            dateField.value = '';
        } else {
            clearNintexError(dateField);
        }
    }
    
    /**
     * Enhance number fields
     */
    function enhanceNumberFields() {
        const numberFields = document.querySelectorAll('.theme-entry input[type="number"], .nf-input-number input');
        
        numberFields.forEach(function(field) {
            const fieldName = (field.name || field.id || '').toLowerCase();
            const themeEntry = field.closest('.theme-entry');
            const label = themeEntry ? themeEntry.querySelector('label') : null;
            const labelText = label ? label.textContent.toLowerCase() : '';
            
            const currencyKeywords = ['amount', 'price', 'cost', 'total', 'expense', 'payment', 'fee', 'charge'];
            const isCurrency = currencyKeywords.some(keyword => 
                fieldName.includes(keyword) || labelText.includes(keyword)
            );
            
            if (isCurrency) {
                field.min = '0';
                field.step = '0.01';
                
                field.addEventListener('blur', function() {
                    formatAsCurrency(this);
                });
                
                field.addEventListener('input', function() {
                    calculateFormTotals();
                });
            }
            
            field.addEventListener('input', function() {
                if (this.min === '0' && parseFloat(this.value) < 0) {
                    this.value = '0';
                }
            });
        });
    }
    
    function formatAsCurrency(field) {
        if (!field.value) return;
        
        const value = parseFloat(field.value);
        if (!isNaN(value)) {
            field.value = value.toFixed(2);
        }
    }
    
    /**
     * Calculate form totals
     */
    function calculateFormTotals() {
        const allNumberFields = document.querySelectorAll('.theme-entry input[type="number"], .nf-input-number input');
        
        const amountFields = Array.from(allNumberFields).filter(function(field) {
            const fieldName = (field.name || field.id || '').toLowerCase();
            const label = field.closest('.theme-entry')?.querySelector('label')?.textContent.toLowerCase() || '';
            
            const isAmount = ['amount', 'price', 'cost', 'expense'].some(keyword => 
                fieldName.includes(keyword) || label.includes(keyword)
            );
            const isTotal = ['total', 'sum', 'grand'].some(keyword => 
                fieldName.includes(keyword) || label.includes(keyword)
            );
            
            return isAmount && !isTotal;
        });
        
        const totalField = Array.from(allNumberFields).find(function(field) {
            const fieldName = (field.name || field.id || '').toLowerCase();
            const label = field.closest('.theme-entry')?.querySelector('label')?.textContent.toLowerCase() || '';
            
            return ['total', 'sum', 'grand'].some(keyword => 
                fieldName.includes(keyword) || label.includes(keyword)
            );
        });
        
        if (amountFields.length > 1 && totalField) {
            let total = 0;
            amountFields.forEach(function(field) {
                const value = parseFloat(field.value) || 0;
                total += value;
            });
            
            totalField.value = total.toFixed(2);
            totalField.readOnly = true;
            
            if (typeof NWF !== 'undefined' && NWF.FormFiller) {
                const event = new Event('change', { bubbles: true });
                totalField.dispatchEvent(event);
            }
        }
    }
    
    /**
     * Enhance textareas
     */
    function enhanceTextareas() {
        const textareas = document.querySelectorAll('.theme-entry textarea, .nf-input-textarea textarea');
        
        textareas.forEach(function(textarea) {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
            
            if (textarea.maxLength > 0 && textarea.maxLength !== 524288) {
                addCharacterCounter(textarea);
            }
            
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
    
    function addCharacterCounter(textarea) {
        const themeEntry = textarea.closest('.theme-entry');
        if (!themeEntry) return;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '12px';
        counter.style.color = '#7f8c8d';
        counter.style.marginTop = '5px';
        
        function updateCounter() {
            const remaining = textarea.maxLength - textarea.value.length;
            counter.textContent = remaining + ' characters remaining';
            
            if (remaining < 50) {
                counter.style.color = '#e74c3c';
                counter.style.fontWeight = '600';
            } else {
                counter.style.color = '#7f8c8d';
                counter.style.fontWeight = 'normal';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        updateCounter();
    }
    
    /**
     * Enhance buttons
     */
    function enhanceButtons() {
        const submitButtons = document.querySelectorAll('.nf-form-buttons button[type="submit"], .nf-submit, input[type="submit"]');
        
        submitButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                if (this.disabled) {
                    e.preventDefault();
                    return;
                }
                
                if (!validateNintexForm()) {
                    e.preventDefault();
                    return;
                }
                
                const originalText = this.textContent || this.value;
                const buttonElement = this;
                
                setTimeout(function() {
                    if (buttonElement.tagName === 'BUTTON') {
                        buttonElement.textContent = 'Submitting...';
                    } else {
                        buttonElement.value = 'Submitting...';
                    }
                    buttonElement.disabled = true;
                    
                    setTimeout(function() {
                        buttonElement.disabled = false;
                        if (buttonElement.tagName === 'BUTTON') {
                            buttonElement.textContent = originalText;
                        } else {
                            buttonElement.value = originalText;
                        }
                    }, 10000);
                }, 100);
            });
        });
    }
    
    /**
     * Enhance repeaters
     */
    function enhanceRepeaters() {
        const repeaters = document.querySelectorAll('.nf-repeater-table');
        
        repeaters.forEach(function(repeater) {
            if (window.innerWidth < 768) {
                repeater.style.display = 'block';
                repeater.style.overflowX = 'auto';
            }
        });
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('nf-repeater-add-row')) {
                setTimeout(function() {
                    enhanceNumberFields();
                    enhanceDateFields();
                }, 500);
            }
        });
    }
    
    /**
     * Add form validation
     */
    function addFormValidation() {
        const requiredFields = document.querySelectorAll('.theme-entry .nf-required input, .theme-entry .nf-required textarea, .theme-entry .nf-required select');
        
        requiredFields.forEach(function(field) {
            field.addEventListener('blur', function() {
                validateRequiredField(this);
            });
        });
        
        const emailFields = document.querySelectorAll('.theme-entry input[type="email"]');
        emailFields.forEach(function(field) {
            field.addEventListener('blur', function() {
                validateEmailField(this);
            });
        });
    }
    
    function validateRequiredField(field) {
        if (!field.value || field.value.trim() === '') {
            showNintexError(field, 'This field is required');
            return false;
        } else {
            clearNintexError(field);
            return true;
        }
    }
    
    function validateEmailField(field) {
        if (!field.value) return true;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showNintexError(field, 'Please enter a valid email address');
            return false;
        } else {
            clearNintexError(field);
            return true;
        }
    }
    
    function validateNintexForm() {
        let isValid = true;
        
        const requiredFields = document.querySelectorAll('.theme-entry .nf-required input, .theme-entry .nf-required textarea, .theme-entry .nf-required select');
        
        requiredFields.forEach(function(field) {
            if (!validateRequiredField(field)) {
                isValid = false;
            }
        });
        
        const emailFields = document.querySelectorAll('.theme-entry input[type="email"]');
        emailFields.forEach(function(field) {
            if (!validateEmailField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
            
            const firstError = document.querySelector('.theme-entry.nf-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    function showNintexError(field, message) {
        const themeEntry = field.closest('.theme-entry');
        if (!themeEntry) return;
        
        themeEntry.classList.add('nf-error');
        
        const existingError = themeEntry.querySelector('.nf-error-msg');
        if (existingError) {
            existingError.remove();
        }
        
        const errorMsg = document.createElement('span');
        errorMsg.className = 'nf-error-msg';
        errorMsg.textContent = message;
        field.parentNode.appendChild(errorMsg);
    }
    
    function clearNintexError(field) {
        const themeEntry = field.closest('.theme-entry');
        if (!themeEntry) return;
        
        themeEntry.classList.remove('nf-error');
        const errorMsg = themeEntry.querySelector('.nf-error-msg');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    /**
     * Improve accessibility
     */
    function improveAccessibility() {
        const allInputs = document.querySelectorAll('.theme-entry input, .theme-entry textarea, .theme-entry select');
        
        allInputs.forEach(function(input) {
            const themeEntry = input.closest('.theme-entry');
            const label = themeEntry ? themeEntry.querySelector('label') : null;
            
            if (label && !input.getAttribute('aria-label')) {
                const labelText = label.textContent.trim().replace('*', '').trim();
                input.setAttribute('aria-label', labelText);
            }
            
            if (input.required) {
                input.setAttribute('aria-required', 'true');
            }
        });
    }
    
    /**
     * Add calculations
     */
    function addCalculations() {
        calculateFormTotals();
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    calculateFormTotals();
                }
            });
        });
        
        const repeaters = document.querySelectorAll('.nf-repeater-table tbody');
        repeaters.forEach(function(tbody) {
            observer.observe(tbody, { childList: true });
        });
    }
    
})();
