// Voice Assistant Module
class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.voice = null;

        this.initVoice();
    }

    initVoice() {
        // Wait for voices to load
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.addEventListener('voiceschanged', () => {
                this.selectVoice();
            });
        } else {
            this.selectVoice();
        }
    }

    selectVoice() {
        const voices = this.synthesis.getVoices();
        // Prefer female English voices for a friendly companion feel
        this.voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
            voices.find(v => v.lang.startsWith('en')) ||
            voices[0];
    }

    // Text-to-Speech
    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (this.isSpeaking) {
                this.synthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.voice;
            utterance.rate = options.rate || 0.9; // Slightly slower for clarity
            utterance.pitch = options.pitch || 1.0;
            utterance.volume = options.volume || 1.0;

            utterance.onstart = () => {
                this.isSpeaking = true;
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                resolve();
            };

            utterance.onerror = (error) => {
                this.isSpeaking = false;
                reject(error);
            };

            this.synthesis.speak(utterance);
        });
    }

    // Stop speaking
    stopSpeaking() {
        if (this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    // Speech-to-Text
    startListening(onResult, onError) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            onError(new Error('Speech recognition not supported in this browser'));
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            onResult(transcript, confidence);
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        this.recognition.start();
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    // Conversational responses
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning!";
        if (hour < 18) return "Good afternoon!";
        return "Good evening!";
    }

    getEncouragement() {
        const phrases = [
            "You've got this!",
            "One step at a time!",
            "Great job staying focused!",
            "You're making progress!",
            "Keep up the good work!",
            "I believe in you!",
            "You're doing amazing!"
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    getTaskIntro(taskName) {
        return `Let's work on ${taskName}. I'll guide you through each step.`;
    }

    getStepAnnouncement(stepNumber, totalSteps, stepText) {
        return `Step ${stepNumber} of ${totalSteps}: ${stepText}`;
    }

    getCompletion() {
        const phrases = [
            "Excellent work! You completed the task!",
            "Amazing! You did it! Take a well-deserved break.",
            "Fantastic job! Task completed successfully!",
            "You crushed it! Time to celebrate!",
            "Well done! You've earned some rest."
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
}

// Export for use in main app
window.VoiceAssistant = VoiceAssistant;
