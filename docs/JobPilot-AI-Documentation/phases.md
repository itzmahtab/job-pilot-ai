# JobPilot AI — Implementation Phases: Zero to Deployment

This plan prioritizes a locally workable application first. It includes more than 10 phases so the implementation can be executed incrementally without turning into one oversized task.

**Important workflow boundary:** During the initial build, work locally and verify locally. Prepare deployment configuration when the application is ready, but do not begin dedicated testing against the deployed environment until the final deployment-testing phase is explicitly approved.

## Phase 1 — Repository and development foundation

### Build
- Create the Next.js 16+ App Router application with TypeScript strict mode.
- Configure Tailwind CSS and shadcn/ui.
- Add ESLint, Prettier, and package scripts.
- Establish the repository structure described in `architecture.md`.
- Create `.env.example` with placeholder names only.
- Add a README with prerequisites and local setup.

### Acceptance criteria
- App starts locally.
- Shared layout and navigation render.
- No real secrets are committed.
- Formatting and type-check scripts exist.

## Phase 2 — Design system and application shell

### Build
- Define semantic CSS theme tokens.
- Implement light/dark theme support.
- Build responsive sidebar, top bar, mobile navigation, and page container.
- Add reusable loading skeleton, empty state, error state, status badge, and confirmation dialog.
- Add subtle transitions and reduced-motion support.
- Implement landing page and dashboard shell with clearly labeled sample data.

### Acceptance criteria
- Shell works on mobile and desktop.
- Navigation links work.
- Interactive controls are keyboard accessible.
- Sample data is clearly distinguished from live data.

## Phase 3 — Database and domain schema

### Build
- Configure PostgreSQL and Drizzle.
- Define schema for users/profile, resumes, jobs, analyses, saved searches, user-job state, notifications, and scrape runs.
- Add indexes, foreign keys, unique constraints, and migrations.
- Add deterministic seed fixtures that contain no real personal data.
- Create repositories and service boundaries.

### Acceptance criteria
- Migrations apply to a local/dev database.
- Seed process is repeatable.
- Duplicate source IDs and duplicate user-job records are constrained.
- Database access is not embedded directly in presentation components.

## Phase 4 — Authentication and authorization

### Build
- Select and configure an auth library compatible with the chosen Next.js 16 release.
- Implement sign-up/sign-in/sign-out and session handling.
- Protect dashboard routes.
- Add server-side ownership checks to profile, resume, saved jobs, and applications.
- Add safe redirect handling and session error states.

### Acceptance criteria
- Signed-out users cannot access private pages.
- A user cannot read or mutate another user's records by changing an ID.
- Authorization is enforced on the server, not only in the UI.

## Phase 5 — Profile and preference onboarding

### Build
- Add editable candidate profile fields.
- Add target roles, seniority, skills, experience, work mode, eligible countries, and preferred locations.
- Add exclude keywords and preferred employment types.
- Validate all form submissions with Zod.
- Persist preferences and provide an edit screen.

### Acceptance criteria
- Profile data persists after refresh.
- Empty or unknown fields are supported.
- Users can update and reset preferences.
- No inference silently changes user-confirmed data.

## Phase 6 — Resume upload, parsing, and review

### Build
- Add a private upload flow for PDF and DOCX.
- Enforce size and format limits.
- Configure private object storage for deployment; use safe local storage or a development adapter locally.
- Extract PDF and DOCX text.
- Detect empty/image-only PDFs and show a clear fallback.
- Create a draft profile from parsed text using deterministic extraction and optional AI.
- Build the editable review/confirmation screen.
- Add replace and delete actions.

### Acceptance criteria
- Supported files upload and parse locally.
- Invalid formats and oversized files are rejected.
- Extracted fields can be corrected before saving.
- Private file access is owner-checked.
- Resume text and signed URLs are not written to routine logs.
- Core profile editing works with no AI provider.

## Phase 7 — Job ingestion contract and fixtures

