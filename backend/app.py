import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from groq import Groq

# Relative imports assuming running as a module or with PYTHONPATH setup correctly, 
# but for simplicity in this setup we'll assume running from root or backend dir
# and we might need to adjust path.
# However, standard practice: running `uvicorn backend.app:app --reload` from root.
from backend.input_validator import is_valid_input
from backend.output_validator import is_valid_output
from backend.task_utils import split_tasks, prioritize_tasks
from backend.rag_patterns import get_task_pattern
from backend.scheduler import EnergyScheduler
from backend.gamification import GamificationSystem
from backend.history import TaskHistory
from backend.empathy import EmpathyEngine
from backend.analytics import SmartAnalytics

# -------------------- SETUP --------------------
load_dotenv()

# Graceful degradation if no API Key (for testing UI)
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

app = FastAPI(title="PS-1 Smart Companion")

# Initialize Systems
scheduler = EnergyScheduler()
gamification = GamificationSystem()
history = TaskHistory()
empathy = EmpathyEngine()
analytics = SmartAnalytics()

# -------------------- MODELS --------------------
class TaskRequest(BaseModel):
    tasks: str
    energy_level: str = "medium"

class StartResponse(BaseModel):
    task: str
    current_step: str
    next_step_index: int
    total_steps: int
    all_steps: list[str]

class PlanResponse(BaseModel):
    plan: list[StartResponse]
    mood: str

class ContinueRequest(BaseModel):
    task: str
    steps: list[str]
    step_index: int

class StepResponse(BaseModel):
    task: str
    current_step: str
    next_step_index: int
    total_steps: int

# -------------------- API ENDPOINTS --------------------

@app.get("/api/gamification/stats")
def get_stats():
    return gamification.get_stats()

@app.post("/api/gamification/xp")
def add_xp(amount: int = Body(..., embed=True)):
    return gamification.add_xp(amount)

@app.post("/generate-plan", response_model=PlanResponse)
def generate_plan(request: TaskRequest):
    try:
        if not client:
             # Mock response for testing without API key
             return {
                 "plan": [{
                     "task": "Mock Task (No API Key)",
                     "current_step": "Check .env file",
                     "next_step_index": 1,
                     "total_steps": 3,
                     "all_steps": ["Check .env file", "Add GROQ_API_KEY", "Restart Server"]
                 }],
                 "mood": "neutral"
             }

        user_input = request.tasks.strip()

        if not is_valid_input(user_input):
            raise HTTPException(
                status_code=400,
                detail="Invalid input. Please provide simple actionable tasks."
            )

        # Logic
        tasks = split_tasks(user_input)
        tasks = tasks[:3]  # anti-overwhelm

        # Empathy Check
        sentiment = empathy.analyze_sentiment(user_input)
        
        # Process tasks
        prioritized_tasks = prioritize_tasks(tasks)
        
        results = []
        
        for task in prioritized_tasks:
            pattern = get_task_pattern(task)
            
            # Inject Mood Instruction
            system_prompt = (
                "You are an executive-function assistant for neurodivergent users.\n\n"
                f"User Mood Context: {sentiment['instruction']}\n\n"
                f"{pattern}\n\n"
                "Rules:\n"
                "- Output ONLY a numbered list\n"
                "- Maximum 6 steps\n" 
                "- One action per line\n"
                "- Each sentence under 12 words\n"
                "- No explanations\n"
                "- No emojis\n"
                "- No extra text"
            )

            steps = None

            for _ in range(3):
                try:
                    if not client:
                        raise Exception("No API Key")

                    response = client.chat.completions.create(
                        model="llama-3.1-8b-instant",
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": task},
                        ],
                        temperature=0.2,
                        max_tokens=120
                    )
                    output = response.choices[0].message.content
                    if is_valid_output(output):
                        steps = [line.split(". ", 1)[1] for line in output.split("\n") if ". " in line]
                        if steps: break
                except Exception as e:
                    print(f"LLM Error: {e}")
                    break

            if not steps:
                steps = ["Break task into smaller parts.", "Start with the first part."]

            results.append({
                "task": task,
                "current_step": steps[0],
                "next_step_index": 1,
                "total_steps": len(steps),
                "all_steps": steps
            })

        # Save to history
        history.add_entry(
            user_query=user_input,
            generated_plan=results,
            energy_level=request.energy_level
        )

        return {
            "plan": results,
            "mood": sentiment['mood']
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error and return a proper JSON error response
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in generate_plan: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.post("/next-step", response_model=StepResponse)
def next_step(request: ContinueRequest):
    if request.step_index >= len(request.steps):
        return {
            "task": request.task,
            "current_step": "🎉 Task completed. Take a short break.",
            "next_step_index": request.step_index,
            "total_steps": len(request.steps)
        }

    return {
        "task": request.task,
        "current_step": request.steps[request.step_index],
        "next_step_index": request.step_index + 1,
        "total_steps": len(request.steps)
    }

# -------------------- HISTORY ENDPOINTS --------------------

@app.get("/api/history")
def get_history(limit: int = None):
    """Get all task history"""
    return history.get_all_history(limit=limit)

@app.get("/api/history/{entry_id}")
def get_history_entry(entry_id: int):
    """Get a specific history entry"""
    entry = history.get_entry_by_id(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="History entry not found")
    return entry

@app.post("/api/history/{entry_id}/complete")
def mark_history_complete(entry_id: int):
    """Mark a history entry as completed"""
    success = history.mark_completed(entry_id)
    if not success:
        raise HTTPException(status_code=404, detail="History entry not found")
    return {"success": True, "message": "Entry marked as completed"}

@app.get("/api/history/search")
def search_history(q: str):
    """Search history by query text"""
    return history.search_history(q)

@app.get("/api/history/recent/{days}")
def get_recent_history(days: int = 7):
    """Get recent history from last N days"""
    return history.get_recent_queries(days)

@app.delete("/api/history")
def clear_history():
    """Clear all history"""
    history.clear_history()
    return {"success": True, "message": "History cleared"}

@app.get("/api/analytics/insights")
def get_analytics():
    """Get smart time analytics"""
    return analytics.get_insights()

# -------------------- STATIC FILES --------------------
# Mount frontend
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
