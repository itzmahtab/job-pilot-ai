import { z } from "zod";
import {
  EMPLOYMENT_TYPE_VALUES,
  SENIORITY_VALUES,
  WORK_MODE_VALUES,
} from "./constants";

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(value);
    }
  }

  return result;
}

function stringListSchema(maxItems: number, maxLength: number) {
  return z
    .array(
      z
        .string()
        .trim()
        .min(1, "Values cannot be empty")
        .max(maxLength, `Each value must be ${maxLength} characters or fewer`)
    )
    .max(maxItems, `Add no more than ${maxItems} values`)
    .default([])
    .transform(dedupeStrings);
}

const headlineSchema = z
  .string()
  .trim()
  .max(120, "Headline must be 120 characters or fewer")
  .optional()
  .transform((value) => (value ? value : null));

const experienceSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .refine(
    (value) =>
      value === null || (/^\d{1,2}(\.\d)?$/.test(value) && Number(value) <= 60),
    {
      message: "Enter years as a number from 0 to 60, for example 1.5",
    }
  );

const senioritySchema = z
  .union([z.enum(SENIORITY_VALUES), z.literal("")])
  .optional()
  .transform((value) => (value ? value : null));

const workModesSchema = z
  .array(z.enum(WORK_MODE_VALUES))
  .max(WORK_MODE_VALUES.length)
  .default([]);

const employmentTypesSchema = z
  .array(z.enum(EMPLOYMENT_TYPE_VALUES))
  .max(EMPLOYMENT_TYPE_VALUES.length)
  .default([]);

export const profileSchema = z.object({
  headline: headlineSchema,
  targetRoles: stringListSchema(10, 80),
  seniorityPreference: senioritySchema,
  skills: stringListSchema(50, 60),
  approxYearsExperience: experienceSchema,
  workModes: workModesSchema,
  eligibleCountries: stringListSchema(25, 60),
  preferredLocations: stringListSchema(15, 80),
  excludeKeywords: stringListSchema(25, 60),
  employmentTypes: employmentTypesSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>;

export function profileInputToDbValues(input: ProfileInput) {
  return {
    headline: input.headline,
    targetRoles: input.targetRoles,
    seniorityPreference: input.seniorityPreference,
    skills: input.skills,
    approxYearsExperience: input.approxYearsExperience,
    workModes: input.workModes,
    eligibleCountries: input.eligibleCountries,
    preferredLocations: input.preferredLocations,
    excludeKeywords: input.excludeKeywords,
    employmentTypes: input.employmentTypes,
  };
}
