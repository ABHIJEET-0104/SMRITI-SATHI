# Product Requirements Document (PRD)

## Project: **Smriti Sathi (स्मृति साथी)**
**Cognitive Care & Memory Companion for Elders and Caregivers**  
*Repository / Solution Context: SIH2K26 / ABHIJEET-0104/SMRITI-SATHI*

---

## 1. Executive Summary & Vision

**Smriti Sathi** ("Memory Companion") is a patient-centric, caregiver-integrated web application designed to support elderly individuals, particularly those experiencing mild cognitive impairment (MCI), age-related memory decline, or early-stage dementia. 

Unlike clinical diagnostic tools, Smriti Sathi is framed around **dignity, emotional warmth, calm routines, and empowerment**. It blends **personalized cognitive stimulation games** (leveraging familiar family photographs and sequence memory) with **multilingual voice assistance**, **structured daily task/medication reminders**, and **transparent, non-medical performance monitoring for caregivers**.

### Core Value Propositions
1. **Calm, Senior-Friendly Experience**: High-contrast typography, large touch targets, minimal visual clutter, soft acoustic cues, and zero clinical anxiety.
2. **Multilingual Inclusivity (Indic First)**: Complete UI and spoken voice guidance in English, Hindi (हिन्दी), Marathi (मराठी), and Assamese (অসমীয়া).
3. **Personalized Cognitive Engagement**: Memory exercises built from the elder's actual family circle and personal history rather than abstract puzzles.
4. **Offline-First Resilience**: Games continue running without interruption when connectivity drops, using client-generated idempotent UUIDs that sync seamlessly upon reconnection.
5. **Caregiver Empowerment without Surveillance Overreach**: Caregivers track objective game performance (accuracy, response times, adherence trends) with deterministic rule-based insights, maintaining ethical boundaries by avoiding unauthorized medical claims.

---

## 2. Target Personas & User Journeys

### Persona A: The Elder / Patient ("Dada-ji / Aaji")
- **Profile**: 65+ years old, experiencing normal cognitive aging or mild memory lapse; comfortable with regional speech; intimidated by complex technology or dense forms.
- **Pain Points**: Forgetting names/faces of distant relatives, missing daily medications or hydration routines, anxiety induced by complex apps.
- **Needs**: Large buttons, clear spoken instructions in native language, positive reinforcement, frustration-free recovery from mistakes.
- **Key Journey**:
  1. Opens the application or receives a morning reminder.
  2. Hears a gentle audio greeting (*"Namaskar, welcome back"*).
  3. Plays a 5-question **Family Memory Match** game viewing pictures of grandchildren.
  4. Receives immediate, calm verbal encouragement.
  5. Views today's reminders (e.g., "Afternoon blood pressure medicine") and taps "Acknowledge" with one touch.

### Persona B: The Primary Caregiver ("Adult Son / Daughter / Nurse")
- **Profile**: 30–55 years old, managing their elderly parent's daily well-being while balancing work and family life.
- **Pain Points**: Uncertainty regarding cognitive trajectory, difficulty verifying if daily routines/tablets were remembered, guilt over physical distance.
- **Needs**: Remote visibility into game consistency, easy photo uploading with names/relationships, simple scheduling of daily reminders, pairing via simple shareable codes.
- **Key Journey**:
  1. Registers as Caregiver and links the elder's profile using a 6-character **Care Code** (e.g., `A8F9B2`).
  2. Uploads photos of family members, tagging names and relationships.
  3. Sets scheduled reminders (e.g., "09:00 AM Blood pressure pill", "05:00 PM Evening walk").
  4. Reviews the Performance Trend charts (accuracy, response speed, mistakes, rule-based difficulty progression).

---

## 3. Product Goals & Success Metrics

| Objective | Key Metric | Target / SLA |
| :--- | :--- | :--- |
| **Cognitive Engagement** | Weekly Active Sessions | $\ge 4$ sessions per active elder / week |
| **Accessibility & Usability** | Task Completion Rate | $> 90\%$ completion of game rounds without caregiver intervention |
| **Language Inclusivity** | Non-English Usage | $> 60\%$ sessions played in Hindi, Marathi, or Assamese |
| **Offline Reliability** | Sync Success Rate | $100\%$ idempotent sync of cached offline sessions |
| **Caregiver Satisfaction** | Caregiver Onboarding | $< 2$ minutes to link elder via 6-character Care Code |

---

## 4. Key Functional Features & Requirements

### 4.1 Dual-Role Authentication & Profile Management
- **FR-AUTH-1**: Dedicated entry paths on landing screen: **Patient/Elder Login** vs. **Caregiver Login**.
- **FR-AUTH-2**: Support for Email/Password and OAuth (Google / Cloud Auth) via Supabase Auth.
- **FR-AUTH-3**: Automatic profile provisioning on sign-up with default language selection (`en`, `hi`, `mr`, `as`) and role attribution.
- **FR-AUTH-4**: **Care Code Pairing System**: Every elderly profile generates a unique, uppercase 6-character alphanumeric Care Code. Caregivers enter this code to securely bind their account to the elder.

