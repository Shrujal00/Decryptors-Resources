// Authentication UI components

function showLoginPage() {
    // Hide register form, show login form
    document.getElementById('register-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');
}

function showSignUpPage() {
    // Hide login form, show register form
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('register-section').classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    console.log('🔐 Attempting login for:', username);
    
    const result = await authSystem.login(username, password);
    
    if (result.success) {
        alert('Login successful!');
        // UI is already updated by authSystem.updateUI() in login method
        showPage('home');
    } else {
        alert('Login failed: ' + result.error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('register-fullname').value;
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    console.log('📝 Attempting registration for:', username);
    
    const result = await authSystem.register(username, password, fullName, email);
    
    if (result.success) {
        alert('Registration successful! Welcome to Decryptors!');
        // UI is already updated by authSystem.updateUI() in register method
        showPage('profile');
    } else {
        alert('Registration failed: ' + result.error);
    }
}

function setupAuthEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}
