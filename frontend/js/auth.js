document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMsg = document.getElementById('auth-error');

    // Quick redirect if already logged in
    if (localStorage.getItem('jwt_token')) {
        // window.location.href = 'dashboard.html';
        // For development, we might not auto-redirect so we can test login form.
        // uncomment above for production.
    }

    // Tab switching functionality
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
        errorMsg.classList.add('hidden');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        errorMsg.classList.add('hidden');
    });

    function showMessage(msg, isSuccess = false) {
        errorMsg.textContent = msg;
        if (isSuccess) {
            errorMsg.style.color = 'var(--success)';
            errorMsg.style.background = 'rgba(0, 184, 148, 0.1)';
        } else {
            errorMsg.style.color = 'var(--danger)';
            errorMsg.style.background = 'rgba(255, 118, 117, 0.1)';
        }
        errorMsg.classList.remove('hidden');
    }

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = loginForm.querySelector('button');
        
        btn.textContent = 'Signing in...';
        btn.disabled = true;

        const res = await api.request('/login', 'POST', { email, password });
        
        btn.textContent = 'Sign In';
        btn.disabled = false;

        if (res.error) {
            showMessage(res.error);
        } else {
            // Check based on API structure, assuming res.data contains access_token
            if (res.data && res.data.access_token) {
                localStorage.setItem('jwt_token', res.data.access_token);
            }
            window.location.href = 'dashboard.html';
        }
    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const btn = signupForm.querySelector('button');

        btn.textContent = 'Creating...';
        btn.disabled = true;

        const res = await api.request('/users', 'POST', { name, email, password });
        
        btn.textContent = 'Create Account';
        btn.disabled = false;

        if (res.error) {
            showMessage(res.error);
        } else {
            signupForm.reset();
            loginTab.click();
            showMessage('Account created successfully! Please log in.', true);
            
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 4000);
        }
    });
});
