// script.js

// --- Supabase Client Initialization (Placeholder) ---
// This will be overridden by the individual HTML files
let supabase;

// --- Utility Functions ---
function showNotification(message, isSuccess = true) {
    // A simple notification function. In a real app, consider using a library.
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '10000';
    notification.style.fontWeight = 'bold';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    if (isSuccess) {
        notification.style.backgroundColor = 'var(--success)';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = 'var(--error)';
        notification.style.color = 'white';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

function playSound(soundType) {
    const tapSoundEnabled = localStorage.getItem('tapSound') !== 'false';
    const notificationSoundEnabled = localStorage.getItem('notificationSound') !== 'false';
    
    // In a real app, you would play actual sound files here
    // For now, we'll just log to the console
    if ((soundType === 'tap' && tapSoundEnabled) || (soundType === 'notification' && notificationSoundEnabled)) {
        console.log(`Playing ${soundType} sound`);
        // Example: new Audio('path/to/sound.mp3').play();
    }
}


// --- Splash Screen Logic ---
// (Handled directly in index.html with setTimeout)


// --- Authentication Logic ---
function initializeAuth() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const forms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const backToLoginBtn = document.getElementById('back-to-login');

    // Password toggle logic
    document.getElementById('toggle-login-password').addEventListener('click', function() {
        const passwordInput = document.getElementById('login-password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });

    document.getElementById('toggle-signup-password').addEventListener('click', function() {
        const passwordInput = document.getElementById('signup-password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Form toggle logic
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and forms
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show the corresponding form
            const targetFormId = button.getAttribute('data-target');
            document.getElementById(targetFormId).classList.add('active');
        });
    });

    // Back to login from confirmation
    backToLoginBtn.addEventListener('click', () => {
        confirmationMessage.classList.add('hidden');
        document.getElementById('login-form').classList.add('active');
        document.querySelector('.toggle-btn[data-target="login-form"]').classList.add('active');
        document.querySelector('.toggle-btn[data-target="signup-form"]').classList.remove('active');
    });

    // Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('Login successful:', data);
            showNotification('Login successful!', true);
            playSound('notification');
            // Redirect to home screen
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message, false);
        }
    });

    // Signup Form Submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const username = document.getElementById('signup-username').value;
        const referralCode = document.getElementById('signup-referral').value;

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        referral_code: referralCode || null
                    }
                }
            });

            if (error) throw error;

            console.log('Signup successful:', data);
            // Hide forms and show confirmation message
            loginForm.classList.remove('active');
            signupForm.classList.remove('active');
            confirmationMessage.classList.remove('hidden');
            showNotification('Signup successful! Please check your email.', true);
        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message, false);
        }
    });
}


