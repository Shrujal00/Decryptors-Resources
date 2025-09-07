// Firebase configuration for compat version (v8 style)
const firebaseConfig = {
  apiKey: "AIzaSyAYbfZ2N5V1jEIxeuGpULaC2ETnoIz0TAU",
  authDomain: "decryptorsresources.firebaseapp.com",
  projectId: "decryptorsresources",
  storageBucket: "decryptorsresources.firebasestorage.app",
  messagingSenderId: "104392877000",
  appId: "1:104392877000:web:747544618b9ee51136d6fd"
};

// Initialize Firebase (using compat version)
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Collections references
const eventsCollection = db.collection('events');
const announcementsCollection = db.collection('announcements');
const resourcesCollection = db.collection('resources');
const roadmapsCollection = db.collection('roadmaps');

// Real-time listeners
let eventsListener = null;
let announcementsListener = null;
let resourcesListener = null;
let roadmapsListener = null;

// Connection status
let isFirebaseEnabled = false;

// Check if Firebase is properly initialized
try {
    if (firebase.apps.length > 0) {
        isFirebaseEnabled = true;
        console.log('Firebase initialized successfully');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    isFirebaseEnabled = false;
}

// Export for global access
window.db = db;
window.eventsCollection = eventsCollection;
window.announcementsCollection = announcementsCollection;
window.resourcesCollection = resourcesCollection;
window.roadmapsCollection = roadmapsCollection;
