# Architectural Decision Records (ADRs) — Smriti Sathi (स्मृति साथी)

This document records every significant architectural and implementation decision made in the codebase, along with the rationale, trade-offs, and alternatives considered.

---

## Decision Log Guidelines for Contributors & AI Agents

Whenever altering the codebase, record each significant decision below using the following format:
```markdown
### ADR-XXX: [Short Descriptive Title]
- **Date**: YYYY-MM-DD
- **Status**: Accepted | Superseded | Deprecated
- **Context**: Problem statement or need driving the decision.
- **Decision**: The approach, architecture, or library chosen.
- **Rationale**: Why this approach was selected over alternatives.
- **Alternatives Considered**: Other options reviewed and why they were rejected.
- **Impact & Trade-offs**: Consequences on security, bundle size, performance, offline capability, or maintainability.
```

---

## Recorded Decisions

### ADR-001: TanStack Start + TanStack Router (Fullstack TypeScript)
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: The application requires server-side rendering for quick first-contentful paint on low-end elder devices, strict type-safety across client-server boundaries, and modern file-based routing.
- **Decision**: Built on TanStack Start with TanStack Router, React 19, and Vite.
- **Rationale**: TanStack Start provides typed server functions (`createServerFn`) that seamlessly bridge client queries with server logic without maintaining duplicate API schema definitions or a separate standalone backend service.
- **Alternatives Considered**:
  - *Next.js (App Router)*: Good ecosystem, but TanStack Start offers tighter integration with TanStack Query/Router, zero-config RPC server functions, and lightweight edge deployment.
  - *Vite SPA + Express Backend*: Requires managing two separate repos/deployments, manual REST routes, and disconnected TypeScript types.
- **Impact & Trade-offs**: Enables single-command local development (`npm run dev`), unified type-safety, but requires following TanStack Start server function conventions.

---

### ADR-002: Supabase with Context-Enforced Row Level Security (RLS)
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: The system manages sensitive elder data (daily game performance, photos, routine reminders) shared between elders and authorized caregivers.
- **Decision**: Use Supabase (PostgreSQL + Auth + Storage) with granular Postgres Row Level Security policies governed by a helper function `public.can_access(user_id)`.
- **Rationale**: RLS guarantees that data isolation and access permissions are enforced at the database layer itself, preventing data leaks even if an API query is misconfigured. Server functions execute with the user's Supabase JWT context.
- **Alternatives Considered**:
  - *Custom Node/Express Auth Middleware with raw PostgreSQL*: High development overhead and prone to authorization logic bugs.
  - *Firebase Firestore*: Good offline support, but lacks SQL relational capabilities and expressive RLS functions needed for caregiver-elder role relationships.
- **Impact & Trade-offs**: Strong data security and automatic JWT propagation; requires database migrations to define security policies (`supabase/migrations`).

---

### ADR-003: Idempotent Client-Side Session UUIDs & LocalStorage Sync Queue
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: North Eastern Region (NER) and rural elderly environments experience frequent intermittent or zero internet connectivity. Elders must be able to complete cognitive games offline without losing progress.
- **Decision**:
  - Every game round generates a UUID client-side (`crypto.randomUUID()`) at initiation.
  - Completed sessions are immediately committed to `localStorage` under `smriti_sync_queue_v1`.
  - An automatic sync listener (`src/hooks/use-sync.ts`) flushes queued records via `syncOfflineSessions` when network connectivity is restored (`navigator.onLine` / window `online` event).
- **Rationale**: Client-generated primary keys guarantee **idempotency**. Re-trying network submission after connectivity drops will never generate duplicate rows or distort performance trends.
- **Alternatives Considered**:
  - *Server-assigned IDs upon completion*: Fails when offline; games would block waiting for network confirmation.
  - *Service Worker Background Sync API*: Not uniformly supported on older Android WebViews or budget devices commonly used by elders.
- **Impact & Trade-offs**: Guaranteed offline play with zero data loss; `localStorage` is quota-capped (~5MB), but structured game metric payloads are miniscule (<1KB per session).

---

