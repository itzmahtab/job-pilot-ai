"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SampleJob {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: "remote" | "hybrid" | "onsite";
  employmentType: "full-time" | "internship" | "junior" | "contract";
  experienceRequired: string;
  salary?: string;
  postedAt: string;
  firstSeenAt: string;
  matchScore: number;
  scoreBreakdown: {
    skills: number;
    experience: number;
    role: number;
    location: number;
    freshness: number;
  };
  matchingSkills: string[];
  missingOrUnverifiedSkills: string[];
  canonicalUrl: string;
  source: string;
  descriptionSnippet: string;
}

interface SampleJobCardProps {
  job: SampleJob;
  onSaveToggle?: (jobId: string) => void;
  isSaved?: boolean;
}

export function SampleJobCard({
  job,
  onSaveToggle,
  isSaved = false,
}: SampleJobCardProps) {
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [saved, setSaved] = React.useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    if (onSaveToggle) onSaveToggle(job.id);
  };

  // Color coding for score pill
  const scoreVariant =
    job.matchScore >= 85
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : job.matchScore >= 70
        ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";

  return (
    <Card className="hover:border-[var(--primary)]/40 hover:shadow-md transition-all relative overflow-hidden group">
      {/* Sample Data watermark tag */}
      <div className="absolute top-0 right-0 bg-amber-500/15 border-b border-l border-amber-500/25 px-2.5 py-0.5 rounded-bl-md text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
        Sample Data
      </div>

      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Main Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-base sm:text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {job.title}
              </span>
              <Badge variant="secondary" className="capitalize text-[11px]">
                {job.employmentType}
              </Badge>
              <Badge
                variant={job.workMode === "remote" ? "success" : "outline"}
                className="capitalize text-[11px]"
              >
                {job.workMode}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1 font-medium text-[var(--foreground)]">
                <Building2 className="w-3.5 h-3.5" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Exp: {job.experienceRequired}
              </span>
              {job.salary && (
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          {/* Match Score & Save */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs tracking-tight",
                  scoreVariant
                )}
                title="Deterministic match score calculated against profile preferences and skills"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{job.matchScore}% Match</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                aria-label={saved ? "Unsave job" : "Save job"}
                title={saved ? "Unsave job" : "Save job"}
                className={cn(
                  "h-8 w-8",
                  saved
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)]"
                )}
              >
                {saved ? (
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
            </div>

            <span className="text-[10px] text-[var(--muted-foreground)]">
              Posted: {job.postedAt}
            </span>
          </div>
        </div>

        {/* Snippet */}
        <p className="mt-3 text-xs sm:text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
          {job.descriptionSnippet}
        </p>

        {/* Skills Tag row */}
        <div className="mt-4 flex flex-wrap gap-1.5 items-center">
          {job.matchingSkills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] font-medium"
            >
              ✓ {skill}
            </span>
          ))}
          {job.missingOrUnverifiedSkills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium"
            >
              ? {skill}
            </span>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline focus-visible:outline-none"
          >
            <span>
              {showExplanation ? "Hide explanation" : "Why this matches"}
            </span>
            {showExplanation ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--muted-foreground)] hidden sm:inline">
              Source: {job.source}
            </span>
            <a
              href={job.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
            >
              <span>Apply on {job.source}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Transparent Score Breakdown (Principle 2: Explain every recommendation) */}
        {showExplanation && (
          <div className="mt-4 p-4 rounded-lg bg-[var(--secondary)]/70 border border-[var(--border)] space-y-3 animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 font-semibold text-[var(--foreground)]">
              <span>Score Breakdown (Deterministic Weights)</span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-normal">
                Ranking aid only, not hiring guarantee
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="block text-[10px] text-[var(--muted-foreground)]">
                  Skills (35%)
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {job.scoreBreakdown.skills}/100
                </span>
              </div>
              <div className="p-2 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="block text-[10px] text-[var(--muted-foreground)]">
                  Experience (25%)
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {job.scoreBreakdown.experience}/100
                </span>
              </div>
              <div className="p-2 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="block text-[10px] text-[var(--muted-foreground)]">
                  Role Pref (20%)
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {job.scoreBreakdown.role}/100
                </span>
              </div>
              <div className="p-2 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="block text-[10px] text-[var(--muted-foreground)]">
                  Location (15%)
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {job.scoreBreakdown.location}/100
                </span>
              </div>
              <div className="p-2 rounded bg-[var(--card)] border border-[var(--border)] col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-[var(--muted-foreground)]">
                  Freshness (5%)
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {job.scoreBreakdown.freshness}/100
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1 text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Matches profile target skills:{" "}
                  {job.matchingSkills.join(", ")}
                </span>
              </div>
              {job.missingOrUnverifiedSkills.length > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Uncertain or missing skills in resume:{" "}
                    {job.missingOrUnverifiedSkills.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
