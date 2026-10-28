"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { UserRepository } from "@/lib/repositories/user-repository";
import { profileToFormValues } from "./mappers";
import { profileInputToDbValues, profileSchema } from "./schema";
import type { ProfileActionState } from "./types";

function parseProfileFormData(formData: FormData) {
  return {
    headline: String(formData.get("headline") ?? ""),
    targetRoles: formData.getAll("targetRoles").map(String),
    seniorityPreference: String(formData.get("seniorityPreference") ?? ""),
    skills: formData.getAll("skills").map(String),
    approxYearsExperience: String(formData.get("approxYearsExperience") ?? ""),
    workModes: formData.getAll("workModes").map(String),
    eligibleCountries: formData.getAll("eligibleCountries").map(String),
    preferredLocations: formData.getAll("preferredLocations").map(String),
    excludeKeywords: formData.getAll("excludeKeywords").map(String),
    employmentTypes: formData.getAll("employmentTypes").map(String),
  };
}

function revalidateProfilePaths() {
  revalidatePath("/profile");
  revalidatePath("/onboarding");
  revalidatePath("/settings");
}

export async function saveProfileAction(
  _prevState: ProfileActionState | null,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await getSession();
  if (!session?.user) {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again.",
    };
  }

  const parsed = profileSchema.safeParse(parseProfileFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >,
    };
  }

  try {
    const saved = await UserRepository.upsertProfile(
      session.user.id,
      profileInputToDbValues(parsed.data)
    );

    revalidateProfilePaths();

    return {
      status: "success",
      message: "Profile saved.",
      values: profileToFormValues(saved),
    };
  } catch (error) {
    console.error("saveProfileAction failed", error);
    return {
      status: "error",
      message: "Could not save your profile. Please try again.",
    };
  }
}

export async function resetProfileAction(): Promise<ProfileActionState> {
  const session = await getSession();
  if (!session?.user) {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again.",
    };
  }

  try {
    const saved = await UserRepository.upsertProfile(session.user.id, {
      headline: null,
      targetRoles: [],
      seniorityPreference: null,
      skills: [],
      approxYearsExperience: null,
      workModes: [],
      eligibleCountries: [],
      preferredLocations: [],
      excludeKeywords: [],
      employmentTypes: [],
    });

    revalidateProfilePaths();

    return {
      status: "success",
      message: "Profile preferences reset.",
      values: profileToFormValues(saved),
    };
  } catch (error) {
    console.error("resetProfileAction failed", error);
    return {
      status: "error",
      message: "Could not reset your profile. Please try again.",
    };
  }
}
