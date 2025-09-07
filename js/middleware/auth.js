// Authentication middleware and session management
class AuthManager {
    constructor() {
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
        this.sessionKey = 'adminSession';
        this.lastActivityKey = 'lastActivity';
        this.initializeAuth();
    }

    initializeAuth() {
        // Check if session is valid on page load
        this.validateSession();
        
        // Set up activity tracking
        this.trackUserActivity();
        
        // Check session periodically
        setInterval(() => {
            this.validateSession();
        }, 60000); // Check every minute
    }

    login(username, password) {
        // Validate credentials
        if (username === 'admin' && password === 'decryptors2025') {
            const sessionData = {
                isLoggedIn: true,
                loginTime: Date.now(),
                lastActivity: Date.now(),
                sessionId: this.generateSessionId()
            };
            
            // Store session data
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            localStorage.setItem(this.lastActivityKey, Date.now().toString());
            localStorage.setItem('isAdmin', 'true');
            
            // Update global state
            isAdmin = true;
            this.updateAdminState(true);
            
            console.log('Admin login successful');
            return true;
        }
        
        console.log('Invalid login credentials');
        return false;
    }

    logout() {
        // Clear all session data
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.lastActivityKey);
        localStorage.removeItem('isAdmin');
        
        // Update global state
        isAdmin = false;
        this.updateAdminState(false);
        
        console.log('Admin logged out');
    }

    validateSession() {
        const sessionData = this.getSessionData();
        
        if (!sessionData) {
            this.forceLogout();
            return false;
        }

        const now = Date.now();
        const timeSinceLastActivity = now - sessionData.lastActivity;

        // Check if session has expired
        if (timeSinceLastActivity > this.sessionTimeout) {
            console.log('Session expired due to inactivity');
            this.forceLogout();
            return false;
        }

        // Session is valid, update global state
        isAdmin = true;
        this.updateAdminState(true);
        return true;
    }

    getSessionData() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error parsing session data:', error);
            return null;
        }
    }

    updateLastActivity() {
        const sessionData = this.getSessionData();
        if (sessionData) {
            sessionData.lastActivity = Date.now();
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            localStorage.setItem(this.lastActivityKey, Date.now().toString());
        }
    }

    trackUserActivity() {
        const events = ['click', 'keypress', 'scroll', 'mousemove'];
        let activityTimeout;

        events.forEach(event => {
            document.addEventListener(event, () => {
                // Throttle activity updates to avoid excessive storage writes
                clearTimeout(activityTimeout);
                activityTimeout = setTimeout(() => {
                    if (isAdmin) {
                        this.updateLastActivity();
                    }
                }, 1000);
            }, { passive: true });
        });
    }

    forceLogout() {
        // Clear all session data
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.lastActivityKey);
        localStorage.removeItem('isAdmin');
        
        // Update global state
        isAdmin = false;
        this.updateAdminState(false);
        
        // Show login form if on admin page
        const adminLogin = document.getElementById('admin-login');
        const adminDashboard = document.getElementById('admin-dashboard');
        
        if (adminLogin) adminLogin.style.display = 'block';
        if (adminDashboard) adminDashboard.style.display = 'none';
        
        // Clear form fields
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        if (usernameField) usernameField.value = '';
        if (passwordField) passwordField.value = '';
        
        console.log('Forced logout executed');
    }

    updateAdminState(isLoggedIn) {
        // Update UI elements
        if (typeof updateAdminUI === 'function') {
            updateAdminUI();
        }
        
        // Regenerate roadmap cards to show/hide admin controls
        if (typeof generateRoadmapCards === 'function') {
            generateRoadmapCards();
        }
        
        // Update admin stats if logged in
        if (isLoggedIn && typeof updateAdminStats === 'function') {
            updateAdminStats();
        }
    }

    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    isAuthenticated() {
        return this.validateSession();
    }

    getSessionInfo() {
        const sessionData = this.getSessionData();
        if (!sessionData) return null;
        
        const now = Date.now();
        const sessionAge = now - sessionData.loginTime;
        const timeRemaining = this.sessionTimeout - (now - sessionData.lastActivity);
        
        return {
            loginTime: new Date(sessionData.loginTime),
            sessionAge: Math.floor(sessionAge / 1000 / 60), // minutes
            timeRemaining: Math.floor(timeRemaining / 1000 / 60), // minutes
            sessionId: sessionData.sessionId
        };
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for global access
window.authManager = authManager;
