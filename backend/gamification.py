import json
import os
from datetime import datetime

DATA_FILE = "gamification_data.json"

class GamificationSystem:
    def __init__(self):
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r") as f:
                    return json.load(f)
            except:
                pass
        return {"xp": 0, "level": 1, "streak": 0, "last_active": None}

    def _save_data(self):
        with open(DATA_FILE, "w") as f:
            json.dump(self.data, f)

    def add_xp(self, amount: int):
        self.data["xp"] += amount
        # Level up logic: Level = sqrt(XP) or simple threshold (e.g. every 100 XP)
        new_level = 1 + (self.data["xp"] // 100)
        leveled_up = new_level > self.data["level"]
        self.data["level"] = new_level
        
        self.check_streak()
        self._save_data()
        
        return {
            "xp": self.data["xp"],
            "level": self.data["level"],
            "leveled_up": leveled_up
        }

    def check_streak(self):
        today = datetime.now().strftime("%Y-%m-%d")
        last = self.data.get("last_active")
        
        if last != today:
            # Check if consecutive
            if last:
                last_date = datetime.strptime(last, "%Y-%m-%d")
                delta = (datetime.now() - last_date).days
                if delta == 1:
                    self.data["streak"] += 1
                elif delta > 1:
                    self.data["streak"] = 1 # Reset
            else:
                self.data["streak"] = 1
                
            self.data["last_active"] = today
            self._save_data()

    def get_stats(self):
        return self.data
