// Admin functions and UI management
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'decryptors2025') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        updateAdminUI();
        generateRoadmapCards();
        alert('Login successful! You can now edit resources.');
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function logout() {
    isAdmin = false;
    localStorage.removeItem('isAdmin');
    
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    updateAdminUI();
    generateRoadmapCards();
}

function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    
    if (isAdmin) {
        if (adminControls) adminControls.style.display = 'block';
        if (eventAdminControls) eventAdminControls.style.display = 'block';
        if (announcementAdminControls) announcementAdminControls.style.display = 'block';
    } else {
        if (adminControls) adminControls.style.display = 'none';
        if (eventAdminControls) eventAdminControls.style.display = 'none';
        if (announcementAdminControls) announcementAdminControls.style.display = 'none';
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

function exportData() {
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
    if (!confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
        return;
    }
    
    localStorage.removeItem('roadmapResources');
    localStorage.removeItem('communityEvents');
    localStorage.removeItem('communityAnnouncements');
    localStorage.removeItem('roadmaps');
    
    alert('Local data cleared successfully! Please refresh the page.');
}
