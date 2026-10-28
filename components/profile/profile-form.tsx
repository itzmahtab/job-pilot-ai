"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  COUNTRY_SUGGESTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  LOCATION_SUGGESTIONS,
  SENIORITY_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/profile/constants";
import { resetProfileAction, saveProfileAction } from "@/lib/profile/actions";
import type {
  ProfileActionState,
  ProfileFormValues,
} from "@/lib/profile/types";
import { cn } from "@/lib/utils";
import { SkillPicker } from "./skill-picker";
import { TagInput } from "./tag-input";

interface ProfileFormProps {
  initialValues: ProfileFormValues;
  mode?: "profile" | "onboarding";
}

const STEP_LABELS = ["Roles", "Skills", "Location", "Review"] as const;
const STEP_TITLES = [
  "Target roles and seniority",
  "Skills and experience",
  "Work and location preferences",
  "Exclusions and review",
] as const;

const FIELD_STEPS: Record<string, number> = {
  headline: 0,
  targetRoles: 0,
  seniorityPreference: 0,
  skills: 1,
  approxYearsExperience: 1,
  workModes: 2,
  employmentTypes: 2,
  eligibleCountries: 2,
  preferredLocations: 2,
  excludeKeywords: 3,
};

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function ProfileForm({
  initialValues,
  mode = "profile",
}: ProfileFormProps) {
  const [state, formAction, isPending] = React.useActionState(
    saveProfileAction,
    null as ProfileActionState | null
  );
  const [values, setValues] = React.useState<ProfileFormValues>(initialValues);
  const [step, setStep] = React.useState(0);
  const [isResetOpen, setIsResetOpen] = React.useState(false);
  const [isResetting, startReset] = React.useTransition();
  const [feedback, setFeedback] = React.useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();

  const isOnboarding = mode === "onboarding";

  React.useEffect(() => {
    if (!state) return;

    if (state.status === "success") {
      if (isOnboarding) {
        router.replace("/dashboard");
        return;
      }

      if (state.values) {
        setValues(state.values);
      }
      setFeedback({
        tone: "success",
        message: state.message ?? "Profile saved.",
      });
      return;
    }

    setFeedback({
      tone: "error",
      message: state.message ?? "Please correct the highlighted fields.",
    });

    if (state.fieldErrors && isOnboarding) {
      const firstField = Object.keys(state.fieldErrors).find(
        (field) => state.fieldErrors?.[field]?.length
      );
      const fieldStep = firstField ? FIELD_STEPS[firstField] : undefined;
      if (typeof fieldStep === "number") {
        setStep(fieldStep);
      }
    }
  }, [isOnboarding, router, state]);

  const update = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (feedback?.tone === "success") {
      setFeedback(null);
    }
  };

  const handleReset = () => {
    startReset(async () => {
      const result = await resetProfileAction();
      if (result.status === "success" && result.values) {
        setValues(result.values);
        setFeedback({
          tone: "success",
          message: result.message ?? "Profile preferences reset.",
        });
      } else {
        setFeedback({
          tone: "error",
          message: result.message ?? "Could not reset your profile.",
        });
      }
      setIsResetOpen(false);
    });
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.defaultPrevented) return;
    if (!isOnboarding || step === STEP_LABELS.length - 1) return;

    const target = event.target as HTMLElement;
    if (event.key === "Enter" && target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  };

  const errorFor = (field: string) =>
    state?.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  const workModeLabels = WORK_MODE_OPTIONS.filter((option) =>
    values.workModes.includes(option.value)
  ).map((option) => option.label);

  const employmentTypeLabels = EMPLOYMENT_TYPE_OPTIONS.filter((option) =>
    values.employmentTypes.includes(option.value)
  ).map((option) => option.label);

  const seniorityLabel =
    SENIORITY_OPTIONS.find(
      (option) => option.value === values.seniorityPreference
    )?.label ?? "Not specified";

  const summaryRows = [
    { label: "Headline", value: values.headline || "Not specified" },
    {
      label: "Target roles",
      value: values.targetRoles.length
        ? values.targetRoles.join(", ")
        : "Not specified",
    },
    { label: "Seniority", value: seniorityLabel },
    {
      label: "Experience",
      value: values.approxYearsExperience
        ? `${values.approxYearsExperience} years`
        : "Not specified",
    },
    {
      label: "Skills",
      value: values.skills.length ? values.skills.join(", ") : "Not specified",
    },
    {
      label: "Work modes",
      value: workModeLabels.length
        ? workModeLabels.join(", ")
        : "Not specified",
    },
    {
      label: "Employment types",
      value: employmentTypeLabels.length
        ? employmentTypeLabels.join(", ")
        : "Not specified",
    },
    {
      label: "Eligible countries",
      value: values.eligibleCountries.length
        ? values.eligibleCountries.join(", ")
        : "Not specified",
    },
    {
      label: "Preferred locations",
      value: values.preferredLocations.length
        ? values.preferredLocations.join(", ")
        : "Not specified",
    },
    {
      label: "Excluded keywords",
      value: values.excludeKeywords.length
        ? values.excludeKeywords.join(", ")
        : "None",
    },
  ];

  return (
    <>
      <form
        action={formAction}
        onKeyDown={handleFormKeyDown}
        className="space-y-6"
      >
        {feedback && (
          <div
            role={feedback.tone === "error" ? "alert" : "status"}
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-xs",
              feedback.tone === "error"
                ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            )}
          >
            {feedback.tone === "error" ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {isOnboarding && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted-foreground)]">
              <span className="font-semibold uppercase tracking-wider">
                Step {step + 1} of {STEP_LABELS.length}
              </span>
              <span>{STEP_TITLES[step]}</span>
            </div>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STEP_LABELS.map((label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    aria-current={step === index ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                      step === index
                        ? "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        step === index
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--secondary)] text-[var(--foreground)]"
                      )}
                    >
                      {index + 1}
                    </span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        <Card hidden={isOnboarding && step !== 0}>
          <CardHeader>
            <CardTitle className="text-base">
              {isOnboarding ? STEP_TITLES[0] : "Role preferences"}
            </CardTitle>
            <CardDescription className="text-xs">
              Tell us what kind of work you want to be matched with. Leave any
              field blank if you are unsure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                name="headline"
                value={values.headline}
                onChange={(event) => update("headline", event.target.value)}
                placeholder="e.g. Junior full-stack developer"
                maxLength={120}
                aria-invalid={Boolean(errorFor("headline"))}
                aria-describedby={
                  errorFor("headline") ? "headline-error" : undefined
                }
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                A short description of the role you are targeting.
              </p>
              {errorFor("headline") && (
                <p id="headline-error" className="text-[10px] text-rose-500">
                  {errorFor("headline")}
                </p>
              )}
            </div>

            <TagInput
              id="targetRoles"
              name="targetRoles"
              label="Target roles"
              description="Roles you want to see. You can add up to 10."
              placeholder="e.g. Frontend Engineer"
              values={values.targetRoles}
              onChange={(next) => update("targetRoles", next)}
              maxItems={10}
              maxLength={80}
              error={errorFor("targetRoles")}
            />

            <div className="space-y-1.5">
              <Label htmlFor="seniorityPreference">Seniority preference</Label>
              <Select
                id="seniorityPreference"
                name="seniorityPreference"
                value={values.seniorityPreference}
                onChange={(event) =>
                  update(
                    "seniorityPreference",
                    event.target
                      .value as ProfileFormValues["seniorityPreference"]
                  )
                }
                aria-invalid={Boolean(errorFor("seniorityPreference"))}
                aria-describedby={
                  errorFor("seniorityPreference")
                    ? "seniorityPreference-error"
                    : undefined
                }
              >
                <option value="">Not specified</option>
                {SENIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {errorFor("seniorityPreference") && (
                <p
                  id="seniorityPreference-error"
                  className="text-[10px] text-rose-500"
                >
                  {errorFor("seniorityPreference")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card hidden={isOnboarding && step !== 1}>
          <CardHeader>
            <CardTitle className="text-base">
              {isOnboarding ? STEP_TITLES[1] : "Skills & experience"}
            </CardTitle>
            <CardDescription className="text-xs">
              Add skills you want matching jobs to consider. Approximate
              experience is optional and never inferred.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <SkillPicker
              values={values.skills}
              onChange={(next) => update("skills", next)}
              error={errorFor("skills")}
            />

            <div className="space-y-1.5">
              <Label htmlFor="approxYearsExperience">
                Approximate years of experience
              </Label>
              <Input
                id="approxYearsExperience"
                name="approxYearsExperience"
                value={values.approxYearsExperience}
                onChange={(event) =>
                  update("approxYearsExperience", event.target.value)
                }
                inputMode="decimal"
                placeholder="e.g. 1.5"
                aria-invalid={Boolean(errorFor("approxYearsExperience"))}
                aria-describedby={
                  errorFor("approxYearsExperience")
                    ? "approxYearsExperience-error"
                    : "approxYearsExperience-description"
                }
              />
              <p
                id="approxYearsExperience-description"
                className="text-[11px] text-[var(--muted-foreground)]"
              >
                Leave blank if you do not know or prefer not to say.
              </p>
              {errorFor("approxYearsExperience") && (
                <p
                  id="approxYearsExperience-error"
                  className="text-[10px] text-rose-500"
                >
                  {errorFor("approxYearsExperience")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card hidden={isOnboarding && step !== 2}>
          <CardHeader>
            <CardTitle className="text-base">
              {isOnboarding ? STEP_TITLES[2] : "Work & location"}
            </CardTitle>
            <CardDescription className="text-xs">
              Choose the work modes, employment types, and locations that fit
              your situation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-[var(--foreground)]">
                Work modes
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {WORK_MODE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 transition-colors hover:border-[var(--primary)]/30"
                  >
                    <Checkbox
                      name="workModes"
                      value={option.value}
                      checked={values.workModes.includes(option.value)}
                      onChange={() =>
                        update(
                          "workModes",
                          toggleValue(values.workModes, option.value)
                        )
                      }
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block text-xs font-medium text-[var(--foreground)]">
                        {option.label}
                      </span>
                      <span className="block text-[11px] text-[var(--muted-foreground)]">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errorFor("workModes") && (
                <p className="text-[10px] text-rose-500">
                  {errorFor("workModes")}
                </p>
              )}
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-[var(--foreground)]">
                Employment types
              </legend>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPE_OPTIONS.map((option) => {
                  const isSelected = values.employmentTypes.includes(
                    option.value
                  );
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                        isSelected
                          ? "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <Checkbox
                        name="employmentTypes"
                        value={option.value}
                        checked={isSelected}
                        onChange={() =>
                          update(
                            "employmentTypes",
                            toggleValue(values.employmentTypes, option.value)
                          )
                        }
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              {errorFor("employmentTypes") && (
                <p className="text-[10px] text-rose-500">
                  {errorFor("employmentTypes")}
                </p>
              )}
            </fieldset>

            <TagInput
              id="eligibleCountries"
              name="eligibleCountries"
              label="Eligible countries"
              description="Countries where you are authorized to work. Use codes such as US, GB, or EU."
              placeholder="e.g. US"
              values={values.eligibleCountries}
              onChange={(next) => update("eligibleCountries", next)}
              suggestions={COUNTRY_SUGGESTIONS}
              maxItems={25}
              maxLength={60}
              error={errorFor("eligibleCountries")}
            />

            <TagInput
              id="preferredLocations"
              name="preferredLocations"
              label="Preferred locations"
              description="Cities or regions you prefer. Remote is a valid location."
              placeholder="e.g. Berlin, DE"
              values={values.preferredLocations}
              onChange={(next) => update("preferredLocations", next)}
              suggestions={LOCATION_SUGGESTIONS}
              maxItems={15}
              maxLength={80}
              error={errorFor("preferredLocations")}
            />
          </CardContent>
        </Card>

        <Card hidden={isOnboarding && step !== 3}>
          <CardHeader>
            <CardTitle className="text-base">
              {isOnboarding ? STEP_TITLES[3] : "Negative filters"}
            </CardTitle>
            <CardDescription className="text-xs">
              Exclude listings that contain terms you do not want. These filters
              are applied before ranking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TagInput
              id="excludeKeywords"
              name="excludeKeywords"
              label="Exclude keywords"
              description="For example: Senior, Lead, Principal, 5+ years."
              placeholder="e.g. Senior"
              values={values.excludeKeywords}
              onChange={(next) => update("excludeKeywords", next)}
              maxItems={25}
              maxLength={60}
              error={errorFor("excludeKeywords")}
            />

            {isOnboarding && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-[var(--foreground)]">
                    Review your preferences
                  </h3>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Nothing is inferred. You can change any answer later from
                    your profile.
                  </p>
                </div>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {summaryRows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-lg border border-[var(--border)] bg-[var(--secondary)]/40 p-3"
                    >
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-xs text-[var(--foreground)]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-[11px] text-[var(--muted-foreground)]">
                  Resume upload and optional extraction are part of Phase 6.
                  Your current profile works without them.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {isOnboarding ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep((current) => current - 1)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  Skip for now
                </Link>
              )}
            </div>

            {step < STEP_LABELS.length - 1 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setStep((current) => current + 1)}
                className="gap-1.5"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                isLoading={isPending}
                className="gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Save profile
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetOpen(true)}
              disabled={isPending || isResetting}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset preferences
            </Button>

            <Button
              type="submit"
              size="sm"
              isLoading={isPending}
              disabled={isResetting}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Save profile
            </Button>
          </div>
        )}
      </form>

      <ConfirmationDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Reset profile preferences?"
        description="This clears your headline, target roles, skills, experience, locations, and filters. Your account remains active."
        confirmText="Reset preferences"
        variant="destructive"
        isLoading={isResetting}
      />
    </>
  );
}
