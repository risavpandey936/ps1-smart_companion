"""
Simple test script to verify the API is working correctly
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_generate_plan():
    print("Testing /generate-plan endpoint...")
    
    payload = {
        "tasks": "write a report, send emails",
        "energy_level": "medium"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/generate-plan",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"\nResponse:")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            print(json.dumps(response.json(), indent=2))
        else:
            print(response.text[:500])
            
    except Exception as e:
        print(f"Error: {e}")

def test_gamification():
    print("\n\nTesting /api/gamification/stats endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/gamification/stats")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_generate_plan()
    test_gamification()
