// Roadmap CRUD operations
async function handleAddRoadmap(e) {
    e.preventDefault();
    if (!isAdmin) return;
    
    const id = document.getElementById('roadmap-id').value;
    const title = document.getElementById('roadmap-title-input').value;
    const icon = document.getElementById('roadmap-icon').value;
    const description = document.getElementById('roadmap-description').value;
    
    // Get steps from the dynamic list
    const steps = [];
    const stepElements = document.querySelectorAll('.step-input-group');
    stepElements.forEach(stepEl => {
        const stepTitle = stepEl.querySelector('.step-title').value;
        const stepDesc = stepEl.querySelector('.step-description').value;
        if (stepTitle && stepDesc) {
            steps.push({ title: stepTitle, description: stepDesc });
        }
    });

    const roadmapDataObj = {
        title,
        icon,
        description,
        steps,
        createdAt: new Date().toISOString()
    };

    try {
        if (window.isFirebaseEnabled && typeof roadmapsCollection !== 'undefined') {
            if (editingRoadmapId) {
                await roadmapsCollection.doc(editingRoadmapId).update({
                    ...roadmapDataObj,
                    updatedAt: new Date().toISOString()
                });
                console.log('Roadmap updated in Firebase successfully');
            } else {
                await roadmapsCollection.doc(id).set(roadmapDataObj);
                console.log('Roadmap added to Firebase successfully');
            }
        } else {
            if (editingRoadmapId) {
                allRoadmaps[editingRoadmapId] = roadmapDataObj;
            } else {
                allRoadmaps[id] = roadmapDataObj;
            }
            saveRoadmaps();
            generateRoadmapCards();
        }
        
        closeAddRoadmapModal();
        alert('Roadmap saved successfully!');
    } catch (error) {
        console.error('Error saving roadmap:', error);
        alert('Error saving roadmap: ' + error.message);
    }
}

function editRoadmap(roadmapId) {
    if (!isAdmin) return;
    
    const roadmapsToUse = Object.keys(allRoadmaps).length > 0 ? allRoadmaps : roadmapData;
    const roadmap = roadmapsToUse[roadmapId];
    if (!roadmap) return;
    
    editingRoadmapId = roadmapId;
    document.getElementById('roadmap-modal-title').textContent = 'Edit Roadmap';
    document.getElementById('roadmap-submit-btn').textContent = 'Update Roadmap';
    
    document.getElementById('roadmap-id').value = roadmapId;
    document.getElementById('roadmap-title-input').value = roadmap.title;
    document.getElementById('roadmap-icon').value = roadmap.icon;
    document.getElementById('roadmap-description').value = roadmap.description;
    
    // Populate steps
    const stepsList = document.getElementById('roadmap-steps-list');
    stepsList.innerHTML = '';
    roadmap.steps.forEach((step, index) => {
        addStepInput(step.title, step.description);
    });
    
    document.getElementById('add-roadmap-modal').style.display = 'block';
}

async function deleteRoadmap(roadmapId) {
    if (!isAdmin || !confirm('Are you sure you want to delete this roadmap?')) return;
    
    try {
        if (window.isFirebaseEnabled && typeof roadmapsCollection !== 'undefined') {
            await roadmapsCollection.doc(roadmapId).delete();
            console.log('Roadmap deleted from Firebase successfully');
        } else {
            delete allRoadmaps[roadmapId];
            saveRoadmaps();
            generateRoadmapCards();
        }
        alert('Roadmap deleted successfully!');
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        alert('Error deleting roadmap: ' + error.message);
    }
}

// Step management functions
function addStep(field) {
    const isCurrentAdmin = window.currentUser && (window.currentUser.role === 'admin' || window.currentUser.role === 'superuser');
    if (!isCurrentAdmin) return;
    
    const title = prompt('Enter step title:');
    if (!title) return;
    
    const description = prompt('Enter step description:');
    if (!description) return;
    
    const roadmapsToUse = Object.keys(allRoadmaps).length > 0 ? allRoadmaps : roadmapData;
    const roadmap = roadmapsToUse[field];
    if (!roadmap) return;
    
    const newStep = { title, description };
    roadmap.steps.push(newStep);
    
    saveRoadmapChanges(field, roadmap);
    loadRoadmap(field);
}

function editStep(field, stepIndex) {
    const isCurrentAdmin = window.currentUser && (window.currentUser.role === 'admin' || window.currentUser.role === 'superuser');
    if (!isCurrentAdmin) return;
    
    const roadmapsToUse = Object.keys(allRoadmaps).length > 0 ? allRoadmaps : roadmapData;
    const roadmap = roadmapsToUse[field];
    if (!roadmap || !roadmap.steps[stepIndex]) return;
    
    const step = roadmap.steps[stepIndex];
    const newTitle = prompt('Edit step title:', step.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Edit step description:', step.description);
    if (newDescription === null) return;
    
    roadmap.steps[stepIndex] = { title: newTitle, description: newDescription };
    
    saveRoadmapChanges(field, roadmap);
    loadRoadmap(field);
}

function deleteStep(field, stepIndex) {
    const isCurrentAdmin = window.currentUser && (window.currentUser.role === 'admin' || window.currentUser.role === 'superuser');
    if (!isCurrentAdmin || !confirm('Are you sure you want to delete this step?')) return;
    
    const roadmapsToUse = Object.keys(allRoadmaps).length > 0 ? allRoadmaps : roadmapData;
    const roadmap = roadmapsToUse[field];
    if (!roadmap || !roadmap.steps[stepIndex]) return;
    
    roadmap.steps.splice(stepIndex, 1);
    
    saveRoadmapChanges(field, roadmap);
    loadRoadmap(field);
}

async function saveRoadmapChanges(field, roadmap) {
    try {
        if (window.isFirebaseEnabled && typeof roadmapsCollection !== 'undefined') {
            await roadmapsCollection.doc(field).update({
                ...roadmap,
                updatedAt: new Date().toISOString()
            });
            console.log('Roadmap steps updated in Firebase successfully');
        } else {
            allRoadmaps[field] = roadmap;
            saveRoadmaps();
        }
    } catch (error) {
        console.error('Error saving roadmap changes:', error);
        alert('Error saving changes: ' + error.message);
    }
}

function saveRoadmaps() {
    localStorage.setItem('roadmaps', JSON.stringify(allRoadmaps));
    generateRoadmapCards();
}
