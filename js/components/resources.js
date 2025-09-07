// Resource display and management functions
function loadFieldResources(field) {
    const fieldResources = allResources[field] || { free: [], paid: [] };
    
    const freeList = document.getElementById('free-resources-list');
    const paidList = document.getElementById('paid-resources-list');
    
    if (freeList) {
        freeList.innerHTML = '';
        fieldResources.free.forEach(resource => {
            freeList.appendChild(createResourceElement(resource, 'free'));
        });
    }

    if (paidList) {
        paidList.innerHTML = '';
        fieldResources.paid.forEach(resource => {
            paidList.appendChild(createResourceElement(resource, 'paid'));
        });
    }

    updateAdminUI();
}

function createResourceElement(resource, type) {
    const div = document.createElement('div');
    div.className = 'resource-item';
    div.setAttribute('data-type', type);
    div.setAttribute('data-id', resource.id);
    
    div.innerHTML = `
        <h4>${resource.title}</h4>
        <p>${resource.description}</p>
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer">Visit Resource <i class="fas fa-external-link-alt"></i></a>
        ${isAdmin ? `
        <div class="resource-actions">
            <button class="action-btn delete" onclick="deleteResource('${resource.id}', '${type}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        ` : ''}
    `;
    
    return div;
}

function filterResources() {
    const searchTerm = document.getElementById('resource-search')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p')?.textContent.toLowerCase() || '';
        const type = item.getAttribute('data-type');
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || activeFilter === type;
        
        if (matchesSearch && matchesFilter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
