"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function OnboardingError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Could not load profile setup"
      message="Your account is safe. Check your connection and try again."
      onRetry={reset}
    />
  );
}
