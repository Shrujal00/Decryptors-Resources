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
