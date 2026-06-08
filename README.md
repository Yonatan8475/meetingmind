# 🧠 MeetingMind — Frontend

> A professional Next.js frontend for the MeetingMind AI Meeting Intelligence system. Record meetings in **English or Amharic**, transcribe with Groq Whisper, and process through 3 specialized AI agents to generate structured reports.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## 🎯 What It Does

```
🎙️ Record Audio (English or Amharic)
        ↓
📝 Groq Whisper transcribes speech to text
        ↓
⚡ 3 AI Agents process the transcript
        ↓
📄 Professional formatted report generated
        ↓
⬇ Download as .txt file
```

---

## 🖥️ Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Live stats, hero section, recent meetings |
| Record | `/record` | Record audio or paste transcript |
| Process | `/process` | Run pipeline on pasted text |
| Tracker | `/tracker` | Test Agent 3 directly |
| Meetings | `/meetings` | All past meetings |
| Meeting Detail | `/meetings/[id]` | Single meeting with full report |
| Tasks | `/tasks` | All tasks with status management |

---

## 🏗️ Project Structure

```
meetingmind/
│
├── app/                        ← Next.js App Router
│   ├── layout.js               ← Root layout with fonts and Header
│   ├── page.js                 ← Dashboard
│   ├── record/
│   │   └── page.js             ← Recording page
│   ├── process/
│   │   └── page.js             ← Paste transcript page
│   ├── tracker/
│   │   └── page.js             ← Agent 3 tester
│   ├── meetings/
│   │   ├── page.js             ← Meetings list
│   │   └── [id]/page.js        ← Single meeting detail
│   └── tasks/
│       └── page.js             ← Tasks management
│
├── components/                 ← Reusable UI components
│   ├── Header.js               ← Sticky nav + API status
│   ├── AudioRecorder.js        ← Mic + waveform + language selector
│   ├── FormattedReport.js      ← Professional report viewer + download
│   ├── TaskItem.js             ← Single task row
│   ├── ReportView.js           ← Report visual/raw toggle
│   └── StatCard.js             ← Stat number display
│
├── lib/
│   ├── api.js                  ← All API calls to FastAPI backend
│   └── constants.js            ← Sample data, presets, agent info
│
├── package.json
├── next.config.js
├── tailwind.config.js
└── jsconfig.json
```

---

## 🛠️ Tech Stack

- **Next.js 14** — App Router, Server Components, file-based routing
- **React 18** — useState, useEffect, useRef, useCallback
- **Tailwind CSS** — Utility-first styling
- **Web Audio API** — Real-time waveform visualization while recording
- **MediaRecorder API** — Browser-native audio recording (no library needed)
- **Google Fonts** — Bebas Neue, Outfit, DM Mono

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8000`

### 1. Clone the repo

```bash
git clone https://github.com/Yonatan8475/meetingmind.git
cd meetingmind
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

Frontend live at: `http://localhost:3000`

### 4. Make sure backend is running

```bash
# In a separate terminal
cd gemini-multi-agent
docker compose up
```

---

## 🌍 Bilingual Support

MeetingMind supports **English** and **Amharic (አማርኛ)** recordings.

| Language | Code | Flag |
|----------|------|------|
| English | `en` | 🇺🇸 |
| Amharic | `am` | 🇪🇹 |
| Auto-detect | `auto` | 🌐 |

---

## 📡 API Integration

All API calls are centralized in `lib/api.js`:

```javascript
// Transcribe audio
const result = await transcribeAudio(audioBlob, 'en');

// Run full pipeline
const data = await processMeeting(transcript);

// Download report
const url = getDownloadUrl(meetingId);

// Get all meetings
const meetings = await getMeetings();

// Update task status
await updateTaskStatus(taskId, 'Done');
```

Change the API base URL by setting the environment variable:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-gcp-url.run.app
```

---

## 🎙️ How Recording Works

```javascript
// 1. Get microphone access
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// 2. Visualize with Web Audio API
const analyser = audioCtx.createAnalyser();
source.connect(analyser);

// 3. Record with MediaRecorder
const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
recorder.start();

// 4. Send to Groq Whisper via API
const formData = new FormData();
formData.append('file', audioBlob, 'recording.webm');
formData.append('language', 'en');
const result = await fetch('/api/transcribe', { method: 'POST', body: formData });
```

---

## 📄 Report Format

After processing, the app generates a professional formatted report:

```
═══════════════════════════════════════════════════════
         MEETING TRANSCRIPT & REPORT
            Generated by MeetingMind AI
═══════════════════════════════════════════════════════
  Date       : June 8, 2026
  Time       : 10:30 AM
  Language   : English
  Duration   : 3 minutes 24 seconds
  Meeting ID : #5
═══════════════════════════════════════════════════════

TRANSCRIPT
───────────────────────────────────────────────────────
John will build the API backend by Friday...

═══════════════════════════════════════════════════════

SUMMARY
───────────────────────────────────────────────────────
Key Points:
- API backend assigned to John...

═══════════════════════════════════════════════════════

ACTION ITEMS
───────────────────────────────────────────────────────
  1. Build API backend
     Owner    : John
     Deadline : Friday
     Status   : Pending

═══════════════════════════════════════════════════════
```

---

## 🚢 Deployment — Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set API URL environment variable
vercel env add NEXT_PUBLIC_API_URL
# Enter your GCP Cloud Run URL
```

Live at: `https://meetingmind.vercel.app`

---

## 🔗 Related

- **Backend repo:** [github.com/Yonatan8475/gemini-multi-agent](https://github.com/Yonatan8475/gemini-multi-agent)
- **API docs:** `http://localhost:8000/docs`

---

## 👨‍💻 Built By

**Yonatan Abebe**
Applied AI Solutions Development — George Brown College, Toronto 2025

- 🔗 GitHub: [github.com/Yonatan8475](https://github.com/Yonatan8475)
- 🌍 Building: TruckGo Ethiopia — AI-powered freight matching platform

---

## 📄 License

MIT License — free to use, modify, and distribute.
