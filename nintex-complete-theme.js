/* =====================================================
   NINTEX FORMS - PROFESSIONAL JAVASCRIPT
   All functionality scoped to work with .theme-entry
   Compatible with GitHub raw links
   ===================================================== */

(function() {
    'use strict';
    
    // Configuration
    var CONFIG = {
        debug: true,
        animations: {
            enabled: true,
            duration: 350,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
        },
        validation: {
            enabled: true,
            realTime: true
        },
        calculations: {
            enabled: true,
            autoTotal: true
        },
        enhancements: {
            autoResize: true,
            characterCounter: true,
            dateValidation: true,
            currencyFormatting: true
        }
    };
    
    // Logging function
    function log(message, type) {
        if (CONFIG.debug) {
            var prefix = '[Nintex Enhancement]';
            if (type === 'error') {
                console.error(prefix, message);
            } else if (type === 'warn') {
                console.warn(prefix, message);
            } else {
                console.log(prefix, message);
            }
        }
    }
    
    // Wait for page to load and Nintex to be ready
    function initializeEnhancements() {
        log('Starting initialization...');
        
        // Check if Nintex is available
        if (typeof NWF !== 'undefined' && NWF.FormFiller) {
            log('Nintex FormFiller detected, registering after ready...');
            NWF.FormFiller.Events.RegisterAfterReady(function() {
                log('Nintex form ready, applying enhancements...');
                applyAllEnhancements();
            });
        } else {
            log('NWF not detected, using fallback initialization');
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', applyAllEnhancements);
            } else {
                applyAllEnhancements();
            }
        }
    }
    
    // Apply all enhancements
    function applyAllEnhancements() {
        var themeEntry = document.querySelector('.theme-entry');
        if (!themeEntry) {
            log('Warning: .theme-entry not found, retrying in 500ms...', 'warn');
            setTimeout(applyAllEnhancements, 500);
            return;
        }
        
        log('Applying enhancements to .theme-entry elements...');
        
        // Setup popup animations
        if (CONFIG.animations.enabled) {
            setupPopupAnimations();
        }
        
        // Enhance form fields
        enhanceTextInputs();
        enhanceTextareas();
        enhanceNumberFields();
        enhanceDateFields();
        enhanceButtons();
        enhanceValidation();
        
        // Setup calculations
        if (CONFIG.calculations.enabled) {
            setupCalculations();
        }
        
        // Improve accessibility
        improveAccessibility();
        
        log('✅ All enhancements applied successfully!');
    }
    
    /* ===== POPUP ANIMATIONS ===== */
    function setupPopupAnimations() {
        log('Setting up popup animations...');
        
        // Check if SourceCode is available
        if (typeof SourceCode === 'undefined' || !SourceCode.Forms || !SourceCode.Forms.Widget) {
            log('SourceCode.Forms not available, skipping popup animations', 'warn');
            return;
        }
        
        // Override popup show
        var originalShow = SourceCode.Forms.Widget.PopupWindow.prototype.show;
        SourceCode.Forms.Widget.PopupWindow.prototype.show = function() {
            log('Popup show triggered');
            var result = null;
            
            if (shouldAnimatePanel(this)) {
                this.controls.main.addClass('animatedintro scpsapi-slidepanel');
                
                var css = {
                    top: '0px',
                    right: '0px',
                    left: 'auto',
                    bottom: '0px',
                    height: 'auto !important',
                    position: 'fixed',
                    width: '600px',
                    maxWidth: '90vw'
                };
                
                this.controls.main.css(css);
                result = originalShow.call(this);
                this.controls.main.css('height', 'auto');
                
                var _this = this;
                setTimeout(function() {
                    _this.controls.main.removeClass('animatedintro');
                }, 50);
            } else {
                result = originalShow.call(this);
            }
            
            return result;
        };
        
        // Override popup close
        var originalClose = SourceCode.Forms.Widget.PopupWindow.prototype.close;
        SourceCode.Forms.Widget.PopupWindow.prototype.close = function(options) {
            log('Popup close triggered');
            
            if (shouldAnimatePanel(this)) {
                var _this = this;
                
                function transitionEnd() {
                    log('Popup transition ended');
                    _this.controls.main.off('transitionend', transitionEnd);
                    setTimeout(function() {
                        originalClose.call(_this, options);
                        _this.controls.main.removeClass('animatedexit animatedintro scpsapi-slidepanel');
                    }, 50);
                }
                
                this.controls.main.on('transitionend', transitionEnd);
                this.controls.main.addClass('animatedexit');
            } else {
                originalClose.call(this, options);
            }
        };
        
        log('Popup animations configured');
    }
    
    function shouldAnimatePanel(jqPopup) {
        return jqPopup.controls.main.hasClass('sub-form') || 
               jqPopup.controls.main.hasClass('sub-view');
    }
    
    /* ===== TEXT INPUT ENHANCEMENTS ===== */
    function enhanceTextInputs() {
        log('Enhancing text inputs...');
        
        var inputs = document.querySelectorAll('.theme-entry input[type="text"], .theme-entry input[type="email"], .theme-entry input[type="tel"], .theme-entry input[type="url"]');
        
        inputs.forEach(function(input) {
            // Trim whitespace on blur
            input.addEventListener('blur', function() {
                if (this.value) {
                    this.value = this.value.trim();
                }
            });
            
            // Email validation
            if (input.type === 'email') {
                input.addEventListener('blur', function() {
                    validateEmail(this);
                });
            }
            
            // Add placeholder from label if not present
            if (!input.placeholder) {
                var label = findLabelForInput(input);
                if (label) {
                    var labelText = label.textContent.trim().replace('*', '').trim();
                    if (labelText && labelText.length < 50) {
                        input.placeholder = 'Enter ' + labelText.toLowerCase();
                    }
                }
            }
        });
        
        log('Text inputs enhanced: ' + inputs.length);
    }
    
    /* ===== TEXTAREA ENHANCEMENTS ===== */
    function enhanceTextareas() {
        log('Enhancing textareas...');
        
        var textareas = document.querySelectorAll('.theme-entry textarea');
        
        textareas.forEach(function(textarea) {
            // Auto-resize
            if (CONFIG.enhancements.autoResize) {
                textarea.addEventListener('input', function() {
                    autoResizeTextarea(this);
                });
                
                // Initial resize
                autoResizeTextarea(textarea);
            }
            
            // Character counter
            if (CONFIG.enhancements.characterCounter && textarea.maxLength > 0 && textarea.maxLength !== 524288) {
                addCharacterCounter(textarea);
            }
        });
        
        log('Textareas enhanced: ' + textareas.length);
    }
    
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }
    
    function addCharacterCounter(textarea) {
        var counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = 'text-align: right; font-size: 12px; color: #7f8c8d; margin-top: 5px; font-family: inherit;';
        
        function updateCounter() {
            var remaining = textarea.maxLength - textarea.value.length;
            counter.textContent = remaining + ' characters remaining';
            
            if (remaining < 50) {
                counter.style.color = '#e74c3c';
                counter.style.fontWeight = '600';
            } else if (remaining < 100) {
                counter.style.color = '#f39c12';
                counter.style.fontWeight = '500';
            } else {
                counter.style.color = '#7f8c8d';
                counter.style.fontWeight = 'normal';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        updateCounter();
    }
    
    /* ===== NUMBER FIELD ENHANCEMENTS ===== */
    function enhanceNumberFields() {
        if (!CONFIG.enhancements.currencyFormatting) return;
        
        log('Enhancing number fields...');
        
        var numberFields = document.querySelectorAll('.theme-entry input[type="number"]');
        
        numberFields.forEach(function(field) {
            var fieldName = (field.name || field.id || '').toLowerCase();
            var label = findLabelForInput(field);
            var labelText = label ? label.textContent.toLowerCase() : '';
            
            // Check if it's a currency field
            var currencyKeywords = ['amount', 'price', 'cost', 'total', 'expense', 'payment', 'fee', 'charge', 'salary', 'wage'];
            var isCurrency = currencyKeywords.some(function(keyword) {
                return fieldName.includes(keyword) || labelText.includes(keyword);
            });
            
            if (isCurrency) {
                field.step = '0.01';
                field.min = '0';
                
                // Format on blur
                field.addEventListener('blur', function() {
                    formatCurrency(this);
                });
                
                // Calculate on input
                field.addEventListener('input', function() {
                    if (CONFIG.calculations.enabled) {
                        calculateTotals();
                    }
                });
            }
            
            // Prevent negative for positive-only fields
            field.addEventListener('input', function() {
                if (this.min === '0' && parseFloat(this.value) < 0) {
                    this.value = '0';
                }
            });
        });
        
        log('Number fields enhanced: ' + numberFields.length);
    }
    
    function formatCurrency(field) {
        if (!field.value) return;
        
        var value = parseFloat(field.value);
        if (!isNaN(value)) {
            field.value = value.toFixed(2);
        }
    }
    
    /* ===== DATE FIELD ENHANCEMENTS ===== */
    function enhanceDateFields() {
        if (!CONFIG.enhancements.dateValidation) return;
        
        log('Enhancing date fields...');
        
        var dateFields = document.querySelectorAll('.theme-entry input[type="date"]');
        
        dateFields.forEach(function(field) {
            var fieldName = (field.name || field.id || '').toLowerCase();
            var label = findLabelForInput(field);
            var labelText = label ? label.textContent.toLowerCase() : '';
            
            // Keywords that suggest past dates only
            var pastKeywords = ['expense', 'receipt', 'purchase', 'invoice', 'transaction', 'birth', 'start'];
            var isPastDate = pastKeywords.some(function(keyword) {
                return fieldName.includes(keyword) || labelText.includes(keyword);
            });
            
            if (isPastDate) {
                var today = new Date().toISOString().split('T')[0];
                field.max = today;
            }
            
            // Validate on change
            field.addEventListener('change', function() {
                validateDate(this);
            });
        });
        
        log('Date fields enhanced: ' + dateFields.length);
    }
    
    function validateDate(field) {
        if (!field.value) return;
        
        var selectedDate = new Date(field.value);
        var maxDate = field.max ? new Date(field.max) : null;
        
        if (maxDate && selectedDate > maxDate) {
            showError(field, 'Please select a date that is not in the future');
            field.value = '';
        } else {
            clearError(field);
        }
    }
    
    /* ===== BUTTON ENHANCEMENTS ===== */
    function enhanceButtons() {
        log('Enhancing buttons...');
        
        var submitButtons = document.querySelectorAll('.theme-entry button[type="submit"], .theme-entry input[type="submit"], .theme-entry .nf-submit');
        
        submitButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                // Prevent double submission
                if (this.disabled) {
                    e.preventDefault();
                    return;
                }
                
                // Validate before submission
                if (CONFIG.validation.enabled) {
                    if (!validateForm()) {
                        e.preventDefault();
                        return;
                    }
                }
                
                // Add loading state
                var originalText = this.textContent || this.value;
                var buttonElement = this;
                
                setTimeout(function() {
                    buttonElement.disabled = true;
                    
                    if (buttonElement.tagName === 'BUTTON') {
                        buttonElement.textContent = 'Submitting...';
                    } else {
                        buttonElement.value = 'Submitting...';
                    }
                    
                    // Re-enable after 10 seconds as fallback
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
        
        log('Buttons enhanced: ' + submitButtons.length);
    }
    
    /* ===== VALIDATION ===== */
    function enhanceValidation() {
        if (!CONFIG.validation.enabled) return;
        
        log('Setting up validation...');
        
        if (CONFIG.validation.realTime) {
            // Real-time validation for required fields
            var requiredFields = document.querySelectorAll('.theme-entry input[required], .theme-entry textarea[required], .theme-entry select[required]');
            
            requiredFields.forEach(function(field) {
                field.addEventListener('blur', function() {
                    validateRequired(this);
                });
            });
        }
    }
    
    function validateForm() {
        log('Validating form...');
        
        var isValid = true;
        var firstError = null;
        
        // Validate required fields
        var requiredFields = document.querySelectorAll('.theme-entry input[required], .theme-entry textarea[required], .theme-entry select[required]');
        
        requiredFields.forEach(function(field) {
            if (!validateRequired(field)) {
                isValid = false;
                if (!firstError) firstError = field;
            }
        });
        
        // Validate email fields
        var emailFields = document.querySelectorAll('.theme-entry input[type="email"]');
        emailFields.forEach(function(field) {
            if (field.value && !validateEmail(field)) {
                isValid = false;
                if (!firstError) firstError = field;
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    function validateRequired(field) {
        if (!field.value || field.value.trim() === '') {
            showError(field, 'This field is required');
            return false;
        } else {
            clearError(field);
            return true;
        }
    }
    
    function validateEmail(field) {
        if (!field.value) return true;
        
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        } else {
            clearError(field);
            return true;
        }
    }
    
    function showError(field, message) {
        var container = field.closest('.theme-entry') || field.parentElement;
        if (!container) return;
        
        container.classList.add('nf-error');
        field.classList.add('error');
        
        // Remove existing error
        var existingError = container.querySelector('.nf-error-msg');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error
        var errorMsg = document.createElement('div');
        errorMsg.className = 'nf-error-msg';
        errorMsg.textContent = message;
        errorMsg.style.cssText = 'color: #e74c3c; font-size: 13px; margin-top: 5px; font-weight: 500;';
        
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
    }
    
    function clearError(field) {
        var container = field.closest('.theme-entry') || field.parentElement;
        if (!container) return;
        
        container.classList.remove('nf-error');
        field.classList.remove('error');
        
        var errorMsg = container.querySelector('.nf-error-msg');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    /* ===== CALCULATIONS ===== */
    function setupCalculations() {
        log('Setting up auto-calculations...');
        
        calculateTotals();
        
        // Watch for changes in repeating sections
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function() {
                calculateTotals();
            });
            
            var containers = document.querySelectorAll('.theme-entry table tbody, .theme-entry .repeater-section');
            containers.forEach(function(container) {
                observer.observe(container, { childList: true, subtree: true });
            });
        }
    }
    
    function calculateTotals() {
        if (!CONFIG.calculations.autoTotal) return;
        
        var numberFields = document.querySelectorAll('.theme-entry input[type="number"]');
        
        // Find amount fields
        var amountFields = Array.from(numberFields).filter(function(field) {
            var fieldName = (field.name || field.id || '').toLowerCase();
            var label = findLabelForInput(field);
            var labelText = label ? label.textContent.toLowerCase() : '';
            
            var isAmount = ['amount', 'price', 'cost', 'expense'].some(function(keyword) {
                return fieldName.includes(keyword) || labelText.includes(keyword);
            });
            
            var isTotal = ['total', 'sum', 'grand'].some(function(keyword) {
                return fieldName.includes(keyword) || labelText.includes(keyword);
            });
            
            return isAmount && !isTotal;
        });
        
        // Find total field
        var totalField = Array.from(numberFields).find(function(field) {
            var fieldName = (field.name || field.id || '').toLowerCase();
            var label = findLabelForInput(field);
            var labelText = label ? label.textContent.toLowerCase() : '';
            
            return ['total', 'sum', 'grand'].some(function(keyword) {
                return fieldName.includes(keyword) || labelText.includes(keyword);
            });
        });
        
        if (amountFields.length > 0 && totalField) {
            var total = 0;
            amountFields.forEach(function(field) {
                var value = parseFloat(field.value) || 0;
                total += value;
            });
            
            totalField.value = total.toFixed(2);
            totalField.readOnly = true;
            
            log('Total calculated: ' + total.toFixed(2));
        }
    }
    
    /* ===== ACCESSIBILITY ===== */
    function improveAccessibility() {
        log('Improving accessibility...');
        
        var inputs = document.querySelectorAll('.theme-entry input, .theme-entry textarea, .theme-entry select');
        
        inputs.forEach(function(input) {
            // Add aria-label if missing
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                var label = findLabelForInput(input);
                if (label) {
                    var labelText = label.textContent.trim().replace('*', '').trim();
                    input.setAttribute('aria-label', labelText);
                }
            }
            
            // Add aria-required
            if (input.required || input.classList.contains('required')) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Add aria-invalid for errors
            if (input.classList.contains('error')) {
                input.setAttribute('aria-invalid', 'true');
            }
        });
        
        log('Accessibility improved');
    }
    
    /* ===== HELPER FUNCTIONS ===== */
    function findLabelForInput(input) {
        // Try to find label by 'for' attribute
        if (input.id) {
            var label = document.querySelector('label[for="' + input.id + '"]');
            if (label) return label;
        }
        
        // Try to find label in same container
        var container = input.closest('.theme-entry') || input.parentElement;
        if (container) {
            var label = container.querySelector('label');
            if (label) return label;
        }
        
        return null;
    }
    
    /* ===== INITIALIZE ===== */
    initializeEnhancements();
    
    log('Script loaded and ready');
    
})();
