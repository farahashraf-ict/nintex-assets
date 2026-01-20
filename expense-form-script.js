/* Nintex Expense Claim Form - Simple JavaScript */
/* All functionality scoped to .theme-entry */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initForm() {
        var formContainer = document.querySelector('.theme-entry');
        
        if (!formContainer) {
            console.log('Form container with .theme-entry not found');
            return;
        }
        
        console.log('Expense form initialized');

        
        
        // Initialize all features
        addFormStructure();
        setupFieldValidation();
        setupDateFormatting();
        setupNumericFields();
        setupTableCalculations();
    }
    
    // Add header and footer structure if not present
    // function addFormStructure() {
    //     var formContainer = document.querySelector('.theme-entry');
        
    //     // Check if header already exists
    //     if (!formContainer.querySelector('.form-header')) {
    //         var header = document.createElement('div');
    //         header.className = 'form-header';
    //         header.innerHTML = `
    //             <h1>Expense Claim Form</h1>
    //             <p>Please complete all required fields and submit your expense claim for approval. Ensure all receipts are attached and amounts are accurate.</p>
    //         `;
    //         formContainer.insertBefore(header, formContainer.firstChild);
    //     }
        
    //     // Check if footer already exists
    //     if (!formContainer.querySelector('.form-footer')) {
    //         var footer = document.createElement('div');
    //         footer.className = 'form-footer';
    //         footer.innerHTML = `
    //             <p>For questions or assistance, please contact the Finance Department</p>
    //             <div class="footer-links">
    //                 <a href="#">Expense Policy</a> | 
    //                 <a href="#">Help Center</a> | 
    //                 <a href="#">Contact Support</a>
    //             </div>
    //         `;
    //         formContainer.appendChild(footer);
    //     }
    // }


    function addFormStructure() {
    var formContainer = document.querySelector('.theme-entry');
    
    // Check if header already exists
    if (!formContainer.querySelector('.form-header')) {
        var header = document.createElement('div');
        header.className = 'form-header';
        
        // Create a container for logo + title
        var headerTop = document.createElement('div');
        headerTop.style.display = 'flex';
        headerTop.style.alignItems = 'center';
        headerTop.style.marginBottom = '10px';
        
        // Logo
        var logo = document.createElement('img');
        logo.src = 'https://farahashraf-ict.github.io/nintex-assets/finovate-logo.webp';
        logo.alt = 'Logo';
        logo.style.cssText = 'height: 60px; margin-right: 20px;';
        headerTop.appendChild(logo);
        
        // Title
        var label = document.createElement('span');
        label.textContent = 'Expense Claim Form'; // Or pageTitle if defined
        label.style.cssText = `
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
        `;
        headerTop.appendChild(label);
        
        // Add headerTop to header
        header.appendChild(headerTop);
        
        // Add description paragraph
        var desc = document.createElement('p');
        desc.textContent = 'Please complete all required fields and submit your expense claim for approval. Ensure all receipts are attached and amounts are accurate.';
        header.appendChild(desc);
        
        // Insert header at the top of formContainer
        formContainer.insertBefore(header, formContainer.firstChild);
    }
    
    // Footer logic remains unchanged
    if (!formContainer.querySelector('.form-footer')) {
        var footer = document.createElement('div');
        footer.className = 'form-footer';
        footer.innerHTML = `
            <p>For questions or assistance, please contact the Finance Department</p>
            <div class="footer-links">
                <a href="#">Expense Policy</a> | 
                <a href="#">Help Center</a> | 
                <a href="#">Contact Support</a>
            </div>
        `;
        formContainer.appendChild(footer);
    }
}

    
    // Simple field validation on blur
    function setupFieldValidation() {
        var formContainer = document.querySelector('.theme-entry');
        var requiredFields = formContainer.querySelectorAll('input[required], textarea[required], select[required]');
        
        requiredFields.forEach(function(field) {
            // Mark label as required
            var label = formContainer.querySelector('label[for="' + field.id + '"]');
            if (label && !label.classList.contains('required')) {
                label.classList.add('required');
            }
            
            // Add validation on blur
            field.addEventListener('blur', function() {
                validateField(field);
            });
        });
    }
    
    // Validate individual field
    function validateField(field) {
        var parent = field.closest('.form-row') || field.parentElement;
        var errorMsg = parent.querySelector('.error-message');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            parent.classList.add('field-error');
            
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentElement.appendChild(errorMsg);
            }
        } else {
            parent.classList.remove('field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    }
    
    // Format date fields nicely
    function setupDateFormatting() {
        var formContainer = document.querySelector('.theme-entry');
        var dateFields = formContainer.querySelectorAll('input[type="date"]');
        
        dateFields.forEach(function(field) {
            // Set max date to today for expense dates
            if (field.name && field.name.toLowerCase().includes('date')) {
                var today = new Date().toISOString().split('T')[0];
                if (!field.hasAttribute('max')) {
                    field.setAttribute('max', today);
                }
            }
        });
    }
    
    // Handle numeric fields (amounts, quantities)
    function setupNumericFields() {
        var formContainer = document.querySelector('.theme-entry');
        var numericFields = formContainer.querySelectorAll('input[type="number"]');
        
        numericFields.forEach(function(field) {
            // Format currency fields
            if (field.name && (field.name.toLowerCase().includes('amount') || 
                               field.name.toLowerCase().includes('cost') || 
                               field.name.toLowerCase().includes('price'))) {
                
                field.setAttribute('step', '0.01');
                field.setAttribute('min', '0');
                
                // Add blur event to format as currency
                field.addEventListener('blur', function() {
                    if (field.value) {
                        var value = parseFloat(field.value);
                        if (!isNaN(value)) {
                            field.value = value.toFixed(2);
                        }
                    }
                });
            }
        });
    }
    
    // Simple table/grid calculations
    function setupTableCalculations() {
        var formContainer = document.querySelector('.theme-entry');
        var tables = formContainer.querySelectorAll('table, .grid-table');
        
        tables.forEach(function(table) {
            var amountInputs = table.querySelectorAll('input[type="number"]');
            
            // Add change event to recalculate totals
            amountInputs.forEach(function(input) {
                input.addEventListener('input', function() {
                    calculateTableTotal(table);
                });
            });
            
            // Initial calculation
            calculateTableTotal(table);
        });
    }
    
    // Calculate total for a table
    function calculateTableTotal(table) {
        var amountInputs = table.querySelectorAll('input[type="number"]');
        var total = 0;
        
        amountInputs.forEach(function(input) {
            var value = parseFloat(input.value) || 0;
            total += value;
        });
        
        // Look for a total cell or create one
        var totalCell = table.querySelector('.total-amount, .total-cell');
        if (totalCell) {
            totalCell.textContent = total.toFixed(2);
        }
    }
    
    // Utility: Format currency
    function formatCurrency(amount) {
        return parseFloat(amount).toFixed(2);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForm);
    } else {
        initForm();
    }
    
})();
