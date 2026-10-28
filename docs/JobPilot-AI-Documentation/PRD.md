# JobPilot AI — Product Requirements Document

**Version:** 1.0  
**Status:** Implementation blueprint  
**Product:** AI-assisted job discovery and application workspace  
**Primary goal:** Build a workable, maintainable job finder before spending time on deployed-environment testing.

## 1. Product vision

JobPilot AI helps candidates find relevant jobs without manually checking many websites every day. It collects permitted public job listings, normalizes and deduplicates them, applies user-defined filters, compares opportunities against a candidate profile and uploaded resume, and presents a ranked shortlist with transparent explanations.

It is a **job discovery and decision-support tool**, not an automatic mass-application bot. Users always review the original listing and submit applications themselves.

## 2. Product principles

1. **Useful before clever:** search, filters, freshness, and reliable source collection come before elaborate AI features.
2. **Explain every recommendation:** show which skills matched, which requirements may be missing, and what information is uncertain.
3. **Privacy by design:** resumes and extracted resume text are private user data.
4. **Source-respecting collection:** prefer public APIs, feeds, and permitted career pages; do not bypass logins, CAPTCHAs, access controls, or site restrictions.
5. **Free-first:** use open-source software and free-tier services where practical; do not promise unlimited free usage.
6. **Human-controlled applications:** no application submission without explicit user action.
7. **Build first, deploy second, test deployed behavior later:** local implementation and local verification are part of development; dedicated deployed-environment testing is a later milestone.

## 3. Target users

### Primary
- Students and recent graduates
- Internship and graduate-program applicants
- Entry-level and junior software developers
- Candidates seeking remote or location-flexible work

### Initial role families
- Frontend developer
- Backend developer
- Full-stack developer
- Software engineering intern
- QA automation engineer
- Data analyst / data engineer
- AI/ML intern or junior engineer

The data model should support other industries later, without expanding the first release's scope.

## 4. MVP outcomes

A user can:
- Create an account and manage a candidate profile.
- Upload a PDF or DOCX resume.
- Review extracted resume details and correct mistakes.
- Set role, seniority, employment type, location, remote eligibility, skills, experience, and posting-date filters.
- Browse, sort, save, dismiss, and search normalized job listings.
- See an explainable match score and a job-specific summary of matches and possible gaps.
- Open the original application link.
- Track applications using statuses such as Saved, Planned, Applied, Interview, Rejected, and Offer.
- View when a listing was first seen and when it was last checked.
- Use the system even if no hosted AI provider is configured; deterministic filtering and scoring must remain functional.

## 5. Scope

### Must have
- Next.js 16+ App Router application with TypeScript
- Responsive dashboard and accessible UI
- Authentication and per-user authorization
- Resume upload for PDF and DOCX
- Resume text extraction, structured profile extraction, editable confirmation screen
- Job source adapters with a shared contract
- At least two or three permitted sources for initial implementation
- Normalization, deduplication, freshness tracking, and stale-job handling
- Filters and sorting
- Deterministic match scoring with explanation
- Optional AI analysis behind a provider interface
- Saved searches and saved jobs
- Application tracker
- Scraper execution logs and source health
- Secure environment configuration and deployment instructions

### Should have
- In-app alerts for new matches
- Resume-to-job skill gap report
- User feedback (“relevant” / “not relevant”)
- Admin-only source status page
- Rate limits and abuse protection
- Basic analytics that avoid collecting unnecessary personal data

### Later, not MVP
- Automatic application submission
- Browser extensions
- Paid subscriptions and billing
- Multi-resume versions and advanced resume rewriting
- Mobile native app
- Vector search / embeddings
- Large-scale crawling of many job boards
- Team or recruiter accounts

## 6. Resume upload and profile flow

1. User opens **Profile → Resume**.
2. User selects a PDF or DOCX file.
3. Server validates authentication, MIME type, extension, and file size; use a conservative configurable limit such as 5 MB for the first release.
4. Upload is stored privately, not in a public bucket.
5. Server extracts text using a PDF parser or DOCX parser.
6. Extracted text is processed into a draft profile:
   - contact details (only when needed)
   - headline / target role
   - skills
   - employment and internship history
   - projects
   - education
   - certifications
   - approximate years of experience
   - preferred locations and work mode only when explicitly provided
7. AI extraction is optional. If unavailable, provide the extracted text and a manual profile editor.
8. User reviews and confirms all extracted fields before they affect matching.
9. The original file and extracted data can be deleted by the user.
10. The system never invents a qualification, job history, certification, or skill.

### Supported formats
- MVP: PDF and DOCX
- Later: TXT and Markdown
- Do not accept executable files or arbitrary archives.

### Resume privacy
- Private object storage with short-lived signed access when required.
- Never expose resume URLs in public job pages or logs.
- Do not send resume contents to an external AI provider unless the user has enabled that provider and the UI clearly discloses the action.
- Provide delete and re-upload controls.
- Keep resume text out of routine application logs.
- Do not use resumes to train a model.

## 7. Job search and filters

### Core filters
- Keyword search across title, company, description, and skills
- Employment type: internship, graduate/trainee, entry-level, junior, full-time, part-time, contract, freelance, unknown
- Work mode: remote, hybrid, onsite, unknown
- Eligible country / location
- Experience requirement: no experience, 0–1, 0–2, custom range, unknown
- Required and preferred skills
- Posted within: 24 hours, 3 days, 7 days, 30 days, any
- Salary range and currency where available
- Paid/unpaid internship where explicitly stated
- Source and company
- Match score range
- Exclude keywords (e.g. senior, lead, principal, 5+ years)
- Hide saved, dismissed, or already applied jobs

