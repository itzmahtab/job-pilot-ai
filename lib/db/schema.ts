import {
  pgTable,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -----------------------------------------------------------------------------
// 1. Users
// -----------------------------------------------------------------------------
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  image: text("image"),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// -----------------------------------------------------------------------------
// 2. Profiles (1-to-1 with User)
// -----------------------------------------------------------------------------
export const profiles = pgTable(
  "profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    headline: text("headline"),
    targetRoles: jsonb("target_roles").$type<string[]>().default([]),
    seniorityPreference: text("seniority_preference").default("entry"), // 'intern' | 'junior' | 'entry' | 'mid' | 'all'
    skills: jsonb("skills").$type<string[]>().default([]),
    approxYearsExperience: numeric("approx_years_experience"),
    workModes: jsonb("work_modes").$type<string[]>().default(["remote", "hybrid"]),
    eligibleCountries: jsonb("eligible_countries").$type<string[]>().default([]),
    preferredLocations: jsonb("preferred_locations").$type<string[]>().default([]),
    excludeKeywords: jsonb("exclude_keywords").$type<string[]>().default([]),
    employmentTypes: jsonb("employment_types").$type<string[]>().default(["full-time", "internship"]),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("profile_user_idx").on(table.userId),
  ]
);

// -----------------------------------------------------------------------------
// 3. Resumes (Private storage, encrypted text, draft review)
// -----------------------------------------------------------------------------
export const resumes = pgTable(
  "resumes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    storageKey: text("storage_key").notNull(), // Unguessable storage identifier
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(), // 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    fileSizeBytes: integer("file_size_bytes").notNull(),
    parseState: text("parse_state").notNull().default("pending"), // 'pending' | 'processing' | 'completed' | 'failed' | 'no_text_found'
    extractedText: text("extracted_text"), // Kept private, never exposed in logs
    extractedDraft: jsonb("extracted_draft").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("resume_user_idx").on(table.userId),
  ]
);

// -----------------------------------------------------------------------------
// 4. Jobs (Normalized public listings)
// -----------------------------------------------------------------------------
export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(), // 'hackernews' | 'wellfound' | 'remotive'
    sourceJobId: text("source_job_id"),
    canonicalUrl: text("canonical_url").notNull(),
    title: text("title").notNull(),
    company: text("company").notNull(),
    companyLogoUrl: text("company_logo_url"),
    location: text("location").notNull(),
    workMode: text("work_mode").notNull().default("unknown"), // 'remote' | 'hybrid' | 'onsite' | 'unknown'
    employmentType: text("employment_type").notNull().default("unknown"), // 'full-time' | 'internship' | 'junior' | 'contract' | 'unknown'
    experienceRequirement: text("experience_requirement").default("unknown"), // 'no_experience' | '0-1' | '0-2' | 'custom' | 'unknown'
    eligibleCountries: jsonb("eligible_countries").$type<string[]>().default([]),
    requiredSkills: jsonb("required_skills").$type<string[]>().default([]),
    preferredSkills: jsonb("preferred_skills").$type<string[]>().default([]),
    salaryMin: numeric("salary_min"),
    salaryMax: numeric("salary_max"),
    salaryCurrency: text("salary_currency"),
    salaryInterval: text("salary_interval"), // 'yearly' | 'monthly' | 'hourly'
    descriptionText: text("description_text").notNull(),
    descriptionHtml: text("description_html"),
    postedAt: timestamp("posted_at", { withTimezone: true }),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    status: text("status").notNull().default("active"), // 'active' | 'stale' | 'expired'
    contentHash: text("content_hash").notNull(), // Hash for deduplication
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  },
  (table) => [
    uniqueIndex("source_job_unique_idx").on(table.source, table.sourceJobId),
    index("job_posted_at_idx").on(table.postedAt),
    index("job_type_mode_idx").on(table.employmentType, table.workMode),
    index("job_company_idx").on(table.company),
    index("job_status_idx").on(table.status),
    index("job_content_hash_idx").on(table.contentHash),
  ]
);

