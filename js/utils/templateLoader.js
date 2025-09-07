// Template loader utility
async function loadTemplate(templatePath, containerId) {
    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${templatePath}`);
        }
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
        return html;
    } catch (error) {
        console.error('Template loading error:', error);
        return null;
    }
}

// Load all page templates
async function loadAllPageTemplates() {
    try {
        console.log('Loading page templates...');
        
        // Load all pages into main content
        const templates = [
            'templates/pages/home.html',
            'templates/pages/roadmap.html', 
            'templates/pages/community.html',
            'templates/pages/admin.html'
        ];
        
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        // Clear existing content except for the home page which should stay
        const homeSection = document.getElementById('home');
        mainContent.innerHTML = '';
        
        // Load each template and append to main content
        for (const templatePath of templates) {
            const response = await fetch(templatePath);
            if (response.ok) {
                const html = await response.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Append the section to main content
                const section = tempDiv.querySelector('section');
                if (section) {
                    mainContent.appendChild(section);
                }
            }
        }
        
        console.log('Page templates loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading page templates:', error);
        return false;
    }
}

// Load modals
async function loadModals() {
    try {
        await loadTemplate('templates/modals.html', 'modals-content');
        console.log('Modals loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading modals:', error);
        return false;
    }
}

// Initialize all templates
async function initializeTemplates() {
    try {
        // Load navbar
        await loadTemplate('templates/components/navbar.html', 'navbar-content');
        
        // Load pages
        await loadAllPageTemplates();
        
        // Load modals
        await loadModals();
        
        console.log('All templates loaded successfully');
        return true;
    } catch (error) {
        console.error('Error initializing templates:', error);
        return false;
    }
}
