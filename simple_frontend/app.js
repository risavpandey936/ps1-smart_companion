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

// State
let recognition = null;
let isListening = false;

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
newTaskBtn.addEventListener('click', resetForm);

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
        const response = await fetch('/break-down-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to process task');
        }

        const data = await response.json();
        displayResults(data);

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

// Auto-focus on load
window.addEventListener('load', () => {
    taskInput.focus();
});
