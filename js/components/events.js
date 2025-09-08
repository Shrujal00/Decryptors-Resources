// Event display and management functions
async function displayEvents() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;

    eventsList.innerHTML = '';

    if (allEvents.length === 0) {
        eventsList.innerHTML = '<div class="empty-state">No upcoming events at the moment.</div>';
        return;
    }

    // Process events asynchronously since createEventElement is now async
    for (const event of allEvents) {
        const eventCard = await createEventElement(event);
        eventsList.appendChild(eventCard);
    }

    updateAdminUI();
}

async function createEventElement(event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    const div = document.createElement('div');
    div.className = 'event-card';
    
    // Check if registration form exists (now async)
    const hasRegistrationForm = await checkEventHasForm(event.id);
    const isRegistrationOpen = event.registrationOpen !== false;
    const userRegistered = await checkUserRegistration(event.id);
    const isAdmin = window.currentUser && (window.currentUser.role === 'admin' || window.currentUser.role === 'superuser');
    
    console.log(`🎯 Event ${event.id} - Form: ${hasRegistrationForm}, Admin: ${isAdmin}, User: ${window.currentUser?.username || 'NOT_LOGGED_IN'}, Role: ${window.currentUser?.role || 'NO_ROLE'}`);
    console.log(`📝 Registration Details - Open: ${isRegistrationOpen}, User Registered: ${userRegistered}, Has Form: ${hasRegistrationForm}`);
    
    div.innerHTML = `
        <div class="event-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
        </div>
        <div class="event-info">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <span class="event-time">${event.time}</span>
            
            ${hasRegistrationForm ? `
                <div class="registration-status ${isRegistrationOpen ? 'open' : 'closed'}">
                    <i class="fas fa-${isRegistrationOpen ? 'check-circle' : 'times-circle'}"></i>
                    Registration ${isRegistrationOpen ? 'Open' : 'Closed'}
                </div>
            ` : ''}
        </div>
        
        <div class="event-actions">
            ${(() => {
                const showRegisterBtn = hasRegistrationForm && isRegistrationOpen && !userRegistered && window.currentUser;
                const showRegisteredBtn = userRegistered;
                const showLoginBtn = hasRegistrationForm && !window.currentUser;
                
                console.log(`🔘 Button Logic for ${event.id}:`);
                console.log(`   - Show Register: ${showRegisterBtn} (form:${hasRegistrationForm} open:${isRegistrationOpen} notReg:${!userRegistered} user:${!!window.currentUser})`);
                console.log(`   - Show Registered: ${showRegisteredBtn}`);
                console.log(`   - Show Login: ${showLoginBtn}`);
                
                if (showRegisterBtn) {
                    return `<button class="register-btn" onclick="window.eventFormsManager.openRegistrationForm('${event.id}')">
                        <i class="fas fa-user-plus"></i>
                        Register
                    </button>`;
                } else if (showRegisteredBtn) {
                    return `<button class="register-btn" disabled>
                        <i class="fas fa-check"></i>
                        Registered
                    </button>`;
                } else if (showLoginBtn) {
                    return `<button class="register-btn" onclick="alert('Please login to register for this event.'); showPage('auth');">
                        <i class="fas fa-sign-in-alt"></i>
                        Login to Register
                    </button>`;
                } else {
                    return '';
                }
            })()}
            
            ${isAdmin ? `
                <div class="admin-form-actions">
                    ${!hasRegistrationForm ? `
                        <button class="form-builder-btn create-form-btn" 
                                data-event-id="${event.id}" 
                                data-action="create-form"
                                onclick="window.eventFormsManager.openFormBuilder('${event.id}')" 
                                title="Create Registration Form">
                            <i class="fas fa-form"></i> Create Form
                        </button>
                    ` : `
                        <button class="form-builder-btn create-form-btn" 
                                data-event-id="${event.id}" 
                                data-action="create-form"
                                onclick="window.eventFormsManager.openFormBuilder('${event.id}')" 
                                title="Edit Registration Form">
                            <i class="fas fa-edit"></i> Edit Form
                        </button>
                        <button class="view-responses-btn" 
                                data-event-id="${event.id}" 
                                onclick="window.eventFormsManager.viewResponses('${event.id}')" 
                                title="View Registrations">
                            <i class="fas fa-users"></i> View Responses
                        </button>
                    `}
                </div>
                <div class="item-actions">
                    <button class="action-btn edit" onclick="editEvent('${event.id}')" title="Edit Event">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEvent('${event.id}')" title="Delete Event">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        </div>
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

    const isAdmin = window.currentUser && (window.currentUser.role === 'admin' || window.currentUser.role === 'superuser');

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

// Helper function to check if event has registration form
async function checkUserRegistration(eventId) {
    try {
        if (!window.currentUser) return false;
        
        if (window.isFirebaseEnabled && window.db) {
            // Check Firebase for user registration
            // Use a simpler query to avoid index errors
            const registrationsQuery = await db.collection('eventRegistrations')
                .where('eventId', '==', eventId)
                .get();
            
            // Filter client-side to avoid compound index requirement
            const userRegistrations = registrationsQuery.docs.filter(doc => 
                doc.data().userId === window.currentUser.id
            );
            
            const isRegistered = userRegistrations.length > 0;
            console.log(`🎟️ Firebase registration check for event ${eventId}: ${isRegistered ? 'REGISTERED' : 'NOT REGISTERED'}`);
            return isRegistered;
        } else {
            // Check localStorage for demo
            const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
            const isRegistered = registrations.some(reg => 
                reg.eventId === eventId && 
                reg.userId === window.currentUser.id
            );
            console.log(`🎟️ LocalStorage registration check for event ${eventId}: ${isRegistered ? 'REGISTERED' : 'NOT REGISTERED'}`);
            return isRegistered;
        }
    } catch (error) {
        console.error('Error checking user registration:', error);
        return false;
    }
}

async function checkEventHasForm(eventId) {
    try {
        if (window.isFirebaseEnabled && window.db) {
            // Check Firebase for form configuration
            const formDoc = await db.collection('eventForms').doc(eventId).get();
            const hasForm = formDoc.exists;
            console.log(`🔍 Firebase check for event ${eventId}: ${hasForm ? 'EXISTS' : 'NOT FOUND'}`);
            if (hasForm) {
                console.log('📋 Firebase form config found:', formDoc.data());
            }
            return hasForm;
        } else {
            // Fallback to localStorage for demo
            const formConfig = localStorage.getItem(`eventForm_${eventId}`);
            const hasForm = formConfig !== null;
            console.log(`🔍 LocalStorage check for event ${eventId}: ${hasForm ? 'EXISTS' : 'NOT FOUND'}`);
            if (hasForm) {
                console.log('📋 LocalStorage form config found:', JSON.parse(formConfig));
            } else {
                // Debug: show all localStorage keys with eventForm
                const allKeys = Object.keys(localStorage).filter(key => key.startsWith('eventForm_'));
                console.log('🗝️ All eventForm keys in localStorage:', allKeys);
            }
            return hasForm;
        }
    } catch (error) {
        console.error('Error checking event form:', error);
        return false;
    }
}
