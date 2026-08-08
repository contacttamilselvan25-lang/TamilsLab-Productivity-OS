<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2a788202-d539-4c65-91ae-469496c6fb45

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

----------------------------------------------------------------------------------------------------------------------------------------------------------------

ABOUT THIS APP :
🌟 Core Views & Features
The app is divided into 10 specialized views managed by the main layout (

src/App.tsx
):

1. 🌅 Today View (Daily Dashboard)
Displays a greeting banner matching the current time of day.
Shows a prioritized checklist of today's tasks and commitments.
Incorporates a Recharts pie chart to visualize habit distribution.
Triggers celebratory confetti animation upon completion of the day's priority tasks.
2. 📝 Tasks View (Advanced Task Manager)
Tracks items across 4 priority levels (P1 to P4).
Supports subtask breakdowns, due dates/times, and project folders.
Supports recurrence rules (daily, weekly, monthly) for repeat items.
3. 🗓️ Calendar View (Interactive Schedule)
Schedules events, appointments, and focus sessions.
Provides color-coded categories, locations, and duration timelines.
4. 📓 Notes View (Document & Thought Hub)
Features custom categorization (Work, Personal, Ideas) and tags.
Includes a Note Summarizer: Powered by the Gemini backend, it automatically extracts a 2-bullet summary and action items from any note.
5. 🎨 Drawing Notes View (Interactive Whiteboard / Canvas)
This is an incredibly rich component (

DrawingNotesView.tsx
) supporting three creative workflows:

Schematic Mode: A drag-and-drop flowchart editor featuring pre-styled nodes (Process, Decision, Start, Database, Cloud, Text) with connectable arrows.
Freehand Mode: An HTML5 Canvas editor containing draw, highlight, erase, stroke size, and custom shape tools (rectangle, circle, lines, arrows) with a rich color palette.
Styled Note Mode: For taking rich, custom text documents.
6. 📁 Files View (Local File Vault & AI Doc Analysis)
Allows local files (PDFs, text files, spreadsheets) to be uploaded and stored as Base64 data URLs.
Provides full preview and download capabilities directly in the app.
AI Document Analysis: Extracts plaintext content and submits it to the Gemini server for answering questions, summarizing information, or pulling actionable checklists from files.
7. 🔁 Habits View (Habit Tracker)
Tracks habits categorized by life pillars (Mindfulness, Health, Fitness, Learning, etc.).
Tracks daily/weekday streaks and logs historical completion dates inside local storage.
8. 🎯 Goals View (Strategic AI Goal Breakdown)
Tracks monthly, quarterly, or yearly goals with completion percentages.
Milestone Generation: Integrates with the Gemini API to automatically break down a primary goal into a step-by-step sequence of actionable milestones.
9. ⏱️ Focus Timer View (Procedural Noise Pomodoro)
Features a Pomodoro timer with pre-configured or custom durations.
Procedural Web Audio Engine (

src/lib/ambientSound.ts
): Procedurally generates high-quality background soundscapes (Rain, White Noise, Ocean Waves, Forest) locally in the browser using the Web Audio API without requiring any external audio files.
10. ⚙️ Settings View
Configures user profiles, accent colors (Indigo, Emerald, Violet, Amber, Slate, Rose), and dark/light modes.
Allows selecting preferred AI personalities (Calm, Concise, Detailed) and models.
🧠 The Workspace AI Assistant
Unlike standard chat interfaces, the chat assistant in Tamil’slab is built around the User's Workspace Context:

Whenever you type a message, the client automatically packages the state of your local storage (your name, today's schedule, notes, goals, active tasks, and past AI memory facts) and feeds it to the model.
The Express API endpoint (

server.ts:L42-L107
) runs the Gemini model using a calm, highly intelligent, workspace-advisor instruction set.
The AI can suggest direct interface actions, such as scheduling daily blocks, rescheduling overdue tasks, or creating new notes directly from your conversation.
🖥️ Native Desktop Integration
The workspace includes custom automation to run the application like a native desktop program on Windows:



start_app.bat
: Starts the Node server in the background and launches Microsoft Edge or Google Chrome in standalone App Mode (--app=http://localhost:3000), using a dedicated user-data directory to keep your session separate from standard web browsing.


stop_app.bat
: Safely kills the running server processes.


create_shortcut.ps1
: A PowerShell utility that generates clean shortcuts on your Windows Desktop (complete with the custom app_logo.ico) so you can launch and close the environment in one click.
