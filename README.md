# PS-1 Smart Companion

A comprehensive, energy-adaptive web application for neurodiverse individuals.

## Features
- **Energy-Adaptive Scheduler**: Suggests tasks based on your energy levels (Peak vs. Slump hours).
- **Gamification**: Earn XP, level up, and maintain streaks to boost motivation.
- **AI Companion**: Breaks down complex tasks into manageable steps using personalized prompts.
- **Premium UI**: Sensory-friendly, glassmorphism design with focus modes.

## Structure
- `backend/`: FastAPI application (Python).
- `frontend/`: Vanilla JS + CSS (Single Page App).
- `start.ps1`: Startup script.

## Setup & Run

1. **Install Dependencies**:
   ```powershell
   pip install -r backend/requirements.txt
   ```

2. **Run the App**:
   ```powershell
   ./start.ps1
   ```
   Or manually:
   ```powershell
   uvicorn backend.app:app --reload
   ```

3. **Open in Browser**:
   Visit `http://localhost:8000`

## Tech Stack
- **Backend**: FastAPI, Python 3.13, Groq API (Llama 3).
- **Frontend**: HTML5, CSS3 (Variables + Glassmorphism), Vanilla JS (ES Modules).
