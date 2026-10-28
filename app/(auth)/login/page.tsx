"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Radar, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  signInAction,
  demoSignInAction,
  type ActionState,
} from "@/lib/auth/actions";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [state, formAction, isPending] = React.useActionState(
    signInAction,
    null as ActionState | null
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="h-10 w-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[var(--foreground)]">
              JobPilot{" "}
              <span className="text-[var(--accent)] text-xs uppercase tracking-wider font-semibold">
                AI
              </span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Sign in to access your opportunity radar and tracked applications
          </p>
        </div>

        {/* Demo Fast-Pass Banner (Zero friction preview) */}
        <div className="p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-xs text-[var(--foreground)] space-y-3">
          <div className="flex items-center gap-2 font-semibold text-[var(--primary)]">
            <Sparkles className="w-4 h-4" />
            <span>Developer & Evaluator Quick Sign-In</span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
            One-click sign-in with pre-configured candidate profile, 12 matched
            listings, and verified skills.
          </p>
          <form action={demoSignInAction}>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="w-full gap-2 text-xs font-semibold"
            >
              <span>Instant Access as Demo Candidate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[var(--border)] w-full" />
          <span className="bg-[var(--background)] px-3 text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider shrink-0 font-medium">
            Or sign in with email
          </span>
          <div className="border-t border-[var(--border)] w-full" />
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-6">
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="redirect" value={redirectUrl} />

              {state?.error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="developer@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                />
                {state?.fieldErrors?.email && (
                  <p className="text-[10px] text-rose-500">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--foreground)] block">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                />
                {state?.fieldErrors?.password && (
                  <p className="text-[10px] text-rose-500">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="default"
                size="md"
                isLoading={isPending}
                className="w-full text-xs font-semibold"
              >
                Sign In to Workspace
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-[var(--muted-foreground)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Create candidate account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </React.Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md animate-pulse space-y-4">
        <div className="mx-auto h-10 w-36 rounded-xl bg-[var(--secondary)]" />
        <div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--card)]" />
      </div>
    </div>
  );
}
