# Start the application
Write-Host "Starting PS-1 Smart Companion..."
Write-Host "Frontend: http://localhost:8000"
Write-Host "Backend API: http://localhost:8000/docs"

# Install dependencies if needed (rudimentary check)
# pip install -r backend/requirements.txt

# Run Uvicorn
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
