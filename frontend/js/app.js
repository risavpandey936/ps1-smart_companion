
// State Management (Simple Store)
const state = {
    energyLevel: 'medium',
    gamification: { xp: 0, level: 1, streak: 0 },
    plan: [],
    activeTaskIndex: null,
    activeStepIndex: 0,
    voice: null // Voice Assistant instance
};

// DOM Elements
const elements = {
    streakDisplay: document.getElementById('streak-display'),
    xpDisplay: document.getElementById('xp-display'),
    levelDisplay: document.getElementById('level-display'),
    energyBtns: document.querySelectorAll('.energy-btn'),
    taskInput: document.getElementById('task-input'),
    generateBtn: document.getElementById('generate-btn'),
    dashboard: document.getElementById('dashboard'),
    taskList: document.getElementById('task-list'),
    focusOverlay: document.getElementById('focus-mode-overlay'),
    focusTaskTitle: document.getElementById('focus-task-title'),
    focusStepDisplay: document.getElementById('focus-step-display'),
    nextStepBtn: document.getElementById('next-step'),
    prevStepBtn: document.getElementById('prev-step'),
    closeFocusBtn: document.getElementById('close-focus'),
    voiceBtn: document.getElementById('voice-btn'),
    viewHistoryBtn: document.getElementById('view-history-btn'),
    historySection: document.getElementById('history-section'),
    historyList: document.getElementById('history-list'),
    historySearchInput: document.getElementById('history-search-input'),
    clearHistoryBtn: document.getElementById('clear-history-btn'),
    companionAvatar: document.getElementById('companion-avatar')
};

