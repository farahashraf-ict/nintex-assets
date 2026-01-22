function addFormStructure() {
    var formContainer = document.querySelector('.theme-entry');
    
    // ========== CREATE HEADER ==========
    if (!formContainer.querySelector('.form-header')) {
        var header = document.createElement('div');
        header.className = 'form-header';
        header.style.cssText = `
            background: white;
            padding: 15px 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
        `;
        
        // Container for header content
        var headerContainer = document.createElement('div');
        headerContainer.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        `;
        
        // Left side - Logo
        var logoContainer = document.createElement('div');
        logoContainer.style.cssText = 'flex-shrink: 0;';
        
        var logo = document.createElement('img');
        logo.src = 'https://farahashraf-ict.github.io/nintex-assets/finovate-logo.webp'; // Replace with Digital Bank logo URL
        logo.alt = 'Digital Bank Logo';
        logo.style.cssText = 'height: 40px;';
        logoContainer.appendChild(logo);
        
        // Center - Navigation Menu
        var navMenu = document.createElement('div');
        navMenu.className = 'header-nav';
        navMenu.style.cssText = `
            display: flex;
            gap: 0;
            flex: 1;
            justify-content: center;
        `;
        
        var menuItems = [
            { icon: '🏦', text: 'Accounts' },
            { icon: '💳', text: 'Cards' },
            { icon: '🏠', text: 'Home Finance' },
            { icon: '✈️', text: 'Payment & Travel' },
            { icon: '👤', text: 'Loan Management' },
            { icon: '💰', text: 'Ways to Bank' }
        ];
        
        menuItems.forEach(function(item) {
            var menuItem = document.createElement('a');
            menuItem.href = '#';
            menuItem.style.cssText = `
                background: #00803E;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                border-right: 1px solid rgba(255,255,255,0.2);
                transition: background 0.3s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                min-width: 100px;
            `;
            
            var iconSpan = document.createElement('span');
            iconSpan.textContent = item.icon;
            iconSpan.style.fontSize = '20px';
            
            var textSpan = document.createElement('span');
            textSpan.textContent = item.text;
            textSpan.style.fontSize = '12px';
            
            menuItem.appendChild(iconSpan);
            menuItem.appendChild(textSpan);
            
            menuItem.onmouseover = function() {
                this.style.background = '#006633';
            };
            menuItem.onmouseout = function() {
                this.style.background = '#00803E';
            };
            
            navMenu.appendChild(menuItem);
        });
        
        // Right side - Language switcher and welcome
        var rightSection = document.createElement('div');
        rightSection.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
        `;
        
        var langSwitcher = document.createElement('div');
        langSwitcher.style.cssText = 'display: flex; gap: 10px;';
        
        var arLang = document.createElement('span');
        arLang.textContent = '🇸🇦 Ar';
        arLang.style.cssText = 'cursor: pointer; font-size: 14px; color: #333;';
        
        var enLang = document.createElement('span');
        enLang.textContent = '🇬🇧 En';
        enLang.style.cssText = 'cursor: pointer; font-size: 14px; color: #333;';
        
        langSwitcher.appendChild(arLang);
        langSwitcher.appendChild(enLang);
        
        var welcomeText = document.createElement('div');
        welcomeText.textContent = 'Welcome Sherif';
        welcomeText.style.cssText = 'font-size: 14px; font-weight: 500; color: #333;';
        
        rightSection.appendChild(langSwitcher);
        rightSection.appendChild(welcomeText);
        
        // Assemble header
        headerContainer.appendChild(logoContainer);
        headerContainer.appendChild(navMenu);
        headerContainer.appendChild(rightSection);
        header.appendChild(headerContainer);
        
        // Insert header at the top
        formContainer.insertBefore(header, formContainer.firstChild);
    }
    
    // ========== CREATE HERO BANNER ==========
    if (!formContainer.querySelector('.hero-banner')) {
        var heroBanner = document.createElement('div');
        heroBanner.className = 'hero-banner';
        heroBanner.style.cssText = `
            background: linear-gradient(135deg, rgba(0,128,62,0.9), rgba(0,100,50,0.9)),
                        url('https://farahashraf-ict.github.io/nintex-assets/finovate-logo.webp') center/cover;
            padding: 60px 20px;
            margin-bottom: 30px;
            position: relative;
            color: white;
        `;
        
        var iconRow = document.createElement('div');
        iconRow.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
        `;
        
        var icons = ['📞', '✉️', '@', '🖩'];
        icons.forEach(function(icon) {
            var iconCircle = document.createElement('div');
            iconCircle.style.cssText = `
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 3px solid rgba(255,255,255,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                background: rgba(255,255,255,0.1);
            `;
            iconCircle.textContent = icon;
            iconRow.appendChild(iconCircle);
        });
        
        heroBanner.appendChild(iconRow);
        
        // Insert after header
        var header = formContainer.querySelector('.form-header');
        if (header && header.nextSibling) {
            formContainer.insertBefore(heroBanner, header.nextSibling);
        } else {
            formContainer.appendChild(heroBanner);
        }
    }
    
    // ========== CREATE FOOTER ==========
    if (!formContainer.querySelector('.form-footer')) {
        var footer = document.createElement('div');
        footer.className = 'form-footer';
        footer.style.cssText = `
            background: #00803E;
            color: white;
            padding: 30px 20px;
            margin-top: 40px;
        `;
        
        var footerContainer = document.createElement('div');
        footerContainer.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        // Left side - Social media icons
        var socialContainer = document.createElement('div');
        socialContainer.style.cssText = 'display: flex; gap: 15px;';
        
        var socialIcons = ['facebook', 'youtube', 'tiktok', 'instagram', 'twitter'];
        socialIcons.forEach(function(social) {
            var socialLink = document.createElement('a');
            socialLink.href = '#';
            socialLink.style.cssText = `
                width: 35px;
                height: 35px;
                background: white;
                color: #00803E;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                font-weight: bold;
                transition: transform 0.3s;
            `;
            socialLink.textContent = social.charAt(0).toUpperCase();
            socialLink.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
            };
            socialLink.onmouseout = function() {
                this.style.transform = 'scale(1)';
            };
            socialContainer.appendChild(socialLink);
        });
        
        // Center - Company info
        var companyInfo = document.createElement('div');
        companyInfo.style.cssText = 'text-align: center;';
        
        var companyName = document.createElement('div');
        companyName.textContent = 'Nintex Digital Bank (K) | Contact Us';
        companyName.style.cssText = 'font-size: 14px; margin-bottom: 5px;';
        
        var copyright = document.createElement('div');
        copyright.textContent = 'All Rights Reserved @2025';
        copyright.style.cssText = 'font-size: 12px; opacity: 0.9;';
        
        companyInfo.appendChild(companyName);
        companyInfo.appendChild(copyright);
        
        // Right side - Logo
        var footerLogo = document.createElement('img');
        footerLogo.src = 'https://farahashraf-ict.github.io/nintex-assets/finovate-logo.webp'; // Replace with Digital Bank logo
        footerLogo.alt = 'Digital Bank';
        footerLogo.style.cssText = 'height: 35px;';
        
        // Assemble footer
        footerContainer.appendChild(socialContainer);
        footerContainer.appendChild(companyInfo);
        footerContainer.appendChild(footerLogo);
        footer.appendChild(footerContainer);
        
        // Insert footer at the bottom
        formContainer.appendChild(footer);
    }
}

// Call the function when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFormStructure);
} else {
    addFormStructure();
}