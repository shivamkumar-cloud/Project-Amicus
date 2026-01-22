// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initBreathingExercise();
    initMoodTracker();
    initModal();
    initTabs();
    initAnimations();
    initFloatingChat();
    initMeditationPlayers();
    initJournal();
    initScrollProgress();
    
    // Add welcome animation
    setTimeout(() => {
        showWelcomeMessage();
    }, 1000);
});

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking a link
    navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            
            // Update active link
            navLinksAll.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
    });
}

// Breathing Exercise
function initBreathingExercise() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startBreathing');
    const pauseBtn = document.getElementById('pauseBreathing');
    const resetBtn = document.getElementById('resetBreathing');
    const presets = document.querySelectorAll('.breathing-preset');
    const breathCount = document.getElementById('breathCount');
    const sessionTime = document.getElementById('sessionTime');
    const calmScore = document.getElementById('calmScore');
    
    let isBreathing = false;
    let isInhaling = true;
    let breathCounter = 0;
    let sessionMinutes = 0;
    let timer = null;
    let seconds = 0;
    let currentPreset = '478'; // 4-7-8 technique
    let inhaleTime = 4, holdTime = 7, exhaleTime = 8;
    
    // Preset selection
    presets.forEach(preset => {
        preset.addEventListener('click', function() {
            presets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentPreset = this.dataset.time;
            
            switch(currentPreset) {
                case '478':
                    inhaleTime = 4; holdTime = 7; exhaleTime = 8;
                    break;
                case '456':
                    inhaleTime = 4; holdTime = 5; exhaleTime = 6;
                    break;
                case 'box':
                    inhaleTime = 4; holdTime = 4; exhaleTime = 4;
                    break;
            }
            
            if (isBreathing) {
                resetBreathing();
                startBreathing();
            }
        });
    });
    
    // Start breathing
    startBtn.addEventListener('click', startBreathing);
    
    function startBreathing() {
        if (isBreathing) return;
        
        isBreathing = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        circle.classList.add('pulse');
        
        // Start timer
        timer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
            
            // Update session time every minute
            if (seconds % 60 === 0) {
                sessionMinutes++;
                sessionTime.textContent = sessionMinutes;
            }
            
            // Breathing cycle
            const cycleTime = inhaleTime + holdTime + exhaleTime;
            const cyclePosition = seconds % cycleTime;
            
            if (cyclePosition < inhaleTime) {
                // Inhale
                if (!isInhaling) {
                    isInhaling = true;
                    text.textContent = 'Breathe In';
                    circle.style.animation = 'breathe-in 4s ease-out';
                }
            } else if (cyclePosition < inhaleTime + holdTime) {
                // Hold
                if (isInhaling) {
                    isInhaling = false;
                    text.textContent = 'Hold';
                    circle.style.animation = 'breathe-hold 7s ease-in-out';
                }
            } else {
                // Exhale
                if (isInhaling) {
                    isInhaling = false;
                    text.textContent = 'Breathe Out';
                    circle.style.animation = 'breathe-out 8s ease-in';
                    
                    // Count breath
                    breathCounter++;
                    breathCount.textContent = breathCounter;
                    
                    // Update calm score
                    let newScore = parseInt(calmScore.textContent) + 5;
                    if (newScore > 100) newScore = 100;
                    calmScore.textContent = newScore;
                }
            }
        }, 1000);
    }
    
    // Pause breathing
    pauseBtn.addEventListener('click', function() {
        if (!isBreathing) return;
        
        isBreathing = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        clearInterval(timer);
        circle.classList.remove('pulse');
        text.textContent = 'Paused';
    });
    
    // Reset breathing
    resetBtn.addEventListener('click', resetBreathing);
    
    function resetBreathing() {
        isBreathing = false;
        isInhaling = true;
        clearInterval(timer);
        seconds = 0;
        breathCounter = 0;
        sessionMinutes = 0;
        
        updateTimerDisplay();
        breathCount.textContent = '0';
        sessionTime.textContent = '0';
        calmScore.textContent = '0';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        circle.classList.remove('pulse');
        text.textContent = 'Breathe In';
        circle.style.animation = 'breathe 8s infinite alternate';
    }
    
    function updateTimerDisplay() {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }
    
    // Initialize
    resetBreathing();
}