// API Client
const API = {
    async getStats() {
        const res = await fetch('/api/gamification/stats');
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    },
    async generatePlan(tasks, energyLevel = 'medium') {
        const res = await fetch('/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tasks, energy_level: energyLevel })
        });

        // Check if response is ok
        if (!res.ok) {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await res.json();
                throw new Error(errorData.detail || `HTTP ${res.status}`);
            } else {
                const text = await res.text();
                throw new Error(`Server error: ${text.substring(0, 200)}`);
            }
        }

        // Parse JSON response
        let data;
        try {
            data = await res.json();
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error(`Failed to parse server response: ${e.message}`);
        }

        // Validate response structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response: not an object');
        }

        if (!data.plan) {
            throw new Error('Invalid response: missing plan field');
        }

        if (!Array.isArray(data.plan)) {
            console.error('Plan is not an array:', data.plan);
            throw new Error(`Invalid response: plan is ${typeof data.plan}, expected array`);
        }

        console.log('generatePlan returning:', data);
        return data;
    },
    async nextStep(task, steps, stepIndex) {
        const res = await fetch('/next-step', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, steps, step_index: stepIndex })
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    },
    async addXp(amount) {
        const res = await fetch('/api/gamification/xp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    },
    async getHistory(limit = null) {
        const url = limit ? `/api/history?limit=${limit}` : '/api/history';
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    },
    async searchHistory(query) {
        const res = await fetch(`/api/history/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    },
    async clearHistory() {
        const res = await fetch('/api/history', { method: 'DELETE' });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    },
    async getAnalytics() {
        const res = await fetch('/api/analytics/insights');
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    }
};

// Initialization
async function init() {
    try {
        const stats = await API.getStats();
        updateGamificationUI(stats);
    } catch (e) {
        console.error("Failed to fetch stats", e);
    }

    // Initialize Voice Assistant
    if (window.VoiceAssistant) {
        state.voice = new window.VoiceAssistant();
        console.log("Voice Assistant Initialized");
    }

    setupEventListeners();
}

function updateGamificationUI(stats) {
    state.gamification = stats;
    elements.streakDisplay.textContent = stats.streak;
    elements.xpDisplay.textContent = `${stats.xp} XP`;
    elements.levelDisplay.textContent = stats.level;
}

function setupEventListeners() {
    // Energy Selection
    elements.energyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.energyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.energyLevel = btn.dataset.level;
        });
    });

    // Generate Plan
    elements.generateBtn.addEventListener('click', async () => {
        const input = elements.taskInput.value.trim();
        if (!input) return;

        elements.generateBtn.disabled = true;
        elements.generateBtn.textContent = "🧠 Thinking...";

        // Voice Feedback
        if (state.voice) state.voice.speak("Let me think about the best way to do that.");

        try {
            const response = await API.generatePlan(input, state.energyLevel);
            console.log('API Response:', response);
            console.log('Response.plan:', response.plan);
            console.log('Is array?', Array.isArray(response.plan));

            state.plan = response.plan;
            renderDashboard(response.plan);

            // Mood Feedback
            if (response.mood !== 'neutral') {
                const moodEmoji = response.mood === 'stressed' ? '💙' : '⚡';
                const moodMsg = response.mood === 'stressed'
                    ? "I noticed you're feeling a bit overwhelmed. I've broken this down into tiny steps."
                    : "I love your energy! Let's crush these tasks.";

                // Show toast or speak
                if (state.voice) state.voice.speak(moodMsg);

                // Visual Indicator on Avatar
                const face = document.querySelector('.avatar-face');
                if (face) {
                    face.textContent = moodEmoji;
                    setTimeout(() => face.textContent = '🤖', 5000);
                }
            } else {
                if (state.voice) {
                    const msg = state.plan.length === 1
                        ? "I've broken that down into steps for you."
                        : `I've created a plan with ${state.plan.length} main tasks.`;
                    state.voice.speak(msg);
                }
            }

        } catch (e) {
            console.error('Error details:', e);
            alert("Error generating plan: " + e.message);
            if (state.voice) state.voice.speak("Sorry, I had trouble creating a plan.");
        } finally {
            elements.generateBtn.disabled = false;
            elements.generateBtn.textContent = "EXECUTE_PLAN";
        }
    });

    // Voice Input Button
    elements.voiceBtn.addEventListener('click', () => {
        toggleVoiceInput();
    });

    // Focus Mode Navigation
    elements.nextStepBtn.addEventListener('click', async () => {
        const task = state.plan[state.activeTaskIndex];
        const nextIdx = state.activeStepIndex + 1;

        // Encourage user
        if (state.voice) {
            const praise = state.voice.getEncouragement();
            // Don't speak praise every single step, maybe every other or random?
            // For now, let's keep it simple: speak encouragement if finishing.
        }

        if (nextIdx >= task.all_steps.length) {
            // Task Complete
            elements.focusStepDisplay.textContent = "🎉 You did it!";

            // Voice Celebration
            if (state.voice) {
                state.voice.speak(state.voice.getCompletion());
            }

            await API.addXp(50);
            const stats = await API.getStats();
            updateGamificationUI(stats);
            setTimeout(closeFocusMode, 3000); // 3s delay to hear voice
            return;
        }

        state.activeStepIndex = nextIdx;
        updateFocusModeUI(task);

        // Speak encouragement randomly
        if (state.voice && Math.random() > 0.7) {
            state.voice.speak(state.voice.getEncouragement());
        }
    });

    elements.prevStepBtn.addEventListener('click', () => {
        if (state.activeStepIndex > 0) {
            state.activeStepIndex--;
            updateFocusModeUI(state.plan[state.activeTaskIndex]);
        }
    });

    elements.closeFocusBtn.addEventListener('click', () => {
        if (state.voice) state.voice.stopSpeaking();
        closeFocusMode();
    });

    // History
    elements.viewHistoryBtn.addEventListener('click', toggleHistory);
    elements.clearHistoryBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear all history?')) {
            await API.clearHistory();
            loadHistory();
        }
    });
    elements.historySearchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query) {
            const results = await API.searchHistory(query);
            renderHistory(results);
        } else {
            loadHistory();
        }
    });

    // Companion Avatar Click
    elements.companionAvatar.addEventListener('click', () => {
        if (state.voice) {
            const greeting = state.voice.getGreeting();
            state.voice.speak(`${greeting} I am your smart companion. How can I help you today?`);
        }
    });
}

