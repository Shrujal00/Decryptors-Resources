// Global state
let currentPage = 'home';
let currentField = '';
let isAdmin = false;
let allResources = [];
let allEvents = [];
let allAnnouncements = [];
let editingEventId = null;

// Sample roadmap data
const roadmapData = {
    fullstack: {
        title: 'Full Stack Development',
        icon: 'fas fa-globe',
        description: 'Master both frontend and backend development',
        steps: [
            { title: 'HTML & CSS Basics', description: 'Learn the foundation of web development with HTML5 and CSS3' },
            { title: 'JavaScript Fundamentals', description: 'Master JavaScript ES6+ features and DOM manipulation' },
            { title: 'Frontend Framework', description: 'Learn React, Vue, or Angular for modern UI development' },
            { title: 'Backend Development', description: 'Build APIs with Node.js, Python, or other backend technologies' },
            { title: 'Database Design', description: 'Work with SQL and NoSQL databases' },
            { title: 'DevOps & Deployment', description: 'Deploy applications using cloud platforms and CI/CD' }
        ]
    },
    app: {
        title: 'App Development',
        icon: 'fas fa-mobile-alt',
        description: 'Build native and cross-platform mobile applications',
        steps: [
            { title: 'Programming Fundamentals', description: 'Learn programming basics with your chosen language' },
            { title: 'Mobile UI/UX Design', description: 'Understand mobile design principles and user experience' },
            { title: 'Native Development', description: 'iOS (Swift) or Android (Kotlin/Java) development' },
            { title: 'Cross-Platform Tools', description: 'React Native, Flutter, or Xamarin development' },
            { title: 'API Integration', description: 'Connect your app to backend services and APIs' },
            { title: 'App Store Deployment', description: 'Publish your app to Google Play Store and Apple App Store' }
        ]
    },
    dsa: {
        title: 'Data Structures & Algorithms',
        icon: 'fas fa-sitemap',
        description: 'Master problem-solving and coding interview skills',
        steps: [
            { title: 'Programming Language', description: 'Choose and master one language (C++, Java, Python)' },
            { title: 'Basic Data Structures', description: 'Arrays, Linked Lists, Stacks, Queues' },
            { title: 'Advanced Data Structures', description: 'Trees, Graphs, Hash Tables, Heaps' },
            { title: 'Algorithm Techniques', description: 'Sorting, Searching, Recursion, Dynamic Programming' },
            { title: 'Problem Solving', description: 'Practice on LeetCode, HackerRank, Codeforces' },
            { title: 'System Design Basics', description: 'Learn scalability and system architecture concepts' }
        ]
    },
    cybersecurity: {
        title: 'Cybersecurity',
        icon: 'fas fa-shield-alt',
        description: 'Protect systems and data from cyber threats',
        steps: [
            { title: 'Security Fundamentals', description: 'CIA Triad, Risk Management, Security Frameworks' },
            { title: 'Network Security', description: 'Firewalls, VPNs, Intrusion Detection Systems' },
            { title: 'Ethical Hacking', description: 'Penetration testing and vulnerability assessment' },
            { title: 'Cryptography', description: 'Encryption, Digital Signatures, PKI' },
            { title: 'Incident Response', description: 'Security monitoring and incident handling' },
            { title: 'Compliance & Governance', description: 'Security policies, regulations, and best practices' }
        ]
    },
    network: {
        title: 'Network Engineering',
        icon: 'fas fa-network-wired',
        description: 'Design and manage computer networks',
        steps: [
            { title: 'Networking Basics', description: 'OSI Model, TCP/IP, Subnetting' },
            { title: 'Routing & Switching', description: 'Cisco/Juniper routing protocols and switching concepts' },
            { title: 'Network Security', description: 'VPNs, Firewalls, Access Control Lists' },
            { title: 'Wireless Technologies', description: 'Wi-Fi, Bluetooth, Cellular networks' },
            { title: 'Network Monitoring', description: 'SNMP, Network analysis tools, Performance optimization' },
            { title: 'Cloud Networking', description: 'SDN, Network virtualization, Cloud connectivity' }
        ]
    },
    cloud: {
        title: 'Cloud Engineering',
        icon: 'fas fa-cloud',
        description: 'Build and manage cloud infrastructure',
        steps: [
            { title: 'Cloud Fundamentals', description: 'IaaS, PaaS, SaaS concepts and cloud providers' },
            { title: 'Infrastructure as Code', description: 'Terraform, CloudFormation, ARM templates' },
            { title: 'Containerization', description: 'Docker, Kubernetes, Container orchestration' },
            { title: 'Cloud Services', description: 'AWS/Azure/GCP core services and architectures' },
            { title: 'DevOps Integration', description: 'CI/CD pipelines, Monitoring, Logging' },
            { title: 'Cloud Security', description: 'IAM, Encryption, Compliance in cloud environments' }
        ]
    },
    datascience: {
        title: 'Data Science',
        icon: 'fas fa-chart-line',
        description: 'Extract insights from data using statistical methods',
        steps: [
            { title: 'Programming for Data Science', description: 'Python or R programming fundamentals' },
            { title: 'Statistics & Mathematics', description: 'Descriptive/Inferential statistics, Linear algebra' },
            { title: 'Data Manipulation', description: 'Pandas, NumPy, Data cleaning and preprocessing' },
            { title: 'Data Visualization', description: 'Matplotlib, Seaborn, Plotly, Tableau' },
            { title: 'Machine Learning Basics', description: 'Supervised/Unsupervised learning algorithms' },
            { title: 'Big Data Tools', description: 'Spark, Hadoop, SQL databases' }
        ]
    },
    ml: {
        title: 'Machine Learning',
        icon: 'fas fa-robot',
        description: 'Build intelligent systems that learn from data',
        steps: [
            { title: 'ML Fundamentals', description: 'Types of ML, Model evaluation, Cross-validation' },
            { title: 'Supervised Learning', description: 'Regression, Classification algorithms' },
            { title: 'Unsupervised Learning', description: 'Clustering, Dimensionality reduction' },
            { title: 'Deep Learning Basics', description: 'Neural networks, TensorFlow, PyTorch' },
            { title: 'Model Deployment', description: 'MLOps, Model serving, API development' },
            { title: 'Advanced Topics', description: 'NLP, Computer Vision, Reinforcement Learning' }
        ]
    },
    ai: {
        title: 'Artificial Intelligence',
        icon: 'fas fa-brain',
        description: 'Create intelligent systems and AI applications',
        steps: [
            { title: 'AI Foundations', description: 'History of AI, Search algorithms, Knowledge representation' },
            { title: 'Machine Learning Mastery', description: 'Advanced ML techniques and algorithms' },
            { title: 'Deep Learning', description: 'CNNs, RNNs, Transformers, GANs' },
            { title: 'Natural Language Processing', description: 'Text processing, Language models, ChatBots' },
            { title: 'Computer Vision', description: 'Image processing, Object detection, Recognition' },
            { title: 'AI Ethics & Deployment', description: 'Responsible AI, Bias detection, Production systems' }
        ]
    }
};

