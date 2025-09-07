// Firebase initialization and data management
function loadLocalData() {
    allResources = JSON.parse(localStorage.getItem('roadmapResources')) || defaultResources;
    allEvents = JSON.parse(localStorage.getItem('communityEvents')) || defaultEvents;
    allAnnouncements = JSON.parse(localStorage.getItem('communityAnnouncements')) || defaultAnnouncements;
    
    displayEvents();
    displayAnnouncements();
    generateRoadmapCards();
    console.log('Local data loaded');
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