function renderDashboard(plan) {
    console.log('renderDashboard called with:', plan);
    console.log('Type:', typeof plan);
    console.log('Is array?', Array.isArray(plan));

    elements.dashboard.classList.remove('hidden');
    elements.taskList.innerHTML = '';

    // Validate that plan is an array
    if (!Array.isArray(plan)) {
        console.error('Plan is not an array:', plan);
        elements.taskList.innerHTML = '<p style="color: red; padding: 1rem;">Error: Invalid plan data received from server</p>';
        return;
    }

    plan.forEach((taskData, index) => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <h3>${taskData.task}</h3>
            <div class="step-preview">${taskData.total_steps} steps</div>
            <button class="cta-btn" style="margin-top: 1rem; font-size: 0.9rem;">Start</button>
        `;

        card.querySelector('button').addEventListener('click', () => startFocusMode(index));
        elements.taskList.appendChild(card);
    });
}

function startFocusMode(index) {
    state.activeTaskIndex = index;
    state.activeStepIndex = 0;
    const task = state.plan[index];

    elements.focusOverlay.classList.remove('hidden');

    if (state.voice) {
        state.voice.speak(state.voice.getTaskIntro(task.task));
    }

    // Small delay to let intro speak before step 1
    setTimeout(() => {
        updateFocusModeUI(task);
    }, 2000);
}

function updateFocusModeUI(task) {
    elements.focusTaskTitle.textContent = task.task;
    const currentStepText = task.all_steps[state.activeStepIndex];
    elements.focusStepDisplay.textContent = currentStepText;

    // Voice read step
    if (state.voice) {
        // Stop any previous speech
        // state.voice.stopSpeaking(); 
        // Actually, queuing is better for natural flow, but users might skip fast.
        // Let's rely on the voice assistant's internal handling (cancellable)

        const stepNum = state.activeStepIndex + 1;
        state.voice.speak(`Step ${stepNum}. ${currentStepText}`);
    }
}

function closeFocusMode() {
    elements.focusOverlay.classList.add('hidden');
}

function toggleVoiceInput() {
    if (!state.voice) {
        alert("Voice assistant not initialized.");
        return;
    }

    if (state.voice.isListening) {
        state.voice.stopListening();
        elements.voiceBtn.style.color = 'inherit';
        elements.voiceBtn.classList.remove('listening');
    } else {
        elements.voiceBtn.style.color = 'var(--secondary)';
        elements.voiceBtn.classList.add('listening');

        state.voice.startListening(
            (text, confidence) => {
                // On Result
                elements.taskInput.value += (elements.taskInput.value ? " " : "") + text;
                // Optional: stop listening after one sentence or keep going?
                // The implementation in voice-assistant.js is continuous=false (one sentence)
                elements.voiceBtn.style.color = 'inherit';
                elements.voiceBtn.classList.remove('listening');
            },
            (error) => {
                // On Error
                console.error("Voice Error:", error);
                elements.voiceBtn.style.color = 'inherit';
                elements.voiceBtn.classList.remove('listening');
            }
        );
    }
}

// History Functions
async function toggleHistory() {
    const isHidden = elements.historySection.classList.contains('hidden');
    if (isHidden) {
        await loadHistory();
        elements.historySection.classList.remove('hidden');
        elements.viewHistoryBtn.textContent = '🏠 Home';
    } else {
        elements.historySection.classList.add('hidden');
        elements.viewHistoryBtn.textContent = '📜 History';
    }
}

async function loadHistory() {
    try {
        const [history, analyticsData] = await Promise.all([
            API.getHistory(20),
            API.getAnalytics()
        ]);

        renderAnalytics(analyticsData);
        renderHistory(history);
    } catch (e) {
        console.error('Failed to load history', e);
    }
}

function renderAnalytics(data) {
    // Check if container exists, if not create it inside history section
    let container = document.getElementById('analytics-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'analytics-container';
        container.style.cssText = 'background: rgba(255,255,255,0.5); padding: 1rem; margin-bottom: 1rem; border-radius: 8px; font-size: 0.9rem;';

        const searchInput = elements.historySearchInput ? elements.historySearchInput.parentNode : null;
        if (searchInput) {
            searchInput.parentNode.insertBefore(container, searchInput.nextSibling);
        }
    }

    if (data.insights && data.insights.length > 0) {
        container.innerHTML = `<strong>💡 Smart Insights:</strong><ul style="padding-left: 1.2rem; margin-top: 0.5rem;">${data.insights.map(i => `<li>${i}</li>`).join('')}</ul>`;
    } else {
        container.innerHTML = '<em>No insights available yet.</em>';
    }
}

function renderHistory(history) {
    elements.historyList.innerHTML = '';

    if (!history || history.length === 0) {
        elements.historyList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No history yet. Start by creating some tasks!</p>';
        return;
    }

    history.reverse().forEach(entry => {
        const item = document.createElement('div');
        item.className = `history-item ${entry.completed ? 'completed' : ''}`;

        const date = new Date(entry.timestamp).toLocaleString();
        const taskCount = entry.generated_plan.length;
        const taskNames = entry.generated_plan.map(t => t.task).join(', ');

        item.innerHTML = `
            <div class="history-meta">
                <span>🕒 ${date}</span>
                <span>⚡ ${entry.energy_level}</span>
            </div>
            <div class="history-query">"${entry.user_query}"</div>
            <div class="history-tasks">${taskCount} task(s): ${taskNames}</div>
            <div class="history-actions">
                <button onclick="reloadHistoryEntry(${entry.id})">🔄 Reload</button>
                ${entry.completed ? '<span style="color: #10b981;">✓ Completed</span>' : ''}
            </div>
        `;

        elements.historyList.appendChild(item);
    });
}

// Make reloadHistoryEntry available globally
window.reloadHistoryEntry = async function (entryId) {
    try {
        const history = await API.getHistory();
        const entry = history.find(e => e.id === entryId);
        if (entry) {
            elements.taskInput.value = entry.user_query;
            state.energyLevel = entry.energy_level;
            // Update energy button
            elements.energyBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.level === entry.energy_level) {
                    btn.classList.add('active');
                }
            });
            // Hide history and show main view
            toggleHistory();
        }
    } catch (e) {
        console.error('Failed to reload entry', e);
    }
};

init();
