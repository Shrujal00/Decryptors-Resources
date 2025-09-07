// Main application initialization and core functions
function initializeApp() {
    isAdmin = localStorage.getItem('isAdmin') === 'true';
    updateAdminUI();
    generateRoadmapCards();
    showPage('home');
    console.log('App initialized');
}

function showPage(page, field = '') {
    console.log('Showing page:', page, field);
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = page;
        
        if (page === 'roadmap' && field) {
            currentField = field;
            loadRoadmap(field);
        } else if (page === 'community') {
            displayEvents();
            displayAnnouncements();
        } else if (page === 'home') {
            generateRoadmapCards();
        }
    }

    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink && !activeLink.getAttribute('data-field')) {
        activeLink.classList.add('active');
    }
}

function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    
    if (isAdmin) {
        if (adminControls) adminControls.style.display = 'block';
        if (eventAdminControls) eventAdminControls.style.display = 'block';
        if (announcementAdminControls) announcementAdminControls.style.display = 'block';
        
        // Update admin stats if on admin page
        updateAdminStats();
    } else {
        if (adminControls) adminControls.style.display = 'none';
        if (eventAdminControls) eventAdminControls.style.display = 'none';
        if (announcementAdminControls) announcementAdminControls.style.display = 'none';
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    setTimeout(() => {
        checkFirebaseConnection();
        initializeApp();
        setupEventListeners();
        
        if (window.isFirebaseEnabled) {
            initializeFirebaseListeners();
            seedDefaultData();
        } else {
            loadLocalData();
        }
        
        // Initialize collapsible categories
        setTimeout(() => {
            const categories = document.querySelectorAll('.category-content');
            categories.forEach(category => {
                category.classList.add('active');
                const header = category.previousElementSibling;
                const icon = header.querySelector('i:last-child');
                if (icon) icon.style.transform = 'rotate(180deg)';
            });
        }, 100);
    }, 1500);
});

// Clean up listeners
window.addEventListener('beforeunload', () => {
    if (typeof eventsListener !== 'undefined' && eventsListener) eventsListener();
    if (typeof announcementsListener !== 'undefined' && announcementsListener) announcementsListener();
    if (typeof resourcesListener !== 'undefined' && resourcesListener) resourcesListener();
    if (typeof roadmapsListener !== 'undefined' && roadmapsListener) roadmapsListener();
});
