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

// Default data for fallback
const defaultResources = {
    fullstack: {
        free: [
            { id: '1', title: 'freeCodeCamp', url: 'https://freecodecamp.org', description: 'Comprehensive web development curriculum' },
            { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Complete web development documentation' },
            { id: '3', title: 'The Odin Project', url: 'https://theodinproject.com', description: 'Full-stack web development course' }
        ],
        paid: [
            { id: '4', title: 'Complete Web Developer Bootcamp', url: 'https://udemy.com', description: 'Comprehensive paid course on Udemy' },
            { id: '5', title: 'Frontend Masters', url: 'https://frontendmasters.com', description: 'Advanced frontend development courses' }
        ]
    },
    app: {
        free: [
            { id: '6', title: 'React Native Docs', url: 'https://reactnative.dev', description: 'Official React Native documentation' },
            { id: '7', title: 'Flutter Documentation', url: 'https://flutter.dev', description: 'Official Flutter development guide' }
        ],
        paid: [
            { id: '8', title: 'iOS Development Course', url: 'https://udemy.com', description: 'Complete iOS development with Swift' },
            { id: '9', title: 'Android Development Nanodegree', url: 'https://udacity.com', description: 'Google-certified Android course' }
        ]
    },
    dsa: {
        free: [
            { id: '10', title: 'LeetCode', url: 'https://leetcode.com', description: 'Practice coding problems and algorithms' },
            { id: '11', title: 'GeeksforGeeks', url: 'https://geeksforgeeks.org', description: 'DSA tutorials and practice problems' }
        ],
        paid: [
            { id: '12', title: 'AlgoExpert', url: 'https://algoexpert.io', description: 'Curated coding interview preparation' },
            { id: '13', title: 'InterviewBit', url: 'https://interviewbit.com', description: 'Structured interview preparation platform' }
        ]
    }
};

const defaultEvents = [
    { id: '1', title: 'JavaScript Workshop', description: 'Learn the fundamentals of JavaScript in this hands-on workshop.', date: '2024-12-20', time: '6:00 PM - 8:00 PM' }
];

const defaultAnnouncements = [
    { id: '1', title: 'Welcome to Decryptors!', content: "We're excited to launch our new platform. Start exploring the roadmaps and join our growing community of learners.", date: '2024-12-15' }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    setTimeout(() => {
        checkFirebaseConnection();
        initializeApp();
        setupEventListeners();
        
        if (window.isFirebaseEnabled) {
            initializeFirebaseListeners();
            seedDefaultData();
        } else {
            loadLocalData();
        }
        
        // Initialize collapsible categories
        setTimeout(() => {
            const categories = document.querySelectorAll('.category-content');
            categories.forEach(category => {
                category.classList.add('active');
                const header = category.previousElementSibling;
                const icon = header.querySelector('i:last-child');
                if (icon) icon.style.transform = 'rotate(180deg)';
            });
        }, 100);
    }, 1500);
});

function checkFirebaseConnection() {
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            window.isFirebaseEnabled = true;
            console.log('Firebase connected successfully');
        } else {
            window.isFirebaseEnabled = false;
            console.log('Firebase not available, using local storage');
        }
    } catch (error) {
        window.isFirebaseEnabled = false;
        console.log('Firebase error, using local storage:', error);
    }
}

function loadLocalData() {
    allResources = JSON.parse(localStorage.getItem('roadmapResources')) || defaultResources;
    allEvents = JSON.parse(localStorage.getItem('communityEvents')) || defaultEvents;
    allAnnouncements = JSON.parse(localStorage.getItem('communityAnnouncements')) || defaultAnnouncements;
    
    displayEvents();
    displayAnnouncements();
    console.log('Local data loaded');
}

async function seedDefaultData() {
    try {
        // Check if we need to upload local data to Firebase first
        await uploadLocalDataToFirebase();
        
        // Then seed default data if collections are empty
        const resourcesSnapshot = await resourcesCollection.get();
        if (resourcesSnapshot.empty) {
            console.log('Seeding default resources...');
            for (const [field, data] of Object.entries(defaultResources)) {
                await resourcesCollection.doc(field).set(data);
            }
        }

        const eventsSnapshot = await eventsCollection.get();
        if (eventsSnapshot.empty) {
            console.log('Seeding default events...');
            for (const event of defaultEvents) {
                await eventsCollection.add(event);
            }
        }

        const announcementsSnapshot = await announcementsCollection.get();
        if (announcementsSnapshot.empty) {
            console.log('Seeding default announcements...');
            for (const announcement of defaultAnnouncements) {
                await announcementsCollection.add(announcement);
            }
        }
    } catch (error) {
        console.error('Error seeding default data:', error);
        loadLocalData();
    }
}

