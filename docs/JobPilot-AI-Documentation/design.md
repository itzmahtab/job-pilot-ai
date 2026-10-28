# JobPilot AI — Design System and UI Specification

## 1. Design direction

**Product personality:** calm, capable, focused, optimistic.  
**Visual metaphor:** a clear radar that helps users spot their next opportunity.  
**Design goal:** make job search feel organized and encouraging rather than noisy or exhausting.

Avoid the typical overloaded job-board interface. Give the user a clear hierarchy: search, filters, useful matches, evidence, and next action.

## 2. Visual principles

- Readability over decoration.
- Strong contrast and visible focus.
- Compact information density on desktop; comfortable cards on mobile.
- Match score is useful metadata, never a guarantee of hiring.
- Distinguish verified facts from AI inferences.
- Use motion sparingly and respect reduced-motion preferences.
- Keep the application action prominent, but always open the original employer/source listing.

## 3. Color tokens

Use CSS variables compatible with shadcn/ui. The exact palette can be tuned during implementation.

### Light theme
- Background: warm near-white
- Foreground: deep slate
- Card: white
- Primary: deep indigo / blue
- Accent: muted teal
- Success: accessible green
- Warning: amber
- Destructive: accessible red
- Border: soft neutral gray
- Muted text: readable slate gray

### Dark theme
- Background: deep blue-gray, not pure black
- Card: slightly lighter surface
- Foreground: soft white
- Primary: brighter indigo
- Border: subtle but visible
- Status colors must retain accessible contrast

Use semantic tokens (`background`, `foreground`, `primary`, `muted`, `border`, `destructive`) rather than scattering hex codes through components. Do not use green as a giant recommendation banner; use it for small meaningful status cues.

## 4. Typography and spacing

- Use a clean sans-serif family such as Geist or another free system-compatible font.
- Page title: clear, medium-large, not oversized.
- Job title: prominent enough to scan quickly.
- Metadata: smaller but still readable.
- Description: comfortable line height and constrained reading width.
- Use a consistent spacing scale based on 4px increments.
- Keep paragraphs short and use labels for structured data.
- Use tabular numerals for match percentages, dates, and salary ranges when helpful.

## 5. Application shell

### Desktop
- Collapsible left sidebar
- Top bar with global search, notifications, and profile menu
- Main content area with responsive max width
- Optional right-side job detail panel on the job explorer

### Mobile
- Compact header
- Bottom navigation or accessible menu
- Filters open in a drawer/sheet
- Job results use full-width cards
- Avoid wide tables; use stacked metadata
- Keep the application action reachable without excessive scrolling

### Navigation
- Overview
- Find jobs
- Saved
- Applications
- Resume
- Saved searches
- Settings

Admin/source health navigation appears only to authorized administrators.

## 6. Required screens

### A. Landing page
- Clear promise: find relevant jobs, not more noise.
- Explain how collection, filters, and matching work.
- Show a small illustrative job card with a clearly labeled example score.
- CTA: “Build my job profile” or “Explore the dashboard.”
- Include privacy explanation for resume uploads.
- Avoid fake customer quotes, fabricated job counts, and unsupported performance claims.

### B. Onboarding
A short stepper:
1. Target roles and seniority
2. Skills and experience
3. Location and remote eligibility
4. Optional resume upload
5. Review preferences

Allow skipping resume upload. Every AI-extracted field must be editable and confirmed.

### C. Dashboard
- Greeting and concise summary
- “New matches” list
- Match quality overview
- Recent saved/application activity
- Source freshness / collection status in a discreet area
- Empty state that tells the user how to improve the profile or broaden filters

### D. Job explorer
Desktop layout:
- Left filter column
- Center result list
- Optional detail panel
- Search bar and active-filter chips above results

Each job card shows:
- Job title and company
- Remote/hybrid/onsite label
- Employment type and seniority
- Location eligibility summary
- Posted date when known
- Match score with “Why this matches” affordance
- Save / dismiss controls
- Original application link

Avoid displaying unsupported salary or eligibility assumptions. Show “Not specified” or “Could not verify” when needed.

