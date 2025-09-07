// Profile management components

async function loadProfile(userId = null) {
    const targetUserId = userId || authSystem.currentUser?.id;
    
    if (!targetUserId) {
        document.getElementById('profile-content').innerHTML = '<p>Please log in to view your profile.</p>';
        return;
    }
    
    const user = userId ? await authSystem.getUserById(userId) : authSystem.currentUser;
    
    if (!user) {
        document.getElementById('profile-content').innerHTML = '<p>User not found.</p>';
        return;
    }
    
    const isOwnProfile = !userId || userId === authSystem.currentUser?.id;
    const canEdit = authSystem.canEditProfile(targetUserId);
    
    // Fetch GitHub and LeetCode streaks
    const githubStreak = await fetchGitHubStreak(user.socialLinks?.github);
    const leetcodeStreak = await fetchLeetCodeStreak(user.socialLinks?.leetcode);
    
    document.getElementById('profile-content').innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-info">
                    <h2>${user.fullName || user.username}</h2>
                    <p class="username">@${user.username}</p>
                    <span class="role-badge role-${user.role}">${user.role.toUpperCase()}</span>
                    ${canEdit ? `
                    <button class="btn btn-edit" onclick="toggleProfileEdit()">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ` : ''}
                </div>
            </div>
            
            ${canEdit ? `
            <div class="profile-edit-form" id="profile-edit-form" style="display: none;">
                <h3>Edit Profile</h3>
                <form id="profile-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Full Name:</label>
                            <input type="text" id="edit-fullname" value="${user.fullName || ''}">
                        </div>
                        <div class="form-group">
                            <label>GitHub Username:</label>
                            <input type="text" id="edit-github" value="${user.socialLinks?.github || ''}" placeholder="username">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>LinkedIn URL:</label>
                            <input type="url" id="edit-linkedin" value="${user.socialLinks?.linkedin || ''}" placeholder="https://linkedin.com/in/username">
                        </div>
                        <div class="form-group">
                            <label>LeetCode Username:</label>
                            <input type="text" id="edit-leetcode" value="${user.socialLinks?.leetcode || ''}" placeholder="username">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Twitter URL:</label>
                            <input type="url" id="edit-twitter" value="${user.socialLinks?.twitter || ''}" placeholder="https://twitter.com/username">
                        </div>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                        <button type="button" class="btn btn-secondary" onclick="toggleProfileEdit()">Cancel</button>
                    </div>
                </form>
            </div>
            ` : ''}
            
            <div class="profile-sections">
                <div class="profile-section">
                    <h3>Social Links</h3>
                    <div class="social-links-list">
                        ${user.socialLinks?.github ? `
                        <div class="social-link-item">
                            <i class="fab fa-github"></i>
                            <a href="https://github.com/${user.socialLinks.github}" target="_blank">GitHub</a>
                        </div>
                        ` : '<p class="no-links">No GitHub link provided</p>'}
                        ${user.socialLinks?.linkedin ? `
                        <div class="social-link-item">
                            <i class="fab fa-linkedin"></i>
                            <a href="${user.socialLinks.linkedin}" target="_blank">LinkedIn</a>
                        </div>
                        ` : ''}
                        ${user.socialLinks?.twitter ? `
                        <div class="social-link-item">
                            <i class="fab fa-twitter"></i>
                            <a href="${user.socialLinks.twitter}" target="_blank">Twitter</a>
                        </div>
                        ` : ''}
                        ${user.socialLinks?.leetcode ? `
                        <div class="social-link-item">
                            <i class="fas fa-code"></i>
                            <a href="https://leetcode.com/${user.socialLinks.leetcode}" target="_blank">LeetCode</a>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>Coding Streaks</h3>
                    <div class="streaks-container">
                        <div class="streak-item">
                            <div class="streak-icon">
                                <i class="fab fa-github"></i>
                            </div>
                            <div class="streak-info">
                                <h4>GitHub Streak</h4>
                                <p class="streak-number">${githubStreak}</p>
                            </div>
                        </div>
                        <div class="streak-item">
                            <div class="streak-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="streak-info">
                                <h4>LeetCode Streak</h4>
                                <p class="streak-number">${leetcodeStreak}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${authSystem.canManageRoles() && user.role !== 'superuser' ? `
                <div class="profile-section">
                    <h3>Role Management <small>(SuperUser Only)</small></h3>
                    <div class="role-management">
                        <select id="role-select">
                            <option value="member" ${user.role === 'member' ? 'selected' : ''}>Member</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                        <button class="btn btn-warning" onclick="changeUserRole('${user.id}')">
                            Change Role
                        </button>
                    </div>
                    <p class="role-help">Note: Admins can manage content but cannot change roles or remove other admins.</p>
                </div>
                ` : ''}
                
                ${user.role === 'admin' ? `
                <div class="profile-section">
                    <h3>Admin Permissions</h3>
                    <div class="admin-permissions">
                        <div class="permission-item">
                            <i class="fas fa-check text-success"></i>
                            <span>Add/Edit/Delete Resources</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-check text-success"></i>
                            <span>Add/Edit/Delete Events</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-check text-success"></i>
                            <span>Add/Edit/Delete Announcements</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-check text-success"></i>
                            <span>Add/Edit/Delete Roadmaps</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-times text-danger"></i>
                            <span>Change User Roles (SuperUser Only)</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-times text-danger"></i>
                            <span>Remove Other Admins (SuperUser Only)</span>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Setup profile form listener
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

function toggleProfileEdit() {
    const form = document.getElementById('profile-edit-form');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const profileData = {
        fullName: document.getElementById('edit-fullname').value,
        socialLinks: {
            linkedin: document.getElementById('edit-linkedin').value,
            twitter: document.getElementById('edit-twitter').value,
            github: document.getElementById('edit-github').value,
            leetcode: document.getElementById('edit-leetcode').value
        }
    };
    
    const result = await authSystem.updateProfile(authSystem.currentUser.id, profileData);
    
    if (result.success) {
        alert('Profile updated successfully!');
        loadProfile();
    } else {
        alert('Failed to update profile: ' + result.error);
    }
}

async function changeUserRole(userId) {
    const newRole = document.getElementById('role-select').value;
    const result = await authSystem.changeUserRole(userId, newRole);
    
    if (result.success) {
        alert('Role changed successfully!');
        loadProfile(userId);
    } else {
        alert('Failed to change role: ' + result.error);
    }
}

// Streak fetching functions
async function fetchGitHubStreak(username) {
    if (!username) return 'N/A';
    
    try {
        // GitHub doesn't have a direct streak API, so we'll simulate it
        // In a real implementation, you'd use GitHub API to calculate streaks
        const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        if (response.ok) {
            const events = await response.json();
            // Simple streak calculation - count consecutive days with commits
            return calculateGitHubStreak(events);
        }
    } catch (error) {
        console.error('Error fetching GitHub streak:', error);
    }
    return 'N/A';
}

async function fetchLeetCodeStreak(username) {
    if (!username) return 'N/A';
    
    try {
        // LeetCode doesn't have a public API, so we'll use a proxy or simulate
        // In a real implementation, you'd use web scraping or unofficial APIs
        return Math.floor(Math.random() * 100) + ' days'; // Simulated for demo
    } catch (error) {
        console.error('Error fetching LeetCode streak:', error);
    }
    return 'N/A';
}

function calculateGitHubStreak(events) {
    // Simplified streak calculation
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.created_at);
            return eventDate.toDateString() === currentDate.toDateString();
        });
        
        if (dayEvents.length > 0) {
            streak++;
        } else if (streak > 0) {
            break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak + ' days';
}
