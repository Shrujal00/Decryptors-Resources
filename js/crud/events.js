// Event CRUD operations
async function handleAddEvent(e) {
    e.preventDefault();
    if (!isAdmin) return;
    
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    
    const eventData = { 
        title, 
        description, 
        date, 
        time,
        createdAt: new Date().toISOString()
    };

    try {
        if (window.isFirebaseEnabled && typeof eventsCollection !== 'undefined') {
            if (editingEventId) {
                await eventsCollection.doc(editingEventId).update({
                    ...eventData,
                    updatedAt: new Date().toISOString()
                });
            } else {
                await eventsCollection.add(eventData);
            }
        } else {
            if (editingEventId) {
                const index = allEvents.findIndex(e => e.id === editingEventId);
                if (index !== -1) allEvents[index] = { ...allEvents[index], ...eventData };
            } else {
                allEvents.push({ id: Date.now().toString(), ...eventData });
            }
            saveEvents();
            displayEvents();
        }
        
        closeAddEventModal();
        alert('Event saved successfully!');
    } catch (error) {
        console.error('Error saving event:', error);
        alert('Error saving event: ' + error.message);
    }
}

async function deleteEvent(eventId) {
    if (!isAdmin || !confirm('Are you sure you want to delete this event?')) return;
    
    try {
        if (window.isFirebaseEnabled && typeof eventsCollection !== 'undefined') {
            await eventsCollection.doc(eventId).delete();
            allEvents = allEvents.filter(e => e.id !== eventId);
            displayEvents();
        } else {
            allEvents = allEvents.filter(e => e.id !== eventId);
            saveEvents();
            displayEvents();
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event: ' + error.message);
    }
}

function editEvent(eventId) {
    if (!isAdmin) return;
    
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;
    
    editingEventId = eventId;
    document.getElementById('event-modal-title').textContent = 'Edit Event';
    document.getElementById('event-submit-btn').textContent = 'Update Event';
    
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-description').value = event.description;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-time').value = event.time;
    
    document.getElementById('add-event-modal').style.display = 'block';
}
