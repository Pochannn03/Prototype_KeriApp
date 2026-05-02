let currentBalance = 1450.00;
let pendingTransferAmount = 0; 

function updateBalanceDisplay() {
    const formatted = currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('wallet-balance-display').innerText = '₱ ' + formatted;
}

function switchTab(tabName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    if(tabName !== 'settings') {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        document.getElementById('nav-' + tabName).classList.add('active');
    }

    const targetScreen = document.getElementById('screen-' + tabName);
    targetScreen.classList.add('active');
    
    const fabButton = document.getElementById('fab-post-ride');
    if(tabName === 'keriride') {
        fabButton.classList.add('active');
    } else {
        fabButton.classList.remove('active');
    }

    document.querySelectorAll('.budget-fill, .density-fill.front-bar').forEach(bar => {
        bar.style.width = '0%';
    });

    setTimeout(() => {
        targetScreen.querySelectorAll('.budget-fill, .density-fill.front-bar').forEach(bar => {
            const targetWidth = bar.getAttribute('data-target-width');
            if (targetWidth) {
                bar.style.width = targetWidth;
            }
        });
    }, 100); 
}

function login() {
    document.getElementById('screen-splash').classList.remove('active');
    switchTab('keriview'); 
    document.getElementById('bottom-nav').classList.remove('hidden');
    document.getElementById('status-bar').style.color = 'var(--text-dark)';
}

function logout() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-splash').classList.add('active');
    document.getElementById('bottom-nav').classList.add('hidden');
    document.getElementById('status-bar').style.color = 'var(--text-dark)';
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-keriview').classList.add('active');
    
    document.getElementById('fab-post-ride').classList.remove('active');
}

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

function openModal() { document.getElementById('diskarte-modal').classList.add('active'); }
function closeModal() { document.getElementById('diskarte-modal').classList.remove('active'); }

function openCarbonModal() { document.getElementById('carbon-modal').classList.add('active'); }
function closeCarbonModal() { document.getElementById('carbon-modal').classList.remove('active'); }

function flipDensityCard() {
    const cardInner = document.getElementById('density-flip-card');
    const isFlippingToBack = !cardInner.classList.contains('flipped');
    
    const targetSide = isFlippingToBack ? '.flip-card-back' : '.flip-card-front';
    document.querySelectorAll(`${targetSide} .density-fill`).forEach(bar => {
        bar.style.width = '0%';
    });

    cardInner.classList.toggle('flipped');

    setTimeout(() => {
        document.querySelectorAll(`${targetSide} .density-fill`).forEach(bar => {
            const targetWidth = bar.getAttribute('data-target-width');
            if (targetWidth) {
                bar.style.width = targetWidth;
            }
        });
    }, 300);
}

function openSheet(sheetId) {
    const overlayId = 'overlay-' + sheetId.split('-')[1]; 
    document.getElementById(overlayId).classList.add('active');
    document.getElementById(sheetId).classList.add('active');
    
    if(sheetId !== 'sheet-funding' && sheetId !== 'sheet-postride') {
        const inputs = document.querySelectorAll(`#${sheetId} .input-field`);
        inputs.forEach(input => input.value = '');
    }
}

function closeSheet(sheetId) {
    const overlayId = 'overlay-' + sheetId.split('-')[1];
    document.getElementById(overlayId).classList.remove('active');
    document.getElementById(sheetId).classList.remove('active');
}

function selectFunding(source) {
    document.getElementById('funding-label').innerText = `Funding from ${source}`;
    closeSheet('sheet-funding');
    
    setTimeout(() => {
        openSheet('sheet-topup');
    }, 300);
}

function processTopUp() {
    const inputField = document.querySelector('#sheet-topup .input-field');
    const amount = parseFloat(inputField.value);

    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount.', 'danger');
        return;
    }

    const btn = document.getElementById('btn-confirm-topup');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing';
    btn.style.opacity = '0.8';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
        
        currentBalance += amount;
        updateBalanceDisplay();
        
        closeSheet('sheet-topup');
        showToast(`Successfully added ₱${amount.toFixed(2)} to wallet`, 'success');
    }, 1500);
}

function processTransfer() {
    const inputField = document.querySelector('#sheet-transfer .amount-input');
    const amount = parseFloat(inputField.value);

    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount.', 'danger');
        return;
    }

    if (amount > currentBalance) {
        showToast('Insufficient funds for this transfer.', 'danger');
        return;
    }

    pendingTransferAmount = amount;
    
    closeSheet('sheet-transfer');
    
    setTimeout(() => {
        openOtpModal();
    }, 300);
}