// Add function to upload existing local data to Firebase
async function uploadLocalDataToFirebase() {
    try {
        console.log('Checking for existing local data to upload...');
        
        // Upload local resources to Firebase
        const localResources = JSON.parse(localStorage.getItem('roadmapResources'));
        if (localResources && Object.keys(localResources).length > 0) {
            console.log('Uploading local resources to Firebase...');
            for (const [field, data] of Object.entries(localResources)) {
                const fieldDoc = await resourcesCollection.doc(field).get();
                if (!fieldDoc.exists) {
                    await resourcesCollection.doc(field).set(data);
                    console.log(`Uploaded ${field} resources to Firebase`);
                }
            }
        }
        
        // Upload local events to Firebase
        const localEvents = JSON.parse(localStorage.getItem('communityEvents'));
        if (localEvents && localEvents.length > 0) {
            console.log('Uploading local events to Firebase...');
            const eventsSnapshot = await eventsCollection.get();
            if (eventsSnapshot.empty) {
                for (const event of localEvents) {
                    const { id, ...eventData } = event; // Remove local id
                    await eventsCollection.add(eventData);
                }
                console.log('Uploaded local events to Firebase');
            }
        }
        
        // Upload local announcements to Firebase
        const localAnnouncements = JSON.parse(localStorage.getItem('communityAnnouncements'));
        if (localAnnouncements && localAnnouncements.length > 0) {
            console.log('Uploading local announcements to Firebase...');
            const announcementsSnapshot = await announcementsCollection.get();
            if (announcementsSnapshot.empty) {
                for (const announcement of localAnnouncements) {
                    const { id, ...announcementData } = announcement; // Remove local id
                    await announcementsCollection.add(announcementData);
                }
                console.log('Uploaded local announcements to Firebase');
            }
        }
        
    } catch (error) {
        console.error('Error uploading local data to Firebase:', error);
    }
}

function initializeFirebaseListeners() {
    if (!window.isFirebaseEnabled) return;

    try {
        // Listen for events with proper error handling
        eventsListener = eventsCollection.onSnapshot((snapshot) => {
            console.log('Events snapshot received, size:', snapshot.size);
            allEvents = [];
            snapshot.forEach((doc) => {
                allEvents.push({ id: doc.id, ...doc.data() });
            });
            displayEvents();
            console.log('Events synced from Firebase:', allEvents.length);
        }, (error) => {
            console.error('Events listener error:', error);
            loadLocalData();
        });

        // Listen for announcements with proper error handling
        announcementsListener = announcementsCollection.onSnapshot((snapshot) => {
            console.log('Announcements snapshot received, size:', snapshot.size);
            allAnnouncements = [];
            snapshot.forEach((doc) => {
                allAnnouncements.push({ id: doc.id, ...doc.data() });
            });
            displayAnnouncements();
            console.log('Announcements synced from Firebase:', allAnnouncements.length);
        }, (error) => {
            console.error('Announcements listener error:', error);
            loadLocalData();
        });

        // Listen for resources with proper error handling
        resourcesListener = resourcesCollection.onSnapshot((snapshot) => {
            allResources = {};
            snapshot.forEach((doc) => {
                allResources[doc.id] = doc.data();
            });
            if (currentField) {
                loadFieldResources(currentField);
            }
            console.log('Resources synced from Firebase');
        }, (error) => {
            console.error('Resources listener error:', error);
            loadLocalData();
        });
    } catch (error) {
        console.error('Error setting up Firebase listeners:', error);
        loadLocalData();
    }
}

function initializeApp() {
    isAdmin = localStorage.getItem('isAdmin') === 'true';
    updateAdminUI();
    generateRoadmapCards();
    showPage('home');
    console.log('App initialized');
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
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const addResourceForm = document.getElementById('add-resource-form');
    if (addResourceForm) addResourceForm.addEventListener('submit', handleAddResource);

    const addEventForm = document.getElementById('add-event-form');
    if (addEventForm) addEventForm.addEventListener('submit', handleAddEvent);

    const addAnnouncementForm = document.getElementById('add-announcement-form');
    if (addAnnouncementForm) addAnnouncementForm.addEventListener('submit', handleAddAnnouncement);

    // Search and filter
    const resourceSearch = document.getElementById('resource-search');
    if (resourceSearch) resourceSearch.addEventListener('input', filterResources);
    
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
        
        if (e.target === resourceModal) closeAddResourceModal();
        if (e.target === eventModal) closeAddEventModal();
        if (e.target === announcementModal) closeAddAnnouncementModal();
    });

    console.log('Event listeners set up complete');
}