### ADR-004: Deterministic Rule-Based Performance Adaptation (No Black-Box ML)
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: The app adapts game difficulty (`easy`, `medium`, `hard`) and displays trend indicators (`improving`, `stable`, `declining`) to caregivers.
- **Decision**: Implement transparent, deterministic mathematical algorithms in `src/lib/performance.ts` (evaluating rolling averages of accuracy $\ge 80\%$, mistakes $\le 1$, and response time).
- **Rationale**:
  1. Complete explainability: every difficulty shift includes an explicit human-readable rationale (`"Accuracy was 85% over the last 3 sessions"`).
  2. Zero cloud ML dependency: can run 100% offline in browser runtime.
  3. Predictable behavior: avoids hallucinations or sudden unpredictable shifts that could confuse an elder.
- **Alternatives Considered**:
  - *External LLM/AI model for adaptive difficulty*: Expensive, requires network roundtrip, introduces latency, and risks inconsistent recommendations.
- **Impact & Trade-offs**: Safe, predictable, instant computation; requires careful tuning of statistical thresholds.

---

### ADR-005: Strict Zero-Clinical / Non-Diagnostic Boundary
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: Healthcare regulations and ethical responsibilities require that cognitive games for elders with dementia do not make medical or diagnostic claims.
- **Decision**: All UI copy, caregiver metrics, and documentation explicitly state that data represents **in-game cognitive engagement only**, accompanied by persistent disclaimers that Smriti Sathi is not a diagnostic tool or medical device.
- **Rationale**: Protects patient safety and complies with MedTech ethical standards.
- **Alternatives Considered**: Framing metrics as "dementia progression scores" (rejected as dangerous, irresponsible, and legally impermissible).
- **Impact & Trade-offs**: Visual indicators use neutral phrasing ("Game Activity Trend", "Accuracy", "Response Speed") rather than clinical labels.

---

### ADR-006: Native Web Speech API with Graceful Degradation
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: Elderly users benefit significantly from spoken voice instructions and prompts, especially those with poor eyesight or mild cognitive impairment.
- **Decision**: Implement `VoiceService` using native `window.speechSynthesis` with locale resolution across regional voices.
- **Rationale**: Zero external audio streaming latency, zero per-character cloud TTS cost, works offline once local language voices are downloaded on the OS.
- **Alternatives Considered**:
  - *Cloud TTS APIs (Google Cloud Text-to-Speech / AWS Polly)*: Adds recurring API costs, introduces audio playback latency, and fails completely when offline.
- **Impact & Trade-offs**: Voice quality depends on installed OS speech engines; graceful visual fallback is always present if TTS fails or is unavailable on the client device.

---

### ADR-007: 4-Language Cultural Localization (EN, HI, MR, AS)
- **Date**: 2026-09-08
- **Status**: Accepted
- **Context**: Focus on India, particularly the North Eastern Region (NER) and western states, requires native language support beyond English.
- **Decision**: Centralized static dictionary in `src/lib/i18n.ts` supporting English (`en-IN`), Hindi (`hi-IN`), Marathi (`mr-IN`), and Assamese (`as-IN`).
- **Rationale**: Static typed dictionary prevents runtime translation misses, enables offline translation lookups, and keeps memory footprint minimal.
- **Impact & Trade-offs**: All user-facing strings must use translation keys from `src/lib/i18n.ts`.

---

### ADR-008: Decision & Flow Tracking Protocol
- **Date**: 2026-09-10
- **Status**: Accepted
- **Context**: Maintain solid understanding of codebase architecture and ensure all changes are documented with explicit rationale.
- **Decision**:
  - All significant design decisions must be logged in `DECISIONS.md`.
  - Execution flows across entry points, game loops, auth, and state must be maintained in `FLOW.md`.
  - A self-quiz protocol must be conducted before accepting major changes.
- **Rationale**: Prevents architectural drift, ensures maintainability across long development cycles, and ensures pair-programming comprehension.

---

