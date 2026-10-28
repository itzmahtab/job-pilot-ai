"use client";

import * as React from "react";
import Link from "next/link";
import { Radar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signUpAction, type ActionState } from "@/lib/auth/actions";

export default function SignUpPage() {
  const [state, formAction, isPending] = React.useActionState(
    signUpAction,
    null as ActionState | null
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
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
            Create candidate account
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Create your account, then choose the preferences used for job match
            rankings
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Developer"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                />
                {state?.fieldErrors?.name && (
                  <p className="text-[10px] text-rose-500">
                    {state.fieldErrors.name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                />
                {state?.fieldErrors?.email && (
                  <p className="text-[10px] text-rose-500">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)] block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                />
                {state?.fieldErrors?.password && (
                  <p className="text-[10px] text-rose-500">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                By creating an account, you confirm your candidate data and
                resume are stored privately and never shared with untrusted
                third parties.
              </p>

              <Button
                type="submit"
                variant="default"
                size="md"
                isLoading={isPending}
                className="w-full text-xs font-semibold"
              >
                Create Account & Continue
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-[var(--muted-foreground)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
