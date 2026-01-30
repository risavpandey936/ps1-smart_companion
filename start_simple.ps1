# Simple Smart Companion Launcher
Write-Host "🤖 Starting Simple Smart Companion..." -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (Test-Path "venv") {
    Write-Host "✓ Activating virtual environment..." -ForegroundColor Green
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "⚠ No virtual environment found. Using system Python." -ForegroundColor Yellow
}

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "⚠ Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "  Create a .env file with your GROQ_API_KEY" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "🚀 Starting server on http://localhost:8000" -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the simple app
uvicorn backend.simple_app:app --reload --port 8000
