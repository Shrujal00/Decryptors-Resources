// Local storage functions
function saveResources() {
    localStorage.setItem('roadmapResources', JSON.stringify(allResources));
}

function saveEvents() {
    localStorage.setItem('communityEvents', JSON.stringify(allEvents));
}

function saveAnnouncements() {
    localStorage.setItem('communityAnnouncements', JSON.stringify(allAnnouncements));
}

function saveRoadmaps() {
    localStorage.setItem('roadmaps', JSON.stringify(allRoadmaps));
}

// Utility functions
function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    if (!category) return;
    
    const header = category.previousElementSibling;
    const icon = header.querySelector('i:last-child');
    
    category.classList.toggle('active');
    
    if (category.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

function scrollToRoadmaps() {
    const roadmapsSection = document.getElementById('roadmaps-section');
    if (roadmapsSection) {
        roadmapsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}
