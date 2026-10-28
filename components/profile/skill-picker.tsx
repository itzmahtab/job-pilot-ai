"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
import { SKILL_SUGGESTIONS } from "@/lib/profile/constants";
import { TagInput } from "./tag-input";

interface SkillPickerProps {
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function SkillPicker({ values, onChange, error }: SkillPickerProps) {
  const selectedKeys = React.useMemo(
    () => new Set(values.map((value) => value.toLowerCase())),
    [values]
  );

  const toggleSuggestion = (skill: string) => {
    const isSelected = selectedKeys.has(skill.toLowerCase());
    if (isSelected) {
      onChange(
        values.filter((value) => value.toLowerCase() !== skill.toLowerCase())
      );
      return;
    }

    if (values.length >= 50) return;
    onChange([...values, skill]);
  };

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold text-[var(--foreground)]">
          Suggested skills
        </legend>
        <p className="text-[11px] text-[var(--muted-foreground)]">
          Select the skills you want matching jobs to consider. Add anything
          missing below.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SKILL_SUGGESTIONS.map((skill) => {
            const isSelected = selectedKeys.has(skill.toLowerCase());
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSuggestion(skill)}
                aria-pressed={isSelected}
                className={
                  isSelected
                    ? "inline-flex items-center gap-1 rounded-md border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2 py-1 text-[11px] font-medium text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    : "inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[11px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/30 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                }
              >
                {isSelected ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                {skill}
              </button>
            );
          })}
        </div>
      </fieldset>

      <TagInput
        id="skills"
        name="skills"
        label="Add a skill"
        description="Press Enter or comma to add a custom skill."
        placeholder="e.g. Rust"
        values={values}
        onChange={onChange}
        maxItems={50}
        maxLength={60}
        error={error}
      />
    </div>
  );
}
