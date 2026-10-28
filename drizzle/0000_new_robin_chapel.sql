CREATE TABLE "job_analyses" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"content_hash" text NOT NULL,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"analysis_payload" jsonb NOT NULL,
	"score_version" text DEFAULT '1.0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"source_job_id" text,
	"canonical_url" text NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"company_logo_url" text,
	"location" text NOT NULL,
	"work_mode" text DEFAULT 'unknown' NOT NULL,
	"employment_type" text DEFAULT 'unknown' NOT NULL,
	"experience_requirement" text DEFAULT 'unknown',
	"eligible_countries" jsonb DEFAULT '[]'::jsonb,
	"required_skills" jsonb DEFAULT '[]'::jsonb,
	"preferred_skills" jsonb DEFAULT '[]'::jsonb,
	"salary_min" numeric,
	"salary_max" numeric,
	"salary_currency" text,
	"salary_interval" text,
	"description_text" text NOT NULL,
	"description_html" text,
	"posted_at" timestamp with time zone,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"content_hash" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"headline" text,
	"target_roles" jsonb DEFAULT '[]'::jsonb,
	"seniority_preference" text DEFAULT 'entry',
	"skills" jsonb DEFAULT '[]'::jsonb,
	"approx_years_experience" numeric,
	"work_modes" jsonb DEFAULT '["remote","hybrid"]'::jsonb,
	"eligible_countries" jsonb DEFAULT '[]'::jsonb,
	"preferred_locations" jsonb DEFAULT '[]'::jsonb,
	"exclude_keywords" jsonb DEFAULT '[]'::jsonb,
	"employment_types" jsonb DEFAULT '["full-time","internship"]'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"storage_key" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size_bytes" integer NOT NULL,
	"parse_state" text DEFAULT 'pending' NOT NULL,
	"extracted_text" text,
	"extracted_draft" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "saved_searches" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"filters" jsonb NOT NULL,
	"alert_frequency" text DEFAULT 'instant' NOT NULL,
	"last_notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scrape_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"status" text DEFAULT 'running' NOT NULL,
	"discovered_count" integer DEFAULT 0 NOT NULL,
	"inserted_count" integer DEFAULT 0 NOT NULL,
	"updated_count" integer DEFAULT 0 NOT NULL,
	"skipped_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"safe_error_summary" text,
	"run_metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "user_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"job_id" text NOT NULL,
	"is_saved" boolean DEFAULT false NOT NULL,
	"is_dismissed" boolean DEFAULT false NOT NULL,
	"application_stage" text DEFAULT 'saved' NOT NULL,
	"applied_at" timestamp with time zone,
	"follow_up_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "job_analyses" ADD CONSTRAINT "job_analyses_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_jobs" ADD CONSTRAINT "user_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_jobs" ADD CONSTRAINT "user_jobs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analysis_job_idx" ON "job_analyses" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "analysis_hash_provider_idx" ON "job_analyses" USING btree ("content_hash","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "source_job_unique_idx" ON "jobs" USING btree ("source","source_job_id");--> statement-breakpoint
CREATE INDEX "job_posted_at_idx" ON "jobs" USING btree ("posted_at");--> statement-breakpoint
CREATE INDEX "job_type_mode_idx" ON "jobs" USING btree ("employment_type","work_mode");--> statement-breakpoint
CREATE INDEX "job_company_idx" ON "jobs" USING btree ("company");--> statement-breakpoint
CREATE INDEX "job_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_content_hash_idx" ON "jobs" USING btree ("content_hash");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "profile_user_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "resume_user_idx" ON "resumes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_searches_user_idx" ON "saved_searches" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "scrape_runs_source_idx" ON "scrape_runs" USING btree ("source","started_at");--> statement-breakpoint
CREATE INDEX "scrape_runs_status_idx" ON "scrape_runs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_job_unique_idx" ON "user_jobs" USING btree ("user_id","job_id");--> statement-breakpoint
CREATE INDEX "user_job_stage_idx" ON "user_jobs" USING btree ("user_id","application_stage");--> statement-breakpoint
CREATE INDEX "user_job_saved_idx" ON "user_jobs" USING btree ("user_id","is_saved");