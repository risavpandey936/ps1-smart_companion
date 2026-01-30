from textblob import TextBlob

class EmpathyEngine:
    def __init__(self):
        pass

    def analyze_sentiment(self, text):
        """
        Analyze the sentiment of the user input.
        Returns a dictionary with polarity, mood string, and tailored system instruction.
        """
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        # Polarity range: -1.0 (negative) to 1.0 (positive)

        # Determine Mood & Strategy
        if polarity < -0.3:
            mood = "stressed"
            instruction = (
                "The user seems overwhelmed, stressed, or negative. "
                "Adhere to 'Empathy First' protocol: \n"
                "1. Validate their feelings immediately (e.g., 'I hear that this is tough'). \n"
                "2. Do NOT be overly cheerful or robotic. \n"
                "3. Break tasks down into TINY, non-intimidating micro-steps. \n"
                "4. Suggest a 'quick win' task first."
            )
        elif polarity > 0.3:
            mood = "excited"
            instruction = (
                "The user seems excited, energetic, or positive. "
                "Match their energy! \n"
                "1. Be encouraging and enthusiastic. \n"
                "2. Suggest ambitious but achievable milestones. \n"
                "3. Use emojis and high-energy language."
            )
        else:
            mood = "neutral"
            instruction = (
                "The user's tone is neutral or practical. "
                "Be efficient, clear, and supportive without being overbearing."
            )

        return {
            "polarity": polarity,
            "mood": mood,
            "instruction": instruction
        }
