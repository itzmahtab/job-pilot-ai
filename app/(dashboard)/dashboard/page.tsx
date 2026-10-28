import Link from "next/link";
import {
  Compass,
  FileText,
  Briefcase,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SAMPLE_JOBS } from "@/lib/fixtures/sample-jobs";
import { SampleJobCard } from "@/components/jobs/sample-job-card";

export default function DashboardPage() {
  const topMatches = SAMPLE_JOBS.slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Phase 1 & 2 Application Shell Active
            </h4>
            <p className="text-xs text-[var(--muted-foreground)]">
              All displayed job listings and profile scores are verified sample fixtures.
            </p>
          </div>
        </div>
        <Link href="/jobs">
          <Button variant="default" size="sm" className="whitespace-nowrap">
            Explore All 12 Matches
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-[var(--primary)]/30 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Total Matches
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--foreground)]">12</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+4 today</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Compass className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-[var(--primary)]/30 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                High Match (80%+)
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--foreground)]">5</span>
                <span className="text-xs text-[var(--muted-foreground)]">jobs</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-[var(--primary)]/30 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Tracked Applications
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--foreground)]">3</span>
                <span className="text-xs text-[var(--muted-foreground)]">in pipeline</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-[var(--primary)]/30 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Resume Status
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
                <span className="text-xs text-[var(--muted-foreground)]">v1.2</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--secondary)] text-[var(--foreground)]">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recommended Listings & Sidebar widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Top Ranked Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Top Matched Opportunities
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Ranked using your candidate profile and skill matches
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {topMatches.map((job) => (
              <SampleJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Right Col: System Health, Profile Strength, Freshness */}
        <div className="space-y-6">
          {/* Profile Match Radar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile Radar Status</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Candidate preferences matching criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Target Roles</span>
                <span className="font-semibold text-[var(--foreground)]">Frontend, Full-Stack</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Preferred Seniority</span>
                <span className="font-semibold text-[var(--foreground)]">Junior, Entry, Intern</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Location Eligibility</span>
                <span className="font-semibold text-[var(--foreground)]">Remote, US, EMEA</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[var(--muted-foreground)]">Confirmed Skills</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">8 skills verified</span>
              </div>

              <div className="pt-2">
                <Link href="/resume" className="w-full block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Review Extracted Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Source Collection Health (PRD Requirement) */}
          <Card className="bg-[var(--secondary)]/30 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--accent)]" />
                <span>Source Collection Freshness</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  HackerNews Hiring
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)]">35m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Wellfound Feed
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)]">1h 10m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Remotive Public API
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)]">2h ago</span>
              </div>

              <p className="text-[10px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                Next scheduled GitHub Actions sync in 3 hours. Ingestion is idempotent.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
