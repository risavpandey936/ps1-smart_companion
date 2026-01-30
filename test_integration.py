import requests
import json

BASE_URL = "http://localhost:8000"

def test_gamification():
    """Test gamification endpoints"""
    print("Testing Gamification System...")
    
    # Get initial stats
    response = requests.get(f"{BASE_URL}/api/gamification/stats")
    print(f"✓ Initial stats: {response.json()}")
    
    # Add XP
    response = requests.post(
        f"{BASE_URL}/api/gamification/xp",
        json={"amount": 50}
    )
    result = response.json()
    print(f"✓ Added 50 XP: Level {result['level']}, Total XP: {result['xp']}")
    
    return True

def test_task_generation():
    """Test task generation endpoint"""
    print("\nTesting Task Generation...")
    
    response = requests.post(
        f"{BASE_URL}/generate-plan",
        json={"tasks": "Clean my room and study math"}
    )
    
    if response.status_code == 200:
        plan = response.json()
        print(f"✓ Generated {len(plan)} tasks:")
        for task in plan:
            print(f"  - {task['task']} ({task['total_steps']} steps)")
            print(f"    First step: {task['current_step']}")
        return True
    else:
        print(f"✗ Error: {response.status_code}")
        return False

def test_next_step():
    """Test step progression"""
    print("\nTesting Step Progression...")
    
    response = requests.post(
        f"{BASE_URL}/next-step",
        json={
            "task": "Test Task",
            "steps": ["Step 1", "Step 2", "Step 3"],
            "step_index": 1
        }
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Current step: {result['current_step']}")
        print(f"  Progress: {result['next_step_index']}/{result['total_steps']}")
        return True
    else:
        print(f"✗ Error: {response.status_code}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("PS-1 Smart Companion - API Tests")
    print("=" * 50)
    
    try:
        test_gamification()
        test_task_generation()
        test_next_step()
        
        print("\n" + "=" * 50)
        print("✓ All tests passed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Cannot connect to server.")
        print("Make sure the server is running: uvicorn backend.app:app --reload")
    except Exception as e:
        print(f"\n✗ Error: {e}")