// --- Home Screen Logic ---
function initializeHome() {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            window.location.href = 'auth.html';
            return;
        }
    });

    // --- Banner Slider Logic ---
    const bannerSlider = document.getElementById('banner-slider');
    const slides = [
        { id: 1, color: 'linear-gradient(45deg, #ff9a9e, #fad0c4)' },
        { id: 2, color: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)' },
        { id: 3, color: 'linear-gradient(45deg, #ffecd2, #fcb69f)' }
    ];

    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'banner-slide';
        if (index === 0) slideElement.classList.add('active');
        slideElement.style.background = slide.color;
        // You can add banner images or content here
        slideElement.innerHTML = `<div style="padding: 20px; color: #333; font-weight: bold; text-align: center;">Banner ${slide.id}</div>`;
        bannerSlider.appendChild(slideElement);
    });

    let currentSlide = 0;
    setInterval(() => {
        const slides = document.querySelectorAll('.banner-slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); // Change slide every 5 seconds

    // --- Settings Menu Logic ---
    const settingsMenu = document.getElementById('settings-menu');
    const openSettingsBtn = document.getElementById('open-settings');
    const closeSettingsBtn = document.getElementById('close-settings');
    const logoutBtn = document.getElementById('logout-btn');

    openSettingsBtn.addEventListener('click', () => {
        playSound('tap');
        settingsMenu.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
        playSound('tap');
        settingsMenu.classList.remove('active');
    });

    // Close menu if clicked outside
    settingsMenu.addEventListener('click', (e) => {
        if (e.target === settingsMenu) {
            settingsMenu.classList.remove('active');
        }
    });

    // Sound Toggles
    const tapSoundToggle = document.getElementById('tap-sound-toggle');
    const notificationSoundToggle = document.getElementById('notification-sound-toggle');

    // Load saved preferences
    tapSoundToggle.checked = localStorage.getItem('tapSound') !== 'false';
    notificationSoundToggle.checked = localStorage.getItem('notificationSound') !== 'false';

    tapSoundToggle.addEventListener('change', () => {
        localStorage.setItem('tapSound', tapSoundToggle.checked);
        playSound('tap'); // Play a sound to demonstrate
    });

    notificationSoundToggle.addEventListener('change', () => {
        localStorage.setItem('notificationSound', notificationSoundToggle.checked);
        playSound('notification'); // Play a sound to demonstrate
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        playSound('tap');
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            showNotification('Logout failed', false);
        } else {
            window.location.href = 'auth.html';
        }
    });
}


// --- Spin Wheel Logic ---
function initializeSpinWheel() {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            window.location.href = 'auth.html';
            return;
        }
    });

    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    const prizeModal = document.getElementById('prize-modal');
    const prizeAmount = document.getElementById('prize-amount');
    const prizeMessage = document.getElementById('prize-message');
    const closePrizeModal = document.getElementById('close-prize-modal');

    // Define prizes
    const prizes = [
        { amount: 0, message: "Better luck next time!" },
        { amount: 10, message: "You won 10 coins!" },
        { amount: 50, message: "Great! 50 coins for you!" },
        { amount: 0, message: "Oh no! Try again." },
        { amount: 100, message: "Jackpot! 100 coins!" },
        { amount: 0, message: "So close! Spin again." },
        { amount: 20, message: "Nice! 20 coins!" },
        { amount: 0, message: "No luck this time." }
    ];

    // Create wheel segments
    prizes.forEach((prize, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        segment.style.transform = `rotate(${index * 45}deg)`;
        segment.innerHTML = `
            <span class="segment-text" style="transform: rotate(${45 / 2}deg);">
                ${prize.amount > 0 ? `+${prize.amount}` : 'Try'}
            </span>
        `;
        wheel.appendChild(segment);
    });

    let isSpinning = false;

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        playSound('tap');
        
        isSpinning = true;
        spinButton.disabled = true;
        spinButton.textContent = "SPINNING...";

        // Determine a random winning segment (0-7)
        const winningSegment = Math.floor(Math.random() * prizes.length);
        const prize = prizes[winningSegment];
        
        // Calculate rotation (5 full spins + offset to winning segment)
        // Each segment is 45 degrees (360/8)
        const extraRotation = 360 - (winningSegment * 45 + 45/2); // Stop at the middle of the segment
        const totalRotation = 5 * 360 + extraRotation; // 5 full spins

        // Apply the spin animation
        wheel.style.transition = 'transform 5s cubic-bezier(0.23, 1, 0.32, 1)';
        wheel.style.transform = `rotate(${totalRotation}deg)`;

        // After spin completes
        setTimeout(() => {
            isSpinning = false;
            spinButton.disabled = false;
            spinButton.textContent = "SPIN NOW (50 coins)";
            
            // Show prize modal
            prizeAmount.textContent = prize.amount > 0 ? `+${prize.amount}` : "?";
            prizeMessage.textContent = prize.message;
            prizeModal.classList.add('active');
            
            // In a real app, you would update the user's balance in Supabase here
            // supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        }, 5000);
    });

    closePrizeModal.addEventListener('click', () => {
        playSound('tap');
        prizeModal.classList.remove('active');
        // Reset wheel position for next spin (optional, looks better without reset)
        // wheel.style.transition = 'none';
        // wheel.style.transform = 'rotate(0deg)';
    });
}


