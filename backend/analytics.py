import json
import os
import pandas as pd
from datetime import datetime
from backend.history import HISTORY_FILE

class SmartAnalytics:
    def __init__(self):
        self.history_file = HISTORY_FILE

    def _load_data(self):
        if not os.path.exists(self.history_file):
            return []
        try:
            with open(self.history_file, "r") as f:
                return json.load(f)
        except:
            return []

    def get_insights(self):
        data = self._load_data()
        if not data:
            return {"message": "Not enough data yet."}

        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Ensure timestamp is datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # 1. Best Time of Day
        # Extract hour
        df['hour'] = df['timestamp'].dt.hour
        
        def get_time_of_day(hour):
            if 5 <= hour < 12: return 'Morning'
            elif 12 <= hour < 17: return 'Afternoon'
            elif 17 <= hour < 22: return 'Evening'
            else: return 'Night'
            
        df['period'] = df['hour'].apply(get_time_of_day)
        
        # Count tasks per period
        period_counts = df['period'].value_counts()
        if not period_counts.empty:
            best_period = period_counts.idxmax()
            best_period_count = period_counts.max()
        else:
            best_period = "Unknown"
            best_period_count = 0

        # 2. Success by Energy Level (Completion Rate)
        # Note: We track 'completed' boolean in history
        if 'completed' in df.columns and 'energy_level' in df.columns:
            energy_success = df.groupby('energy_level')['completed'].mean()
            # Find energy level with highest completion rate
            if not energy_success.empty:
                best_energy = energy_success.idxmax()
                best_energy_rate = energy_success.max() * 100
            else:
                best_energy = "Unknown"
                best_energy_rate = 0
        else:
            best_energy = "Unknown"
            best_energy_rate = 0

        # 3. Generate Insight Text
        insights = []
        
        if best_period != "Unknown":
            insights.append(f"🧠 You are most active in the **{best_period}** ({best_period_count} sessions).")
            
        if best_energy != "Unknown" and best_energy_rate > 0:
            insights.append(f"⚡ You have a {best_energy_rate:.0f}% success rate when your energy is **{best_energy}**.")
            
        if len(df) > 5:
             insights.append(f"📊 You've logged {len(df)} total sessions. Consistent tracking builds data accuracy!")
        else:
             insights.append("💡 Keep logging tasks to unlock deeper insights.")

        return {
            "insights": insights,
            "best_period": best_period,
            "best_energy": best_energy,
            "total_sessions": len(df)
        }
