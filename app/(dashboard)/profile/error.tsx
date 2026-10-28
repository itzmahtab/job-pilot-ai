"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function ProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Could not load your profile"
      message="Your saved preferences are safe. Check your connection and try again."
      onRetry={reset}
    />
  );
}
