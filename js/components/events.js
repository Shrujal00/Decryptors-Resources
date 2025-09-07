// Event display and management functions
function displayEvents() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;

    eventsList.innerHTML = '';

    if (allEvents.length === 0) {
        eventsList.innerHTML = '<div class="empty-state">No upcoming events at the moment.</div>';
        return;
    }

    allEvents.forEach(event => {
        const eventCard = createEventElement(event);
        eventsList.appendChild(eventCard);
    });

    updateAdminUI();
}

function createEventElement(event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `
        <div class="event-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
        </div>
        <div class="event-info">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <span class="event-time">${event.time}</span>
        </div>
        ${isAdmin ? `
        <div class="item-actions">
            <button class="action-btn edit" onclick="editEvent('${event.id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteEvent('${event.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        ` : ''}
    `;
    
    return div;
}

function displayAnnouncements() {
    const announcementsList = document.getElementById('announcements-list');
    if (!announcementsList) return;

    announcementsList.innerHTML = '';

    if (allAnnouncements.length === 0) {
        announcementsList.innerHTML = '<div class="empty-state">No announcements at the moment.</div>';
        return;
    }

    allAnnouncements.forEach(announcement => {
        const announcementCard = createAnnouncementElement(announcement);
        announcementsList.appendChild(announcementCard);
    });

    updateAdminUI();
}

function createAnnouncementElement(announcement) {
    const announcementDate = new Date(announcement.date);
    const formattedDate = announcementDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });

    const div = document.createElement('div');
    div.className = 'announcement-card';
    div.innerHTML = `
        <div class="announcement-date">${formattedDate}</div>
        <h3>${announcement.title}</h3>
        <p>${announcement.content}</p>
        ${isAdmin ? `
        <div class="item-actions">
            <button class="action-btn delete" onclick="deleteAnnouncement('${announcement.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        ` : ''}
    `;
    
    return div;
}
