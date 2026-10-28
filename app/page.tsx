import Link from "next/link";
import {
  Radar,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  FileText,
  Lock,
  Layers,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SampleJobCard } from "@/components/jobs/sample-job-card";
import { SAMPLE_JOBS } from "@/lib/fixtures/sample-jobs";

export default function LandingPage() {
  const sampleJob = SAMPLE_JOBS[0];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col selection:bg-[var(--primary)]/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-xs">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-[var(--foreground)]">
                JobPilot
              </span>
              <span className="text-[var(--accent)] font-semibold text-xs tracking-wider uppercase ml-1">
                AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="gap-1.5 shadow-sm">
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 text-xs font-semibold text-[var(--primary)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Job Discovery & Opportunity Radar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.15]">
            Find relevant developer jobs, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
              without drowning in noise.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            JobPilot AI scans permitted public job sources, deduplicates listings, evaluates opportunities against your resume, and gives you transparent, explainable recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                Explore Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Browse Sample Jobs
              </Button>
            </Link>
          </div>

          <p className="text-xs text-[var(--muted-foreground)] flex items-center justify-center gap-2 pt-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Privacy-first design • Resumes remain strictly private • Human-in-the-loop applications</span>
          </p>
        </div>
      </section>

      {/* Illustrative Job Card Showcase (PRD Requirement: Show example score) */}
      <section className="py-12 px-4 sm:px-6 bg-[var(--card)]/40 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Explainable Match Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Every recommendation comes with a transparent score breakdown. No black-box promises.
            </p>
          </div>

          {/* Interactive Sample Card */}
          <SampleJobCard job={sampleJob} />
        </div>
      </section>

      {/* How it Works Pillars */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            How JobPilot AI Works
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] max-w-lg mx-auto">
            A trustworthy, deterministic pipeline engineered specifically for early-career developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] w-fit">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">
              1. Source-Respecting Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              We collect listings from permitted public feeds, APIs, and community boards without bypassing logins or anti-bot protections.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] w-fit">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">
              2. Deterministic Matching
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Transparent, weighted scoring (skills 35%, experience 25%, role 20%, location 15%, freshness 5%) filters out noise before you apply.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">
              3. Human-Controlled Tracking
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              No automatic spam applications. You always review original employer listings and manage your own pipeline across 6 organized stages.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--border)] py-8 px-4 sm:px-6 bg-[var(--card)]/60 text-xs text-[var(--muted-foreground)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-semibold text-[var(--foreground)]">JobPilot AI</span>
            <span>— Open Decision-Support Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-[var(--foreground)] transition-colors">
              Workspace
            </Link>
            <Link href="/jobs" className="hover:text-[var(--foreground)] transition-colors">
              Find Jobs
            </Link>
            <Link href="/resume" className="hover:text-[var(--foreground)] transition-colors">
              Resume Center
            </Link>
            <Link href="/settings" className="hover:text-[var(--foreground)] transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
