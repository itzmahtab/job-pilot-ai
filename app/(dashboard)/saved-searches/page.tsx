import { BookmarkCheck, Bell, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SavedSearchesPage() {
  const savedSearches = [
    {
      id: "search-1",
      name: "Remote Junior Frontend (React / Next.js)",
      filters: "Remote • 0-2 yrs • React, TypeScript",
      alertFrequency: "Instant in-app",
      newMatchesCount: 3,
    },
    {
      id: "search-2",
      name: "Full-Stack Internships (US / Hybrid)",
      filters: "Internship • Hybrid / Onsite • Node.js, SQL",
      alertFrequency: "Daily digest",
      newMatchesCount: 1,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Saved Searches & Alerts
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Automated radar alerts triggered when new opportunities matching your criteria are collected
        </p>
      </div>

      <div className="space-y-4">
        {savedSearches.map((search) => (
          <Card key={search.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm sm:text-base text-[var(--foreground)]">
                    {search.name}
                  </span>
                  {search.newMatchesCount > 0 && (
                    <Badge variant="success" className="text-[10px]">
                      {search.newMatchesCount} new opportunities
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] font-mono">
                  {search.filters}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] pt-1">
                  <Bell className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>Notification: {search.alertFrequency}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <span>View Matches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8"
                  title="Delete saved search"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
