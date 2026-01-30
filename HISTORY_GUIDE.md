# History Feature - User Guide

## ✅ Feature Added: Task History

Your PS-1 Smart Companion now **automatically saves every question/task** you ask!

---

## 📜 How It Works

### Automatic Saving
Every time you:
1. Type a task in the input box
2. Click "🚀 Ignite"
3. Generate a plan

The system automatically saves:
- ✅ Your original question/task
- ✅ The generated task breakdown
- ✅ Your energy level at the time
- ✅ Timestamp (date and time)
- ✅ Completion status

---

## 🔍 Viewing Your History

### Access History
1. Click the **"📜 History"** button in the top-right header
2. See all your past queries in reverse chronological order (newest first)

### What You'll See
Each history entry shows:
- 🕒 **Date & Time**: When you asked
- ⚡ **Energy Level**: Low/Medium/High
- **Your Query**: The exact question you asked
- **Tasks Generated**: How many tasks were created
- **Actions**: Reload button to reuse the query

---

## 🔄 Reloading Past Queries

Want to use a previous query again?

1. Go to History (click "📜 History")
2. Find the entry you want
3. Click **"🔄 Reload"**
4. The query will be loaded back into the input box
5. Your energy level will be restored
6. Click "Ignite" again to regenerate

---

## 🔎 Searching History

Can't find a specific task?

1. Open History
2. Type in the **search box** at the top
3. Results filter in real-time
4. Search matches your original query text

**Example**: Type "clean" to find all cleaning-related tasks

---

## 🗑️ Clearing History

Want to start fresh?

1. Open History
2. Click **"Clear All"** button (top-right of history section)
3. Confirm the action
4. All history will be deleted

⚠️ **Warning**: This action cannot be undone!

---

## 💾 Data Storage

### Where is it saved?
- **File**: `task_history.json` in your project root
- **Format**: JSON (human-readable)
- **Privacy**: Stored locally on your computer (not in the cloud)

### What's saved?
```json
{
  "id": 1,
  "timestamp": "2026-01-29T21:08:00",
  "user_query": "Clean my room and study math",
  "energy_level": "medium",
  "generated_plan": [...],
  "completed": false
}
```

---

## 🎯 Use Cases

### 1. **Recurring Tasks**
- Save your morning routine once
- Reload it every day
- No need to retype

### 2. **Track Progress**
- See what you've worked on over time
- Review past tasks
- Identify patterns

### 3. **Learn from History**
- See which energy levels work best for certain tasks
- Review how the AI broke down complex tasks
- Improve your task descriptions over time

### 4. **Accountability**
- Visual record of your activity
- See your streak of daily usage
- Motivate yourself with past successes

---

## 🔧 API Endpoints (For Developers)

If you want to integrate with the history system:

### Get All History
```
GET /api/history
GET /api/history?limit=10  (last 10 entries)
```

### Get Specific Entry
```
GET /api/history/{entry_id}
```

### Search History
```
GET /api/history/search?q=clean
```

### Get Recent (Last N Days)
```
GET /api/history/recent/7  (last 7 days)
```

### Mark as Completed
```
POST /api/history/{entry_id}/complete
```

### Clear All History
```
DELETE /api/history
```

---

## 💡 Tips

1. **Use Descriptive Queries**: The better your original query, the easier it is to find later
2. **Check History Regularly**: Review what you've accomplished
3. **Reload Frequently Used Tasks**: Save time on repetitive tasks
4. **Search Before Creating**: You might have already asked the same question

---

## 🎉 Benefits

✅ **Never lose a task idea**  
✅ **Reuse successful task breakdowns**  
✅ **Track your productivity over time**  
✅ **Learn from past patterns**  
✅ **Save time on recurring tasks**  

---

**Your history is now being saved automatically!** 
Open the app and try it out: http://localhost:8000
