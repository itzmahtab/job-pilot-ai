"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TagInputProps {
  id: string;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: readonly string[];
  maxItems?: number;
  maxLength?: number;
  error?: string;
}

export function TagInput({
  id,
  name,
  label,
  description,
  placeholder = "Type a value and press Enter",
  values,
  onChange,
  suggestions = [],
  maxItems = 20,
  maxLength = 80,
  error,
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");
  const inputId = `${id}-input`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const isAtLimit = values.length >= maxItems;

  const addValues = React.useCallback(
    (rawValues: string[]) => {
      const next = [...values];
      const seen = new Set(values.map((value) => value.toLowerCase()));

      for (const rawValue of rawValues) {
        const value = rawValue.trim().slice(0, maxLength);
        if (!value) continue;

        const key = value.toLowerCase();
        if (next.length >= maxItems || seen.has(key)) continue;

        seen.add(key);
        next.push(value);
      }

      if (next.length !== values.length) {
        onChange(next);
      }
    },
    [maxItems, maxLength, onChange, values]
  );

  const removeValue = (value: string) => {
    onChange(values.filter((item) => item !== value));
  };

  const commitDraft = () => {
    addValues([draft]);
    setDraft("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
      return;
    }

    if (event.key === "Backspace" && draft === "" && values.length > 0) {
      removeValue(values[values.length - 1]);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    if (text.includes(",") || text.includes("\n")) {
      event.preventDefault();
      addValues(text.split(/[\n,]+/));
      setDraft("");
    }
  };

  const availableSuggestions = suggestions
    .filter(
      (suggestion) =>
        !values.some(
          (value) => value.toLowerCase() === suggestion.toLowerCase()
        )
    )
    .slice(0, 8);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{label}</Label>
        <span className="text-[10px] tabular-nums text-[var(--muted-foreground)]">
          {values.length}/{maxItems}
        </span>
      </div>

      {description && (
        <p
          id={descriptionId}
          className="text-[11px] text-[var(--muted-foreground)]"
        >
          {description}
        </p>
      )}

      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--secondary)] px-2 py-1 text-[11px] font-medium text-[var(--secondary-foreground)]"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(value)}
                aria-label={`Remove ${value}`}
                className="rounded-sm text-[var(--muted-foreground)] hover:text-rose-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={
            isAtLimit ? "Maximum number of values reached" : placeholder
          }
          maxLength={maxLength}
          disabled={isAtLimit}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={commitDraft}
          disabled={isAtLimit || draft.trim().length === 0}
          aria-label={`Add ${label.toLowerCase()}`}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {availableSuggestions.length > 0 && !isAtLimit && (
        <div className="flex flex-wrap gap-1.5">
          {availableSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addValues([suggestion])}
              className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <Plus className="h-3 w-3" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p id={errorId} className="text-[10px] font-medium text-rose-500">
          {error}
        </p>
      )}

      {values.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  );
}
