# 🤖 Smart Companion - Simple Version

A beautifully simple app that breaks down any task into tiny, actionable micro-steps.

## ✨ Features

- **Simple Input**: Just type or speak what you need to do
- **Voice Input**: Click the microphone to use voice (Chrome/Edge)
- **AI-Powered**: Uses Groq's LLaMA to break down tasks intelligently
- **Beautiful UI**: Modern, dark-themed interface with smooth animations
- **Step Tracking**: Click steps to mark them as complete
- **Zero Complexity**: No databases, no complex data structures, just pure simplicity

## 🚀 Quick Start

1. **Make sure you have your GROQ_API_KEY in `.env` file**
   ```
   GROQ_API_KEY=your_key_here
   ```

2. **Run the simple version:**
   ```powershell
   .\start_simple.ps1
   ```

3. **Open your browser:**
   ```
   http://localhost:8000
   ```

4. **Start using it:**
   - Type a task (or click 🎤 to speak)
   - Click "Break It Down ✨"
   - Get your micro-steps!
   - Click each step to mark it complete

## 📁 Files

- `backend/simple_app.py` - Minimal FastAPI backend (one endpoint)
- `simple_frontend/index.html` - Clean HTML structure
- `simple_frontend/style.css` - Beautiful dark theme with animations
- `simple_frontend/app.js` - Simple JavaScript with voice support
- `start_simple.ps1` - Launch script

## 🎯 How It Works

1. You enter a task
2. The app sends it to Groq's AI
3. AI breaks it into 3-6 micro-steps
4. You see the steps with a beautiful interface
5. Click steps to mark them complete
6. Celebrate when done! 🎉

## 💡 Examples

Try these tasks:
- "write a report"
- "clean my room"
- "start studying for exam"
- "make dinner"
- "organize my desk"

## 🔧 Technical Details

- **Backend**: FastAPI (Python)
- **AI**: Groq LLaMA 3.1
- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks!)
- **Voice**: Web Speech API
- **Design**: Modern dark theme with Inter font

## 🎨 Design Philosophy

- **Simplicity First**: No complex features, just what you need
- **Beautiful**: Premium design that feels good to use
- **Fast**: Instant loading, smooth animations
- **Accessible**: Clear, readable, easy to understand

---

**Made with ❤️ for neurodivergent minds**
