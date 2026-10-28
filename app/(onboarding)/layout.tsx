import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-xs transition-transform group-hover:scale-105">
              <Radar className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight text-[var(--foreground)]">
              JobPilot{" "}
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                AI
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
