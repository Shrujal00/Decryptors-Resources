// Modal management functions
function openAddResourceModal() {
    if (!isAdmin) {
        alert('Please login as admin to add resources.');
        return;
    }
    
    if (!currentField) {
        alert('Please navigate to a specific roadmap to add resources.');
        return;
    }
    
    document.getElementById('add-resource-form').reset();
    document.getElementById('add-resource-modal').style.display = 'block';
}

function closeAddResourceModal() {
    document.getElementById('add-resource-modal').style.display = 'none';
    document.getElementById('add-resource-form').reset();
}

function openAddEventModal() {
    if (!isAdmin) {
        alert('Please login as admin to add events.');
        return;
    }
    
    editingEventId = null;
    document.getElementById('event-modal-title').textContent = 'Add Event';
    document.getElementById('event-submit-btn').textContent = 'Add Event';
    document.getElementById('add-event-form').reset();
    document.getElementById('add-event-modal').style.display = 'block';
}

function closeAddEventModal() {
    document.getElementById('add-event-modal').style.display = 'none';
    document.getElementById('add-event-form').reset();
    editingEventId = null;
}

function openAddAnnouncementModal() {
    if (!isAdmin) {
        alert('Please login as admin to add announcements.');
        return;
    }
    
    document.getElementById('add-announcement-form').reset();
    document.getElementById('add-announcement-modal').style.display = 'block';
}

function closeAddAnnouncementModal() {
    document.getElementById('add-announcement-modal').style.display = 'none';
    document.getElementById('add-announcement-form').reset();
}

function openAddRoadmapModal() {
    if (!isAdmin) {
        alert('Please login as admin to add roadmaps.');
        return;
    }
    
    editingRoadmapId = null;
    document.getElementById('roadmap-modal-title').textContent = 'Add Roadmap';
    document.getElementById('roadmap-submit-btn').textContent = 'Add Roadmap';
    document.getElementById('add-roadmap-form').reset();
    document.getElementById('roadmap-steps-list').innerHTML = '';
    document.getElementById('add-roadmap-modal').style.display = 'block';
}

function closeAddRoadmapModal() {
    document.getElementById('add-roadmap-modal').style.display = 'none';
    document.getElementById('add-roadmap-form').reset();
    editingRoadmapId = null;
}

function addStepInput(title = '', description = '') {
    const stepsList = document.getElementById('roadmap-steps-list');
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step-input-group';
    
    stepDiv.innerHTML = `
        <div class="form-group">
            <label>Step Title:</label>
            <input type="text" class="step-title" value="${title}" required>
        </div>
        <div class="form-group">
            <label>Step Description:</label>
            <textarea class="step-description" rows="2" required>${description}</textarea>
        </div>
        <button type="button" class="btn btn-danger remove-step" onclick="removeStepInput(this)">
            <i class="fas fa-trash"></i> Remove Step
        </button>
        <hr>
    `;
    
    stepsList.appendChild(stepDiv);
}

function removeStepInput(button) {
    button.parentElement.remove();
}