### Build
- Define the shared `Job` schema with Zod.
- Implement normalization and canonical URL helpers.
- Add fixture-based import for local development.
- Implement idempotent upsert and source provenance.
- Track posted, first-seen, and last-seen timestamps separately.
- Add source/run status models.

### Acceptance criteria
- Re-importing the same fixture does not create duplicate jobs.
- Malformed records are rejected with safe error details.
- Unknown fields remain unknown.
- A source failure does not expire all existing jobs.

## Phase 8 — First permitted job source adapters

### Build
- Review source access rules before coding each adapter.
- Start with two or three public APIs, feeds, or permitted career pages.
- Prefer API/RSS/static HTML parsing.
- Add Playwright only for permitted JavaScript-rendered public pages.
- Implement bounded page limits, timeouts, polite delays, and transient retries.
- Add per-source fixtures for parser regression.

### Acceptance criteria
- Each source adapter can run independently.
- One failing source does not block other sources.
- Source URL and original application URL are preserved.
- No login/CAPTCHA/access-control bypass is implemented.

## Phase 9 — Playwright worker and scheduled collection

### Build
- Create a separate Node.js scraper package.
- Add a local CLI command for a single source and a full run.
- Add run summary: discovered, inserted, updated, skipped, failed.
- Implement secure ingestion to the app through a server-only secret or signed request.
- Add a GitHub Actions scheduled workflow with manual dispatch.
- Keep schedule frequency within source limits and available CI quotas.

### Acceptance criteria
- Worker runs locally.
- Re-running the worker is idempotent.
- Ingestion rejects missing/invalid authentication.
- Secrets are stored in environment configuration, not workflow source.
- Run errors and partial successes are visible.

## Phase 10 — Job explorer, filters, and sorting

### Build
- Build the job list and job detail panel/page.
- Add keyword search and all core filters.
- Add sorting for best match, newest posting, newest discovery, and company.
- Add pagination or cursor-based loading.
- Add active filter chips and clear-all action.
- Add stale/unknown status indicators.
- Build mobile filter sheet and responsive job cards.

### Acceptance criteria
- Filters compose correctly.
- Invalid query parameters are safely handled.
- Sorting is deterministic for equal values.
- Unknown salary/location/eligibility values are not falsely presented as verified.
- Job detail always includes the original source link when available.

## Phase 11 — Deterministic matching engine

### Build
- Implement hard filters for explicit user exclusions.
- Implement configurable 0–100 component scores.
- Start with skill 35%, experience 25%, role 20%, location 15%, freshness 5%.
- Version the scoring model.
- Add a score breakdown and explanation component.
- Add unit tests for edge cases such as missing skills and unknown experience.

### Acceptance criteria
- Score stays between 0 and 100.
- Hard exclusions run before ranking.
- Missing data is handled explicitly.
- UI explains why a job was ranked.
- Score is never described as a hiring probability.

## Phase 12 — Optional AI provider and analysis cache

### Build
- Define a provider interface and a no-AI fallback.
- Add local Ollama configuration for development if available.
- Add optional hosted provider configuration through server-only environment variables.
- Validate model output with Zod.
- Extract job requirements, preferred skills, seniority, and uncertainty notes.
- Add content-hash caching and model/version metadata.
- Keep resume-to-profile extraction opt-in if external inference is involved.

### Acceptance criteria
- The app works with AI disabled.
- Provider failures do not break search.
- AI cannot overwrite user-confirmed profile fields without review.
- Unsupported claims are marked unknown or uncertain.
- Repeated identical content reuses cached analysis.

## Phase 13 — Saved jobs, saved searches, and application tracker

### Build
- Add save/dismiss controls.
- Add application states: Saved, Planned, Applied, Interview, Rejected, Offer.
- Add notes, application date, and optional follow-up date.
- Add saved searches with persisted filter settings.
- Add a new-match in-app notification model.
- Add list and board views with accessible alternatives.

### Acceptance criteria
- State persists per user.
- One user cannot see another user's tracker.
- Duplicate saves are handled safely.
- Destructive actions require appropriate confirmation.