// -----------------------------------------------------------------------------
// 5. Job Analyses (Cached analysis by content hash)
// -----------------------------------------------------------------------------
export const jobAnalyses = pgTable(
  "job_analyses",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    contentHash: text("content_hash").notNull(),
    provider: text("provider").notNull(), // 'none' | 'ollama' | 'hosted'
    model: text("model").notNull(),
    analysisPayload: jsonb("analysis_payload").$type<Record<string, unknown>>().notNull(),
    scoreVersion: text("score_version").notNull().default("1.0"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("analysis_job_idx").on(table.jobId),
    index("analysis_hash_provider_idx").on(table.contentHash, table.provider),
  ]
);

// -----------------------------------------------------------------------------
// 6. User Jobs (Application Tracker & Saved Jobs)
// -----------------------------------------------------------------------------
export const userJobs = pgTable(
  "user_jobs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    isSaved: boolean("is_saved").notNull().default(false),
    isDismissed: boolean("is_dismissed").notNull().default(false),
    applicationStage: text("application_stage").notNull().default("saved"), // 'saved' | 'planned' | 'applied' | 'interview' | 'offer' | 'rejected'
    appliedAt: timestamp("applied_at", { withTimezone: true }),
    followUpAt: timestamp("follow_up_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_job_unique_idx").on(table.userId, table.jobId),
    index("user_job_stage_idx").on(table.userId, table.applicationStage),
    index("user_job_saved_idx").on(table.userId, table.isSaved),
  ]
);

// -----------------------------------------------------------------------------
// 7. Saved Searches
// -----------------------------------------------------------------------------
export const savedSearches = pgTable(
  "saved_searches",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    filters: jsonb("filters").$type<Record<string, unknown>>().notNull(),
    alertFrequency: text("alert_frequency").notNull().default("instant"), // 'instant' | 'daily' | 'weekly' | 'off'
    lastNotifiedAt: timestamp("last_notified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("saved_searches_user_idx").on(table.userId, table.createdAt),
  ]
);

// -----------------------------------------------------------------------------
// 8. Scrape Runs (Operational health & ingestion audit)
// -----------------------------------------------------------------------------
export const scrapeRuns = pgTable(
  "scrape_runs",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    status: text("status").notNull().default("running"), // 'running' | 'success' | 'partial_success' | 'failed'
    discoveredCount: integer("discovered_count").notNull().default(0),
    insertedCount: integer("inserted_count").notNull().default(0),
    updatedCount: integer("updated_count").notNull().default(0),
    skippedCount: integer("skipped_count").notNull().default(0),
    failedCount: integer("failed_count").notNull().default(0),
    safeErrorSummary: text("safe_error_summary"),
    runMetadata: jsonb("run_metadata").$type<Record<string, unknown>>().default({}),
  },
  (table) => [
    index("scrape_runs_source_idx").on(table.source, table.startedAt),
    index("scrape_runs_status_idx").on(table.status),
  ]
);

// -----------------------------------------------------------------------------
// 9. Notifications
// -----------------------------------------------------------------------------
export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'new_match' | 'source_sync' | 'application_reminder'
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId, table.isRead, table.createdAt),
  ]
);

// -----------------------------------------------------------------------------
// Relations
// -----------------------------------------------------------------------------
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  resumes: many(resumes),
  userJobs: many(userJobs),
  savedSearches: many(savedSearches),
  notifications: many(notifications),
}));

export const jobsRelations = relations(jobs, ({ many }) => ({
  analyses: many(jobAnalyses),
  userJobs: many(userJobs),
}));

export const userJobsRelations = relations(userJobs, ({ one }) => ({
  user: one(users, { fields: [userJobs.userId], references: [users.id] }),
  job: one(jobs, { fields: [userJobs.jobId], references: [jobs.id] }),
}));
