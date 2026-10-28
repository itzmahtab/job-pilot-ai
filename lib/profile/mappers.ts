import type { Profile } from "@/lib/repositories/user-repository";
import {
  EMPLOYMENT_TYPE_VALUES,
  SENIORITY_VALUES,
  WORK_MODE_VALUES,
  type EmploymentTypeValue,
  type SeniorityValue,
  type WorkModeValue,
} from "./constants";
import { createEmptyProfile, type ProfileFormValues } from "./types";

function filterValues<T extends string>(
  values: string[] | null | undefined,
  allowed: readonly T[]
): T[] {
  const allowedSet = new Set<string>(allowed);
  return (values ?? []).filter((value): value is T => allowedSet.has(value));
}

function toSeniority(
  value: string | null
): ProfileFormValues["seniorityPreference"] {
  return value && (SENIORITY_VALUES as readonly string[]).includes(value)
    ? (value as SeniorityValue)
    : "";
}

export function profileToFormValues(
  profile: Profile | null
): ProfileFormValues {
  if (!profile) {
    return createEmptyProfile();
  }

  return {
    headline: profile.headline ?? "",
    targetRoles: profile.targetRoles ?? [],
    seniorityPreference: toSeniority(profile.seniorityPreference),
    skills: profile.skills ?? [],
    approxYearsExperience: profile.approxYearsExperience ?? "",
    workModes: filterValues<WorkModeValue>(profile.workModes, WORK_MODE_VALUES),
    eligibleCountries: profile.eligibleCountries ?? [],
    preferredLocations: profile.preferredLocations ?? [],
    excludeKeywords: profile.excludeKeywords ?? [],
    employmentTypes: filterValues<EmploymentTypeValue>(
      profile.employmentTypes,
      EMPLOYMENT_TYPE_VALUES
    ),
  };
}
