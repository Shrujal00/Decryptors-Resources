// Admin functions and UI management
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (window.authManager && window.authManager.login(username, password)) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        updateAdminUI();
        generateRoadmapCards();
        updateAdminStats();
        alert('Login successful! You can now edit resources.');
    } else {
        alert('Invalid credentials. Please try again.');
        // Clear password field for security
        document.getElementById('password').value = '';
    }
}

function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
    
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    updateAdminUI();
    generateRoadmapCards();
    
    alert('You have been logged out successfully.');
}

function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    
    // Check authentication status - fallback to localStorage if authManager not available
    const isAuthenticated = window.authManager ? window.authManager.isAuthenticated() : (localStorage.getItem('isAdmin') === 'true');
    
    if (isAuthenticated) {
        if (adminControls) adminControls.style.display = 'block';
        if (eventAdminControls) eventAdminControls.style.display = 'block';
        if (announcementAdminControls) announcementAdminControls.style.display = 'block';
        
        // Update admin stats if on admin page
        updateAdminStats();
        
        // Show session info if on admin page
        showSessionInfo();
    } else {
        if (adminControls) adminControls.style.display = 'none';
        if (eventAdminControls) eventAdminControls.style.display = 'none';
        if (announcementAdminControls) announcementAdminControls.style.display = 'none';
        
        // Ensure admin state is properly reset
        isAdmin = false;
    }
}

function showSessionInfo() {
    if (!window.authManager) return;
    
    const sessionInfo = window.authManager.getSessionInfo();
    if (sessionInfo) {
        const sessionInfoEl = document.getElementById('session-info');
        if (sessionInfoEl) {
            sessionInfoEl.innerHTML = `
                <small>
                    Session: ${sessionInfo.timeRemaining} minutes remaining
                    <br>Logged in: ${sessionInfo.sessionAge} minutes ago
                </small>
            `;
        }
    }
}

// Add new admin utility functions
function updateAdminStats() {
    if (!isAdmin) return;
    
    // Update roadmaps count
    const roadmapsCount = Object.keys(allRoadmaps).length > 0 ? Object.keys(allRoadmaps).length : Object.keys(roadmapData).length;
    const roadmapsCountEl = document.getElementById('roadmaps-count');
    if (roadmapsCountEl) roadmapsCountEl.textContent = roadmapsCount;
    
    // Update resources count
    let resourcesCount = 0;
    Object.values(allResources).forEach(field => {
        if (field.free) resourcesCount += field.free.length;
        if (field.paid) resourcesCount += field.paid.length;
    });
    const resourcesCountEl = document.getElementById('resources-count');
    if (resourcesCountEl) resourcesCountEl.textContent = resourcesCount;
    
    // Update events count
    const eventsCountEl = document.getElementById('events-count');
    if (eventsCountEl) eventsCountEl.textContent = allEvents.length;
    
    // Update announcements count
    const announcementsCountEl = document.getElementById('announcements-count');
    if (announcementsCountEl) announcementsCountEl.textContent = allAnnouncements.length;
}

// Admin action middleware - check authentication before performing admin actions
function requireAuth(action) {
    return function(...args) {
        if (!authManager.isAuthenticated()) {
            alert('Your session has expired. Please log in again.');
            authManager.forceLogout();
            return false;
        }
        return action.apply(this, args);
    };
}

// Wrap admin functions with authentication middleware
const authenticatedExportData = requireAuth(exportData);
const authenticatedClearLocalData = requireAuth(clearLocalData);

function exportData() {
    if (window.authManager && !window.authManager.isAuthenticated()) {
        alert('Authentication required for this action.');
        return;
    }
    
    const data = {
        roadmaps: allRoadmaps,
        resources: allResources,
        events: allEvents,
        announcements: allAnnouncements,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `decryptors-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Data exported successfully!');
}

function clearLocalData() {
    if (window.authManager && !window.authManager.isAuthenticated()) {
        alert('Authentication required for this action.');
        return;
    }
    
    if (!confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
        return;
    }
    
    localStorage.removeItem('roadmapResources');
    localStorage.removeItem('communityEvents');
    localStorage.removeItem('communityAnnouncements');
    localStorage.removeItem('roadmaps');
    
    alert('Local data cleared successfully! Please refresh the page.');
}
