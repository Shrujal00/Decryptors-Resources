// Members directory components

let allMembers = [];

async function loadMembersDirectory() {
    console.log('📊 Loading members directory...');
    
    try {
        if (!window.isFirebaseEnabled || !authSystem) {
            console.warn('⚠️ Firebase or auth system not available');
            document.getElementById('members-list').innerHTML = '<p class="empty-state">Members directory requires authentication.</p>';
            return;
        }
        
        allMembers = await authSystem.getAllMembers();
        console.log('✅ Loaded members:', allMembers.length);
        displayMembers(allMembers);
        
        // Setup search functionality
        const searchInput = document.getElementById('members-search');
        if (searchInput) {
            // Remove existing listeners
            searchInput.removeEventListener('input', handleMembersSearch);
            searchInput.addEventListener('input', handleMembersSearch);
        }
    } catch (error) {
        console.error('💥 Error loading members:', error);
        document.getElementById('members-list').innerHTML = '<p class="empty-state">Error loading members directory.</p>';
    }
}

function displayMembers(members) {
    const membersList = document.getElementById('members-list');
    if (!membersList) return;
    
    if (members.length === 0) {
        membersList.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No members found.</p></div>';
        return;
    }
    
    membersList.innerHTML = members.map(member => `
        <div class="member-card" onclick="showMemberProfile('${member.id}')">
            <div class="member-header">
                <div class="member-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <span class="role-badge role-${member.role}">${member.role}</span>
            </div>
            <div class="member-info">
                <h3>${member.fullName || member.username}</h3>
                <p class="username">@${member.username}</p>
                <p class="member-email">${member.email || ''}</p>
            </div>
            <div class="member-links">
                ${member.socialLinks?.github ? `<i class="fab fa-github" title="GitHub"></i>` : ''}
                ${member.socialLinks?.linkedin ? `<i class="fab fa-linkedin" title="LinkedIn"></i>` : ''}
                ${member.socialLinks?.leetcode ? `<i class="fas fa-code" title="LeetCode"></i>` : ''}
                ${member.socialLinks?.twitter ? `<i class="fab fa-twitter" title="Twitter"></i>` : ''}
            </div>
            <div class="member-footer">
                <small>Joined ${formatDate(member.createdAt)}</small>
            </div>
        </div>
    `).join('');
}

function handleMembersSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        displayMembers(allMembers);
        return;
    }
    
    const filteredMembers = allMembers.filter(member => {
        return (
            member.username.toLowerCase().includes(searchTerm) ||
            (member.fullName && member.fullName.toLowerCase().includes(searchTerm)) ||
            (member.email && member.email.toLowerCase().includes(searchTerm)) ||
            (member.socialLinks?.github && member.socialLinks.github.toLowerCase().includes(searchTerm)) ||
            (member.socialLinks?.linkedin && member.socialLinks.linkedin.toLowerCase().includes(searchTerm))
        );
    });
    
    displayMembers(filteredMembers);
}

function showMemberProfile(memberId) {
    console.log('👤 Showing profile for member:', memberId);
    showPage('profile');
    // Small delay to ensure page is loaded
    setTimeout(() => {
        loadProfile(memberId);
    }, 100);
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    } catch (error) {
        return 'Unknown';
    }
}
