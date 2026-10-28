"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Briefcase,
  FileText,
  BookmarkCheck,
  Search,
  Settings,
  UserRound,
  Menu,
  X,
  Bell,
  Sparkles,
  ExternalLink,
  Radar,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/lib/auth/actions";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Find Jobs",
    href: "/jobs",
    icon: Compass,
    badge: "12 new",
  },
  {
    name: "Applications",
    href: "/applications",
    icon: Briefcase,
    badge: "3",
  },
  {
    name: "Resume Center",
    href: "/resume",
    icon: FileText,
  },
  {
    name: "Saved Searches",
    href: "/saved-searches",
    icon: BookmarkCheck,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<{
    name?: string | null;
    email: string;
  } | null>(null);

  // Load session info on mount
  React.useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border)] gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-xs">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-base text-[var(--foreground)]">
                JobPilot
              </span>
              <span className="text-[var(--accent)] font-semibold text-xs tracking-wider uppercase">
                AI
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] tracking-tight">
              Opportunity Radar
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
            Workspace
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      isActive
                        ? "text-white"
                        : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Profile Card / Mode & Sign Out */}
        <div className="p-4 border-t border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--secondary)]/60 border border-[var(--border)]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold text-xs flex items-center justify-center shrink-0">
                {user ? (user.name?.slice(0, 2).toUpperCase() ?? "CD") : "JP"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                  {user ? (user.name ?? "Candidate") : "Candidate Profile"}
                </p>
                <p className="text-[10px] text-[var(--muted-foreground)] truncate">
                  {user ? user.email : "Software Engineer"}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Context / Search hint */}
            <div className="hidden sm:flex items-center text-xs text-[var(--muted-foreground)] gap-2 bg-[var(--secondary)]/60 border border-[var(--border)] px-3 py-1.5 rounded-lg">
              <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              <span>Search jobs, companies, or skills... (Press /)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge
              variant="outline"
              className="hidden md:inline-flex bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px]"
            >
              Phase 1 & 2 Preview
            </Badge>

            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Matches</span>
            </Link>

            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden flex bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 max-w-[80%] bg-[var(--card)] h-full p-4 flex flex-col shadow-2xl border-r border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Radar className="w-5 h-5 text-[var(--primary)]" />
                  <span className="font-bold text-sm">JobPilot AI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium",
                        isActive
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[var(--secondary)] text-[var(--foreground)]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[var(--border)] space-y-3 text-xs text-[var(--muted-foreground)]">
                <div className="flex justify-between items-center">
                  <span className="truncate max-w-[160px] font-medium text-[var(--foreground)]">
                    {user ? user.email : "Candidate"}
                  </span>
                  <ThemeToggle />
                </div>
                <form action={signOutAction} className="w-full">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
