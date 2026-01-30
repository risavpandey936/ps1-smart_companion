import json
import os
from datetime import datetime
from typing import List, Dict

HISTORY_FILE = "task_history.json"

class TaskHistory:
    def __init__(self):
        self.history = self._load_history()

    def _load_history(self) -> List[Dict]:
        """Load history from file"""
        if os.path.exists(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except:
                pass
        return []

    def _save_history(self):
        """Save history to file"""
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(self.history, f, indent=2, ensure_ascii=False)

    def add_entry(self, user_query: str, generated_plan: List[Dict], energy_level: str = "medium"):
        """Add a new history entry"""
        entry = {
            "id": len(self.history) + 1,
            "timestamp": datetime.now().isoformat(),
            "user_query": user_query,
            "energy_level": energy_level,
            "generated_plan": generated_plan,
            "completed": False
        }
        
        self.history.append(entry)
        self._save_history()
        
        return entry

    def get_all_history(self, limit: int = None) -> List[Dict]:
        """Get all history entries, optionally limited"""
        if limit:
            return self.history[-limit:]
        return self.history

    def get_entry_by_id(self, entry_id: int) -> Dict:
        """Get a specific history entry by ID"""
        for entry in self.history:
            if entry["id"] == entry_id:
                return entry
        return None

    def mark_completed(self, entry_id: int):
        """Mark a history entry as completed"""
        for entry in self.history:
            if entry["id"] == entry_id:
                entry["completed"] = True
                entry["completed_at"] = datetime.now().isoformat()
                self._save_history()
                return True
        return False

    def search_history(self, query: str) -> List[Dict]:
        """Search history by query text"""
        query_lower = query.lower()
        results = []
        for entry in self.history:
            if query_lower in entry["user_query"].lower():
                results.append(entry)
        return results

    def get_recent_queries(self, days: int = 7) -> List[Dict]:
        """Get queries from the last N days"""
        from datetime import timedelta
        cutoff = datetime.now() - timedelta(days=days)
        
        recent = []
        for entry in self.history:
            entry_time = datetime.fromisoformat(entry["timestamp"])
            if entry_time > cutoff:
                recent.append(entry)
        
        return recent

    def clear_history(self):
        """Clear all history"""
        self.history = []
        self._save_history()
