# 🌿 Tamil's Lab — AI Workspace & Productivity

> Your all-in-one **AI-powered workspace**: tasks, calendar, notes, drawing canvas, habits, goals, focus timer — plus a workspace-aware Gemini assistant that actually knows your schedule.

![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?logo=google&logoColor=white)

---

## ✨ Features

| View | What it does |
| --- | --- |
| ☀️ **Today** | Greeting banner, prioritized checklist, habit pie-chart, confetti on completion |
| ✅ **Tasks** | P1–P4 priorities, subtasks, due times, project folders, recurring tasks |
| 📅 **Calendar** | Color-coded events, focus sessions, locations & timelines |
| 📝 **Notes** | Categorized notes + **Gemini summarizer** extracting bullets & action items |
| ✏️ **Drawing Notes** | Whiteboard with flowchart editor, freehand canvas, and styled notes |
| 📁 **Files** | Local file vault + **AI document analysis** (PDFs, text, spreadsheets) |
| 🎯 **Habits** | Life-pillar habit tracking with day/week streaks |
| 🚩 **Goals** | Auto **milestone breakdown** via Gemini API |
| ⏱️ **Focus Timer** | Pomodoro + procedural soundscapes (Rain, White Noise, Ocean, Forest) |
| ⚙️ **Settings** | Themes (light/dark), accent colors, AI personality & model selection |

## 🤖 The Workspace AI Assistant

The chat assistant is tuned to **your real context** — it packages your notes, schedule, goals and active tasks from local storage and acts as an advisor that can even perform interface actions (reschedule tasks, create notes, schedule blocks).

## 🖥️ Native Desktop Experience

- `start_app.bat` — launches the server + opens Chrome/Edge in dedicated app mode
- `stop_app.bat` — cleanly stops the local server
- `create_shortcut.ps1` — adds a desktop shortcut with the custom app icon

---

## 🚀 Run locally

**Prerequisites:** [Node.js](https://nodejs.org)

```bash
# 1. Install dependencies
npm install

# 2. Set your Gemini API key
#    Copy .env.example to .env.local and fill in GEMINI_API_KEY

# 3. Run the app
npm run dev
```

Then open `http://localhost:3000`.

> **Security:** your API key lives only in local `.env.local` — it is git-ignored and never committed.

## 📁 Project structure

```
├── server.ts            # Express + Gemini API endpoint
├── src/                 # React views (Tasks, Calendar, Notes, Habits, Goals…)
├── src/lib/ambientSound.ts  # Procedural Web Audio soundscapes
├── public/              # Static assets & app icon
├── vite.config.ts       # Vite + Tailwind config
└── start_app.bat        # Windows desktop launcher
```

## 🧰 Tech stack

**React 19 · TypeScript · Vite · Tailwind CSS · Express · Google Gemini API · Recharts · canvas-confetti · Web Audio API**

---

<p align="center">Made with 🧪 technical ambition</p>