// --- Wallet Logic ---
function initializeWallet() {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            window.location.href = 'auth.html';
            return;
        }
    });

    // Load current balance (placeholder)
    document.getElementById('current-balance').textContent = '150.00';

    // Tab switching logic
    document.getElementById('add-funds-tab').addEventListener('click', function() {
        playSound('tap');
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('add-funds-form').classList.add('active');
    });

    document.getElementById('withdraw-funds-tab').addEventListener('click', function() {
        playSound('tap');
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('withdraw-funds-form').classList.add('active');
    });

    // Add Funds Form Submission
    document.getElementById('add-funds-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        playSound('tap');
        
        const amount = document.getElementById('add-amount').value;
        const upiId = document.getElementById('add-upi-id').value;
        const screenshotFile = document.getElementById('add-screenshot').files[0];

        if (!amount || !upiId || !screenshotFile) {
            showNotification('Please fill all fields and select a screenshot.', false);
            return;
        }

        try {
            // 1. Upload screenshot to Supabase Storage
            const fileName = `payment_${Date.now()}_${screenshotFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('payment-screenshots')
                .upload(fileName, screenshotFile);

            if (uploadError) throw uploadError;

            // 2. Get public URL of the uploaded file
            const { data: publicUrlData } = supabase
                .storage
                .from('payment-screenshots')
                .getPublicUrl(fileName);

            const screenshotUrl = publicUrlData.publicUrl;

            // 3. Save transaction details to database
            // This is a simplified example. In a real app, you'd get the actual user ID.
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const { data, error } = await supabase
                .from('transactions')
                .insert([
                    {
                        user_id: userData.user.id,
                        type: 'add',
                        amount: amount,
                        upi_id: upiId,
                        screenshot_url: screenshotUrl,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;

            showNotification('Payment request submitted for approval!', true);
            this.reset(); // Reset form
        } catch (error) {
            console.error('Add funds error:', error);
            showNotification('Failed to submit request: ' + error.message, false);
        }
    });

    // Withdraw Funds Form Submission
    document.getElementById('withdraw-funds-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        playSound('tap');
        
        const amount = document.getElementById('withdraw-amount').value;
        const upiId = document.getElementById('withdraw-upi-id').value;

        if (!amount || !upiId) {
            showNotification('Please fill all fields.', false);
            return;
        }

        try {
            // Get current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            // Save withdrawal request to database
            const { data, error } = await supabase
                .from('transactions')
                .insert([
                    {
                        user_id: userData.user.id,
                        type: 'withdraw',
                        amount: amount,
                        upi_id: upiId,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;

            showNotification('Withdrawal request submitted!', true);
            this.reset(); // Reset form
        } catch (error) {
            console.error('Withdraw funds error:', error);
            showNotification('Failed to submit request: ' + error.message, false);
        }
    });
}


// --- Profile Logic ---
function initializeProfile() {
    // Check if user is logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session) {
            window.location.href = 'auth.html';
            return;
        }

        try {
            // Get user data
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            // Get additional user data from 'profiles' table
            let { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code === 'PGRST116') {
                // Profile doesn't exist, create it
                const { data, error: insertError } = await supabase
                    .from('profiles')
                    .insert([
                        { 
                            id: user.id, 
                            username: user.user_metadata.username || `user_${user.id.substring(0, 8)}`,
                            full_name: user.user_metadata.full_name || '',
                            email: user.email
                        }
                    ])
                    .select()
                    .single();
                
                if (insertError) throw insertError;
                profile = data;
            } else if (profileError) {
                throw profileError;
            }

            // Populate profile UI
            document.getElementById('profile-username').textContent = profile.username;
            document.getElementById('profile-uid').textContent = user.id.substring(0, 10);
            
            document.getElementById('profile-name').value = profile.full_name || '';
            document.getElementById('profile-email').value = profile.email || user.email;
            document.getElementById('profile-age').value = profile.age || '';
            document.getElementById('profile-gender').value = profile.gender || '';
            document.getElementById('profile-state').value = profile.state || '';
            document.getElementById('profile-country').value = profile.country || 'India'; // Default

        } catch (error) {
            console.error('Error loading profile:', error);
            showNotification('Failed to load profile: ' + error.message, false);
        }
    });

    // Edit/Save Profile Logic
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const formControls = profileForm.querySelectorAll('.form-control');

    editBtn.addEventListener('click', () => {
        playSound('tap');
        // Enable form fields
        formControls.forEach(control => control.disabled = false);
        // Show save button, hide edit button
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
    });

    saveBtn.addEventListener('click', async () => {
        playSound('tap');
        // Get updated values
        const updatedData = {
            full_name: document.getElementById('profile-name').value,
            age: parseInt(document.getElementById('profile-age').value) || null,
            gender: document.getElementById('profile-gender').value,
            state: document.getElementById('profile-state').value,
            country: document.getElementById('profile-country').value,
        };

        try {
            // Get current user ID
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            // Update profile in database
            const { data, error } = await supabase
                .from('profiles')
                .update(updatedData)
                .eq('id', user.id);

            if (error) throw error;

            showNotification('Profile updated successfully!', true);
            // Disable form fields
            formControls.forEach(control => control.disabled = true);
            // Show edit button, hide save button
            saveBtn.classList.add('hidden');
            editBtn.classList.remove('hidden');
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile: ' + error.message, false);
        }
    });

    // Profile Picture Change Logic (Placeholder)
    const changePicBtn = document.getElementById('change-pic-btn');
    const profilePicInput = document.getElementById('profile-pic-input');

    changePicBtn.addEventListener('click', () => {
        playSound('tap');
        profilePicInput.click();
    });

    profilePicInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Get current user ID
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            // Upload image to Supabase Storage
            const fileName = `profile_${user.id}_${Date.now()}`;
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('profile-pictures')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: publicUrlData } = supabase
                .storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            const imageUrl = publicUrlData.publicUrl;

            // Update profile with new image URL
            const { data, error } = await supabase
                .from('profiles')
                .update({ avatar_url: imageUrl })
                .eq('id', user.id);

            if (error) throw error;

            // Update UI
            document.getElementById('profile-pic').src = imageUrl;
            showNotification('Profile picture updated!', true);
        } catch (error) {
            console.error('Error uploading picture:', error);
            showNotification('Failed to update picture: ' + error.message, false);
        }
    });
}


// --- Mines Game Logic ---
function initializeMinesGame() {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            window.location.href = '../auth.html';
            return;
        }
    });

    // Load initial balance (placeholder)
    document.getElementById('game-balance').textContent = '150.00';

    const grid = document.getElementById('mines-grid');
    const status = document.getElementById('game-status');
    const cashoutBtn = document.getElementById('cashout-btn');
    const cashoutAmount = document.getElementById('cashout-amount');
    const startBtn = document.getElementById('start-game-btn');
    const betAmountInput = document.getElementById('bet-amount');
    const mineCountSelect = document.getElementById('mine-count');

    let gameState = {
        isPlaying: false,
        board: [],
        revealedCount: 0,
        betAmount: 0,
        mineCount: 0,
        multiplier: 1,
        currentWinnings: 0
    };

    // Create grid cells
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mines-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        grid.appendChild(cell);
    }

    function startGame() {
        playSound('tap');
        const bet = parseFloat(betAmountInput.value);
        const mines = parseInt(mineCountSelect.value);

        if (isNaN(bet) || bet <= 0) {
            showNotification('Please enter a valid bet amount.', false);
            return;
        }

        if (bet > parseFloat(document.getElementById('game-balance').textContent)) {
            showNotification('Insufficient balance.', false);
            return;
        }

        gameState.isPlaying = true;
        gameState.betAmount = bet;
        gameState.mineCount = mines;
        gameState.revealedCount = 0;
        gameState.multiplier = 1;
        gameState.currentWinnings = 0;

        // Deduct bet from balance (placeholder)
        const currentBalance = parseFloat(document.getElementById('game-balance').textContent);
        document.getElementById('game-balance').textContent = (currentBalance - bet).toFixed(2);

        // Initialize board
        gameState.board = Array(25).fill(0); // 0 = safe, 1 = mine
        // Place mines randomly
        let minesPlaced = 0;
        while (minesPlaced < mines) {
            const index = Math.floor(Math.random() * 25);
            if (gameState.board[index] === 0) {
                gameState.board[index] = 1;
                minesPlaced++;
            }
        }

        // Reset UI
        const cells = document.querySelectorAll('.mines-cell');
        cells.forEach(cell => {
            cell.classList.remove('revealed', 'mine', 'safe');
            cell.textContent = '';
        });

        status.textContent = 'Game started! Click on tiles to reveal.';
        cashoutBtn.classList.remove('hidden');
        updateCashoutAmount();
        startBtn.disabled = true;
    }

    function handleCellClick(index) {
        if (!gameState.isPlaying) return;
        playSound('tap');

        const cell = document.querySelector(`.mines-cell[data-index="${index}"]`);
        if (cell.classList.contains('revealed')) return; // Already clicked

        cell.classList.add('revealed');

        if (gameState.board[index] === 1) {
            // Mine hit - Game Over
            cell.classList.add('mine');
            cell.innerHTML = '💣';
            gameState.isPlaying = false;
            status.textContent = 'Game Over! You hit a mine.';
            cashoutBtn.classList.add('hidden');
            startBtn.disabled = false;
            showNotification('Game Over! You lost your bet.', false);
            revealAllMines();
        } else {
            // Safe tile
            cell.classList.add('safe');
            cell.innerHTML = '💎';
            gameState.revealedCount++;
            
            // Update multiplier and winnings
            // This is a simplified multiplier logic
            gameState.multiplier = 1 + (gameState.revealedCount * 0.2);
            gameState.currentWinnings = gameState.betAmount * gameState.multiplier;
            updateCashoutAmount();
            
            status.textContent = `Good! Revealed ${gameState.revealedCount} tiles.`;
            
            // Check win condition (all non-mine tiles revealed)
            if (gameState.revealedCount === (25 - gameState.mineCount)) {
                cashout();
            }
        }
    }

    function updateCashoutAmount() {
        cashoutAmount.textContent = gameState.currentWinnings.toFixed(2);
    }

    function cashout() {
        if (!gameState.isPlaying) return;
        playSound('notification');
        
        gameState.isPlaying = false;
        status.textContent = `You cashed out! Won ${formatCurrency(gameState.currentWinnings)}`;
        cashoutBtn.classList.add('hidden');
        startBtn.disabled = false;
        
        // Add winnings to balance (placeholder)
        const currentBalance = parseFloat(document.getElementById('game-balance').textContent);
        document.getElementById('game-balance').textContent = (currentBalance + gameState.currentWinnings).toFixed(2);
        
        showNotification(`You won ${formatCurrency(gameState.currentWinnings)}!`, true);
    }

    function revealAllMines() {
        const cells = document.querySelectorAll('.mines-cell');
        cells.forEach((cell, index) => {
            if (gameState.board[index] === 1 && !cell.classList.contains('revealed')) {
                cell.classList.add('revealed', 'mine');
                cell.innerHTML = '💣';
            }
        });
    }

    startBtn.addEventListener('click', startGame);
    cashoutBtn.addEventListener('click', cashout);
}


// --- Ludo Game Logic (Placeholder) ---
function initializeLudoGame() {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            window.location.href = '../auth.html';
            return;
        }
    });

    // Load initial balance (placeholder)
    document.getElementById('ludo-balance').textContent = '150.00';

    const joinBtn = document.getElementById('join-game-btn');
    const betAmountInput = document.getElementById('ludo-bet-amount');
    const chatInput = document.getElementById('ludo-chat-input');
    const sendChatBtn = document.getElementById('send-chat-input'); // This ID was wrong in HTML, corrected here
    const chatMessages = document.getElementById('ludo-chat-messages');

    joinBtn.addEventListener('click', () => {
        playSound('tap');
        const bet = parseFloat(betAmountInput.value);
        if (isNaN(bet) || bet <= 0) {
            showNotification('Please enter a valid bet amount.', false);
            return;
        }

        if (bet > parseFloat(document.getElementById('ludo-balance').textContent)) {
            showNotification('Insufficient balance.', false);
            return;
        }

        // Deduct bet from balance (placeholder)
        const currentBalance = parseFloat(document.getElementById('ludo-balance').textContent);
        document.getElementById('ludo-balance').textContent = (currentBalance - bet).toFixed(2);

        showNotification(`Joined game with ${formatCurrency(bet)}!`, true);
        // In a real app, this would connect to a game server or matchmaking system
        status.textContent = 'Waiting for opponent...';
    });

    // Simple chat functionality (placeholder)
    sendChatBtn.addEventListener('click', () => {
        playSound('tap');
        const message = chatInput.value.trim();
        if (message) {
            const messageElement = document.createElement('p');
            messageElement.style.fontSize = '0.9rem';
            messageElement.style.marginBottom = '5px';
            // In a real app, you'd get the actual username
            messageElement.innerHTML = `<strong>You:</strong> ${message}`;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatBtn.click();
        }
    });
}

// --- Export functions for use in HTML files ---
// This allows the individual HTML files to call the correct initialization function
// after setting up the Supabase client.
window.initializeAuth = initializeAuth;
window.initializeHome = initializeHome;
window.initializeSpinWheel = initializeSpinWheel;
window.initializeWallet = initializeWallet;
window.initializeProfile = initializeProfile;
window.initializeMinesGame = initializeMinesGame;
window.initializeLudoGame = initializeLudoGame;