function openOtpModal() {
    document.getElementById('otp-modal').classList.add('active');
    
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
    
    setTimeout(() => {
        document.querySelector('.otp-input').focus();
    }, 100);
}

function closeOtpModal() {
    document.getElementById('otp-modal').classList.remove('active');
}

function verifyOtp() {
    const inputs = document.querySelectorAll('.otp-input');
    let otp = '';
    inputs.forEach(input => otp += input.value);

    if (otp.length < 4) {
        showToast('Please enter the full 4-digit code.', 'warning');
        return;
    }

    const btn = document.getElementById('btn-verify-otp');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying';
    btn.style.opacity = '0.8';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
        
        currentBalance -= pendingTransferAmount;
        updateBalanceDisplay();
        
        closeOtpModal();
        showToast(`Successfully transferred ₱${pendingTransferAmount.toFixed(2)}.`, 'success');
    }, 1500);
}

document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => {
        if (input.value.length > 1) {
            input.value = input.value.slice(0, 1); 
        }
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

function openCamera() {
    document.getElementById('camera-overlay').classList.add('active');
    document.getElementById('status-bar').style.color = 'white';
}

function closeCamera() {
    document.getElementById('camera-overlay').classList.remove('active');
    if(!document.getElementById('screen-splash').classList.contains('active')){
        document.getElementById('status-bar').style.color = 'var(--text-dark)';
    }
}

function simulateScan() {
    closeCamera();
    
    setTimeout(() => {
        const fare = 120.00;
        
        if (currentBalance >= fare) {
            currentBalance -= fare;
            updateBalanceDisplay();
            showToast(`Payment of ₱${fare.toFixed(2)} to MRT-3 successful`, 'success');
        } else {
            showToast('Insufficient balance for this ride.', 'danger');
        }
    }, 400);
}

function simulateRide(btn) {
    if (btn.disabled) return;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Finding';
    btn.style.opacity = '0.8';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Matched';
        btn.style.background = '#10B981';
        btn.style.opacity = '1';
        showToast('Driver matched ETA 4 mins.', 'success');
        
        setTimeout(() => {
            btn.innerHTML = 'Join Carpool';
            btn.style.background = 'var(--primary)';
            btn.disabled = false;
            
            openCarbonModal();
            
        }, 4000);
    }, 2000);
}

function updateSeatDisplay(val) {
    document.getElementById('seat-display').innerText = val;
}

function processPostRide() {
    const btn = document.getElementById('btn-confirm-post');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Broadcasting';
    btn.style.opacity = '0.8';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
        
        const seats = document.getElementById('seat-slider').value;
        const destinationInput = document.querySelector('#sheet-postride .input-field').value;
        const destination = destinationInput ? destinationInput : 'Makati CBD';
        
        closeSheet('sheet-postride');
        showToast(`Ride to ${destination} with ${seats} seat(s) posted`, 'success');
        
        const container = document.getElementById('my-posted-rides-container');
        container.innerHTML = `
            <div class="section-title">My Broadcasted Ride</div>
            <div class="card" style="padding: 12px; border: 2px solid var(--primary);">
                <div class="carpool-map">
                    <div style="position: absolute; bottom: 12px; left: 12px; background: white; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <i class="fa-solid fa-shield-check" style="color: #10B981; margin-right: 4px;"></i> ResiLink Verified
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 4px; margin-bottom: 16px;">
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Current Loc to ${destination}</div>
                        <div style="font-size: 12px; color: var(--text-gray);">${seats} Seat Available</div>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; padding: 0 4px;">
                    <button class="btn-danger-outline" onclick="deletePostedRide()"><i class="fa-solid fa-trash"></i> Delete Post</button>
                </div>
            </div>
        `;
    }, 1500);
}

function deletePostedRide() {
    document.getElementById('my-posted-rides-container').innerHTML = '';
    showToast('Ride post deleted', 'success');
}

function showToast(message, type = 'primary') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-info';
    if (type === 'danger') iconClass = 'fa-triangle-exclamation';
    if (type === 'success') iconClass = 'fa-check';
    if (type === 'primary') iconClass = 'fa-tower-broadcast';

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
        <div>${message}</div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400); 
    }, 3500);
}

function toggleTask(checkbox) {
    const taskTextSpan = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskTextSpan.classList.add('completed');
        showToast('Task completed', 'success');
    } else {
        taskTextSpan.classList.remove('completed');
    }
}