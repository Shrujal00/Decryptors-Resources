// Main application initialization and core functions
function initializeApp() {
    // Initialize admin state using localStorage first
    isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log('Admin state initialized from localStorage:', isAdmin);
    
    updateAdminUI();
    generateRoadmapCards();
    showPage('home');
    console.log('App initialized');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Initialize navbar separately
    initializeNavbar();

    // Forms
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

    // Setup auth event listeners
    setupAuthEventListeners();

    console.log('Event listeners set up complete');
}

function showPage(page, field = '') {
    console.log('Showing page:', page, field);
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = page;
        
        // Update active nav link
        updateActiveNavLink(page);
        
        if (page === 'roadmap' && field) {
            currentField = field;
            loadRoadmap(field);
        } else if (page === 'community') {
            displayEvents();
            displayAnnouncements();
        } else if (page === 'home') {
            generateRoadmapCards();
        } else if (page === 'profile') {
            loadProfile();
        } else if (page === 'members') {
            document.getElementById('members-count').textContent = 'Loading...';
            loadMembersDirectory().then(() => {
                document.getElementById('members-count').textContent = allMembers.length;
            }).catch(() => {
                document.getElementById('members-count').textContent = '0';
            });
        } else if (page === 'auth') {
            showLoginPage();
        }
        
        // Update admin UI for the new page
        setTimeout(() => {
            if (typeof updateAdminUI === 'function') {
                updateAdminUI();
            }
        }, 100);
    }

    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink && !activeLink.getAttribute('data-field')) {
        activeLink.classList.add('active');
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing app...');
    
    setTimeout(() => {
        checkFirebaseConnection();
        
        if (window.isFirebaseEnabled) {
            console.log('🔥 Firebase enabled - initializing all services...');
            
            // Initialize auth system first
            if (window.authSystem) {
                authSystem.initializeAuth().then(() => {
                    initializeApp();
                    setupEventListeners();
                    initializeFirebaseListeners();
                    seedDefaultData();
                    
                    // Force UI update after everything is loaded
                    setTimeout(() => {
                        authSystem.updateUI();
                    }, 500);
                });
            } else {
                console.error('❌ Auth system not available');
            }
        } else {
            console.warn('⚠️ Firebase disabled - limited functionality');
            initializeApp();
            setupEventListeners();
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

function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    
    // Use global isAdmin variable as primary source
    const isAuthenticated = isAdmin;
    
    if (isAuthenticated) {
        if (adminControls) adminControls.style.display = 'block';
        if (eventAdminControls) eventAdminControls.style.display = 'block';
        if (announcementAdminControls) announcementAdminControls.style.display = 'block';
        
        // Update admin stats if on admin page
        if (typeof updateAdminStats === 'function') {
            updateAdminStats();
        }
    } else {
        if (adminControls) adminControls.style.display = 'none';
        if (eventAdminControls) eventAdminControls.style.display = 'none';
        if (announcementAdminControls) announcementAdminControls.style.display = 'none';
    }
}

// Global logout function for navbar compatibility
function logout() {
    if (window.authSystem) {
        authSystem.logout();
    } else {
        console.error('Auth system not available for logout');
    }
}

// Clean up listeners
window.addEventListener('beforeunload', () => {
    if (typeof eventsListener !== 'undefined' && eventsListener) eventsListener();
    if (typeof announcementsListener !== 'undefined' && announcementsListener) announcementsListener();
    if (typeof resourcesListener !== 'undefined' && resourcesListener) resourcesListener();
    if (typeof roadmapsListener !== 'undefined' && roadmapsListener) roadmapsListener();
});
