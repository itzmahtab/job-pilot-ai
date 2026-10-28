"use client";

import * as React from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Compass,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { SAMPLE_JOBS } from "@/lib/fixtures/sample-jobs";
import { SampleJobCard } from "@/components/jobs/sample-job-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function JobExplorerPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedWorkMode, setSelectedWorkMode] = React.useState<string>("all");
  const [selectedSeniority, setSelectedSeniority] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"match" | "newest">("match");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Filter jobs
  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchingSkills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesWorkMode =
      selectedWorkMode === "all" || job.workMode === selectedWorkMode;

    const matchesSeniority =
      selectedSeniority === "all" || job.employmentType === selectedSeniority;

    return matchesSearch && matchesWorkMode && matchesSeniority;
  }).sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    return a.title.localeCompare(b.title);
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedWorkMode("all");
    setSelectedSeniority("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedWorkMode !== "all" ||
    selectedSeniority !== "all";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Job Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Verified opportunities ranked deterministically against your candidate profile
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search role, company, skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mr-1 hidden sm:inline">
            Filters:
          </span>

          {/* Work Mode filter buttons */}
          <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--secondary)]/60 text-xs">
            {["all", "remote", "hybrid", "onsite"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedWorkMode(mode)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                  selectedWorkMode === mode
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Seniority filter */}
          <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--secondary)]/60 text-xs">
            {["all", "junior", "internship"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedSeniority(type)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                  selectedSeniority === type
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 font-medium ml-1"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          <span className="text-[var(--muted-foreground)] font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "match" | "newest")}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          >
            <option value="match">Highest Match Score</option>
            <option value="newest">Alphabetical / Title</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[var(--muted-foreground)]">Active:</span>
          {searchQuery && (
            <Badge variant="outline" className="gap-1 bg-[var(--card)]">
              Keyword: &quot;{searchQuery}&quot;
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            </Badge>
          )}
          {selectedWorkMode !== "all" && (
            <Badge variant="outline" className="gap-1 bg-[var(--card)] capitalize">
              Mode: {selectedWorkMode}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSelectedWorkMode("all")}
              />
            </Badge>
          )}
          {selectedSeniority !== "all" && (
            <Badge variant="outline" className="gap-1 bg-[var(--card)] capitalize">
              Role: {selectedSeniority}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSelectedSeniority("all")}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Job Results Count */}
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>Showing {filteredJobs.length} matching opportunities</span>
        <span className="italic font-medium text-amber-600 dark:text-amber-400">
          ⚡ All results are deterministic sample fixtures
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <SampleJobCard key={job.id} job={job} />
          ))
        ) : (
          <Card className="p-12 text-center border-dashed">
            <CardContent className="space-y-3">
              <Compass className="w-8 h-8 text-[var(--muted-foreground)] mx-auto" />
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No opportunities match these filters
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                Try clearing active keywords or expanding your work mode and seniority criteria.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
