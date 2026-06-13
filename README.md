<div align="center">

# 🎓 EduPortal

### All-in-one school management & learning platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-E53935?style=for-the-badge)](#-license)

</div>

---

## 📖 Overview

**EduPortal** is a single-page web application that brings every actor in a school onto one platform. It ships **four role-based experiences** — Principal, Teacher, Parent, and Student — each with its own dashboard and a tailored set of modules covering academics, communication, school operations, AI assistance, and student wellbeing.

The app is built with **React 19** and bundled by **Vite 8**, uses an `AppContext` for role/session state, and lazily code-splits every feature module so the initial load stays light.

> The application source lives in the **`Web/`** sub-directory of this repository.

---

## ✨ Features

### 🧑‍💼 Role-based dashboards
- **Principal** — school-wide overview, class comparison, AI risk analysis
- **Teacher** — teacher dashboard, attendance, AI lesson planner, evaluations
- **Parent** — parent hub with child overview and direct communication
- **Student** — personal dashboard, study plan, deadlines, competency heatmap

### 🤖 AI-powered tools
- **AI Tutor** & **Floating Chat Widget** — on-demand help
- **Essay Grader** — automated writing feedback
- **AI Risk Analysis** — early-warning signals for at-risk students
- **University Matchmaker** & **AI Advisor** — guidance for student pathways

### 💬 Communication
- Class chat rooms, direct chat, bulletin board, notification center
- **EduMeet** video meetings & meeting booking

### 📚 Academics
- Exam repository, video lectures, mock exams, smart flashcards
- Grade trend charts, class journal, assignments, conduct & evaluations

### 🏫 School operations
- Teacher attendance, seating charts, duty schedules, timetable generator
- School calendar, canteen/cafeteria manager, bus tracker, asset manager
- Library hub & school gallery

### 🏆 Engagement & wellbeing
- Badges, leaderboard, mini tournaments, streak widgets
- Wellness hub, study groups, clubs
- Portfolio builder, digital wallet/ID with **VietQR** payment, counseling

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite 8 |
| Icons | lucide-react |
| Linting | ESLint 10 + react-hooks / react-refresh plugins |
| Hosting | Vercel |

---

## 📁 Project Structure

```
Education/
└── Web/
    ├── index.html
    ├── package.json
    ├── eslint.config.js
    ├── public/                 # favicon, icon sprites
    └── src/
        ├── App.jsx             # role + tab router (lazy-loaded modules)
        ├── context/            # AppContext (role & session state)
        └── components/
            ├── dash/           # role overview panels
            ├── student/        # student-only tabs
            ├── teacher/        # teacher-only tabs
            └── *.jsx           # feature modules
```

---

## 🚀 Getting Started

```bash
# 1. Move into the app directory
cd Web

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The dev server runs at the URL Vite prints (default `http://localhost:5173`).

---

## 📜 Available Scripts

Run inside the `Web/` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Produce an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the codebase with ESLint |

---

## ☁️ Deployment

The project deploys to **Vercel**. Set the build root to `Web/`, with build command `npm run build` and output directory `dist`. Pushing to `main` triggers an automatic production deployment.

---

## 👤 Author

**Bùi Đăng Minh** — Swinburne University
[GitHub @buidangminh23](https://github.com/buidangminh23)

## 📄 License

Released under the **MIT License**.
