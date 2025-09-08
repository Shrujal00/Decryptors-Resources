// Navbar navigation and interaction handler

function initializeNavbar() {
    console.log('🧭 Initializing navbar...');
    
    // Navigation event delegation
    document.addEventListener('click', function(e) {
        // Handle nav links (desktop)
        if (e.target.closest('.nav-link')) {
            e.preventDefault();
            const link = e.target.closest('.nav-link');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            
            if (page) {
                console.log('🔗 Nav link clicked:', page, field);
                showPage(page, field);
            }
        }
        
        // Handle mobile nav links
        if (e.target.closest('.mobile-nav-link:not(.mobile-dropdown-toggle)')) {
            e.preventDefault();
            const link = e.target.closest('.mobile-nav-link');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            
            if (page) {
                console.log('📱 Mobile nav link clicked:', page, field);
                showPage(page, field);
                closeMobileMenu();
            }
        }
        
        // Handle mobile sub links
        if (e.target.closest('.mobile-sub-link')) {
            e.preventDefault();
            const link = e.target.closest('.mobile-sub-link');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            
            if (page && field) {
                console.log('📱 Mobile sub link clicked:', page, field);
                showPage(page, field);
                closeMobileMenu();
            }
        }
        
        // Handle dropdown links (desktop)
        if (e.target.closest('.dropdown-content a')) {
            e.preventDefault();
            const link = e.target.closest('.dropdown-content a');
            const page = link.getAttribute('data-page');
            const field = link.getAttribute('data-field');
            
            if (page && field) {
                console.log('🔗 Dropdown link clicked:', page, field);
                showPage(page, field);
            }
        }
        
        // Handle logo click
        if (e.target.closest('.nav-logo')) {
            console.log('🏠 Logo clicked');
            showPage('home');
        }
    });
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu && hamburger) {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu && hamburger) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Also close any open mobile dropdowns
        const dropdownContent = document.querySelector('.mobile-dropdown-content');
        const dropdownToggle = document.querySelector('.mobile-dropdown-toggle');
        if (dropdownContent && dropdownToggle) {
            dropdownContent.classList.remove('active');
            dropdownToggle.classList.remove('active');
        }
    }
}

function toggleMobileDropdown() {
    const dropdownContent = document.querySelector('.mobile-dropdown-content');
    const dropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    
    if (dropdownContent && dropdownToggle) {
        dropdownContent.classList.toggle('active');
        dropdownToggle.classList.toggle('active');
    }
}

// User dropdown functions
function toggleUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('active');
    }
}

function closeUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.classList.remove('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown && !userDropdown.contains(e.target)) {
        closeUserDropdown();
    }
});

// Update navbar based on authentication state
function updateNavbar() {
    const authSection = document.getElementById('auth-section');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (currentUser) {
        // User is logged in
        if (authSection) authSection.style.display = 'none';
        if (userDropdown) {
            userDropdown.style.display = 'flex';
            
            // Update user info
            const userName = document.getElementById('user-display-name');
            const userRole = document.getElementById('user-display-role');
            const userAvatar = userDropdown.querySelector('.user-avatar');
            
            const displayName = currentUser.fullName || currentUser.username || 'User';
            const role = currentUser.role || 'Member';
            
            if (userName) userName.textContent = displayName;
            if (userRole) userRole.textContent = role;
            
            // Update avatar
            if (userAvatar) {
                updateUserAvatar(userAvatar, currentUser);
            }
        }
    } else {
        // User is not logged in
        if (authSection) authSection.style.display = 'flex';
        if (userDropdown) userDropdown.style.display = 'none';
    }
    
    // Update mobile auth section
    updateMobileAuthSection();
}

// Scroll to roadmaps section
function scrollToRoadmaps() {
    const roadmapsSection = document.getElementById('roadmaps-section');
    if (roadmapsSection) {
        roadmapsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateActiveNavLink(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[data-page="${page}"]:not([data-field])`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Update mobile auth section based on user state
function updateMobileAuthSection() {
    const mobileAuth = document.querySelector('.mobile-auth');
    if (!mobileAuth) return;
    
    const user = currentUser;
    
    if (user) {
        // User is logged in - show compact user info
        const displayName = user.fullName || user.username || 'User';
        const role = user.role || 'Member';
        const initials = getInitials(displayName);
        
        mobileAuth.innerHTML = `
            <div class="mobile-user-compact">
                <div class="mobile-user-avatar">
                    ${user.profilePicture ? 
                        `<img src="${user.profilePicture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
                        `<span style="font-weight: 600; font-size: 0.9rem;">${initials}</span>`
                    }
                </div>
                <div class="mobile-user-details">
                    <div class="mobile-user-name">${displayName}</div>
                    <div class="mobile-user-role">${role}</div>
                </div>
                <div class="mobile-user-actions">
                    <button class="btn mobile-action-btn" onclick="showPage('profile'); closeMobileMenu()">
                        <i class="fas fa-user"></i>
                    </button>
                    <button class="btn mobile-action-btn logout-btn" onclick="logout(); closeMobileMenu()">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        `;
    } else {
        // User is not logged in - show login button
        mobileAuth.innerHTML = `
            <button class="btn btn-primary mobile-login-btn" onclick="showPage('auth'); closeMobileMenu()">
                <i class="fas fa-sign-in-alt"></i>Login / Sign Up
            </button>
        `;
    }
}

// Update user avatar with profile picture or initials
function updateUserAvatar(avatarElement, user) {
    const displayName = user.fullName || user.username || 'User';
    const initials = getInitials(displayName);
    
    if (user.profilePicture) {
        // Show profile picture
        avatarElement.innerHTML = `<img src="${user.profilePicture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
        // Show initials
        avatarElement.innerHTML = `<span style="font-weight: 600; font-size: 1rem; color: white;">${initials}</span>`;
    }
}

// Get initials from name
function getInitials(name) {
    if (!name) return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    } else {
        return words.map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    }
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown-content');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close user dropdown
function closeUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown-content');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Global logout function
function logout() {
    if (window.authSystem) {
        authSystem.logout();
    } else {
        console.error('Auth system not available');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-dropdown')) {
        closeUserDropdown();
    }
});