## Phase 14 — Admin and operational visibility

### Build
- Add an admin-only source health page.
- Display last successful run, recent failure count, run duration, and safe summaries.
- Add source enable/disable controls if needed.
- Add stale listing review rules.
- Add usage indicators for AI calls and storage where practical.
- Add rate limits for expensive operations.

### Acceptance criteria
- Admin-only operations are protected server-side.
- No sensitive file content or secrets appear in logs.
- Partial failures are distinguishable from total failures.
- Source health does not expose private user data.

## Phase 15 — Local integration and quality pass

### Build
- Run type checking, linting, formatting checks, and local test suites.
- Test core flows with local data: sign-in, profile, resume, search, save, application status, scraper ingestion.
- Add accessible loading, empty, error, and retry states.
- Verify migrations and seed fixtures from a clean local setup.
- Document known limitations and required environment variables.
- Fix blockers before deployment preparation.

### Acceptance criteria
- A fresh developer can follow the README.
- Core flows work locally without a hosted AI provider.
- File validation and authorization paths are covered.
- Source adapters have representative fixtures.
- No known blocker prevents a user from using the local app.

**This phase is local verification, not deployed-environment testing.**

## Phase 16 — Deployment preparation

### Build
- Select the hosting target after confirming Next.js 16 compatibility.
- Configure production database and private storage.
- Document environment variables and secrets.
- Configure domain, auth callback URLs, and trusted origins.
- Configure scheduled workflow secrets and ingestion authentication.
- Run migrations using the documented release process.
- Add deployment and rollback instructions.
- Review free-tier limits and cost alerts/usage dashboards where available.

### Acceptance criteria
- Deployment steps are documented and reproducible.
- Secrets are configured outside source control.
- Storage remains private.
- The production database is separate from local fixtures.
- The app is ready for deployment.

Do not use this phase to claim the deployed app has been tested.

## Phase 17 — Initial deployment

### Build
- Deploy the application.
- Configure production environment variables.
- Apply migrations using the release process.
- Configure private storage and the scheduled ingestion worker.
- Confirm deployment completes and record the release identifier.

### Acceptance criteria
- Hosting platform reports a successful deployment.
- Required environment bindings and secrets are present.
- The deployed URL is recorded.
- No dedicated production acceptance test is claimed yet.

## Phase 18 — Deployed-environment testing (deferred until explicitly started)

This is the first phase dedicated to testing the deployed environment. Start it only after the user confirms that the build and initial deployment are ready.

### Test
- Authentication and session persistence.
- Resume upload, parsing, private access, replacement, and deletion.
- Authorization isolation between two test accounts.
- Search, filters, pagination, and original application links.
- Scheduled scraper authentication and ingestion.
- Source failure and retry behavior.
- AI provider unavailable / quota exhausted behavior.
- Mobile and desktop responsiveness.
- Accessibility and reduced-motion behavior.
- Rate limits, file-size limits, and error handling.
- Database/storage usage against free-tier limits.

### Acceptance criteria
- Issues are logged with severity and reproducible steps.
- Privacy and authorization blockers are fixed before public launch.
- Production secrets and test data are cleaned up.
- Only verified behavior is documented as passing.

## Phase 19 — Improve from real feedback

### Build
- Review relevance feedback and source quality.
- Tune ranking weights using observed outcomes.
- Add sources only after access-policy review.
- Improve stale-job detection.
- Consider email digests, additional formats, and broader role families.

### Acceptance criteria
- Changes are based on measured pain points.
- New sources have fixtures and failure monitoring.
- Free-tier usage remains understood and controlled.

## Recommended implementation order

**Phases 1–7 first:** foundation, database, auth, profile, resume, and normalized job data.  
**Phases 8–13 next:** sources, automation, search, matching, AI, and application tracking.  
**Phases 14–17 next:** operations, local integration, deployment preparation, and deployment.  
**Phase 18 only after explicit approval:** test the deployed environment.  
**Phase 19 after the product has useful real-world feedback.**
