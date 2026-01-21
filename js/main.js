// Main JavaScript for WebGIS Kebencanaan Jawa Barat

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href.startsWith('#!') || href.startsWith('http')) {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` || 
                        link.getAttribute('href').includes(`#${sectionId}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Initial call and on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Tab functionality for news section
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to current button and pane
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Progress bar animation on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 300);
        });
    }
    
    // Intersection Observer for progress bars
    if (progressBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.analysis-card, .risk-table').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add current year to footer if needed
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.card, .analysis-card, .emergency-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize tooltips if any
    initTooltips();
    
    // Add loading animation to page
    showLoadingAnimation();
});

// Tooltips initialization
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Loading animation
function showLoadingAnimation() {
    // Remove loading animation after page load
    window.addEventListener('load', function() {
        const loadingElements = document.querySelectorAll('.weather-loading, .news-loading');
        setTimeout(() => {
            loadingElements.forEach(el => {
                if (el.parentElement) {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        if (el.parentElement) {
                            el.style.display = 'none';
                        }
                    }, 300);
                }
            });
        }, 1000);
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export functions for use in other files
window.WebGISUtils = {
    formatDate,
    capitalizeFirstLetter
};
