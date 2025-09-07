// Password change functionality
function openChangePasswordModal() {
    if (!isAdmin) {
        alert('Admin access required');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'change-password-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeChangePasswordModal()">&times;</span>
            <h2>Change Admin Password</h2>
            <form id="change-password-form">
                <div class="form-group">
                    <label for="current-password">Current Password:</label>
                    <input type="password" id="current-password" required>
                </div>
                <div class="form-group">
                    <label for="new-password">New Password:</label>
                    <input type="password" id="new-password" required minlength="8">
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm New Password:</label>
                    <input type="password" id="confirm-password" required minlength="8">
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn btn-primary">Change Password</button>
                    <button type="button" class="btn btn-secondary" onclick="closeChangePasswordModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    document.getElementById('change-password-form').addEventListener('submit', handlePasswordChange);
}

function closeChangePasswordModal() {
    const modal = document.getElementById('change-password-modal');
    if (modal) {
        modal.remove();
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    // Change password
    const success = await changeAdminPassword(currentPassword, newPassword);
    if (success) {
        closeChangePasswordModal();
    }
}
