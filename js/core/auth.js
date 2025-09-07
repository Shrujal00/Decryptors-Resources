// Authentication and user management system

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = new Map();
        this.initializeAuth();
    }

    async initializeAuth() {
        console.log('🔧 Initializing authentication system...');
        
        if (!window.isFirebaseEnabled) {
            console.warn('⚠️ Firebase not enabled - authentication will not work');
            return;
        }

        await this.createSuperUser();
        await this.loadUsers();
        this.checkCurrentSession();
    }

    async createSuperUser() {
        try {
            console.log('👑 Checking for SuperUser...');
            const superUserDoc = await db.collection('users').doc('superuser').get();
            
            if (!superUserDoc.exists) {
                console.log('👑 Creating SuperUser...');
                const superUserData = {
                    username: 'superuser',
                    password: await this.hashPassword('superuser_secret_2025'),
                    role: 'superuser',
                    fullName: 'System Administrator',
                    email: 'system@decryptors.com',
                    createdAt: new Date().toISOString(),
                    isHidden: true
                };
                
                await db.collection('users').doc('superuser').set(superUserData);
                console.log('✅ SuperUser created successfully');
            } else {
                console.log('✅ SuperUser already exists');
            }
        } catch (error) {
            console.error('💥 Error creating SuperUser:', error);
        }
    }

    async loadUsers() {
        try {
            console.log('📊 Loading users from Firebase...');
            const usersSnapshot = await db.collection('users').where('isHidden', '!=', true).get();
            
            this.users.clear();
            usersSnapshot.forEach(doc => {
                this.users.set(doc.id, doc.data());
            });
            
            console.log(`✅ Loaded ${this.users.size} users`);
        } catch (error) {
            console.error('💥 Error loading users:', error);
        }
    }

    checkCurrentSession() {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (session.expiresAt > Date.now()) {
                    this.currentUser = session.user;
                    console.log('✅ Session restored for:', this.currentUser.username);
                    this.updateUI();
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('💥 Error restoring session:', error);
                this.logout();
            }
        }
    }

    async login(username, password) {
        console.log('🔐 Login attempt for:', username);
        
        try {
            if (!window.isFirebaseEnabled) {
                throw new Error('Firebase connection required');
            }

            // Check for superuser login
            if (username === 'superuser') {
                const superUserDoc = await db.collection('users').doc('superuser').get();
                if (superUserDoc.exists) {
                    const userData = superUserDoc.data();
                    const hashedPassword = await this.hashPassword(password);
                    
                    if (hashedPassword === userData.password) {
                        this.currentUser = { ...userData, id: 'superuser' };
                        this.saveSession();
                        this.updateUI();
                        console.log('👑 SuperUser login successful');
                        return { success: true, user: this.currentUser };
                    }
                }
            }

            // Check regular users
            const usersSnapshot = await db.collection('users').where('username', '==', username).get();
            
            if (usersSnapshot.empty) {
                throw new Error('User not found');
            }

            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc.data();
            const hashedPassword = await this.hashPassword(password);

            if (hashedPassword === userData.password) {
                this.currentUser = { ...userData, id: userDoc.id };
                this.saveSession();
                
                // Update last login
                await db.collection('users').doc(userDoc.id).update({
                    lastLogin: new Date().toISOString()
                });

                // Update UI immediately after successful login
                this.updateUI();

                console.log('✅ Login successful for:', username);
                return { success: true, user: this.currentUser };
            } else {
                throw new Error('Invalid password');
            }

        } catch (error) {
            console.error('💥 Login error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async register(username, password, fullName, email) {
        console.log('📝 Registration attempt for:', username);
        
        try {
            if (!window.isFirebaseEnabled) {
                throw new Error('Firebase connection required');
            }

            // Check if username already exists
            const usersSnapshot = await db.collection('users').where('username', '==', username).get();
            if (!usersSnapshot.empty) {
                throw new Error('Username already exists');
            }

            const userData = {
                username,
                password: await this.hashPassword(password),
                fullName,
                email,
                role: 'member',
                socialLinks: {
                    linkedin: '',
                    twitter: '',
                    github: '',
                    leetcode: ''
                },
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isHidden: false
            };

            const docRef = await db.collection('users').add(userData);
            this.currentUser = { ...userData, id: docRef.id };
            this.saveSession();

            // Update UI immediately after successful registration
            this.updateUI();

            console.log('✅ Registration successful for:', username);
            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error('💥 Registration error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async updateProfile(userId, profileData) {
        try {
            await db.collection('users').doc(userId).update({
                ...profileData,
                updatedAt: new Date().toISOString()
            });

            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = { ...this.currentUser, ...profileData };
                this.saveSession();
            }

            console.log('✅ Profile updated for:', userId);
            return { success: true };

        } catch (error) {
            console.error('💥 Profile update error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async changeUserRole(targetUserId, newRole) {
        try {
            if (!this.currentUser || !this.canManageRoles()) {
                throw new Error('Insufficient permissions');
            }

            const targetUserDoc = await db.collection('users').doc(targetUserId).get();
            if (!targetUserDoc.exists) {
                throw new Error('User not found');
            }

            const targetUser = targetUserDoc.data();

            // Only SuperUser can manage roles
            if (this.currentUser.role === 'superuser') {
                await db.collection('users').doc(targetUserId).update({
                    role: newRole,
                    updatedAt: new Date().toISOString()
                });
                console.log('✅ Role changed for:', targetUserId, 'to:', newRole);
                return { success: true };
            } else {
                throw new Error('Only SuperUser can change roles');
            }

        } catch (error) {
            console.error('💥 Role change error:', error.message);
            return { success: false, error: error.message };
        }
    }

    saveSession() {
        const sessionData = {
            user: this.currentUser,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('userSession', JSON.stringify(sessionData));
    }

    logout() {
        console.log('🚪 Logging out user:', this.currentUser?.username);
        this.currentUser = null;
        localStorage.removeItem('userSession');
        
        // Also clear old admin state for compatibility
        localStorage.removeItem('isAdmin');
        
        // Reset global state
        isAdmin = false;
        
        // Update UI immediately
        this.updateUI();
        
        // Regenerate page content to remove admin controls
        if (typeof generateRoadmapCards === 'function') {
            generateRoadmapCards();
        }
        
        // Go back to home page
        showPage('home');
        
        console.log('✅ Logout complete');
    }

    updateUI() {
        // Update global state
        isAdmin = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'superuser');
        
        // Update admin UI controls
        if (typeof updateAdminUI === 'function') {
            updateAdminUI();
        }
        
        // Update auth section in navbar
        this.updateAuthUI();
        
        // Update any page-specific content
        this.updatePageContent();
    }

    updateAuthUI() {
        const authSection = document.getElementById('auth-section');
        if (!authSection) return;

        if (this.currentUser) {
            authSection.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">Welcome, ${this.currentUser.fullName || this.currentUser.username}</span>
                    <button class="btn btn-profile" onclick="showPage('profile')">
                        <i class="fas fa-user"></i> Profile
                    </button>
                    <button class="btn btn-logout" onclick="authSystem.logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <button class="btn btn-primary" onclick="showPage('auth')">Login / Sign Up</button>
            `;
        }
    }

    updatePageContent() {
        // Refresh current page content based on auth state
        const currentPageElement = document.querySelector('.page.active');
        if (!currentPageElement) return;
        
        const pageId = currentPageElement.id;
        
        // Force refresh of pages that depend on auth state
        if (pageId === 'community') {
            if (typeof displayEvents === 'function') displayEvents();
            if (typeof displayAnnouncements === 'function') displayAnnouncements();
        } else if (pageId === 'roadmap') {
            if (currentField && typeof loadFieldResources === 'function') {
                loadFieldResources(currentField);
            }
        } else if (pageId === 'home') {
            if (typeof generateRoadmapCards === 'function') {
                generateRoadmapCards();
            }
        }
    }

    // Utility methods
    canManageRoles() {
        return this.currentUser && this.currentUser.role === 'superuser';
    }

    canManageContent() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'superuser');
    }

    canEditProfile(targetUserId) {
        if (!this.currentUser) return false;
        if (this.currentUser.role === 'superuser') return true;
        if (this.currentUser.role === 'admin') return true;
        return this.currentUser.id === targetUserId;
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'decryptors_salt_2025');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async getUserById(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            return userDoc.exists ? { id: userId, ...userDoc.data() } : null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    async getAllMembers() {
        try {
            const usersSnapshot = await db.collection('users').where('isHidden', '!=', true).get();
            const members = [];
            usersSnapshot.forEach(doc => {
                members.push({ id: doc.id, ...doc.data() });
            });
            return members;
        } catch (error) {
            console.error('Error fetching members:', error);
            return [];
        }
    }
}

// Initialize auth system
const authSystem = new AuthSystem();
window.authSystem = authSystem;
