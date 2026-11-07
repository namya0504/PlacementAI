# 🚀 PlacementAI – AI Resume Builder & Placement Preparation System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://placement-ai-nu.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://placementai-backend.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/namya0504/PlacementAI)
[![React](https://img.shields.io/badge/React%2018-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🌟 Overview

**PlacementAI** is an intelligent, full-stack placement preparation platform engineered to empower students and job seekers throughout their recruitment journey. From crafting ATS-optimized resumes and running real-time coding evaluations to practicing adaptive aptitude tests and AI-powered HR interviews, PlacementAI unifies all placement preparation into a single cohesive ecosystem.

🔗 **Live Application:** [https://placement-ai-nu.vercel.app](https://placement-ai-nu.vercel.app)  
📦 **Repository:** [https://github.com/namya0504/PlacementAI](https://github.com/namya0504/PlacementAI)

---

## 📌 Core Modules & Features

### 📄 1. AI Resume Builder
- **Plug-in Template Registry:** Multiple ATS-compliant, modern layouts (Minimal, Developer, Executive, Creative, Sidebar).
- **Interactive Customizer:** Real-time font scaling, accent palette picker, section ordering, and visibility toggles.
- **A4 Vector PDF Export:** High-fidelity print-to-PDF engine with selectable vector text, clickable links, and precise pagination.
- **AI Bullet Point Polish:** Instant role-specific bullet enhancement and grammar corrections powered by AI.

### 🎯 2. ATS Resume Analyzer
- **Direct PDF/DOCX Parsing:** Client and backend parsing extracting structured skills, experience, and education.
- **Job Description Matcher:** Paste target job descriptions to analyze keyword match rate and ATS compatibility score (0–100%).
- **Actionable Gap Analysis:** Highlights missing industry keywords, formatting errors, and actionable recommendations.

### 💻 3. Technical Preparation Workspace
- **LeetCode-Style Split IDE:** Problem description tab, sample test cases tab, and real-time execution results console.
- **Deterministic Code Runner:** Native multi-language evaluation engine (Python 3 and Node.js VM) with sub-second execution.
- **AI Verification Fallback:** Intelligent evaluation for complex or non-deterministic test cases with detailed failure traces.
- **Progression Logic:** Unlocks next challenges dynamically upon passing all test cases.

### 🧠 4. Aptitude & Reasoning Tests
- **Category-Wise Question Bank:** Quantitative Aptitude, Logical Reasoning, and Verbal Ability.
- **Timed Mock Tests:** Exam-simulated timed tests with instant scoring and detailed step-by-step explanations.
- **Adaptive Difficulty:** Dynamic question sets calibrated to target student proficiency.

### 🎤 5. AI HR Mock Interviews
- **Real-Time Interactive Chat & Speech:** Interactive interview simulations with customizable behavioral and situational tracks.
- **Speech & Sentiment Analysis:** Evaluates answer structure (STAR method), grammar, vocabulary, clarity, and confidence.
- **Comprehensive Interview Reports:** Detailed feedback reports with strengths, weaknesses, and improvement roadmaps.

### 🏢 6. Company-Specific Preparation
- **Top Tech Curations:** Targeted preparation tracks tailored for leading tech companies (FAANG, Tier-1 Product & Service giants).
- **Role Alignment:** Synchronized preparation tracks aligned with student target roles (Software Developer, Data Scientist, Full Stack, DevOps).

### 📊 7. Placement Readiness Analytics
- **Live Readiness Score:** Holistic readiness algorithm weighing resume quality, aptitude test history, coding accuracy, and mock interview performance.
- **Streak & Activity Heatmap:** Real-time tracking of student preparation streaks and daily milestones.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, HTML2PDF |
| **Backend** | Node.js, Express.js, JWT, Bcrypt, Multer, Helmet, CORS |
| **Database & Auth** | Google Firebase Firestore, Firebase Authentication, Firebase Admin SDK |
| **File Storage** | Supabase Storage & Google Cloud Storage |
| **AI Engines** | Groq AI (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`), xAI Grok API |
| **Deployment** | Vercel (Frontend Client), Render (Express Backend API) |

---

## 📂 Project Architecture

```
PlacementAI/
├── backend/
│   ├── config/            # Environment and AI configuration
│   ├── controllers/       # Route controllers (Auth, Profile, Technical, HR, ATS, Resume)
│   ├── firebase/          # Firebase Admin SDK & Firestore helper
│   ├── middlewares/       # JWT Auth, CSRF, rate limiters, file upload
│   ├── python/            # Python speech analysis & resume extraction services
│   ├── routes/            # REST API endpoint definitions
│   ├── services/          # Groq AI, code runner, email, and storage services
│   └── server.js          # Express server entry point
│
├── public/                # Static assets, PWA manifest, service worker
│
├── src/
│   ├── assets/            # Client graphics and brand assets
│   ├── components/        # Reusable UI components (Navbar, Footer, Modals)
│   ├── context/           # AuthContext & global state providers
│   ├── features/          # Domain-specific feature modules (Resume, Interview)
│   ├── pages/             # Route pages (Dashboard, Technical, ATS, Profile, Login, Signup)
│   ├── routes/            # React Router paths & protected route guards
│   ├── services/          # Client API caller layer & Firebase client SDK
│   ├── App.jsx            # Application root
│   └── main.jsx           # Vite client mount point
│
├── vercel.json            # Vercel deployment & cache-control headers
├── package.json           # Frontend dependencies and build scripts
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or v20.x+)
- **npm** or **pnpm**
- **Git**
- Firebase & Supabase accounts (for database, authentication, and file storage)

### 1. Clone the Repository
```bash
git clone https://github.com/namya0504/PlacementAI.git
cd PlacementAI
```

### 2. Configure Environment Variables

#### Frontend `.env` (Project Root)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend `.env` (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key

# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI Service Keys (Groq / xAI)
XAI_API_KEY=your_groq_or_xai_api_key
GROK_API_KEY=your_groq_or_xai_api_key

# Supabase Storage (Optional)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### 3. Install Dependencies & Run

#### Terminal 1 — Backend:
```bash
cd backend
npm install
npm run dev
```

#### Terminal 2 — Frontend:
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔒 Security & Data Integrity

- **Dual-Layer Authentication:** Seamlessly integrates Firebase Authentication with backend JWT cookie tokens for protected operations.
- **CSRF & Rate Limiting:** Enforces strict anti-CSRF token verification and tiered rate limiters on AI and auth routes.
- **Sanitized AI Prompts:** Rigorous input sanitization prevents prompt injections and delimiter breakouts.
- **Deterministic Sandboxing:** Coding challenge executions run within isolated memory environments with execution timeouts.

---

## 👥 Contributors

- **Namya / Diya** ([@namya0504](https://github.com/namya0504) / [@diya2405](https://github.com/diya2405))
- **PlacementAI Development Team**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
