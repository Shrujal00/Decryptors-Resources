// Firebase initialization and data management
function loadLocalData() {
    // Only load local data if Firebase is not enabled
    if (!window.isFirebaseEnabled) {
        allResources = JSON.parse(localStorage.getItem('roadmapResources')) || defaultResources;
        allEvents = JSON.parse(localStorage.getItem('communityEvents')) || defaultEvents;
        allAnnouncements = JSON.parse(localStorage.getItem('communityAnnouncements')) || defaultAnnouncements;
        
        displayEvents();
        displayAnnouncements();
        generateRoadmapCards();
        console.log('Local data loaded (Firebase disabled)');
    } else {
        console.log('Firebase enabled - skipping local data load');
    }
}

async function seedDefaultData() {
    try {
        await uploadLocalDataToFirebase();
        
        // Seed roadmaps to Firebase
        const roadmapsSnapshot = await roadmapsCollection.get();
        if (roadmapsSnapshot.empty) {
            console.log('Seeding default roadmaps...');
            for (const [key, roadmap] of Object.entries(roadmapData)) {
                await roadmapsCollection.doc(key).set({
                    ...roadmap,
                    createdAt: new Date().toISOString()
                });
            }
        }
        
        const resourcesSnapshot = await resourcesCollection.get();
        if (resourcesSnapshot.empty) {
            console.log('Seeding default resources...');
            for (const [field, data] of Object.entries(defaultResources)) {
                await resourcesCollection.doc(field).set(data);
            }
        }

        // NOTE: Events seeding disabled to prevent automatic re-creation
        // Uncomment below if you want to seed default events on first setup
        /*
        const eventsSnapshot = await eventsCollection.get();
        if (eventsSnapshot.empty) {
            console.log('Seeding default events...');
            for (const event of defaultEvents) {
                await eventsCollection.add(event);
            }
        }
        */

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

async function uploadLocalDataToFirebase() {
    try {
        console.log('Checking for existing local data to upload...');
        
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
        
        const localEvents = JSON.parse(localStorage.getItem('communityEvents'));
        if (localEvents && localEvents.length > 0) {
            console.log('Uploading local events to Firebase...');
            const eventsSnapshot = await eventsCollection.get();
            if (eventsSnapshot.empty) {
                for (const event of localEvents) {
                    const { id, ...eventData } = event;
                    await eventsCollection.add(eventData);
                }
                console.log('Uploaded local events to Firebase');
            }
        }
        
        const localAnnouncements = JSON.parse(localStorage.getItem('communityAnnouncements'));
        if (localAnnouncements && localAnnouncements.length > 0) {
            console.log('Uploading local announcements to Firebase...');
            const announcementsSnapshot = await announcementsCollection.get();
            if (announcementsSnapshot.empty) {
                for (const announcement of localAnnouncements) {
                    const { id, ...announcementData } = announcement;
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
        // Clear localStorage to prevent conflicts with Firebase data
        localStorage.removeItem('communityEvents');
        localStorage.removeItem('communityAnnouncements');
        console.log('🧹 Cleared localStorage to prevent duplicates with Firebase');

        // Listen for users changes (for members directory)
        usersListener = db.collection('users').where('isHidden', '!=', true).onSnapshot((snapshot) => {
            console.log('👥 Users synced from Firebase');
            if (currentPage === 'members') {
                loadMembersDirectory();
            }
        }, (error) => {
            console.error('Users listener error:', error);
        });

        // Listen for roadmaps changes
        roadmapsListener = roadmapsCollection.onSnapshot((snapshot) => {
            allRoadmaps = {};
            snapshot.forEach((doc) => {
                allRoadmaps[doc.id] = doc.data();
            });
            generateRoadmapCards();
            console.log('Roadmaps synced from Firebase:', Object.keys(allRoadmaps).length);
        }, (error) => {
            console.error('Roadmaps listener error:', error);
            generateRoadmapCards(); // Use static data on error
        });

        eventsListener = eventsCollection.onSnapshot((snapshot) => {
            allEvents = [];
            snapshot.forEach((doc) => {
                allEvents.push({ id: doc.id, ...doc.data() });
            });
            displayEvents();
            console.log('Events synced from Firebase');
        }, (error) => {
            console.error('Events listener error:', error);
            loadLocalData();
        });

        announcementsListener = announcementsCollection.onSnapshot((snapshot) => {
            allAnnouncements = [];
            snapshot.forEach((doc) => {
                allAnnouncements.push({ id: doc.id, ...doc.data() });
            });
            displayAnnouncements();
            console.log('Announcements synced from Firebase');
        }, (error) => {
            console.error('Announcements listener error:', error);
            loadLocalData();
        });

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

// Initialize Firebase auth on app load
async function initializeFirebaseAuth() {
    console.log('🔧 Initializing Firebase authentication...');
    
    if (!window.isFirebaseEnabled) {
        console.warn('⚠️ Firebase not enabled - admin authentication will not work');
        return;
    }

    if (typeof db === 'undefined') {
        console.error('❌ Firebase database not available for auth initialization');
        return;
    }

    try {
        console.log('🔍 Checking for existing admin document...');
        const authDoc = await db.collection('auth').doc('admin').get();
        
        if (!authDoc.exists) {
            console.log('📝 Admin document not found, creating new one...');
            const hashedPassword = await hashPassword('decryptors2025');
            
            const adminData = {
                username: 'admin',
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            };
            
            console.log('💾 Saving admin credentials to Firebase...');
            await db.collection('auth').doc('admin').set(adminData);
            
            console.log('✅ Admin authentication configured successfully');
            console.log('🔑 Username: admin');
            console.log('🔑 Password: decryptors2025');
        } else {
            console.log('✅ Admin document already exists');
            const authData = authDoc.data();
            console.log('📊 Admin created:', authData.createdAt);
            console.log('📊 Last login:', authData.lastLogin || 'Never');
        }
    } catch (error) {
        console.error('💥 Error initializing Firebase auth:', error);
        console.error('🔍 Error details:', error.message);
    }
}

// Hash function for auth initialization
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'decryptors_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper function to clear all data and start fresh
function clearAllData() {
    // Clear localStorage
    localStorage.clear();
    
    // Clear in-memory arrays
    allEvents = [];
    allAnnouncements = [];
    
    // Refresh displays
    displayEvents();
    displayAnnouncements();
    
    console.log('🧹 All local data cleared. Refresh page to sync with Firebase.');
}

// Make it available globally for debugging
window.clearAllData = clearAllData;
