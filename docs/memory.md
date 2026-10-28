# JobPilot AI — Project Memory & Implementation Tracker

## 1. Project Overview & Architecture
- **Framework**: Next.js 16+ App Router with Turbopack, TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4, Semantic design tokens, accessible components (Radix/Lucide)
- **Database**: PostgreSQL (Neon-ready) with Drizzle ORM
- **Object Storage**: Private Cloudflare R2 (optional) / local private storage fallback
- **Ingestion**: Decoupled Node.js + Playwright worker with authenticated internal endpoint
- **AI Layer**: Provider interface (`NoAIProvider`, `OllamaProvider`, hosted models) with content-hash caching

---

## 2. Phase Execution Status

| Phase | Description | Status | Completed Date | Notes |
|---|---|---|---|---|
| **Phase 1** | Repository & Dev Foundation | **COMPLETED** | 2026-10-28 | Next.js 16 setup, TS strict, `.env.example`, Prettier, README |
| **Phase 2** | Design System & App Shell | **COMPLETED** | 2026-10-28 | Theme tokens, dark mode, `AppShell`, UI components, Landing, Dashboard, Explorer, Pipeline, Resume Center, Settings |
| **Phase 3** | Database & Domain Schema | **COMPLETED** | 2026-10-28 | Drizzle ORM, 9 PostgreSQL tables, indexes & constraints, migrations in `drizzle/`, `JobRepository`, `UserRepository`, `ApplicationRepository`, deterministic seed fixtures |
| **Phase 4** | Authentication & Authorization | **COMPLETED** | 2026-10-28 | Session handling with `jose` & HTTP-only cookies, Next.js 16 `proxy.ts`, server actions (`signInAction`, `signUpAction`, `signOutAction`, `demoSignInAction`), `/login`, `/signup`, `requireUser` guard |
| **Phase 5** | Profile & Preference Onboarding | **COMPLETED** | 2026-10-28 | Zod-validated profile schema, atomic upsert, 4-step onboarding, editable `/profile`, reset flow, protected routes, Neon migrations applied |
| **Phase 6** | Resume Upload, Parsing & Review | Pending | — | PDF/DOCX extraction, private storage, confirmation review |
| **Phase 7** | Job Ingestion Contract & Fixtures | Pending | — | Shared Zod `Job` schema, normalization, idempotent upsert |
| **Phase 8** | First Permitted Job Source Adapters | Pending | — | HackerNews, Wellfound, Remotive adapters |
| **Phase 9** | Playwright Worker & Scheduled Collection | Pending | — | Standalone worker CLI & GitHub Actions workflow |
| **Phase 10** | Job Explorer, Filters & Sorting | Pending | — | Real query filtering, pagination, search |
| **Phase 11** | Deterministic Matching Engine | Pending | — | 0–100 weighted scoring (skills 35%, exp 25%, role 20%, loc 15%, freshness 5%) |
| **Phase 12** | Optional AI Provider & Analysis Cache | Pending | — | Provider abstraction, gap analysis, hash caching |
| **Phase 13** | Saved Jobs & Application Tracker | Pending | — | Persistence for 6-stage pipeline and saved searches |
| **Phase 14** | Admin & Operational Visibility | Pending | — | Source health monitoring and error metrics |
| **Phase 15** | Local Integration & Quality Pass | Pending | — | Full end-to-end local validation pass |
| **Phase 16** | Deployment Preparation | Pending | — | Environment bindings, domain setup, rollback docs |
| **Phase 17** | Initial Deployment | Pending | — | Deployment to free-tier target |
| **Phase 18** | Deployed-Environment Testing | Deferred | — | Deferred until explicitly authorized |
| **Phase 19** | Feedback & Iteration | Deferred | — | Post-launch ranking tuning & improvements |

---

## 3. Key Decisions & Conventions
- **App Router First**: Prefer React Server Components (`RSC`) by default; use `"use client"` only when interactive state is required.
- **Privacy by Design**: Resume documents and extracted raw text are stored in private storage with random identifiers, never exposed publicly or in routine logs.
- **Deterministic First**: Core match scoring, filters, and application tracking must work completely without any paid or hosted AI provider.
- **Explainable Scores**: Every recommendation must expose its breakdown percentages, not just an opaque badge.
- **Human-Controlled Applications**: No auto-applying or mass submission. The original employer/source canonical link is always preserved.
- **Source Respect**: Scrapers never bypass login walls or CAPTCHAs; requests are bounded, polite, and idempotent.

---

## 4. Current Session Log
- **2026-10-28**:
  - Initialized Next.js 16 with Turbopack and TypeScript.
  - Read all 5 documentation blueprints in `docs/JobPilot-AI-Documentation/`.
  - Started development server on `http://localhost:3000`.
  - Finished Phase 1 (foundation, `.env.example`, Prettier, README).
  - Finished Phase 2 (Design system tokens, `AppShell`, reusable accessible UI components, Landing Page, Dashboard, Explorer, Applications Pipeline, Resume Center, Settings).
  - Finished Phase 3 (Database and domain schema: Drizzle ORM configured, 9 PostgreSQL tables generated with constraints/indexes in `drizzle/0000_new_robin_chapel.sql`, repositories created for `jobs`, `users`, and `applications`, and deterministic seed fixtures implemented).
  - Finished Phase 4 (Authentication & authorization: secure session tokens via `jose` and HTTP-only cookies, password hashing with `bcryptjs`, Next.js 16 `proxy.ts` convention protecting workspace routes with automated redirect, server actions for sign-in/sign-up/sign-out, and 1-click demo candidate authentication).
  - All TypeScript checks passing (`tsc --noEmit`), route redirects confirmed (HTTP 307 unauthenticated -> `/login`, HTTP 200 authenticated).
  - Next.js Turbopack dev server actively serving on `http://localhost:3000`.
  - Finished Phase 5 (Profile & Preference Onboarding): added Zod validation, form mappers, atomic profile upsert, save/reset server actions, reusable tag/skill pickers, editable `/profile`, focused 4-step `/onboarding`, profile-aware settings CTA and navigation, and protected `/profile` + `/onboarding` routes. Applied Drizzle migrations to Neon and seeded the demo candidate profile. Production build passes; login search params now render inside a Suspense boundary.