### E. Job detail
- Title, company, source, original link
- Clear work mode and eligible countries
- Required and preferred skills
- Experience and education requirements
- Score breakdown
- “Why it matches” and “Potential gaps”
- Source description, with unsafe HTML sanitized
- Last checked / first discovered dates
- Save, dismiss, and application status controls

### F. Resume center
States:
- Empty: explain PDF/DOCX support and privacy
- Uploading: progress and cancel where supported
- Parsing: clear status, no indefinite spinner
- Review: grouped profile fields with edit controls
- Success: parsed profile timestamp and replace/delete actions
- Error: human-readable reason and retry guidance

Never show raw resume text by default if a structured review is more useful. If a preview is offered, keep it private and user-initiated.

### G. Application tracker
- Board view: Saved, Planned, Applied, Interview, Rejected, Offer
- List view for accessibility and mobile
- Application date, next follow-up, notes, job link
- Confirm before destructive actions
- Provide a no-data state with a simple first step

### H. Settings and privacy
- Profile and preferences
- AI provider disclosure / opt-in
- Resume delete control
- Account deletion process
- Notification preferences
- Data handling summary

## 7. shadcn/ui component guidance

Use shadcn/ui components where appropriate:
- Button, Input, Textarea, Label
- Select, Checkbox, RadioGroup, Slider
- Card, Badge, Separator
- Dialog, AlertDialog, Sheet, Drawer
- DropdownMenu, Popover, Tooltip
- Tabs, Table, Skeleton
- Form patterns with accessible error messaging
- Toast/sonner for non-blocking feedback

Customize spacing and composition instead of using every component on every page. Keep component source in the repository so styling can be adjusted without relying on a paid component service.

## 8. Animation specification

### Technology
- CSS transitions for most hover, focus, and state changes.
- Motion for React for selected entrances, dialogs, and layout changes.
- Use only free/open-source animation tools.
- Do not make the core experience depend on animation.

### Allowed patterns
- Job cards fade/slide in gently when a page loads.
- Filter drawer slides in.
- Score breakdown reveals with a short opacity/height transition.
- Dialogs and menus animate subtly.
- Skeleton placeholders pulse gently.
- Saved state uses a brief icon transition.

### Limits
- Typical interaction transitions: roughly 120–220 ms.
- Avoid long page intro sequences.
- Avoid springy motion on dense lists.
- Animate only visible items where practical.
- Respect `prefers-reduced-motion`.
- Never animate the whole page on every filter change.
- No autoplay video or decorative particle effects.

## 9. Accessibility

- Target WCAG 2.2 AA practices where feasible.
- All actions keyboard-operable.
- Semantic headings and landmarks.
- Labels for all fields.
- Visible focus states.
- Sufficient text and control contrast.
- Announce upload/parse status to assistive technology.
- Do not communicate job status by color alone.
- Respect reduced motion.
- Keep focus managed in dialogs and sheets.
- Ensure score descriptions do not depend only on a color or circular gauge.

## 10. Responsive behavior

- Mobile first, with breakpoints appropriate to the component.
- Filter controls become a sheet/drawer on small screens.
- Job cards stack metadata cleanly.
- Long company names and titles wrap safely.
- Buttons maintain touch-friendly targets.
- Avoid horizontal scrolling except in deliberately scrollable tab strips.
- Tables become cards or lists on narrow screens.

## 11. Content voice

Use concise, supportive language. Avoid pressure or promises.
Good:
- “A strong skills match”
- “Remote eligibility needs confirmation”
- “Three required skills match your profile”
- “We couldn’t verify the posting date”

Avoid:
- “Guaranteed interview”
- “Perfect job”
- “AI says you will get hired”
- “Visa sponsored” unless the source clearly confirms it

## 12. UI quality checklist

- Every screen has loading, empty, success, and error states where relevant.
- Filters are shareable/bookmarkable when appropriate.
- Active filters are visible and removable.
- The sort control announces its current value.
- Match score has a text explanation.
- Resume status is understandable without animation.
- Mobile layouts are usable with keyboard and touch.
- Dark and light themes retain contrast.
- Reduced-motion preference is honored.
