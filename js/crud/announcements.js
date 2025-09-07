// Announcement CRUD operations
async function handleAddAnnouncement(e) {
    e.preventDefault();
    if (!isAdmin) return;
    
    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    
    const announcementData = {
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    try {
        if (window.isFirebaseEnabled && typeof announcementsCollection !== 'undefined') {
            await announcementsCollection.add(announcementData);
        } else {
            allAnnouncements.unshift({ id: Date.now().toString(), ...announcementData });
            saveAnnouncements();
            displayAnnouncements();
        }
        
        closeAddAnnouncementModal();
        alert('Announcement added successfully!');
    } catch (error) {
        console.error('Error adding announcement:', error);
        alert('Error adding announcement: ' + error.message);
    }
}

async function deleteAnnouncement(announcementId) {
    if (!isAdmin || !confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
        if (window.isFirebaseEnabled && typeof announcementsCollection !== 'undefined') {
            await announcementsCollection.doc(announcementId).delete();
        } else {
            allAnnouncements = allAnnouncements.filter(a => a.id !== announcementId);
            saveAnnouncements();
            displayAnnouncements();
        }
        alert('Announcement deleted successfully!');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Error deleting announcement: ' + error.message);
    }
}
