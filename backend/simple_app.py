import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from groq import Groq
from backend import auth

# Load environment
load_dotenv()

app = FastAPI(title="Smart Companion")

# Include Auth Router
app.include_router(auth.router)

# Initialize Groq
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

# Simple Models
class TaskRequest(BaseModel):
    task: str

class TaskResponse(BaseModel):
    task: str
    steps: list[str]

@app.post("/break-down-task", response_model=TaskResponse)
def break_down_task(request: TaskRequest, current_user: auth.User = Depends(auth.get_current_user)):
    """Simple endpoint: takes a task, returns micro-steps"""
    try:
        if not client:
            # Fallback if no API key
            return {
                "task": request.task,
                "steps": [
                    "Set up your GROQ_API_KEY in .env file",
                    "Restart the server",
                    "Try again"
                ]
            }
        
        task = request.task.strip()
        
        if not task:
            raise HTTPException(status_code=400, detail="Task cannot be empty")
        
        # Simple, focused prompt
        system_prompt = """You are a helpful assistant that breaks down tasks into tiny, actionable micro-steps.

Rules:
- Output ONLY a numbered list (1. 2. 3. etc.)
- Maximum 6 steps
- Each step should be ONE simple action
- Keep each step under 10 words
- No explanations, no extra text
- Be specific and actionable"""

        # Call LLM
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Break down this task: {task}"}
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        output = response.choices[0].message.content.strip()
        
        # Parse numbered list
        steps = []
        for line in output.split("\n"):
            line = line.strip()
            if line and any(line.startswith(f"{i}.") for i in range(1, 20)):
                # Remove number prefix
                step = line.split(".", 1)[1].strip() if "." in line else line
                steps.append(step)
        
        # Fallback if parsing failed
        if not steps:
            steps = [
                "Start by gathering what you need",
                "Break the task into smaller parts",
                "Take the first small action"
            ]
        
        return {
            "task": task,
            "steps": steps
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Health check
@app.get("/health")
def health():
    return {"status": "ok", "has_api_key": client is not None}

# Serve frontend
app.mount("/", StaticFiles(directory="simple_frontend", html=True), name="static")
