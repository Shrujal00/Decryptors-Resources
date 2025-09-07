// Initialize authentication system in Firebase
async function initializeFirebaseAuth() {
    if (!window.isFirebaseEnabled) {
        console.log('Firebase not available, skipping auth initialization');
        return;
    }

    try {
        // Check if auth document exists
        const authDoc = await db.collection('auth').doc('admin').get();
        
        if (!authDoc.exists) {
            console.log('Setting up admin authentication...');
            
            // Hash the default password
            const defaultPassword = 'decryptors2025';
            const hashedPassword = await hashPasswordForSetup(defaultPassword);
            
            // Create auth document
            await db.collection('auth').doc('admin').set({
                username: 'admin',
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            });
            
            console.log('Admin authentication configured successfully');
            console.log('Default credentials: admin / decryptors2025');
            console.log('Please change these credentials after first login');
        } else {
            console.log('Admin authentication already configured');
        }
    } catch (error) {
        console.error('Error initializing Firebase auth:', error);
    }
}

// Hash function for setup (matches the one in admin.js)
async function hashPasswordForSetup(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'decryptors_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to change admin password (for admin use)
async function changeAdminPassword(currentPassword, newPassword) {
    if (!isAdmin) {
        alert('Admin access required');
        return false;
    }

    try {
        const authDoc = await db.collection('auth').doc('admin').get();
        const authData = authDoc.data();
        
        // Verify current password
        const hashedCurrentPassword = await hashPasswordForSetup(currentPassword);
        if (hashedCurrentPassword !== authData.password) {
            throw new Error('Current password is incorrect');
        }
        
        // Hash new password
        const hashedNewPassword = await hashPasswordForSetup(newPassword);
        
        // Update password
        await db.collection('auth').doc('admin').update({
            password: hashedNewPassword,
            lastPasswordChange: new Date().toISOString()
        });
        
        alert('Password changed successfully');
        return true;
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password: ' + error.message);
        return false;
    }
}

// Initialize auth on app load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.isFirebaseEnabled) {
            initializeFirebaseAuth();
        }
    }, 2000);
});
