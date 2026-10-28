import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--secondary)]/80",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