// Sample resources data
const defaultResources = {
    fullstack: {
        free: [
            { id: 1, title: 'freeCodeCamp', url: 'https://freecodecamp.org', description: 'Comprehensive web development curriculum' },
            { id: 2, title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Complete web development documentation' },
            { id: 3, title: 'The Odin Project', url: 'https://theodinproject.com', description: 'Full-stack web development course' }
        ],
        paid: [
            { id: 4, title: 'Complete Web Developer Bootcamp', url: 'https://udemy.com', description: 'Comprehensive paid course on Udemy' },
            { id: 5, title: 'Frontend Masters', url: 'https://frontendmasters.com', description: 'Advanced frontend development courses' }
        ]
    },
    app: {
        free: [
            { id: 6, title: 'React Native Docs', url: 'https://reactnative.dev', description: 'Official React Native documentation' },
            { id: 7, title: 'Flutter Documentation', url: 'https://flutter.dev', description: 'Official Flutter development guide' }
        ],
        paid: [
            { id: 8, title: 'iOS Development Course', url: 'https://udemy.com', description: 'Complete iOS development with Swift' },
            { id: 9, title: 'Android Development Nanodegree', url: 'https://udacity.com', description: 'Google-certified Android course' }
        ]
    },
    dsa: {
        free: [
            { id: 10, title: 'LeetCode', url: 'https://leetcode.com', description: 'Practice coding problems and algorithms' },
            { id: 11, title: 'GeeksforGeeks', url: 'https://geeksforgeeks.org', description: 'DSA tutorials and practice problems' }
        ],
        paid: [
            { id: 12, title: 'AlgoExpert', url: 'https://algoexpert.io', description: 'Curated coding interview preparation' },
            { id: 13, title: 'InterviewBit', url: 'https://interviewbit.com', description: 'Structured interview preparation platform' }
        ]
    },
    cybersecurity: {
        free: [
            { id: 14, title: 'OWASP', url: 'https://owasp.org', description: 'Web application security knowledge base' },
            { id: 15, title: 'Cybrary', url: 'https://cybrary.it', description: 'Free cybersecurity training platform' }
        ],
        paid: [
            { id: 16, title: 'Ethical Hacking Course', url: 'https://udemy.com', description: 'Complete ethical hacking and penetration testing' },
            { id: 17, title: 'CISSP Training', url: 'https://cissp.com', description: 'Professional security certification training' }
        ]
    },
    network: {
        free: [
            { id: 18, title: 'Cisco Networking Academy', url: 'https://netacad.com', description: 'Free networking courses from Cisco' },
            { id: 19, title: 'Network+ Study Guide', url: 'https://comptia.org', description: 'CompTIA Network+ certification resources' }
        ],
        paid: [
            { id: 20, title: 'CCNA Complete Course', url: 'https://udemy.com', description: 'Cisco CCNA certification preparation' },
            { id: 21, title: 'Network Engineering Bootcamp', url: 'https://networkengineering.com', description: 'Intensive network engineering training' }
        ]
    },
    cloud: {
        free: [
            { id: 22, title: 'AWS Free Tier', url: 'https://aws.amazon.com/free', description: 'Free AWS services and training' },
            { id: 23, title: 'Google Cloud Skills Boost', url: 'https://cloud.google.com', description: 'Free Google Cloud training' }
        ],
        paid: [
            { id: 24, title: 'AWS Solutions Architect', url: 'https://acloudguru.com', description: 'Professional AWS certification course' },
            { id: 25, title: 'Azure Fundamentals Course', url: 'https://pluralsight.com', description: 'Microsoft Azure comprehensive training' }
        ]
    },
    datascience: {
        free: [
            { id: 26, title: 'Kaggle Learn', url: 'https://kaggle.com/learn', description: 'Free data science micro-courses' },
            { id: 27, title: 'Python for Data Science', url: 'https://python.org', description: 'Official Python data science resources' }
        ],
        paid: [
            { id: 28, title: 'Data Science Specialization', url: 'https://coursera.org', description: 'Johns Hopkins University data science course' },
            { id: 29, title: 'DataCamp Subscription', url: 'https://datacamp.com', description: 'Interactive data science learning platform' }
        ]
    },
    ml: {
        free: [
            { id: 30, title: 'Fast.ai', url: 'https://fast.ai', description: 'Practical machine learning for coders' },
            { id: 31, title: 'Coursera ML Course', url: 'https://coursera.org', description: 'Andrew Ng\'s famous machine learning course' }
        ],
        paid: [
            { id: 32, title: 'Machine Learning A-Z', url: 'https://udemy.com', description: 'Complete machine learning course on Udemy' },
            { id: 33, title: 'DeepLearning.ai Specialization', url: 'https://deeplearning.ai', description: 'Advanced deep learning specialization' }
        ]
    },
    ai: {
        free: [
            { id: 34, title: 'MIT AI Course', url: 'https://ocw.mit.edu', description: 'MIT\'s Introduction to Artificial Intelligence' },
            { id: 35, title: 'OpenAI Resources', url: 'https://openai.com', description: 'AI research papers and resources' }
        ],
        paid: [
            { id: 36, title: 'AI for Everyone', url: 'https://coursera.org', description: 'Non-technical AI course by Andrew Ng' },
            { id: 37, title: 'Advanced AI Specialization', url: 'https://edx.org', description: 'University-level AI course specialization' }
        ]
    }
};

// Default events data
const defaultEvents = [
    {
        id: 1,
        title: 'JavaScript Workshop',
        description: 'Learn the fundamentals of JavaScript in this hands-on workshop.',
        date: '2024-12-20',
        time: '6:00 PM - 8:00 PM'
    }
];

// Default announcements data
const defaultAnnouncements = [
    {
        id: 1,
        title: 'Welcome to Decryptors!',
        content: "We're excited to launch our new platform. Start exploring the roadmaps and join our growing community of learners.",
        date: '2024-12-15'
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadResources();
    loadEvents();
    loadAnnouncements();
});

function initializeApp() {
    // Check admin status
    isAdmin = localStorage.getItem('isAdmin') === 'true';
    updateAdminUI();
    
    // Generate roadmap cards
    generateRoadmapCards();
    
    // Show home page by default
    showPage('home');
}

function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            showPage(page, field);
        });
    });

    // Dropdown links
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            showPage(page, field);
        });
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Admin login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Add resource form
    document.getElementById('add-resource-form').addEventListener('submit', handleAddResource);

    // Add event form
    document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);
    
    // Add announcement form
    document.getElementById('add-announcement-form').addEventListener('submit', handleAddAnnouncement);

    // Search and filter
    document.getElementById('resource-search').addEventListener('input', filterResources);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterResources();
        });
    });

    // Modal close events
    window.addEventListener('click', (e) => {
        const resourceModal = document.getElementById('add-resource-modal');
        const eventModal = document.getElementById('add-event-modal');
        const announcementModal = document.getElementById('add-announcement-modal');
        
        if (e.target === resourceModal) {
            closeAddResourceModal();
        }
        if (e.target === eventModal) {
            closeAddEventModal();
        }
        if (e.target === announcementModal) {
            closeAddAnnouncementModal();
        }
    });
}

