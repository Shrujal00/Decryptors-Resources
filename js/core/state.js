// Global state management
let currentPage = 'home';
let currentField = '';
let isAdmin = false;
let allResources = [];
let allEvents = [];
let allAnnouncements = [];
let allRoadmaps = {};
let editingEventId = null;
let editingRoadmapId = null;

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
