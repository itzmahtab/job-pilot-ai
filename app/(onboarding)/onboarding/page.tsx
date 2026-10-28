import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { requireSessionUser } from "@/lib/auth/guards";
import { profileToFormValues } from "@/lib/profile/mappers";
import { UserRepository } from "@/lib/repositories/user-repository";

export const metadata: Metadata = {
  title: "Set up your profile — JobPilot AI",
  description:
    "Choose the roles, skills, locations, and filters used to rank your job matches.",
};

export default async function OnboardingPage() {
  const user = await requireSessionUser("/onboarding");
  const profile = await UserRepository.getProfile(user.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
          <Sparkles className="h-3 w-3" />
          Profile setup
        </span>
        <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
          Tune your opportunity radar
        </h1>
        <p className="max-w-2xl text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
          Four short steps help us rank jobs against what you actually want. All
          fields are optional, nothing is inferred, and you can change every
          answer later from your profile.
        </p>
      </div>

      <ProfileForm
        initialValues={profileToFormValues(profile)}
        mode="onboarding"
      />
    </div>
  );
}
