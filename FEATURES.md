# PS-1 Smart Companion - Feature Guide

## 🎯 Overview
A comprehensive web-based application designed specifically for neurodiverse individuals (ADHD, dyslexia, autism) to transform overwhelming tasks into manageable, achievable steps.

---

## ✨ Core Features

### 1. **Energy-Adaptive Scheduler** ⚡
**Purpose**: Aligns tasks with your natural energy rhythms instead of rigid schedules.

**How it works**:
- The system learns your peak energy hours (default: 9-12 AM, 6-8 PM)
- Suggests optimal times for complex tasks during high-energy periods
- Reserves low-energy slots for simple, routine tasks
- Adapts based on your historical performance data

**Benefits for neurodiverse users**:
- Reduces executive dysfunction by working WITH your brain, not against it
- Prevents burnout from attempting hard tasks during energy slumps
- Increases success rate and builds positive momentum

---

### 2. **Gamification System** 🎮
**Purpose**: Maintains motivation through dopamine-friendly reward mechanisms.

**Features**:
- **XP (Experience Points)**: Earn 50 XP per completed task
- **Levels**: Automatic level-up every 100 XP
- **Streaks**: Daily activity tracking with fire emoji counter
- **Visual Feedback**: Animated progress bars and celebration effects

**Why it helps**:
- Provides immediate gratification (crucial for ADHD brains)
- Creates positive reinforcement loops
- Makes progress visible and tangible
- Reduces "all or nothing" thinking

---

### 3. **AI Task Breakdown** 🤖
**Purpose**: Converts overwhelming tasks into simple, actionable steps.

**Intelligence**:
- Uses Groq's Llama 3.1 model for natural language understanding
- Pattern recognition for common task types (cleaning, studying, cooking)
- Maximum 6 steps per task to prevent overwhelm
- Each step limited to 12 words for clarity

**Neurodiverse-friendly rules**:
- No jargon or complex language
- One action per step
- No assumptions about prior knowledge
- Clear, concrete instructions

---

### 4. **Focus Mode** 🎯
**Purpose**: Eliminates distractions during task execution.

**Features**:
- Full-screen overlay that blocks other content
- Large, readable text (accessibility-first)
- Progress visualization
- Step-by-step navigation (forward/backward)
- Celebration on completion

**Benefits**:
- Reduces context switching
- Provides "body doubling" effect (feeling of companionship)
- Clear visual feedback on progress
- Safe space to focus without external stimuli

---

### 5. **Voice Interface** 🎤 🗣️
**Purpose**: Reduces typing barriers and supports verbal processors with full conversational interaction.

**Capabilities**:
- **Input**: "Brain dump" your tasks naturally using speech-to-text.
- **Output**: The system reads out tasks, instructions, and encouragement.
- **Focus Mode Guidance**: The AI reads step-by-step instructions so you don't have to look at the screen constantly.
- **Companion Persona**: Click the avatar to hear a greeting and getting started help.
- **Celebrations**: Hear verbal praise ("You crushed it!") when you finish tasks.

**Why it matters**:
- Bypasses dyslexia-related typing challenges
- Supports verbal thinkers and auditory learners
- Reduces friction in task capture
- Provides a sense of presence ("body doubling")

---

### 6. **Premium Sensory-Friendly Design** 🎨
**Purpose**: Creates a calming, non-overwhelming visual environment.

**Design principles**:
- **Glassmorphism**: Soft, frosted glass effects reduce visual harshness
- **Dark mode**: Reduces eye strain and sensory overload
- **Curated colors**: Purple/pink gradients (calming, not aggressive)
- **Clear typography**: Space Grotesk and Outfit fonts (high readability)
- **Smooth animations**: Micro-interactions provide feedback without being jarring
- **Consistent spacing**: Reduces visual clutter

**Accessibility features**:
- High contrast text
- Large touch targets
- Clear visual hierarchy
- No flashing or rapid animations

---

## 🚀 User Journey

### Morning Routine
1. **Energy Check-in**: Select your current energy level (Low/Medium/High)
2. **Brain Dump**: Type or speak your tasks for the day
3. **AI Processing**: System breaks tasks into steps and prioritizes top 3
4. **Scheduler Suggestion**: See optimal times for each task
5. **Start Task**: Enter Focus Mode when ready

### During Task
1. **Read Current Step**: Large, clear instruction
2. **Complete Action**: Do the one thing
3. **Next Step**: Click to advance
4. **Progress Bar**: See how far you've come
5. **Completion**: Celebrate with XP reward

