# 🧠 DSA Mate

### A Personalized DSA Practice & Progress Tracking Platform

DSA Mate is a lightweight web-based platform designed to help students practice Data Structures and Algorithms while tracking their learning progress.

Unlike a basic question list, DSA Mate combines question practice, test-case checking, hints, timers, topic-wise analytics, daily targets, and personalized progress tracking in a single platform.

The project is designed as a simple and accessible alternative for students who want a structured DSA learning environment.

---

## 🚀 Features

### 📚 Question Practice
- Browse DSA questions by topic and difficulty.
- Search questions by title.
- View question descriptions and hints.
- Mark questions as solved.

### 🧪 Test Case Checking
- Write JavaScript solutions directly in the built-in editor.
- Run your code and view the output.
- Test solutions against predefined test cases.
- Automatically mark a question as solved when the test case passes.

### 🎯 Personalized Learning
- Topic-wise progress tracking.
- Difficulty-wise filtering.
- Automatic weak-area detection.
- Daily question targets.
- Personalized practice based on unsolved questions.

### ⏱️ Practice Tools
- Built-in solving timer.
- Multi-level question difficulty.
- Hints for difficult problems.
- Save solutions locally.

### ➕ Custom Questions
Users can create their own questions by specifying:
- Question title
- Topic
- Difficulty
- Description
- Test case input
- Expected output

### 📊 Progress & Analytics
- Total questions
- Solved questions
- Topic-wise completion percentage
- Weak-topic identification
- Local leaderboard based on solved questions

### 💾 Data Management
- Progress is stored using browser LocalStorage.
- Export progress as a JSON backup.
- Import previously exported progress.
- Data remains available after refreshing the page.

### 🌙 User Interface
- Responsive design
- Dark mode
- Search and filtering
- Clean split-screen practice interface

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

Used to build the user interface, question dashboard, code editor, filters, progress section, and interactive features.

### Data Storage
- Browser LocalStorage

Used to persist questions, solved status, saved solutions, and user progress without requiring a backend server.

### Deployment
- GitHub Pages
- Vercel
- Any static web hosting platform

---

## 🏗️ System Workflow

```text
             ┌───────────────────┐
             │      Start        │
             └─────────┬─────────┘
                       ↓
             ┌───────────────────┐
             │   Open DSA Mate   │
             └─────────┬─────────┘
                       ↓
             ┌───────────────────┐
             │ Select a Question │
             └─────────┬─────────┘
                       ↓
             ┌───────────────────┐
             │ Read Problem &    │
             │ Write Solution    │
             └─────────┬─────────┘
                       ↓
             ┌───────────────────┐
             │    Run / Test     │
             └─────────┬─────────┘
                       ↓
                ┌──────┴──────┐
                │             │
             Pass            Fail
                │             │
                ↓             ↓
        ┌──────────────┐  ┌──────────────┐
        │ Mark Solved  │  │ Modify Code  │
        └──────┬───────┘  └──────┬───────┘
               │                  │
               └────────┬─────────┘
                        ↓
              ┌──────────────────┐
              │ Update Progress  │
              └────────┬─────────┘
                       ↓
              ┌──────────────────┐
              │ Continue Practice│
              └──────────────────┘
