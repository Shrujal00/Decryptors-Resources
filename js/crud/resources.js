// Resource CRUD operations
async function handleAddResource(e) {
    e.preventDefault();
    
    if (!isAdmin) return;
    
    const title = document.getElementById('resource-title').value;
    const url = document.getElementById('resource-url').value;
    const description = document.getElementById('resource-description').value;
    const type = document.getElementById('resource-type').value;
    
    const newResource = {
        id: Date.now().toString(),
        title,
        url,
        description,
        createdAt: new Date().toISOString()
    };

    try {
        if (window.isFirebaseEnabled && typeof resourcesCollection !== 'undefined') {
            const fieldDoc = resourcesCollection.doc(currentField);
            const fieldData = await fieldDoc.get();
            
            let fieldResources = fieldData.exists ? fieldData.data() : { free: [], paid: [] };
            if (!fieldResources[type]) fieldResources[type] = [];
            
            fieldResources[type].push(newResource);
            await fieldDoc.set(fieldResources);
        } else {
            if (!allResources[currentField]) allResources[currentField] = { free: [], paid: [] };
            allResources[currentField][type].push(newResource);
            saveResources();
            loadFieldResources(currentField);
        }
        
        closeAddResourceModal();
        alert('Resource added successfully!');
    } catch (error) {
        console.error('Error adding resource:', error);
        alert('Error adding resource: ' + error.message);
    }
}

async function deleteResource(resourceId, type) {
    if (!isAdmin || !confirm('Are you sure you want to delete this resource?')) return;
    
    try {
        if (window.isFirebaseEnabled && typeof resourcesCollection !== 'undefined') {
            const fieldDoc = resourcesCollection.doc(currentField);
            const fieldData = await fieldDoc.get();
            
            if (fieldData.exists) {
                let fieldResources = fieldData.data();
                if (fieldResources[type]) {
                    fieldResources[type] = fieldResources[type].filter(r => r.id !== resourceId);
                    await fieldDoc.set(fieldResources);
                }
            }
        } else {
            if (allResources[currentField] && allResources[currentField][type]) {
                allResources[currentField][type] = allResources[currentField][type].filter(r => r.id !== resourceId);
                saveResources();
                loadFieldResources(currentField);
            }
        }
        alert('Resource deleted successfully!');
    } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource: ' + error.message);
    }
}
