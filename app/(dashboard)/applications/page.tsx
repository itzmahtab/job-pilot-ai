"use client";

import * as React from "react";
import {
  Briefcase,
  ExternalLink,
  Plus,
  Building2,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  stage: "saved" | "planned" | "applied" | "interview" | "offer" | "rejected";
  appliedDate?: string;
  notes?: string;
  link?: string;
}

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    company: "Veloce Technologies",
    role: "Junior Frontend Engineer",
    stage: "interview",
    appliedDate: "Oct 24, 2026",
    notes: "Technical interview scheduled with Lead Frontend Architect on Friday.",
    link: "https://example.com/jobs/veloce-frontend",
  },
  {
    id: "app-2",
    company: "CloudScale Systems",
    role: "Software Engineering Intern",
    stage: "applied",
    appliedDate: "Oct 26, 2026",
    notes: "Submitted through official career portal. Awaiting screening response.",
    link: "https://example.com/jobs/cloudscale-intern",
  },
  {
    id: "app-3",
    company: "FinFlow Data Labs",
    role: "Entry-Level Backend Developer",
    stage: "saved",
    notes: "High match on PostgreSQL and Node.js. Reviewing cover letter draft.",
    link: "https://example.com/jobs/finflow-backend",
  },
];

const STAGES = [
  { key: "saved", label: "Saved", color: "bg-slate-500/10 text-slate-700 dark:text-slate-300" },
  { key: "planned", label: "Planned", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  { key: "applied", label: "Applied", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  { key: "interview", label: "Interview", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
  { key: "offer", label: "Offer", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  { key: "rejected", label: "Rejected", color: "bg-rose-500/10 text-rose-700 dark:text-rose-300" },
] as const;

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<ApplicationItem[]>(INITIAL_APPLICATIONS);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Application Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Track your job applications across each hiring stage with custom notes
          </p>
        </div>

        <Badge
          variant="outline"
          className="self-start sm:self-auto bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
        >
          Phase 2 Board Prototype
        </Badge>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {STAGES.map((stage) => {
          const items = applications.filter((app) => app.stage === stage.key);
          return (
            <div
              key={stage.key}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)]/50 p-3 min-h-[340px] flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  {stage.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${stage.color}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xs hover:border-[var(--primary)]/50 transition-all text-xs space-y-2 group"
                  >
                    <div className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      {item.role}
                    </div>
                    <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
                      <Building2 className="w-3 h-3" />
                      <span>{item.company}</span>
                    </div>

                    {item.appliedDate && (
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                        <Calendar className="w-3 h-3" />
                        <span>Applied: {item.appliedDate}</span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-[var(--muted-foreground)] bg-[var(--secondary)] p-2 rounded border border-[var(--border)]">
                        {item.notes}
                      </p>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline pt-1"
                      >
                        <span>View listing</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-center p-2 rounded-lg border border-dashed border-[var(--border)] text-[11px] text-[var(--muted-foreground)]">
                    No jobs in {stage.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
