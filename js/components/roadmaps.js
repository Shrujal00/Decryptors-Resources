// Roadmap management functions
function generateRoadmapCards() {
    const grid = document.getElementById('roadmaps-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    // Use Firebase roadmaps if available, otherwise use static data
    const roadmapsToUse = Object.keys(allRoadmaps).length > 0 ? allRoadmaps : roadmapData;
    
    Object.entries(roadmapsToUse).forEach(([key, roadmap]) => {
        const card = document.createElement('div');
        card.className = 'roadmap-card';
        card.onclick = () => showPage('roadmap', key);
        
        card.innerHTML = `
            <i class="${roadmap.icon}"></i>
            <h3>${roadmap.title}</h3>
            <p>${roadmap.description}</p>
            ${isAdmin ? `
            <div class="roadmap-actions">
                <button class="action-btn edit" onclick="event.stopPropagation(); editRoadmap('${key}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="event.stopPropagation(); deleteRoadmap('${key}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ` : ''}
        `;
        
        grid.appendChild(card);
    });
    
    // Add "Add Roadmap" card for admin
    if (isAdmin) {
        const addCard = document.createElement('div');
        addCard.className = 'roadmap-card add-roadmap-card';
        addCard.onclick = () => openAddRoadmapModal();
        
        addCard.innerHTML = `
            <i class="fas fa-plus"></i>
            <h3>Add New Roadmap</h3>
            <p>Create a new learning path</p>
        `;
        
        grid.appendChild(addCard);
    }
    
    console.log('Roadmap cards generated:', Object.keys(roadmapsToUse).length);
}

function loadRoadmap(field) {
    // Use Firebase roadmaps if available, otherwise use static data
    const roadmapsToUse = Object.keys(allRoadmaps).length > 0 ? allRoadmaps : roadmapData;
    const roadmap = roadmapsToUse[field];
    
    if (!roadmap) return;

    document.getElementById('roadmap-title').textContent = roadmap.title;

    const timeline = document.getElementById('roadmap-timeline');
    timeline.innerHTML = '';

    roadmap.steps.forEach((step, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-marker">${index + 1}</div>
            <div class="timeline-content">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                ${isAdmin ? `
                <div class="step-actions">
                    <button class="action-btn edit" onclick="editStep('${field}', ${index})" title="Edit Step">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteStep('${field}', ${index})" title="Delete Step">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ` : ''}
            </div>
        `;
        
        timeline.appendChild(timelineItem);
    });

    // Add "Add Step" button for admin
    if (isAdmin) {
        const addStepItem = document.createElement('div');
        addStepItem.className = 'timeline-item add-step-item';
        addStepItem.innerHTML = `
            <div class="timeline-marker">+</div>
            <div class="timeline-content">
                <button class="btn btn-secondary" onclick="addStep('${field}')">
                    <i class="fas fa-plus"></i> Add Step
                </button>
            </div>
        `;
        timeline.appendChild(addStepItem);
    }

    loadFieldResources(field);
}
