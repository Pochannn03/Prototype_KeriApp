// Tab & Navigation Logic
function switchTab(tabName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Settings doesn't have a bottom nav icon, keep visual nav untouched
    if(tabName !== 'settings') {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        document.getElementById('nav-' + tabName).classList.add('active');
    }

    document.getElementById('screen-' + tabName).classList.add('active');
}

// Login/Logout Handlers
function login() {
    document.getElementById('screen-splash').classList.remove('active');
    document.getElementById('screen-keriview').classList.add('active');
    document.getElementById('bottom-nav').classList.remove('hidden');
    document.getElementById('status-bar').style.color = 'var(--text-dark)';
}

function logout() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-splash').classList.add('active');
    document.getElementById('bottom-nav').classList.add('hidden');
    document.getElementById('status-bar').style.color = 'white';
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-keriview').classList.add('active');
}

// Smart Home / Toggles Logic
function toggleSmart(element) {
    element.classList.toggle('active');
    const statusText = element.querySelector('.toggle-status');
    const icon = element.querySelector('.toggle-icon');

    if(element.classList.contains('active')) {
        if(statusText && statusText.innerText === 'Off') statusText.innerText = 'On';
        if(statusText && statusText.innerText === 'Unlocked') statusText.innerText = 'Locked';
        if(icon) {
            icon.style.background = 'var(--primary)';
            icon.style.color = 'white';
        }
    } else {
        if(statusText && statusText.innerText === 'On') statusText.innerText = 'Off';
        if(statusText && statusText.innerText === 'Locked') statusText.innerText = 'Unlocked';
        if(icon) {
            icon.style.background = 'var(--bg-main)';
            icon.style.color = 'var(--text-light-gray)';
        }
    }
}

// Modal Handlers
function openModal() { document.getElementById('diskarte-modal').classList.add('active'); }
function closeModal() { document.getElementById('diskarte-modal').classList.remove('active'); }

// Ride Booking Simulation
function simulateRide(btn) {
    if (btn.disabled) return;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Finding...';
    btn.style.opacity = '0.8';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Matched!';
        btn.style.background = '#10B981';
        btn.style.opacity = '1';
        
        setTimeout(() => {
            btn.innerHTML = 'Join Carpool';
            btn.style.background = 'var(--primary)';
            btn.disabled = false;
        }, 3000);
    }, 2000);
}