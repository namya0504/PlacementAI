# 🚀 PlacementAI – AI Resume Builder & Placement Preparation System

PlacementAI is an AI-powered Progressive Web Application (PWA) designed to help students build professional resumes, improve ATS scores, prepare for placement interviews, and track their placement readiness—all from a single platform.

The platform combines AI-assisted resume generation, ATS analysis, aptitude practice, technical preparation, HR interview simulation, and performance analytics to provide a complete placement preparation experience.

---

## 📌 Features

### 🤖 AI Resume Builder
- AI-generated professional resumes
- Multiple ATS-friendly resume templates
- Role-based resume generation
- Resume preview before download
- PDF download support

### 📄 ATS Resume Analysis
- Upload resume for ATS evaluation
- ATS compatibility score
- Keyword analysis
- Missing keyword suggestions
- Resume improvement recommendations

### 🧠 Aptitude Preparation
- Quantitative Aptitude
- Logical Reasoning
- English
- Stage-wise practice
- Timed mock tests
- Automatic scoring

### 💻 Technical Preparation
- Programming MCQs
- Coding Questions
- Java
- Python
- C++
- React
- Flutter
- SQL
- Topic-wise learning

### 🎤 AI HR Interview
- Common HR Questions
- AI-generated role-specific questions
- AI feedback
- Communication analysis
- Grammar evaluation
- Confidence score

### 📊 Dashboard
- Resume Score
- ATS Score
- Aptitude Progress
- Technical Progress
- HR Progress
- Placement Readiness Score
- Recent Activities

### 👤 User Profile
- Personal Information
- Education
- Skills
- Projects
- Certificates
- Resume Statistics

### 📈 Progress Tracking
- Weekly Progress
- Test History
- Performance Analytics
- Placement Readiness Graph

### 📱 Progressive Web App
- Installable on Mobile
- Responsive Design
- Fast Loading
- Offline Ready

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- CSS
- JavaScript

## Backend

- Node.js
- Express.js

## Database

- Firebase Firestore
- Supabase Storage

## Authentication

- Firebase Authentication
- Email & Password Login
- Google Authentication

## Storage

- Supabase Storage

## AI Integration

- GrokAI API

## Deployment

- Firebase Hosting

---

# 📂 Project Structure

```
PlacementAI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── firebase/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── firebase.json
├── firestore.rules
├── package.json
└── README.md
```

---

# 📄 Main Pages

- Home
- About
- Contact
- Login
- Signup
- Dashboard
- Resume Builder
- Resume Templates
- ATS Checker
- Aptitude
- Technical
- HR Interview
- Company Preparation
- My Progress
- Profile
- Settings

---

# 🔥 Firebase Services Used

- Firebase Authentication
- Firestore Database
- Firebase Storage
- Firebase Hosting

---

# 📁 Firestore Collections

```
users
profiles
resumes
skills
projects
certificates
mock_tests
technical_practice
hr_interviews
placement_readiness
download_history
```

---

# 🤖 AI Features

- AI Resume Generation
- AI Professional Summary
- AI Career Objective
- AI Resume Improvement Suggestions
- AI ATS Analysis
- AI HR Interview Questions
- AI HR Feedback
- AI Placement Readiness Evaluation

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/placementai.git
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Start Frontend

```bash
npm run dev
```

---

## Start Backend

```bash
cd backend
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

GEMINI_API_KEY=

JWT_SECRET=
```

---

# 📸 Screens

- Landing Page
- Authentication
- Dashboard
- Resume Builder
- Resume Preview
- ATS Analysis
- Aptitude Test
- Technical Practice
- HR Interview
- Company Preparation
- Progress Analytics
- User Profile
- Settings

---

# 🔒 Security

- Firebase Authentication
- Protected Routes
- JWT Authentication
- Firestore Security Rules
- Secure File Storage
- Input Validation

---

# 🎯 Project Objectives

- Help students create professional resumes.
- Improve resume ATS compatibility.
- Prepare students for aptitude and technical rounds.
- Simulate AI-based HR interviews.
- Track placement readiness using analytics.
- Provide an all-in-one placement preparation platform.

---

# 🌟 Future Enhancements

- Voice-based AI HR Interview
- AI Resume Optimization
- Real-time Coding Compiler
- Company-wise Placement Roadmaps
- AI Career Recommendations
- Interview Scheduling
- Push Notifications
- Multi-language Support
- Dark Mode

---

# 👨‍💻 Developed By

**PlacementAI Development Team**

Bachelor of Engineering (Information Technology)

Minor Project

---

# 📄 License

This project is developed for educational purposes as a Minor Project.

---

# ⭐ Acknowledgements

- React
- Vite
- Firebase
- Google Gemini API
- Express.js
- Node.js
- Open Source Community

---

## 🎨 How to Add a New Resume Template

Adding a new resume template to PlacementAI takes just **two simple steps** thanks to the plug-in registry architecture:

### 1. Create the Layout Component
Create a layout component in `src/features/resume/templates/layouts/` (or reuse an existing layout family). Every template component receives two standardized props:
- `data`: The resume data object (`personalInfo`, `role`, `summary`, `education`, `skills`, `projects`, `experience`, `certificates`).
- `options`: User customization tokens (`accentColor`, `spacing`, `fontScale`, `hiddenSections`, `sectionOrder`).

```jsx
import React from 'react';
import { resolveTokens } from '../tokens';
import { SectionTitle, ContactRow, SkillList, ExperienceItem, ProjectItem, EducationItem } from '../components/SharedComponents';

export function MyCustomLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('navy', options);
  const { personalInfo = {}, role = '', experience = [], education = [], skills = [], projects = [] } = data;

  return (
    <div className={`w-full bg-white text-slate-800 ${spacing.pagePadding}`}>
      {/* Header */}
      <h1 className={`${fonts.name} font-bold`}>{personalInfo.fullName}</h1>
      <p style={{ color: theme.accent }}>{role}</p>
      <ContactRow personal={personalInfo} accentColor={theme.accent} />

      {/* Sections */}
      {!hiddenSections.includes('experience') && experience.length > 0 && (
        <div>
          <SectionTitle title="Experience" accentColor={theme.accent} />
          {experience.map(exp => (
            <ExperienceItem key={exp.id} exp={exp} accentColor={theme.accent} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Register Entry in `TEMPLATES_REGISTRY`
Open `src/features/resume/templates/index.js` and add an entry:

```javascript
{
  id: 'my_custom_template',
  name: 'My Custom Template',
  description: 'Clean modern layout with customized accent highlights.',
  category: 'Creative', // 'ATS-Friendly' | 'Fresher' | 'Developer' | 'Sidebar' | 'Banner' | 'Minimal' | 'Creative'
  tags: ['Creative', 'Two-column'],
  atsFriendly: true,
  columns: 2,
  supportsPhoto: true,
  accentPresets: ['#1e3a8a', '#0f766e', '#be123c', '#7c3aed'],
  component: MyCustomLayout
}
```

That's it! The new template will automatically:
- Appear in the Canva-style Template Picker with a live scaled preview thumbnail.
- Support interactive color dots and the full preview modal.
- Be selectable in Step 1 and switchable in the Step 3 Customizer Panel without losing user data.
- Print with exact vector selectable text and clickable hyperlinks.
- Fallback gracefully to default if an unknown ID is provided.

---

**PlacementAI — Build Smart. Prepare Better. Get Hired.**