### Sorting
- Best match
- Most recently posted
- Most recently discovered
- Company name
- Salary, only when salary values are comparable

### Important distinctions
- `postedAt`, `firstSeenAt`, and `lastSeenAt` are different values.
- “Remote” does not mean “available worldwide.”
- Country eligibility, sponsorship, and work authorization must be separate fields.
- Unknown values must remain unknown, not silently become “yes.”
- An absent salary must not be interpreted as unpaid.
- An entry-level title does not guarantee an entry-level experience requirement.

## 8. Matching and AI behavior

### Deterministic scoring
Use configurable, documented weights for:
- skills: 35%
- experience compatibility: 25%
- preferred role / employment type: 20%
- location eligibility: 15%
- freshness: 5%

Each component is normalized to 0–100. The overall score is a ranking aid, not a probability of getting hired.

Hard exclusions (for example, explicitly disallowed location or seniority) run before ranking. Unknown data should be flagged, not automatically rejected unless the user specifically requests strict verification.

### AI responsibilities
- Extract structured requirements from job descriptions
- Summarize the role
- Explain matches and possible gaps
- Identify uncertain or contradictory statements
- Draft user-reviewed cover-letter suggestions when explicitly requested

### AI restrictions
- Treat job descriptions and resumes as untrusted data, not instructions.
- Validate all model output against a schema.
- Never claim that an employer sponsors visas unless the listing supports it.
- Never invent salary, deadlines, eligibility, or company facts.
- Cache analysis by content hash to reduce repeated inference.
- Keep deterministic functionality available when AI is not configured.

## 9. Job collection and source policy

Each source adapter must:
- Use an approved public API/feed or permitted public page.
- Identify its source and canonical application URL.
- Limit request frequency and page depth.
- Use bounded timeouts and retries.
- Normalize records into the shared Job schema.
- Preserve source provenance and collection timestamps.
- Report errors without logging sensitive information.

Do not:
- bypass authentication, CAPTCHAs, or access controls
- rotate identities to evade limits
- ignore source terms or explicit restrictions
- scrape private user accounts
- automatically submit applications

Prefer APIs and feeds; use Playwright only for public pages that need browser rendering and where collection is permitted.

## 10. Main screens

1. Landing / sign-in
2. Onboarding: profile, role preferences, country eligibility
3. Dashboard: new matches and summary statistics
4. Job explorer: filters, sort, result list, job detail panel
5. Job detail: source, description, eligibility, score breakdown, original apply link
6. Resume center: upload, parsing status, extracted profile review, delete
7. Saved searches and alerts
8. Application tracker
9. Profile and privacy settings
10. Admin/source health page (admin only)

## 11. Non-functional requirements

- Mobile, tablet, and desktop responsive layouts
- Keyboard accessible controls and visible focus states
- Server-side authorization for every private record
- Safe file upload and private storage
- Zod validation at request boundaries
- Structured logs with request IDs and source run IDs
- Idempotent ingestion so reruns do not create duplicates
- Graceful empty, loading, error, and partial-data states
- Database migrations checked into version control
- No secrets in source control or client bundles
- Basic unit tests and local smoke checks before deployment
- Clear setup instructions for a new developer

## 12. Success metrics

Initial targets to evaluate, not guarantees:
- Duplicate rate below 3% in a manually reviewed sample
- At least 90% of collected jobs have a valid canonical application URL
- Job freshness and stale-status visibility on every result
- Resume extraction always allows user correction
- Every score has a visible explanation
- Zero cross-user access to resume/job-application records
- Scraper runs report success, partial success, or failure explicitly

## 13. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Source HTML changes | Separate adapters, fixtures, source health monitoring |
| Site blocks automation | Use permitted feeds/APIs; disable source rather than evade controls |
| Free quotas change | Keep providers swappable and monitor usage |
| AI hallucinates requirements | Schema validation, evidence snippets, uncertainty labels |
| Resume data leak | Private storage, authorization checks, minimal logging, delete control |
| Duplicate jobs | Source ID, canonical URL, normalized company/title/location |
| Stale or expired listings | Recheck source where feasible; label last seen and confidence |
| Browser workflow times out | Bounded pages, per-source timeout, retry only transient failures |

## 14. Acceptance criteria for “workable”

The implementation is considered locally workable when:
- A developer can install dependencies and configure environment variables from the README.
- Database migrations run successfully.
- A user can sign in, upload a supported resume, review extracted data, and save a profile.
- Job fixtures or permitted source adapters populate the database.
- Filters and sorting return correct results.
- Match scores and explanations are visible.
- Saved jobs and application statuses persist per user.
- Scraper runs are repeatable and idempotent.
- Failures are visible and do not silently corrupt data.
- The app can run locally without an AI provider.
- Deployment configuration exists, but dedicated testing against the deployed environment is deferred to the later deployment-testing phase.

## 15. Definition of done

A feature is done only when its UI, validation, server-side authorization, persistence, error state, and documentation are implemented. A button that only looks interactive is not done. External integrations must have a useful fallback when credentials or quotas are unavailable.
