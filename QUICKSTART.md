# Quick Start Guide

## 🚀 Getting Started

### 1. Verify Installation
The application is now fully set up with:
- ✅ Backend (FastAPI) in `backend/` directory
- ✅ Frontend (HTML/CSS/JS) in `frontend/` directory
- ✅ Energy-Adaptive Scheduler
- ✅ Gamification System
- ✅ Premium UI with Focus Mode

### 2. Start the Server

**Option A: Using the startup script**
```powershell
.\start.ps1
```

**Option B: Manual start**
```powershell
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the Application
Open your browser and navigate to:
```
http://localhost:8000
```

---

## 📱 How to Use

### First Time Setup
1. **Energy Check-in**: Click one of the three energy buttons (Low/Medium/High)
2. **Input Tasks**: Type or use voice (🎤 button) to describe what you need to do
   - Example: "Clean my room and study for math test"
3. **Click "Ignite"**: The AI will break down your tasks into simple steps

### Working on Tasks
1. **View Dashboard**: See your tasks displayed as cards
2. **Start a Task**: Click the "Start" button on any task card
3. **Focus Mode**: 
   - Read the current step (large, clear text)
   - Complete the action
   - Click "Next Step →" to advance
   - Use "← Prev" if you need to go back
4. **Earn Rewards**: Get 50 XP when you complete a task

### Track Progress
- **Streak Counter** (🔥): Days you've been active
- **XP & Level** (⭐): Your total experience points and current level
- **Progress Bar**: Visual indicator of task completion

---

## 🎯 Key Features

### Energy-Adaptive Scheduling
The system suggests optimal times for tasks:
- **High Energy (9-12 AM, 6-8 PM)**: Complex tasks
- **Low Energy (2-4 PM)**: Simple, routine tasks
- **Medium Energy**: Balanced tasks

### Gamification
- **50 XP** per completed task
- **Level up** every 100 XP
- **Daily streaks** for consistency
- **Visual celebrations** on completion

### AI Task Breakdown
- Maximum 6 steps per task
- Each step under 12 words
- Clear, actionable instructions
- No jargon or assumptions

---

## 🛠️ Troubleshooting

### Server won't start
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed (replace PID with actual process ID)
taskkill /PID <PID> /F

# Restart server
uvicorn backend.app:app --reload
```

### API Key Issues
If you see "Mock Task (No API Key)":
1. Check your `.env` file exists in the root directory
2. Verify it contains: `GROQ_API_KEY=your_actual_key_here`
3. Restart the server

### Frontend not loading
1. Verify server is running (check terminal for "Application startup complete")
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors (F12)

---

## 📊 API Endpoints

### Get Gamification Stats
```
GET /api/gamification/stats
```
Returns: `{xp: 0, level: 1, streak: 0, last_active: null}`

### Add XP
```
POST /api/gamification/xp
Body: {"amount": 50}
```

### Generate Task Plan
```
POST /generate-plan
Body: {"tasks": "your tasks here"}
```

### Get Next Step
```
POST /next-step
Body: {
  "task": "task name",
  "steps": ["step1", "step2"],
  "step_index": 1
}
```

---

## 🎨 Customization

### Change Energy Patterns
Edit `backend/scheduler.py`:
```python
self.peak_hours = [(9, 12), (18, 20)]  # Your peak times
self.slump_hours = [(14, 16)]          # Your slump times
```

### Adjust Colors
Edit `frontend/styles.css`:
```css
:root {
    --primary: #8b5cf6;    /* Purple */
    --secondary: #ec4899;  /* Pink */
    --accent: #22d3ee;     /* Cyan */
}
```

### Change XP Rewards
Edit `backend/gamification.py`:
```python
new_level = 1 + (self.data["xp"] // 100)  # Change 100 to adjust level threshold
```

---

## 📝 Tips for Best Results

1. **Be Specific**: "Clean kitchen" → "Wash dishes, wipe counters, sweep floor"
2. **Honest Energy Check-ins**: Accuracy improves scheduling
3. **Use Voice for Brain Dumps**: Faster than typing
4. **Celebrate Small Wins**: Every step counts
5. **Daily Consistency**: Build your streak

---

## 🔒 Privacy & Data

- All data stored locally in `gamification_data.json`
- No cloud sync (your data stays on your machine)
- API calls to Groq only for task breakdown (not stored)

---

## 🆘 Need Help?

- **Documentation**: See `FEATURES.md` for detailed feature explanations
- **Code**: Check `README.md` for technical details
- **Issues**: Review browser console (F12) for error messages

---

**You're all set! Open http://localhost:8000 and start conquering your tasks! 🎉**
