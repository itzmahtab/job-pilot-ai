# JobPilot AI — Architecture

**Target:** Next.js 16+ App Router, TypeScript, free-first infrastructure  
**Architecture style:** Modular monolith for the web app + separately executed Playwright ingestion worker

## 1. Architecture decisions

### Recommended stack

| Layer | Choice | Reason |
|---|---|---|
| Web application | Next.js 16+ App Router + TypeScript | Full-stack React application |
| UI | Tailwind CSS + shadcn/ui | Accessible, composable, free/open-source components |
| Animation | CSS transitions + Motion for React where useful | Smooth interactions without making the UI heavy |
| Forms | React Hook Form + Zod | Typed validation |
| Data fetching | Server Components by default; TanStack Query for interactive client data where needed | Avoid unnecessary client JavaScript |
| Database | Neon PostgreSQL free plan, with Drizzle ORM | Relational data and typed schema |
| Authentication | Auth.js or Better Auth, selected during implementation after checking current Next.js 16 compatibility | Session-based authentication |
| Resume storage | Cloudflare R2 private bucket, optional in local development | Object storage with no public access by default |
| Browser automation | Playwright + Node.js | JavaScript-rendered public career pages |
| Static HTML parsing | Cheerio | Lower-cost extraction for static pages |
| Scheduled scraper | GitHub Actions schedule for MVP | Avoid running Playwright inside a Next.js request |
| AI | Provider interface; Ollama locally; optional hosted provider | Keep core features usable without paid inference |
| Testing | Vitest + Testing Library; Playwright for app end-to-end tests | Local verification and regression coverage |
| Lint / format | ESLint + Prettier | Consistency |
| Deployment | Next.js-compatible free host; choose and validate one adapter before release | Avoid runtime mismatch |

**Cloudflare is optional, not mandatory for every layer.** Use R2 if private resume storage is useful. Do not force Playwright into Cloudflare Workers. If Cloudflare is selected for Next.js hosting, confirm the current Next.js 16 support path and adapter capabilities before committing to it. A straightforward first deployment may use a compatible Next.js host and keep Cloudflare R2 for storage.

Free tiers and provider features can change. The project must document quotas and allow integrations to be replaced.

## 2. System overview

```text
Browser
  |
  v
Next.js 16+ App Router
  |-- Server Components / Server Actions / Route Handlers
  |-- Auth + authorization
  |-- Job search and profile UI
  |-- Resume upload and review
  |-- Application tracker
  |
  +--> PostgreSQL (Neon) via Drizzle
  |
  +--> Private object storage (Cloudflare R2, optional)
  |
  +--> AI provider interface (optional; local Ollama or hosted)

Scheduled GitHub Actions runner
  |
  v
Node.js + Playwright scraper
  |-- Public API / RSS / permitted career pages
  |-- Source adapters
  |-- Normalization / deduplication
  |
  +--> Authenticated ingestion endpoint or controlled database writer
```

The ingestion worker is separate from web requests because browser startup and crawling can exceed request-duration limits. Never allow an unauthenticated public endpoint to write arbitrary job data.

## 3. Repository structure

```text
jobpilot-ai/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── resume/
│   │   │   ├── saved-searches/
│   │   │   ├── applications/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── jobs/
│   │   │   ├── resume/
│   │   │   ├── applications/
│   │   │   └── internal/ingest/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui generated components
│   │   ├── layout/
│   │   ├── jobs/
│   │   ├── resume/
│   │   ├── applications/
│   │   └── motion/
│   ├── features/
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── resumes/
│   │   ├── matching/
│   │   ├── applications/
│   │   └── notifications/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── storage/
│   │   ├── ai/
│   │   ├── validation/
│   │   ├── rate-limit/
│   │   └── utils/
│   └── server/
│       ├── services/
│       └── repositories/
├── scraper/
│   ├── src/
│   │   ├── sources/
│   │   ├── extractors/
│   │   ├── normalizers/
│   │   ├── dedupe/
│   │   ├── ingestion-client/
│   │   └── index.ts
│   ├── fixtures/
│   └── package.json
├── drizzle/
├── .github/workflows/scrape.yml
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── rules.md
│   ├── design.md
│   └── phases.md
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── README.md
```

Keep one deployable Next.js application until there is a proven need to split services. The scraper is separate because it has a different runtime profile.

## 4. Core domain modules

### Jobs
- Source adapters produce normalized job records.
- `JobService` handles search, filters, sorting, and status.
- `JobRepository` owns database queries.
- Canonical URLs and source IDs support deduplication.

### Resume
- Upload service validates files and writes to private storage.
- Parser extracts text from PDF/DOCX.
- Profile extractor creates a draft only.
- User review is required before extracted data affects matching.
- Deletion removes the stored file and associated extracted text.

### Matching
- Hard filters run first.
- Deterministic score is computed from profile/job data.
- AI analysis is optional and cached.
- The UI shows score components and uncertainty.

### Applications
- Per-user job status and notes.
- Unique constraint on user + job.
- Status history may be added if needed; MVP can use current status and timestamps.

### Ingestion
- Scraper executes a bounded source run.
- It submits normalized records through an authenticated internal endpoint.
- The endpoint validates the schema and upserts records.
- Run summary records counts, duration, source errors, and last success.

## 5. Database model

Use PostgreSQL with Drizzle. Suggested tables:

- `users` — auth-owned user identifiers and account metadata
- `profiles` — target roles, skills, experience, countries, work preferences
- `resumes` — storage key, original filename, MIME type, size, parse state, extracted text reference or protected text, created/deleted timestamps
- `jobs` — normalized job content, company, location, remote mode, eligible countries, salary, source, canonical URL, dates, status
- `job_analyses` — content hash, provider/model, structured analysis JSON, score version, created timestamp
- `saved_searches` — filter JSON, alert preference, owner
- `user_jobs` — owner, job, saved/dismissed/application status, notes, timestamps
- `scrape_runs` — source, start/end time, status, counts, safe error summary
- `notifications` — owner, type, payload, read timestamp

Use foreign keys, unique constraints, and indexes. JSONB is appropriate for flexible filter configurations and validated analysis payloads; use normal columns for fields commonly filtered or sorted.

### Important indexes and constraints
- Unique `(source, source_job_id)` where source ID exists.
- Unique canonical URL where canonicalization is reliable.
- Index `(posted_at)`, `(employment_type, work_mode)`, and company.
- Unique `(user_id, job_id)` in `user_jobs`.
- Index `(user_id, status)` for application tracking.
- Index `(user_id, created_at)` for saved searches and notifications.

## 6. Resume file architecture

1. Authenticate user.
2. Validate extension, declared MIME type, actual file signature where practical, and size.
3. Upload to a private R2 bucket or local private storage in development.
4. Save metadata with a random storage key; do not use the original filename as the storage path.
5. Extract text in a server-controlled processing step.
6. Parse PDF using a maintained PDF text extraction library and DOCX using Mammoth or equivalent.
7. Handle scanned/image-only PDFs with a clear “no extractable text found” message. OCR is not required for MVP.
8. Convert extracted content to a structured draft via deterministic extraction and optional AI.
9. Validate output with Zod and show an edit/review screen.
10. Delete the file and extracted content on user request.

Do not make a private resume bucket public. Use short-lived signed URLs only when a download is required. Do not log file contents or expose storage credentials to the browser.

## 7. AI provider design

Define a provider interface:

```ts
export interface JobAIProvider {
  analyzeJob(input: JobAnalysisInput): Promise<JobAnalysis>;
  extractResume(input: ResumeTextInput): Promise<ResumeDraft>;
}
```

Implement:
- `NoAIProvider`: safe fallback; app remains usable
- `OllamaProvider`: developer/local mode
- `HostedAIProvider`: optional, configured through server-only environment variables

Validate outputs with Zod. Treat resume/job text as untrusted input. Do not place secrets in client components. Cache by content hash and provider/model version. Record analysis status and errors without persisting unnecessary prompt content.

## 8. Playwright worker architecture

Every source implements the same contract:
- `discover()` returns bounded candidate listing URLs or records.
- `extract()` obtains fields from the permitted public page.
- `normalize()` maps fields into the shared schema.
- `validate()` rejects malformed data.
- `upsert()` submits records idempotently.

Run sources with:
- per-source timeout
- maximum page count
- bounded concurrency
- polite request intervals
- retry only for transient errors
- clear stop conditions
- no CAPTCHA bypass or authentication evasion

Prefer official APIs, RSS, and static HTML extraction before Playwright. Store only job information needed for the product and preserve original source/application links.

## 9. API boundaries

Representative endpoints or server actions:
- `GET /api/jobs` — authenticated search and filters
- `GET /api/jobs/[id]` — job detail and current user's status
- `POST /api/resume/upload` — authenticated upload initiation/processing
- `GET /api/resume` — current user's resume metadata
- `DELETE /api/resume/[id]` — owner-only deletion
- `POST /api/profile` — validated profile update
- `POST /api/user-jobs` — save/dismiss/update status
- `GET /api/saved-searches`
- `POST /api/saved-searches`
- `POST /api/internal/ingest` — internal authenticated ingestion only
- `POST /api/internal/scrape-runs` — ingestion-run summary

Server Actions can replace some REST endpoints for UI mutations. Regardless of transport, enforce validation and authorization on the server.

## 10. Animation and interaction stack

- Use shadcn/ui as the accessible component base.
- Use CSS transitions for hover, focus, disclosure, and small state changes.
- Use Motion for React selectively for page transitions, list entry, modal transitions, and reduced-motion-aware animation.
- Avoid animating every card and avoid large motion on data-heavy pages.
- Respect `prefers-reduced-motion`.
- Do not make essential content dependent on animation.

## 11. Deployment topology

### Recommended simple topology
- Next.js app on a compatible free-tier Next.js host.
- Neon PostgreSQL for relational data.
- GitHub Actions for scheduled scraper runs.
- Optional Cloudflare R2 private bucket for resume files.
- Optional Ollama for local AI, or a replaceable hosted model provider.

### Cloudflare-hosted alternative
Cloudflare can host assets and private object storage; Workers may host compatible Next.js deployments through the currently supported adapter. Before choosing this route, verify the current Next.js 16 adapter support, Node.js API compatibility, execution limits, and any required OpenNext setup. Do not assume every Node package or Playwright browser can run in Workers.

## 12. Observability and failure handling

- Use structured logs with `runId`, `source`, and safe error code.
- Track source last-success time and failure streak.
- Mark partial source failures as partial success.
- Do not fail the entire run because one source fails.
- Keep ingestion idempotent.
- Never log passwords, session cookies, API tokens, resume text, or signed URLs.
- Show source health and last successful collection in an admin-only view.