// Mood Tracker
function initMoodTracker() {
    const moodOptions = document.querySelectorAll('.mood-option');
    const saveBtn = document.getElementById('saveMood');
    const moodNote = document.getElementById('moodNote');
    const moodChart = initMoodChart();
    
    let currentMood = null;
    
    // Mood selection
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            moodOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentMood = this.dataset.mood;
        });
    });
    
    // Save mood
    saveBtn.addEventListener('click', function() {
        if (!currentMood) {
            showNotification('Please select a mood first', 'warning');
            return;
        }
        
        const note = moodNote.value.trim();
        const date = new Date();
        
        // Save to localStorage
        const moodEntry = {
            mood: currentMood,
            note: note,
            date: date.toISOString(),
            timestamp: date.getTime()
        };
        
        let moodHistory = JSON.parse(localStorage.getItem('amicusMoodHistory') || '[]');
        moodHistory.push(moodEntry);
        localStorage.setItem('amicusMoodHistory', JSON.stringify(moodHistory));
        
        // Update chart
        updateMoodChart(moodHistory);
        
        // Show confirmation
        showNotification('Mood saved successfully!', 'success');
        
        // Reset
        moodOptions.forEach(opt => opt.classList.remove('active'));
        moodNote.value = '';
        currentMood = null;
    });
    
    // Load previous mood data
    function loadMoodHistory() {
        const moodHistory = JSON.parse(localStorage.getItem('amicusMoodHistory') || '[]');
        if (moodHistory.length > 0) {
            updateMoodChart(moodHistory);
        }
    }
    
    loadMoodHistory();
}

function initMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    
    const moodColors = {
        ecstatic: '#f59e0b',
        happy: '#10b981',
        neutral: '#64748b',
        sad: '#3b82f6',
        anxious: '#ef4444'
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Mood Trend',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

function updateMoodChart(moodHistory) {
    // This would update the chart with real data
    // For now, we'll just simulate some data
    const last7Days = moodHistory.slice(-7);
    // Chart update logic would go here
}

// Modal System
function initModal() {
    const journalModal = document.getElementById('journalModal');
    const openJournalBtn = document.getElementById('openJournal');
    const modalClose = journalModal.querySelector('.modal-close');
    const saveJournalBtn = document.getElementById('saveJournal');
    const analyzeJournalBtn = document.getElementById('analyzeJournal');
    const journalEntry = document.getElementById('journalEntry');
    
    // Open journal modal
    openJournalBtn.addEventListener('click', () => {
        journalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        journalEntry.focus();
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    journalModal.addEventListener('click', (e) => {
        if (e.target === journalModal) {
            closeModal();
        }
    });
    
    // Save journal entry
    saveJournalBtn.addEventListener('click', function() {
        const entry = journalEntry.value.trim();
        if (!entry) {
            showNotification('Please write something first', 'warning');
            return;
        }
        
        const journalData = {
            entry: entry,
            date: new Date().toISOString(),
            emotion: analyzeEmotion(entry)
        };
        
        let journalHistory = JSON.parse(localStorage.getItem('amicusJournal') || '[]');
        journalHistory.push(journalData);
        localStorage.setItem('amicusJournal', JSON.stringify(journalHistory));
        
        showNotification('Journal entry saved!', 'success');
        closeModal();
    });
    
    // AI Analysis
    analyzeJournalBtn.addEventListener('click', function() {
        const entry = journalEntry.value.trim();
        if (!entry) {
            showNotification('Please write something first', 'warning');
            return;
        }
        
        const emotion = analyzeEmotion(entry);
        const insights = generateInsights(entry);
        
        showNotification(`Detected: ${emotion}. ${insights}`, 'info');
    });
    
    function closeModal() {
        journalModal.classList.remove('active');
        document.body.style.overflow = '';
        journalEntry.value = '';
    }
    
    // CBT and Gratitude buttons
    document.getElementById('startCBT')?.addEventListener('click', () => {
        showNotification('CBT exercises coming soon!', 'info');
    });
    
    document.getElementById('startGratitude')?.addEventListener('click', () => {
        showNotification('Gratitude practice starting...', 'info');
    });
}

function analyzeEmotion(text) {
    const positiveWords = ['happy', 'good', 'great', 'joy', 'love', 'excited', 'thankful', 'grateful'];
    const negativeWords = ['sad', 'bad', 'angry', 'anxious', 'stress', 'worried', 'hurt', 'pain'];
    
    const words = text.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
        if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
        if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'Positive';
    if (negativeCount > positiveCount) return 'Negative';
    return 'Neutral';
}

function generateInsights(text) {
    const insights = [
        "Remember to be kind to yourself today.",
        "This feeling will pass. You've got this!",
        "Try taking three deep breaths right now.",
        "Would a short walk help clear your mind?",
        "You're stronger than you think. Keep going!"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
}

// Tab System
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update headers
            tabHeaders.forEach(h => h.classList.remove('active'));
            this.classList.add('active');
            
            // Update contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Animations
function initAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .therapy-card, .meditation-card, .article-card').forEach(el => {
        observer.observe(el);
    });
    
    // Floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.3}s`;
        el.classList.add('float-element');
    });
}

