import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { requireSessionUser } from "@/lib/auth/guards";
import { profileToFormValues } from "@/lib/profile/mappers";
import { UserRepository } from "@/lib/repositories/user-repository";

export const metadata: Metadata = {
  title: "Profile & Preferences — JobPilot AI",
  description:
    "Manage the roles, skills, locations, and filters used to rank job opportunities.",
};

export default async function ProfilePage() {
  const user = await requireSessionUser("/profile");
  const profile = await UserRepository.getProfile(user.id);

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
          Profile & matching preferences
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">
          These answers drive deterministic job ranking. Update them any time.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
        <div className="shrink-0 rounded-lg bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[var(--foreground)]">
            You control every field
          </p>
          <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">
            Nothing is inferred from your resume or background. Blank fields
            stay blank until you confirm them, and resetting clears your saved
            preferences without deleting your account.
          </p>
        </div>
      </div>

      <ProfileForm initialValues={profileToFormValues(profile)} />
    </div>
  );
}
