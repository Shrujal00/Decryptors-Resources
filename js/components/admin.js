// Admin functions and UI management

function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    
    // Check if user is admin or superuser using the new auth system
    const isAuthenticated = authSystem && authSystem.currentUser && 
        (authSystem.currentUser.role === 'admin' || authSystem.currentUser.role === 'superuser');
    
    console.log('🔄 Updating admin UI - authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
        if (adminControls) {
            adminControls.style.display = 'block';
            console.log('✅ Admin controls shown');
        }
        if (eventAdminControls) {
            eventAdminControls.style.display = 'block';
            console.log('✅ Event admin controls shown');
        }
        if (announcementAdminControls) {
            announcementAdminControls.style.display = 'block';
            console.log('✅ Announcement admin controls shown');
        }
    } else {
        if (adminControls) {
            adminControls.style.display = 'none';
            console.log('❌ Admin controls hidden');
        }
        if (eventAdminControls) {
            eventAdminControls.style.display = 'none';
            console.log('❌ Event admin controls hidden');
        }
        if (announcementAdminControls) {
            announcementAdminControls.style.display = 'none';
            console.log('❌ Announcement admin controls hidden');
        }
    }
}

function canManageContent() {
    return authSystem && authSystem.currentUser && 
        (authSystem.currentUser.role === 'admin' || authSystem.currentUser.role === 'superuser');
}

function canManageRoles() {
    return authSystem && authSystem.currentUser && authSystem.currentUser.role === 'superuser';
}

function canEditProfile(targetUserId) {
    if (!authSystem || !authSystem.currentUser) return false;
    if (authSystem.currentUser.role === 'superuser') return true;
    if (authSystem.currentUser.role === 'admin') return true;
    return authSystem.currentUser.id === targetUserId;
}

function updateAdminStats() {
    if (!authSystem || !authSystem.currentUser || 
        (authSystem.currentUser.role !== 'admin' && authSystem.currentUser.role !== 'superuser')) {
        return;
    }
    
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
    if (!authSystem || !authSystem.currentUser || 
        (authSystem.currentUser.role !== 'admin' && authSystem.currentUser.role !== 'superuser')) {
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
    if (!authSystem || !authSystem.currentUser || 
        (authSystem.currentUser.role !== 'admin' && authSystem.currentUser.role !== 'superuser')) {
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