// Floating Chat
function initFloatingChat() {
    const chatIcon = document.getElementById('chatIcon');
    
    chatIcon.addEventListener('click', () => {
        window.location.href = 'chatbot.html';
    });
    
    // Make draggable on desktop
    if (window.innerWidth > 768) {
        makeDraggable(chatIcon);
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
        element.style.cursor = 'grabbing';
        element.style.transition = 'none';
    }
    
    function startDragTouch(e) {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
        element.style.transition = 'none';
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e.clientX - startX, e.clientY - startY);
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        updatePosition(touch.clientX - startX, touch.clientY - startY);
    }
    
    function updatePosition(deltaX, deltaY) {
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;
        
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        
        element.style.left = `${Math.max(10, Math.min(newX, maxX))}px`;
        element.style.top = `${Math.max(10, Math.min(newY, maxY))}px`;
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }
    
    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

// Meditation Players
function initMeditationPlayers() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const audioType = this.dataset.audio;
            const isPlaying = this.classList.contains('playing');
            
            // Stop all other players
            playButtons.forEach(b => {
                b.classList.remove('playing');
                b.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            if (!isPlaying) {
                this.classList.add('playing');
                this.innerHTML = '<i class="fas fa-pause"></i>';
                playMeditation(audioType);
            } else {
                stopMeditation();
            }
        });
    });
    
    function playMeditation(type) {
        // In a real app, this would play actual audio
        showNotification(`Playing ${type} meditation...`, 'info');
    }
    
    function stopMeditation() {
        showNotification('Meditation stopped', 'info');
    }
}

// Journal System
function initJournal() {
    // Load journal entries from localStorage
    const journalHistory = JSON.parse(localStorage.getItem('amicusJournal') || '[]');
    // Could display journal history in a separate section
}

// Scroll Progress
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'linear-gradient(135deg, #10b981, #059669)';
        case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)';
        case 'error': return 'linear-gradient(135deg, #ef4444, #dc2626)';
        default: return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
}

// Welcome Message
function showWelcomeMessage() {
    const welcomeMessages = [
        "Welcome to AMICUS! Your mental wellness journey starts here. 🌟",
        "Take a deep breath. You're in a safe space. 🧘‍♀️",
        "Ready to explore tools for your mental wellbeing? Let's begin! 💫",
        "Every small step counts. We're here to support you. 🌈"
    ];
    
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    // Show after 2 seconds
    setTimeout(() => {
        showNotification(randomMessage, 'info');
    }, 2000);
}

// Add particles for visual effect
function addParticles() {
    const colors = ['#818cf8', '#06d6a0', '#8b5cf6', '#f59e0b'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${animationDuration}s;
            animation-delay: ${animationDelay}s;
        `;
        
        document.body.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            particle.remove();
        }, (animationDuration + animationDelay) * 1000);
    }
    
    // Add more particles periodically
    setInterval(addParticles, 5000);
}

// Start particles after page load
setTimeout(addParticles, 3000);

// Add CSS for particles
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: fixed;
        width: 4px;
        height: 4px;
        background: #818cf8;
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        animation: particle-float 20s infinite linear;
    }
    
    @keyframes particle-float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);