### ADR-009: In-Session Multi-Tier Progressive Grid for Sequence Memory
- **Date**: 2026-09-11
- **Status**: Accepted
- **Context**: Static game sessions (fixed 4-pad grid with fixed length) caused either immediate confusion for low-vision/tremor elders or lack of progressive challenge.
- **Decision**:
  - Implement progressive in-session tiers named **Easy**, **Medium**, and **Hard**.
  - **Easy**: 2 large tiles (1x2 grid), 2-step sequence.
  - **Medium**: 4 tiles (2x2 grid), 3-step sequence.
  - **Hard**: 6 tiles (2x3 grid), 4-step sequence.
  - Pass threshold: 100% match promotes elder to next tier with celebratory UI and voice praise.
  - Mistake handling: 1 gentle retry per tier (*"कोई बात नहीं, एक बार फिर देखते हैं"*). If retry fails, the session ends calmly, celebrating highest level achieved without penalization.
- **Rationale**: Reduces initial cognitive clutter (Hick's Law), prevents demoralizing game-over states for dementia patients, and gives caregivers granular progression telemetry.
- **Impact & Trade-offs**: Grid scales dynamically; all level transitions preserve responsive design tokens and WCAG AAA color contrast.

---

### ADR-010: Caregiver-Elder Family Photo Linking & Offline Sync
- **Date**: 2026-09-11
- **Status**: Accepted
- **Context**: When caregivers uploaded family photos for a linked elder/patient, the game (`/play/family`) failed to display them because `play.family.tsx` queried records using `profile.id` (which was the caregiver's own ID, returning 0 records). In addition, TanStack Query cached stale data across devices, the game gave misleading alerts when only 1 member was present, and photos were not persisted offline.
- **Decision**:
  1. **Dynamic Target User Resolution**: In `play.family.tsx`, resolve `targetUserId`: if `profile.role === "caregiver"`, target the first linked elder (`people[0]?.id`) with a "Caregiver Preview" badge; if `elderly`, target `profile.id`.
  2. **Server-Side Fallback in `listFamily`**: If a query is issued for a caregiver ID with linked elders, or for an elder with a linked caregiver, gracefully fall back to the linked party's family members so photos are never lost due to ID differences.
  3. **Auto-Polling & Window Focus**: Configured `refetchInterval: 4000` and `refetchOnWindowFocus: true` on the family query so caregiver uploads instantly reflect in any active game session without manual reloads.
  4. **Offline Persistence**: Implemented `saveCachedFamily` and `getCachedFamily` in `src/lib/offline.ts` storing base64 photos in `localStorage` (`smriti_family_cache_v1`).
  5. **Accurate Threshold Messaging**: Replaced the generic "no photos" message when 1 member exists with an explicit message prompting for 1 more member.
- **Rationale**: Guarantees seamless caregiver preview and elder play, prevents testing confusion, and aligns with offline-first design (ADR-003).
- **Impact & Trade-offs**: Minimal localStorage overhead (~50KB per photo); immediate real-time synchronization between caregiver dashboard and game without requiring heavy WebSockets.

---

### ADR-011: Spaced Retrieval Family Memory Match (Cueing & Persistent Visual Anchor)
- **Date**: 2026-09-11
- **Status**: Accepted
- **Context**: In Family Memory Match, the preview phase previously showed only an unlabelled photo with a generic caption *"Remember this face"*, without identifying who the person was. In the question phase, the photo was completely blanked out, forcing elders with dementia to make a blind guess without ever being taught the face-name association.
- **Decision**:
  1. **Auditory & Visual Prime (Preview Phase)**: In the preview phase (3.8s), prominently display the member's **Name & Relationship** under their portrait and audibly announce them via `VoiceService.speakText(`${name}, ${relationship}`)`.
  2. **Persistent Visual Anchor (Question & Feedback Phases)**: Keep the loved one's photo visible during the question phase and feedback phase, shifting the task from stressful recall under total visual occlusion to gentle face-to-name associative recognition.
  3. **Immediate Educational Feedback**: If a mistake is made, the UI highlights both the error and the correct name with affirmative text (*"This is [Name] ([Relationship])"*).
- **Rationale**: Follows clinical best practices in dementia memory therapy (spaced retrieval and errorless learning), eliminating object permanence anxiety and promoting dignified cognitive reinforcement.
- **Impact & Trade-offs**: Significant reduction in patient confusion; requires no extra network calls as data is already available in the question target.


