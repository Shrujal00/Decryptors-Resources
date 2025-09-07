// Navbar navigation and interaction handler

function initializeNavbar() {
    console.log('🧭 Initializing navbar...');
    
    // Navigation event delegation
    document.addEventListener('click', function(e) {
        // Handle nav links
        if (e.target.closest('.nav-link')) {
            e.preventDefault();
            const link = e.target.closest('.nav-link');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            
            if (page) {
                console.log('🔗 Nav link clicked:', page, field);
                showPage(page, field);
            }
        }
        
        // Handle dropdown links
        if (e.target.closest('.dropdown-content a')) {
            e.preventDefault();
            const link = e.target.closest('.dropdown-content a');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            
            if (page && field) {
                console.log('🔗 Dropdown link clicked:', page, field);
                showPage(page, field);
            }
        }
        
        // Handle logo click
        if (e.target.closest('.nav-logo')) {
            console.log('🏠 Logo clicked');
            showPage('home');
        }
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    console.log('✅ Navbar initialized');
}

function updateActiveNavLink(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[data-page="${page}"]:not([data-field])`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}
