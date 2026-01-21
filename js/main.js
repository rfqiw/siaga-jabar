    // Update year indicators throughout the site
    updateYearIndicators();
    
    // Function to update all year indicators to 2026
    function updateYearIndicators() {
        // Update copyright year
        const copyrightElements = document.querySelectorAll('.footer-credits p');
        copyrightElements.forEach(element => {
            if (element.textContent.includes('2025')) {
                element.textContent = element.textContent.replace('2025', '2026');
            } else if (element.textContent.includes('©')) {
                element.textContent = element.textContent.replace(/\d{4}/, '2026');
            }
        });
        
        // Update any other year references
        const yearElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
        yearElements.forEach(element => {
            const text = element.textContent;
            if (text.includes('2025') && !text.includes('2026')) {
                element.textContent = text.replace('2025', '2026');
            }
        });
        
        // Add current year badge to hero section if not already present
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !document.querySelector('.hero-year-badge')) {
            const yearBadge = document.createElement('div');
            yearBadge.className = 'hero-year-badge';
            yearBadge.textContent = '2026';
            heroTitle.parentNode.insertBefore(yearBadge, heroTitle.nextSibling);
        }
    }
