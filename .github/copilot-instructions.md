# PS-1 Smart Companion - AI Agent Instructions

## Project Overview

**PS-1 Smart Companion** is a web app for neurodiverse individuals (ADHD, dyslexia, autism) that breaks overwhelming tasks into manageable steps using AI, energy-adaptive scheduling, and gamification rewards.

- **Backend**: FastAPI (Python) with Groq Llama 3.1 API integration
- **Frontend**: Vanilla JS/HTML/CSS single-page app
- **Core Value**: Aligns task execution with user energy levels while providing dopamine-driven motivation

## Architecture Patterns

### 1. **Modular System Design** (`backend/`)
The backend follows a **system composition** pattern. Each domain is isolated:

- `task_utils.py`: Task parsing (splitting by commas) and prioritization (physical/simple first)
- `scheduler.py`: Energy scheduling (peak: 9-12 AM, 6-8 PM; slump: 2-4 PM)
- `gamification.py`: XP/level tracking (100 XP = level up, streak management)
- `history.py`: Persistent task history JSON storage
- `empathy.py`: Sentiment analysis using TextBlob to tailor AI responses
- `rag_patterns.py`: Task-type templates (cleaning, studying, admin) that guide AI prompts
- `input_validator.py`: Blocks non-task inputs (questions, emotional queries, >10 words)
- `output_validator.py`: Ensures AI outputs meet constraints (max 6 steps, ≤12 words/step)

**Pattern**: Each module is instantiated once in `app.py` (singleton-like) and methods called via FastAPI endpoints.

### 2. **API Endpoints Structure**
```
/generate-plan          POST → TaskRequest → PlanResponse (task breakdown + mood)
/api/gamification/stats GET  → return current XP/level/streak
/api/gamification/xp    POST → add XP, auto-level up
/continue               POST → navigate task steps
```

All endpoints return **strict JSON** with proper error handling. Frontend validates `res.ok` before parsing.

### 3. **Neurodiverse-First Design Constraints**
Critical constraints built into the system:
- **Max 6 steps per task** (prevents overwhelm)
- **Max 12 words per step** (readability, clear scope)
- **No jargon** (input validator rejects complex language)
- **Physical/easy tasks first** (prioritization algorithm in `task_utils.prioritize_tasks()`)
- **Energy-based timing** (scheduler suggests high-energy slots for hard tasks)

### 4. **Frontend State Management** (`frontend/js/app.js`)
Simple state object:
```javascript
{
  energyLevel,        // 'low' | 'medium' | 'high'
  gamification: {xp, level, streak},
  plan: [],           // array of TaskRequest objects
  activeTaskIndex,    // currently displayed task
  activeStepIndex     // current step in focus mode
}
```

State updates trigger UI re-renders (task cards, focus mode overlay, gamification display).

### 5. **AI Integration Pattern** (Groq API)
- `client = Groq(api_key=os.getenv("GROQ_API_KEY"))` 
- Uses Llama 3.1 model
- **Graceful degradation**: If no API key, app returns mock responses for testing UI
- Empathy engine (sentiment) shapes system prompt before API call
- RAG patterns inject task-type context before AI generation
- Output validator post-processes AI response to enforce constraints

## Critical Workflows

### Running the Application
```powershell
# Full installation
pip install -r backend/requirements.txt

# Start (from project root)
./start.ps1
# or manually:
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000

# Access at http://localhost:8000
```

### Testing
```powershell
# Unit tests (gamification, task generation, step navigation)
python test_integration.py

# API endpoint tests
python test_api_endpoints.py
```

### Debugging API Errors
Common pattern: Frontend shows "Unexpected token 'I'" = backend returned HTML error page (not JSON).
- **Solution**: All endpoints wrapped in try-catch, errors return `{detail: "..."}`  HTTP 500
- See [PROBLEM_RESOLUTION.md](../PROBLEM_RESOLUTION.md) for error handling patterns

## Key Implementation Details

### Energy Scheduler
```python
# EnergyScheduler.get_energy_level(hour) → "high" | "low" | "medium"
# Peak: 9-12, 18-20 (6-8 PM)
# Slump: 14-16 (2-4 PM)
```
Used by frontend to suggest optimal task timing, not enforced.

### Task Prioritization
```python
# Scores tasks by: physical/easy (+2), cognitive (-1), length (-words)
# Sorts descending → physical/short tasks appear first
# e.g., "clean desk, study math" → ["Clean desk", "Study math"]
```

### Gamification Persistence
Stores state in `gamification_data.json`:
```json
{"xp": 150, "level": 2, "streak": 5, "last_active": "2026-01-30"}
```
Streak increments only on consecutive days.

### History Tracking
`task_history.json` stores completed plans with timestamps for analytics.

## Common Patterns to Preserve

1. **Input validation before AI**: Always check constraints before calling Groq API
2. **Two-layer error handling**: Backend try-catch + frontend `res.ok` check
3. **Sentiment-driven personalization**: Empathy engine modifies system prompt, not task steps
4. **Fallback behavior**: Mock responses when GROQ_API_KEY missing (UI testable without API)
5. **File-based persistence**: JSON files in root, not databases (simpler for neurodiverse users)

## Files to Reference

- **Core logic**: [backend/app.py](../backend/app.py) (endpoint definitions)
- **Validation**: [backend/input_validator.py](../backend/input_validator.py), [backend/output_validator.py](../backend/output_validator.py)
- **Task breakdown**: [backend/rag_patterns.py](../backend/rag_patterns.py) (template system)
- **Scheduler rules**: [backend/scheduler.py](../backend/scheduler.py) (energy model)
- **Frontend state**: [frontend/js/app.js](../frontend/js/app.js#L1-L50) (state definition)
- **Feature docs**: [FEATURES.md](../FEATURES.md), [QUICKSTART.md](../QUICKSTART.md)

## What NOT to Do

- ❌ Add database layers (keep persistence JSON-based for simplicity)
- ❌ Remove step/word limits (they exist for neurodiversity accessibility)
- ❌ Add complex terminology to task descriptions
- ❌ Skip error validation (frontend expects strict JSON)
- ❌ Change gamification formula without impact analysis (affects user motivation)

## Dependencies to Know

- **FastAPI**: Web framework, automatic OpenAPI docs at `/docs`
- **Groq**: LLM API (Llama 3.1), requires `GROQ_API_KEY` env var
- **TextBlob**: Sentiment analysis for empathy engine
- **SQLAlchemy/passlib**: Available but rarely used (kept for future auth expansion)
- **python-jose**: JWT support, currently unused

Set `GROQ_API_KEY` in `.env` or use mock mode for testing.