function showPage(page, field = '') {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    // Show requested page
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = page;
        
        if (page === 'roadmap' && field) {
            currentField = field;
            loadRoadmap(field);
        }
    }

    // Update active nav link
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink && !activeLink.getAttribute('data-field')) {
        activeLink.classList.add('active');
    }
}

function generateRoadmapCards() {
    const grid = document.getElementById('roadmaps-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    Object.entries(roadmapData).forEach(([key, roadmap]) => {
        const card = document.createElement('div');
        card.className = 'roadmap-card';
        card.onclick = () => showPage('roadmap', key);
        
        card.innerHTML = `
            <i class="${roadmap.icon}"></i>
            <h3>${roadmap.title}</h3>
            <p>${roadmap.description}</p>
        `;
        
        grid.appendChild(card);
    });
}

function loadRoadmap(field) {
    const roadmap = roadmapData[field];
    if (!roadmap) return;

    // Update title
    document.getElementById('roadmap-title').textContent = roadmap.title;

    // Generate timeline
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
            </div>
        `;
        
        timeline.appendChild(timelineItem);
    });

    // Load resources for this field
    loadFieldResources(field);
}

function loadResources() {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('roadmapResources');
    allResources = saved ? JSON.parse(saved) : defaultResources;
}

function saveResources() {
    localStorage.setItem('roadmapResources', JSON.stringify(allResources));
}

function loadFieldResources(field) {
    const fieldResources = allResources[field] || { free: [], paid: [] };
    
    // Load free resources
    const freeList = document.getElementById('free-resources-list');
    freeList.innerHTML = '';
    fieldResources.free.forEach(resource => {
        freeList.appendChild(createResourceElement(resource, 'free'));
    });

    // Load paid resources
    const paidList = document.getElementById('paid-resources-list');
    paidList.innerHTML = '';
    fieldResources.paid.forEach(resource => {
        paidList.appendChild(createResourceElement(resource, 'paid'));
    });

    // Show/hide admin controls
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
        <div class="resource-actions">
            <button class="action-btn delete" onclick="deleteResource(${resource.id}, '${type}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return div;
}

function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    const header = category.previousElementSibling;
    const icon = header.querySelector('i:last-child');
    
    category.classList.toggle('active');
    
    if (category.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple admin check (in production, use proper authentication)
    if (username === 'admin' && password === 'codeclub2024') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        updateAdminUI();
        alert('Login successful! You can now edit resources.');
    } else {
        alert('Invalid credentials. Use username: admin, password: codeclub2024');
    }
}

function logout() {
    isAdmin = false;
    localStorage.removeItem('isAdmin');
    
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    updateAdminUI();
}

function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    const resourceActions = document.querySelectorAll('.resource-actions');
    const itemActions = document.querySelectorAll('.item-actions');
    
    if (isAdmin) {
        if (adminControls) adminControls.style.display = 'block';
        if (eventAdminControls) eventAdminControls.style.display = 'block';
        if (announcementAdminControls) announcementAdminControls.style.display = 'block';
        resourceActions.forEach(action => action.style.display = 'flex');
        itemActions.forEach(action => action.style.display = 'flex');
    } else {
        if (adminControls) adminControls.style.display = 'none';
        if (eventAdminControls) eventAdminControls.style.display = 'none';
        if (announcementAdminControls) announcementAdminControls.style.display = 'none';
        resourceActions.forEach(action => action.style.display = 'none');
        itemActions.forEach(action => action.style.display = 'none');
    }
}

// Event Management Functions
function loadEvents() {
    const saved = localStorage.getItem('communityEvents');
    allEvents = saved ? JSON.parse(saved) : defaultEvents;
}

function saveEvents() {
    localStorage.setItem('communityEvents', JSON.stringify(allEvents));
}

function displayEvents() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;

    eventsList.innerHTML = '';

    if (allEvents.length === 0) {
        eventsList.innerHTML = '<div class="empty-state">No upcoming events at the moment.</div>';
        return;
    }

    allEvents.forEach(event => {
        const eventCard = createEventElement(event);
        eventsList.appendChild(eventCard);
    });

    updateAdminUI();
}

function createEventElement(event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `
        <div class="event-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
        </div>
        <div class="event-info">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <span class="event-time">${event.time}</span>
        </div>
        <div class="item-actions">
            <button class="action-btn edit" onclick="editEvent(${event.id})" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteEvent(${event.id})" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return div;
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

function handleAddEvent(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        alert('Please login as admin to manage events.');
        return;
    }
    
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    
    if (editingEventId) {
        // Edit existing event
        const eventIndex = allEvents.findIndex(event => event.id === editingEventId);
        if (eventIndex !== -1) {
            allEvents[eventIndex] = {
                ...allEvents[eventIndex],
                title,
                description,
                date,
                time
            };
        }
        alert('Event updated successfully!');
    } else {
        // Add new event
        const newEvent = {
            id: Date.now(),
            title,
            description,
            date,
            time
        };
        
        allEvents.push(newEvent);
        alert('Event added successfully!');
    }
    
    saveEvents();
    displayEvents();
    closeAddEventModal();
}

