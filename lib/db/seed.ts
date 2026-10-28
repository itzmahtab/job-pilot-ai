import { db } from "./index";
import { users, profiles, jobs, userJobs } from "./schema";

export async function seedDatabase() {
  console.log("🌱 Starting JobPilot AI database seed (Deterministic fixtures)...");

  // 1. Seed demo user (No real personal data)
  const demoUserId = "usr_demo_developer_2026";
  await db
    .insert(users)
    .values({
      id: demoUserId,
      email: "candidate.demo@jobpilot.local",
      name: "Demo Developer",
      role: "user",
    })
    .onConflictDoNothing();

  // 2. Seed candidate profile
  await db
    .insert(profiles)
    .values({
      id: "prof_demo_developer_2026",
      userId: demoUserId,
      headline: "Junior Full-Stack Software Engineer",
      targetRoles: ["Frontend Engineer", "Full-Stack Engineer", "Software Intern"],
      seniorityPreference: "entry",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
      approxYearsExperience: "1.5",
      workModes: ["remote", "hybrid"],
      eligibleCountries: ["US", "CA", "GB", "EU"],
      preferredLocations: ["Remote", "New York, NY", "London, UK"],
      excludeKeywords: ["Senior", "Lead", "Staff", "Principal", "5+ years"],
      employmentTypes: ["full-time", "internship"],
    })
    .onConflictDoNothing();

  // 3. Seed initial jobs
  const sampleJobs = [
    {
      id: "job_hn_001",
      source: "hackernews",
      sourceJobId: "hn_item_394821",
      canonicalUrl: "https://news.ycombinator.com/item?id=394821",
      title: "Junior Frontend Engineer (React/Next.js)",
      company: "Veloce Technologies",
      location: "Remote (Global)",
      workMode: "remote",
      employmentType: "junior",
      experienceRequirement: "0-2",
      eligibleCountries: ["US", "CA", "GB", "EU"],
      requiredSkills: ["React", "Next.js", "TypeScript"],
      preferredSkills: ["Tailwind CSS", "GraphQL"],
      salaryMin: "65000",
      salaryMax: "80000",
      salaryCurrency: "USD",
      salaryInterval: "yearly",
      descriptionText:
        "Looking for a junior engineer to join our high-scale product team. You will build user-facing React applications.",
      postedAt: new Date(Date.now() - 2 * 3600 * 1000),
      status: "active",
      contentHash: "hash_veloce_frontend_001",
    },
    {
      id: "job_wf_002",
      source: "wellfound",
      sourceJobId: "wf_startup_98214",
      canonicalUrl: "https://wellfound.com/jobs/98214",
      title: "Full-Stack Software Engineering Intern",
      company: "CloudScale Systems",
      location: "New York, NY (Hybrid)",
      workMode: "hybrid",
      employmentType: "internship",
      experienceRequirement: "no_experience",
      eligibleCountries: ["US"],
      requiredSkills: ["TypeScript", "Node.js", "PostgreSQL"],
      preferredSkills: ["Docker", "Git"],
      salaryMin: "35",
      salaryMax: "42",
      salaryCurrency: "USD",
      salaryInterval: "hourly",
      descriptionText:
        "Join our summer internship cohort building resilient distributed cloud microservices.",
      postedAt: new Date(Date.now() - 5 * 3600 * 1000),
      status: "active",
      contentHash: "hash_cloudscale_intern_002",
    },
  ];

  for (const job of sampleJobs) {
    await db.insert(jobs).values(job).onConflictDoNothing();
  }

  // 4. Seed user job state
  await db
    .insert(userJobs)
    .values({
      id: "uj_demo_001",
      userId: demoUserId,
      jobId: "job_hn_001",
      isSaved: true,
      applicationStage: "interview",
      notes: "First technical round scheduled with frontend team.",
    })
    .onConflictDoNothing();

  console.log("✅ Database seed completed successfully.");
}
