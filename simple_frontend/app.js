// DOM Elements
const taskInput = document.getElementById('taskInput');
const submitBtn = document.getElementById('submitBtn');
const voiceBtn = document.getElementById('voiceBtn');
const resultsSection = document.getElementById('resultsSection');
const taskTitle = document.getElementById('taskTitle');
const stepsContainer = document.getElementById('stepsContainer');
const newTaskBtn = document.getElementById('newTaskBtn');
const progressText = document.getElementById('progressText');
const stepsCount = document.getElementById('stepsCount');
const progressFill = document.getElementById('progressFill');
const historyList = document.getElementById('historyList');
const themeBtn = document.getElementById('themeBtn');

// State
let recognition = null;
let isListening = false;
let taskHistory = [];
let isDarkMode = true;

// Initialize
window.addEventListener('load', () => {
    checkAuth();
    taskInput.focus();
    loadHistory();
    loadTheme();
});

function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '/login.html';
    }
}

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        taskInput.value = transcript;
        stopListening();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
    };

    recognition.onend = () => {
        stopListening();
    };
} else {
    // Hide voice button if not supported
    voiceBtn.style.display = 'none';
}

// Event Listeners
submitBtn.addEventListener('click', handleSubmit);
voiceBtn.addEventListener('click', toggleVoice);
newTaskBtn.addEventListener('click', () => {
    if (typeof stopSpeaking === 'function') stopSpeaking();
    resetForm();
});

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
});

// Functions
async function handleSubmit() {
    const task = taskInput.value.trim();

    if (!task) {
        taskInput.focus();
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Thinking...';

    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/break-down-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ task })
        });

        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to process task');
        }

        const data = await response.json();
        displayResults(data);
        addToHistory(data);

        // Auto-read the steps
        speakResponse(data);

    } catch (error) {
        console.error('Error:', error);
        alert('Oops! Something went wrong: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Break It Down ✨';
    }
}

function displayResults(data) {
    // Hide input section
    document.querySelector('.input-section').style.display = 'none';

    // Show results
    resultsSection.classList.remove('hidden');

    // Set task title
    taskTitle.textContent = data.task;

    // Clear previous steps
    stepsContainer.innerHTML = '';

    // Add steps
    data.steps.forEach((step, index) => {
        const stepCard = document.createElement('div');
        stepCard.className = 'step-card';
        stepCard.innerHTML = `
            <span class="step-number">${index + 1}</span>
            <span class="step-text">${step}</span>
        `;

        // Click to mark as complete
        stepCard.addEventListener('click', () => {
            stepCard.classList.toggle('completed');
            updateProgress();

            // Celebrate if all steps are completed
            const allSteps = document.querySelectorAll('.step-card');
            const completedSteps = document.querySelectorAll('.step-card.completed');

            if (allSteps.length === completedSteps.length) {
                setTimeout(() => {
                    if (confirm('🎉 Amazing! You completed all steps! Start a new task?')) {
                        resetForm();
                    }
                }, 500);
            }
        });

        stepsContainer.appendChild(stepCard);
    });

    // Initialize Progress
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const allSteps = document.querySelectorAll('.step-card');
    const completedSteps = document.querySelectorAll('.step-card.completed');

    const total = allSteps.length;
    const completed = completedSteps.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressText.textContent = `${percentage}% Complete`;
    stepsCount.textContent = `${completed}/${total} Steps`;
    progressFill.style.width = `${percentage}%`;

    if (percentage === 100) {
        progressFill.style.background = 'var(--success)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
    }
}

function resetForm() {
    // Show input section
    document.querySelector('.input-section').style.display = 'block';

    // Hide results
    resultsSection.classList.add('hidden');

    // Clear input
    taskInput.value = '';
    taskInput.focus();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleVoice() {
    if (!recognition) {
        alert('Voice input is not supported in your browser');
        return;
    }

    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    try {
        recognition.start();
        isListening = true;
        voiceBtn.classList.add('listening');
        voiceBtn.textContent = '🔴';
    } catch (error) {
        console.error('Error starting recognition:', error);
    }
}

function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
    }
    isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.textContent = '🎤';
}

const speakBtn = document.getElementById('speakBtn');


speakBtn.addEventListener('click', () => {
    if (window.speechSynthesis.speaking) {
        stopSpeaking();
    } else {
        readDisplayedSteps();
    }
});

// ... existing code ...

function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    speakBtn.textContent = '🔊 Read Steps Aloud';
}

themeBtn.addEventListener('click', toggleTheme);

function speakResponse(data) {
    if (!window.speechSynthesis) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const taskText = `Here is how to ${data.task}. I have broken it down into ${data.steps.length} steps.`;

    const stepsText = data.steps.map((step, index) => `Step ${index + 1}. ${step}`).join('. ');

    const fullText = `${taskText} ${stepsText}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Select a good voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find a natural sounding English voice
    // Note: Voices load asynchronously, so they might not be available immediately on first load, 
    // but usually are by the time a task is submitted.
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices[0];

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
        speakBtn.textContent = 'mn Stop Reading';
    };

    utterance.onend = () => {
        speakBtn.textContent = '🔊 Read Steps Aloud';
    };

    window.speechSynthesis.speak(utterance);
}

function readDisplayedSteps() {
    // Reconstruct data from DOM if needed, but since we pass data to speakResponse, 
    // let's just use the current DOM content to build the text.

    const taskTitleText = document.getElementById('taskTitle').textContent;
    const stepElements = document.querySelectorAll('.step-text');

    if (!taskTitleText) return;

    const steps = Array.from(stepElements).map(el => el.textContent);

    speakResponse({
        task: taskTitleText,
        steps: steps
    });
}



// Theme Functions
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
        }
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('smart_companion_theme');

    // Check system preference if no saved theme
    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    } else {
        setTheme(savedTheme);
    }
}

function toggleTheme() {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.textContent = '🌙';
        isDarkMode = false;
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.textContent = '☀️';
        isDarkMode = true;
    }
    localStorage.setItem('smart_companion_theme', theme);
}

// History Functions
function loadHistory() {
    const saved = localStorage.getItem('smart_companion_history');
    if (saved) {
        try {
            taskHistory = JSON.parse(saved);
            renderHistory();
        } catch (e) {
            console.error('Failed to parse history', e);
        }
    }
}

function saveHistory() {
    localStorage.setItem('smart_companion_history', JSON.stringify(taskHistory));
}

function addToHistory(data) {
    // Avoid duplicates or simple re-runs of same top task?
    // For now request is just task string, data has task and steps.

    // Add timestamp
    const historyItem = {
        ...data,
        timestamp: new Date().toISOString()
    };

    taskHistory.unshift(historyItem);

    // Keep max 50 items
    if (taskHistory.length > 50) {
        taskHistory.pop();
    }

    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (taskHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                No past tasks yet.<br>Start by adding one!
            </div>
        `;
        return;
    }

    historyList.innerHTML = '';

    taskHistory.forEach((item, index) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `
            <div class="history-task">${item.task}</div>
            <div class="history-date">${dateStr}</div>
        `;

        el.addEventListener('click', () => {
            // Highlight active
            document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');

            // Show results
            displayResults(item);

            // On mobile, close sidebar if we had one (not impl yet but good practice)
        });

        historyList.appendChild(el);
    });
}