function editEvent(eventId) {
    if (!isAdmin) {
        alert('Please login as admin to edit events.');
        return;
    }
    
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

function deleteEvent(eventId) {
    if (!isAdmin) {
        alert('Please login as admin to delete events.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    allEvents = allEvents.filter(event => event.id !== eventId);
    saveEvents();
    displayEvents();
    alert('Event deleted successfully!');
}

// Announcement Management Functions
function loadAnnouncements() {
    const saved = localStorage.getItem('communityAnnouncements');
    allAnnouncements = saved ? JSON.parse(saved) : defaultAnnouncements;
}

function saveAnnouncements() {
    localStorage.setItem('communityAnnouncements', JSON.stringify(allAnnouncements));
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

    const div = document.createElement('div');
    div.className = 'announcement-card';
    div.innerHTML = `
        <div class="announcement-date">${formattedDate}</div>
        <h3>${announcement.title}</h3>
        <p>${announcement.content}</p>
        <div class="item-actions">
            <button class="action-btn delete" onclick="deleteAnnouncement(${announcement.id})" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return div;
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

function handleAddAnnouncement(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        alert('Please login as admin to manage announcements.');
        return;
    }
    
    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    
    const newAnnouncement = {
        id: Date.now(),
        title,
        content,
        date: new Date().toISOString().split('T')[0]
    };
    
    allAnnouncements.unshift(newAnnouncement); // Add to beginning
    saveAnnouncements();
    displayAnnouncements();
    closeAddAnnouncementModal();
    alert('Announcement added successfully!');
}

function deleteAnnouncement(announcementId) {
    if (!isAdmin) {
        alert('Please login as admin to delete announcements.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this announcement?')) {
        return;
    }
    
    allAnnouncements = allAnnouncements.filter(announcement => announcement.id !== announcementId);
    saveAnnouncements();
    displayAnnouncements();
    alert('Announcement deleted successfully!');
}

// Initialize collapsible categories as open by default
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const categories = document.querySelectorAll('.category-content');
        categories.forEach(category => {
            category.classList.add('active');
            const header = category.previousElementSibling;
            const icon = header.querySelector('i:last-child');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
            }
        });
    }, 100);
});