### 4.2 Cognitive Stimulation Games

#### Game 1: Family Memory Match (`family_memory_match`)
- **FR-GAME-1**: Dynamically pulls uploaded family photos from the elder's profile. If fewer than 2 members are configured, gracefully surfaces a prompt to add members or try demo data.
- **FR-GAME-2**: **Phases**:
  1. *Intro*: Explains objective via text and voice prompt.
  2. *Preview*: Displays target photo clearly for configured duration (2000ms–4000ms based on difficulty).
  3. *Question*: Presents multiple-choice name options.
  4. *Feedback*: Calm positive or gentle corrective feedback.
  5. *Done*: Summary panel showing accuracy, score, and celebratory message.
- **FR-GAME-3**: Spoken audio prompt announces the question in the elder's selected language.

#### Game 2: Sequence Memory (`sequence_memory`)
- **FR-GAME-4**: Visual and spatial memory game presenting high-contrast, numbered interactive color pads (1–4).
- **FR-GAME-5**: Sequences scale in length based on difficulty (Easy: 3 items, Medium: 5 items, Hard: 7 items).
- **FR-GAME-6**: Immediate touch-pad interaction feedback with audio-visual cues and mistake tolerance.

### 4.3 Deterministic Adaptive Difficulty & Trend Analysis
- **FR-PERF-1**: Rule-based difficulty progression across `easy`, `medium`, and `hard`.
  - **Promotion Rule**: Accuracy $\ge 85\%$, mistakes $\le 1$, average response time $\le 6000\text{ms}$ over recent 5 sessions $\rightarrow$ promote +1 level.
  - **Demotion Rule**: Accuracy $< 50\%$ or mistakes $\ge 4$ $\rightarrow$ ease -1 level.
  - **Stable Rule**: Maintain current difficulty level.
- **FR-PERF-2**: **Performance Trend Classification**:
  - Compares first half vs. second half of recent sessions (up to 10 sessions).
  - Classifies trend into `improving`, `stable`, or `declining`.
- **FR-PERF-3**: **Medical Disclaimers**: The system strictly displays a prominent disclaimer: *"Game metrics represent task performance and engagement trends only. They do not constitute a clinical or medical diagnosis."*

### 4.4 Multilingual Voice Guidance (Web Speech API)
- **FR-VOICE-1**: Centralized dictionary in `src/lib/i18n.ts` supporting English (`en-IN`), Hindi (`hi-IN`), Marathi (`mr-IN`), and Assamese (`as-IN`).
- **FR-VOICE-2**: Automatic fallback voice selection if target regional voice is missing from client OS/browser.
- **FR-VOICE-3**: Clean speech queue management (`speechSynthesis.cancel()`) to prevent audio overlap.

### 4.5 Daily Reminders & Medication Logs
- **FR-REM-1**: Caregivers create time-stamped reminders categorized as `medication`, `hydration`, `exercise`, `appointment`, or `custom`.
- **FR-REM-2**: Elders view today's pending reminders on their home dashboard with large "Acknowledge" checkboxes.
- **FR-REM-3**: Daily log records acknowledgment status (`acknowledged` vs. `missed`), enabling caregivers to audit daily routine compliance.

### 4.6 Offline-First Architecture & Sync Queue
- **FR-OFF-1**: When client loses connectivity (`navigator.onLine === false` or fetch failure), finished game sessions are saved to `localStorage` (`smriti_sync_queue_v1`).
- **FR-OFF-2**: Session IDs are client-generated UUIDs (`crypto.randomUUID()`).
- **FR-OFF-3**: When connectivity returns, background sync worker iterates queued items and pushes them to `recordGameResult`. Database enforces `PRIMARY KEY (session_id)` to guarantee idempotent re-syncing without score duplication.

---

## 5. Non-Functional Requirements (NFRs)

- **Accessibility (a11y)**: WCAG 2.1 Level AA compliance. Minimum touch target size of 48px $\times$ 48px, high color contrast ratios ($\ge 4.5:1$), and dyslexia-friendly font pairings.
- **Performance**: Initial page load time $\le 1.8\text{s}$ on 4G networks; game interaction latency $< 50\text{ms}$.
- **Security & Privacy**:
  - Row Level Security (RLS) enabled on all Supabase tables (`profiles`, `family_members`, `game_sessions`, `reminders`, `alerts`).
  - Strict boundary: Caregivers can only access profiles explicitly linked via `can_access(user_id)`.
  - Sensitive family photos served through secure Supabase Storage buckets.
- **Resilience**: Zero loss of completed game data across browser reloads or intermittent Wi-Fi / cellular disconnection.

---

## 6. Future Roadmap

- **Phase 2**: Push Notifications and Web Push for scheduled medication reminders.
- **Phase 3**: Voice command recognition (speech-to-text) allowing elders to answer by speaking names aloud.
- **Phase 4**: Wearable telemetry integration (pulse, step count, sleep tracking) correlated with cognitive routine engagement.
- **Phase 5**: Expansion to additional regional languages (Bengali, Tamil, Telugu, Kannada, Gujarati).