function showPage(page, field = '') {
    console.log('Showing page:', page, field);
    
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
        } else if (page === 'community') {
            displayEvents();
            displayAnnouncements();
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
            </div>
        `;
        
        timeline.appendChild(timelineItem);
    });

    loadFieldResources(field);
}

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
        ${isAdmin ? `
        <div class="item-actions">
            <button class="action-btn edit" onclick="editEvent('${event.id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteEvent('${event.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        ` : ''}
    `;
    
    return div;
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
        ${isAdmin ? `
        <div class="item-actions">
            <button class="action-btn delete" onclick="deleteAnnouncement('${announcement.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        ` : ''}
    `;
    
    return div;
}

// Admin functions
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'decryptors2025') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        updateAdminUI();
        alert('Login successful! You can now edit resources.');
    } else {
        alert('Invalid credentials. Please try again.');
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

async function deleteEvent(eventId) {
    if (!isAdmin || !confirm('Are you sure you want to delete this event?')) return;
    
    console.log('Attempting to delete event:', eventId);
    
    try {
        if (window.isFirebaseEnabled && typeof eventsCollection !== 'undefined') {
            console.log('Deleting event from Firebase...');
            
            // Delete from Firebase
            await eventsCollection.doc(eventId).delete();
            console.log('Event deleted from Firebase successfully');
            
            // Immediately update local array and UI
            allEvents = allEvents.filter(e => e.id !== eventId);
            displayEvents();
            
        } else {
            console.log('Deleting event from local storage...');
            allEvents = allEvents.filter(e => e.id !== eventId);
            saveEvents();
            displayEvents();
        }
        
        console.log('Event deleted and UI updated');
        
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event: ' + error.message);
    }
}

// Force refresh function for admin
async function refreshAllData() {
    if (!window.isFirebaseEnabled) {
        loadLocalData();
        return;
    }
    
    try {
        console.log('Refreshing all data from Firebase...');
        
        // Refresh events
        const eventsSnapshot = await eventsCollection.get();
        allEvents = [];
        eventsSnapshot.forEach((doc) => {
            allEvents.push({ id: doc.id, ...doc.data() });
        });
        displayEvents();
        
        // Refresh announcements
        const announcementsSnapshot = await announcementsCollection.get();
        allAnnouncements = [];
        announcementsSnapshot.forEach((doc) => {
            allAnnouncements.push({ id: doc.id, ...doc.data() });
        });
        displayAnnouncements();
        
        console.log('Data refreshed successfully');
        alert('Data refreshed from Firebase!');
    } catch (error) {
        console.error('Error refreshing data:', error);
        alert('Error refreshing data: ' + error.message);
    }
}

// Enhanced admin dashboard with refresh functionality
function updateAdminUI() {
    const adminControls = document.getElementById('admin-controls');
    const eventAdminControls = document.getElementById('event-admin-controls');
    const announcementAdminControls = document.getElementById('announcement-admin-controls');
    
    if (isAdmin) {
        if (adminControls) {
            adminControls.style.display = 'block';
            // Add refresh button if not exists
            if (!document.getElementById('refresh-data-btn')) {
                const refreshBtn = document.createElement('button');
                refreshBtn.id = 'refresh-data-btn';
                refreshBtn.className = 'btn btn-secondary';
                refreshBtn.innerHTML = '<i class="fas fa-refresh"></i> Refresh Data';
                refreshBtn.onclick = refreshAllData;
                adminControls.appendChild(refreshBtn);
            }
            // Add sync button if not exists
            if (!document.getElementById('sync-firebase-btn')) {
                const syncBtn = document.createElement('button');
                syncBtn.id = 'sync-firebase-btn';
                syncBtn.className = 'btn btn-secondary';
                syncBtn.innerHTML = '<i class="fas fa-sync"></i> Sync to Firebase';
                syncBtn.onclick = syncAllDataToFirebase;
                adminControls.appendChild(syncBtn);
            }
        }
        if (eventAdminControls) eventAdminControls.style.display = 'block';
        if (announcementAdminControls) announcementAdminControls.style.display = 'block';
    } else {
        if (adminControls) adminControls.style.display = 'none';
        if (eventAdminControls) eventAdminControls.style.display = 'none';
        if (announcementAdminControls) announcementAdminControls.style.display = 'none';
    }
}

// Modal functions
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

// CRUD operations
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
            console.log('Adding resource to Firebase...');
            const fieldDoc = resourcesCollection.doc(currentField);
            const fieldData = await fieldDoc.get();
            
            let fieldResources = fieldData.exists ? fieldData.data() : { free: [], paid: [] };
            if (!fieldResources[type]) fieldResources[type] = [];
            
            fieldResources[type].push(newResource);
            await fieldDoc.set(fieldResources);
            console.log('Resource added to Firebase successfully');
        } else {
            console.log('Adding resource to local storage...');
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
            console.log('Deleting resource from Firebase...');
            const fieldDoc = resourcesCollection.doc(currentField);
            const fieldData = await fieldDoc.get();
            
            if (fieldData.exists) {
                let fieldResources = fieldData.data();
                if (fieldResources[type]) {
                    fieldResources[type] = fieldResources[type].filter(r => r.id !== resourceId);
                    await fieldDoc.set(fieldResources);
                    console.log('Resource deleted from Firebase successfully');
                }
            }
        } else {
            console.log('Deleting resource from local storage...');
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
            console.log('Adding event to Firebase...');
            if (editingEventId) {
                await eventsCollection.doc(editingEventId).update({
                    ...eventData,
                    updatedAt: new Date().toISOString()
                });
                console.log('Event updated in Firebase successfully');
            } else {
                await eventsCollection.add(eventData);
                console.log('Event added to Firebase successfully');
            }
        } else {
            console.log('Adding event to local storage...');
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
    
    console.log('Attempting to delete event:', eventId);
    
    try {
        if (window.isFirebaseEnabled && typeof eventsCollection !== 'undefined') {
            console.log('Deleting event from Firebase...');
            
            // Delete from Firebase
            await eventsCollection.doc(eventId).delete();
            console.log('Event deleted from Firebase successfully');
            
            // Immediately update local array and UI
            allEvents = allEvents.filter(e => e.id !== eventId);
            displayEvents();
            
        } else {
            console.log('Deleting event from local storage...');
            allEvents = allEvents.filter(e => e.id !== eventId);
            saveEvents();
            displayEvents();
        }
        
        console.log('Event deleted and UI updated');
        
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event: ' + error.message);
    }
}

async function handleAddAnnouncement(e) {
    e.preventDefault();
    if (!isAdmin) return;
    
    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    
    const announcementData = {
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    try {
        if (window.isFirebaseEnabled && typeof announcementsCollection !== 'undefined') {
            console.log('Adding announcement to Firebase...');
            await announcementsCollection.add(announcementData);
            console.log('Announcement added to Firebase successfully');
        } else {
            console.log('Adding announcement to local storage...');
            allAnnouncements.unshift({ id: Date.now().toString(), ...announcementData });
            saveAnnouncements();
            displayAnnouncements();
        }
        
        closeAddAnnouncementModal();
        alert('Announcement added successfully!');
    } catch (error) {
        console.error('Error adding announcement:', error);
        alert('Error adding announcement: ' + error.message);
    }
}

async function deleteAnnouncement(announcementId) {
    if (!isAdmin || !confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
        if (window.isFirebaseEnabled && typeof announcementsCollection !== 'undefined') {
            console.log('Deleting announcement from Firebase...');
            await announcementsCollection.doc(announcementId).delete();
            console.log('Announcement deleted from Firebase successfully');
        } else {
            console.log('Deleting announcement from local storage...');
            allAnnouncements = allAnnouncements.filter(a => a.id !== announcementId);
            saveAnnouncements();
            displayAnnouncements();
        }
        alert('Announcement deleted successfully!');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Error deleting announcement: ' + error.message);
    }
}

// Add function to manually sync all data to Firebase (for admin use)
async function syncAllDataToFirebase() {
    if (!isAdmin) {
        alert('Admin access required');
        return;
    }
    
    if (!window.isFirebaseEnabled) {
        alert('Firebase not available');
        return;
    }
    
    if (!confirm('This will upload all local data to Firebase. Continue?')) {
        return;
    }
    
    try {
        await uploadLocalDataToFirebase();
        alert('All data synced to Firebase successfully!');
    } catch (error) {
        console.error('Error syncing data:', error);
        alert('Error syncing data: ' + error.message);
    }
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

// Clean up listeners
window.addEventListener('beforeunload', () => {
    if (typeof eventsListener !== 'undefined' && eventsListener) eventsListener();
    if (typeof announcementsListener !== 'undefined' && announcementsListener) announcementsListener();
    if (typeof resourcesListener !== 'undefined' && resourcesListener) resourcesListener();
});
