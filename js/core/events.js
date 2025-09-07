// Event listener setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation using event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-link')) {
            e.preventDefault();
            const link = e.target.closest('.nav-link');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            showPage(page, field);
        }
        
        if (e.target.closest('.dropdown-content a')) {
            e.preventDefault();
            const link = e.target.closest('.dropdown-content a');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            showPage(page, field);
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

    // Forms - wait for DOM to be ready
    setTimeout(() => {
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);

        const addResourceForm = document.getElementById('add-resource-form');
        if (addResourceForm) addResourceForm.addEventListener('submit', handleAddResource);

        const addEventForm = document.getElementById('add-event-form');
        if (addEventForm) addEventForm.addEventListener('submit', handleAddEvent);

        const addAnnouncementForm = document.getElementById('add-announcement-form');
        if (addAnnouncementForm) addAnnouncementForm.addEventListener('submit', handleAddAnnouncement);

        const addRoadmapForm = document.getElementById('add-roadmap-form');
        if (addRoadmapForm) addRoadmapForm.addEventListener('submit', handleAddRoadmap);
    }, 100);

    // Search and filter
    const resourceSearch = document.getElementById('resource-search');
    if (resourceSearch) resourceSearch.addEventListener('input', filterResources);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterResources();
        });
    });

    console.log('Event listeners set up complete');
}
