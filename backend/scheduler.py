import datetime

class EnergyScheduler:
    def __init__(self):
        # Default "Pattern": High energy in morning (9-12), dip in afternoon (2-4), medium evening (6-8)
        self.peak_hours = [(9, 12), (18, 20)]
        self.slump_hours = [(14, 16)]
    
    def get_energy_level(self, hour: int) -> str:
        for start, end in self.peak_hours:
            if start <= hour < end:
                return "high"
        for start, end in self.slump_hours:
            if start <= hour < end:
                return "low"
        return "medium"

    def suggest_time_for_task(self, difficulty: str, current_time: datetime.datetime = None):
        if current_time is None:
            current_time = datetime.datetime.now()
        
        current_hour = current_time.hour
        # If task is 'hard', find next 'high' energy slot
        # If task is 'easy', any slot works, preferably 'low' or 'medium' to save 'high' for hard tasks.
        
        difficulty = difficulty.lower()
        
        # Simple heuristic search for next 12 hours
        for i in range(12):
            check_time = current_time + datetime.timedelta(hours=i)
            hour = check_time.hour
            energy = self.get_energy_level(hour)
            
            if difficulty == "hard" and energy == "high":
                return {
                    "suggested_time": check_time.strftime("%I:%M %p"),
                    "reason": "This is your peak energy time."
                }
            elif difficulty == "easy" and energy in ["medium", "low"]:
                return {
                    "suggested_time": check_time.strftime("%I:%M %p"),
                    "reason": "Good time for low-effort tasks.",
                }
            elif difficulty == "medium" and energy in ["medium", "high"]:
                 return {
                    "suggested_time": check_time.strftime("%I:%M %p"),
                    "reason": "Balanced energy time."
                }
        
        # Fallback
        return {
            "suggested_time": current_time.strftime("%I:%M %p"),
            "reason": "No perfect slot found soon, start now."
        }