### Evening Reflection
- View streak counter (motivation boost)
- See XP and level progress
- Build consistency habit

---

## 🧠 Innovative Additions for Neurodiverse Support

### Implemented:
1. **Anti-Overwhelm Cap**: Maximum 3 tasks shown at once
2. **Step Simplification**: 6 steps max, 12 words per step
3. **Visual Progress**: Always know where you are
4. **Immediate Rewards**: XP on completion (dopamine hit)
5. **Flexible Navigation**: Can go back to previous steps

### Future Enhancements (Suggested):
1. **Pomodoro Integration**: Built-in timer with breaks
2. **Sensory Break Reminders**: Scheduled movement/rest prompts
3. **Customizable Avatars**: Personalize your AI companion
4. **Social Accountability**: Optional sharing with accountability partners
5. **Habit Stacking**: Link new tasks to existing routines
6. **Emotional Check-ins**: Track mood alongside energy
7. **Medication Reminders**: Gentle notifications
8. **Hyperfocus Protection**: Alerts when you've been working too long

---

## 🛠️ Technical Architecture

### Backend (`backend/`)
- **FastAPI**: High-performance Python web framework
- **Groq API**: LLM for intelligent task breakdown
- **Scheduler Module**: Energy-time alignment logic
- **Gamification Module**: XP/streak tracking with JSON persistence

### Frontend (`frontend/`)
- **Vanilla JavaScript**: No complex build tools, fast loading
- **CSS Variables**: Consistent theming
- **Web Speech API**: Voice input
- **Responsive Design**: Works on desktop and mobile

### Data Flow
1. User inputs tasks → FastAPI endpoint
2. Backend validates and splits tasks
3. Groq API generates step-by-step breakdown
4. Scheduler suggests optimal timing
5. Frontend renders interactive dashboard
6. User completes steps → XP awarded
7. Stats persist to JSON file

---

## 📊 Success Metrics

### For Users:
- **Task Completion Rate**: % of started tasks finished
- **Streak Length**: Consecutive days of activity
- **Energy Alignment**: Tasks completed during suggested times
- **Overwhelm Reduction**: Subjective stress ratings

### System Performance:
- **Response Time**: <2s for task generation
- **Accuracy**: Steps are actionable and clear
- **Accessibility Score**: WCAG 2.1 AA compliance

---

## 🎓 Research-Backed Principles

1. **Chunking** (Miller's Law): 6 steps aligns with working memory limits
2. **Immediate Feedback** (Operant Conditioning): XP rewards reinforce behavior
3. **Visual Progress** (Goal Gradient Effect): Seeing progress increases motivation
4. **Energy Management** (Chronobiology): Aligning tasks with circadian rhythms
5. **Reduced Cognitive Load**: Simple language and clear UI reduce mental effort

---

## 🌟 What Makes This Different

**Traditional Task Apps**:
- Assume neurotypical executive function
- Rigid time-based scheduling
- No breakdown of complex tasks
- Generic, overwhelming interfaces

**PS-1 Smart Companion**:
- Designed FOR neurodiverse brains
- Energy-based, flexible scheduling
- AI-powered task simplification
- Sensory-friendly, calming design
- Gamification for sustained motivation
- Voice support for accessibility

---

## 💡 Usage Tips

1. **Be Honest with Energy Check-ins**: The system works best with accurate data
2. **Use Voice for Brain Dumps**: Don't filter, just speak your thoughts
3. **Celebrate Small Wins**: Every step completed is progress
4. **Don't Skip Breaks**: The celebration screens are intentional pauses
5. **Review Your Streak**: Daily consistency > perfect execution

---

## 🔧 Running the Application

```powershell
# From project root
.\start.ps1

# Or manually
uvicorn backend.app:app --reload

# Then open browser to:
http://localhost:8000
```

---

## 📝 Configuration

### Environment Variables (.env)
```
GROQ_API_KEY=your_api_key_here
```

### Customizing Energy Patterns
Edit `backend/scheduler.py`:
```python
self.peak_hours = [(9, 12), (18, 20)]  # Your peak times
self.slump_hours = [(14, 16)]          # Your low energy times
```

---

## 🤝 Support & Accessibility

- **Screen Reader Compatible**: Semantic HTML with ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **High Contrast Mode**: Respects system preferences
- **Adjustable Text Size**: Scales with browser settings

---

**Built with ❤️ for the neurodiverse community**
