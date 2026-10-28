"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Shield, Trash2, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
          Settings & Preferences
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">
          Manage your matching criteria, AI provider controls, and privacy
          settings
        </p>
      </div>

      <Card className="border-[var(--primary)]/20 bg-[var(--primary)]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="h-4 w-4 text-[var(--primary)]" />
            <span>Matching & target preferences</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Your candidate profile is the source of truth for deterministic job
            ranking.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-between gap-4 text-xs sm:flex-row sm:items-center">
          <p className="max-w-xl text-[11px] leading-relaxed text-[var(--muted-foreground)]">
            Edit target roles, seniority, skills, experience, work modes,
            employment types, locations, and negative filters in one place.
            Blank answers stay blank until you confirm them.
          </p>
          <Link href="/profile" className="shrink-0">
            <Button size="sm" className="gap-1.5">
              Edit profile preferences
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-4 w-4 text-[var(--accent)]" />
            <span>AI Provider Configuration</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Deterministic scoring works completely offline. Optional AI enhances
            gap analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-[var(--foreground)]">
              Active Provider Interface
            </label>
            <select
              defaultValue="none"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] sm:w-64"
            >
              <option value="none">Disabled (Safe Fallback / Zero-cost)</option>
              <option value="ollama">Local Ollama (Developer mode)</option>
              <option value="hosted">
                Hosted Provider (OpenAI / Anthropic)
              </option>
            </select>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            No personal resume contents will ever be shared with any external
            model provider unless you explicitly opt-in above.
          </p>
        </CardContent>
      </Card>

      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-rose-700 dark:text-rose-400">
            <Shield className="h-4 w-4" />
            <span>Privacy & Data Management</span>
          </CardTitle>
          <CardDescription className="text-xs text-[var(--muted-foreground)]">
            You own all your personal data and resume representations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-between gap-4 text-xs sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-[var(--foreground)]">
              Permanently Delete All Data
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Purges all uploaded documents, extracted profiles, application
              records, and saved searches.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() =>
              alert("Data purge confirmation requested (Phase 4 integration).")
            }
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Account & Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
