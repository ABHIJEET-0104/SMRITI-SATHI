# Smriti Sathi (स्मृति साथी)
> **A Calm Cognitive Care & Memory Companion for Elders — and Peace of Mind for Caregivers.**

[![Built with TanStack Start](https://img.shields.io/badge/Fullstack-TanStack%20Start-blue)](https://tanstack.com/start)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61dafb)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20v4-38bdf8)](https://tailwindcss.com/)
[![Database-Supabase](https://img.shields.io/badge/Backend-Supabase%20Postgres-3ecf8e)](https://supabase.com/)
[![License-MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🌟 Overview

**Smriti Sathi** is an accessible, culturally-inclusive web application designed to support elders experiencing mild cognitive impairment, age-related memory lapses, or early-stage dementia. 

Unlike cold diagnostic software, Smriti Sathi is framed around **emotional familiarity, gentle routines, and dignity**. It blends **personalized cognitive stimulation games** using real family photos with **multilingual voice assistance**, **daily routine and medication reminders**, and a **caregiver command dashboard** for tracking game engagement trends without invasive surveillance or unsubstantiated medical claims.

---

## ✨ Key Features

- **👴 Dedicated Dual-Persona Roles**:
  - **Patient / Elder Mode**: Large high-contrast touch targets, simplified layouts, warm greetings, and zero clinical anxiety.
  - **Caregiver Mode**: Centralized hub to track game sessions, view performance trends, upload family portraits, and schedule daily reminders.
- **🖼️ Family Memory Match (`family_memory_match`)**:
  - Interactive photo-and-name recall game powered by photos of children, grandchildren, and loved ones uploaded by the caregiver.
- **🔢 Sequence Memory (`sequence_memory`)**:
  - Calm spatial pattern-matching game with high-contrast colored pads designed to stimulate short-term working memory.
- **📈 Deterministic Adaptive Difficulty & Trends**:
  - Transparent, rule-based algorithms dynamically adjust difficulty levels (`easy`, `medium`, `hard`) based on recent accuracy, mistake count, and response time.
  - Visual trends (`improving`, `stable`, `declining`) presented to caregivers with strict non-medical disclaimers.
- **🗣️ Multilingual Voice Guidance**:
  - Native voice and text instructions across 4 languages:
    - 🇬🇧 **English** (`en-IN`)
    - 🇮🇳 **Hindi (हिन्दी)** (`hi-IN`)
    - 🇮🇳 **Marathi (मराठी)** (`mr-IN`)
    - 🇮🇳 **Assamese (অসমীয়া)** (`as-IN`)
- **📶 Offline-First Resilience**:
  - Games run seamlessly without internet connectivity. Completed rounds are safely queued in `localStorage` and automatically synchronized using idempotent UUIDs upon reconnection.
- **⏰ Daily Medication & Routine Reminders**:
  - Scheduled reminders with large one-tap acknowledgment tracking to keep daily habits on schedule.
- **🔗 6-Character Care Code Pairing**:
  - Simple, secure pairing between caregiver and elder without complex invitation links or setup hassles.

---

## 🏗️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with [TanStack Router](https://tanstack.com/router)
- **Frontend Core**: [React 19](https://react.dev/), TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Data Fetching & State**: [TanStack Query v5](https://tanstack.com/query)
- **Charts & Data Visuals**: [Recharts](https://recharts.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & Auth Middleware)
- **Audio / Voice**: Native Web Speech API (`SpeechSynthesis`) with localized voice resolution
- **Icons & Notifications**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/)

---

## 📁 Repository Structure

```
.
├── src/
│   ├── components/            # UI components (AppShell, FaceTile, TrendChart, PhotoInput)
│   ├── hooks/                 # Custom React hooks (useApp, useGameSession)
│   ├── integrations/supabase/ # Supabase client & auth middleware
│   ├── lib/                   # Core business logic:
│   │   ├── api.functions.ts   # TanStack Start server functions (CRUD & aggregations)
│   │   ├── i18n.ts            # Multilingual dictionaries (EN, HI, MR, AS)
│   │   ├── performance.ts     # Deterministic difficulty and trend algorithms
│   │   ├── offline.ts         # Offline queue & auto-sync engine
│   │   └── voice.ts           # Speech synthesis service
│   ├── routes/                # File-based router pages
│   │   ├── index.tsx          # Dual-persona entry landing page
│   │   ├── auth.tsx           # Authentication modal & sign-up forms
│   │   └── _authenticated/    # Protected routes:
│   │       ├── home.tsx       # Elder dashboard (Games & daily reminders)
│   │       ├── caregiver.tsx  # Caregiver dashboard (Analytics, photos, reminders)
│   │       ├── play.family.tsx# Family Memory Match game
│   │       ├── play.sequence.tsx # Sequence Memory game
│   │       └── profile.tsx    # Profile & language settings
├── supabase/
│   └── migrations/            # Versioned SQL migrations & RLS policies
├── PRD.md                     # Detailed Product Requirements Document
├── implementation.md          # Technical architecture & implementation guide
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: $\ge 20.0.0$
- **npm** or **bun**
- A [Supabase](https://supabase.com) project (or local Supabase instance)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port specified in terminal output).

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 📖 Documentation

- **[Product Requirements Document (PRD.md)](./PRD.md)**: Product vision, user personas, functional specifications, and success criteria.
- **[Technical Implementation Guide (implementation.md)](./implementation.md)**: Database schemas, RLS policies, server function contracts, offline sync engine, and deployment guide.

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are always welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License & Ethical Disclaimer

This project is open source and available under the [MIT License](LICENSE).

> **Important Notice**: *Smriti Sathi is designed solely for cognitive stimulation, personal memory engagement, and daily routine assistance. It is NOT a medical device, nor does it provide medical diagnosis, treatment, or clinical assessment. Always consult qualified healthcare professionals regarding neurological health or dementia care.*

