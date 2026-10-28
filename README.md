# JobPilot AI 🧭

> **AI-assisted job discovery, filtering, and application tracking workspace.**
> Empowering students, recent graduates, and developers to navigate opportunities without noise.

JobPilot AI is a decision-support platform designed to collect permitted public job listings, normalize and deduplicate them, compare opportunities against your candidate profile and resume with transparent scoring, and track your applications.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 16+ App Router](https://nextjs.org) with TypeScript (Strict mode) & Turbopack
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Custom Accessible Design System
- **Icons**: [Lucide React](https://lucide.dev)
- **Database**: PostgreSQL ([Neon](https://neon.tech)) with [Drizzle ORM](https://orm.drizzle.team)
- **Validation**: [Zod](https://zod.dev)
- **Scraper / Ingestion**: Node.js & [Playwright](https://playwright.dev) in isolated background runner

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v11.x (`corepack enable && corepack prepare pnpm@latest --activate`)

### 1. Installation

```bash
pnpm install
```

### 2. Environment Configuration

Copy the example environment file and customize as needed:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Architecture

```text
job-pilot-ai/
├── app/                  # Next.js 16 App Router pages, layouts, and API routes
│   ├── (marketing)/      # Landing page & public routes
│   ├── (dashboard)/      # Protected workspace: jobs, resume, tracker, settings
│   ├── api/              # Route handlers (jobs, upload, internal ingest)
│   ├── globals.css       # Design tokens & theme definitions
│   └── layout.tsx        # Root HTML layout
├── components/           # Reusable UI components
│   ├── ui/               # Core design system components (buttons, badges, cards)
│   ├── layout/           # App navigation shell, sidebar, header
│   └── jobs/             # Job cards, score breakdown, filter drawer
├── lib/                  # Shared utilities, database, and validations
├── docs/                 # Product specifications, PRD, architecture & rules
├── .env.example          # Environment variables template
└── package.json
```

---

## 📜 Development Scripts

- `pnpm dev`: Start Turbopack development server on `localhost:3000`
- `pnpm build`: Create production bundle
- `pnpm start`: Run production server
- `pnpm typecheck`: Run TypeScript compiler validation
- `pnpm format`: Format all files with Prettier
- `pnpm format:check`: Verify formatting consistency
