import type {
  EmploymentTypeValue,
  SeniorityValue,
  WorkModeValue,
} from "./constants";

export interface ProfileFormValues {
  headline: string;
  targetRoles: string[];
  seniorityPreference: SeniorityValue | "";
  skills: string[];
  approxYearsExperience: string;
  workModes: WorkModeValue[];
  eligibleCountries: string[];
  preferredLocations: string[];
  excludeKeywords: string[];
  employmentTypes: EmploymentTypeValue[];
}

export interface ProfileActionState {
  status: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: ProfileFormValues;
}

export function createEmptyProfile(): ProfileFormValues {
  return {
    headline: "",
    targetRoles: [],
    seniorityPreference: "",
    skills: [],
    approxYearsExperience: "",
    workModes: [],
    eligibleCountries: [],
    preferredLocations: [],
    excludeKeywords: [],
    employmentTypes: [],
  };
}
