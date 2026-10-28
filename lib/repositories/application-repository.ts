import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { userJobs, jobs } from "@/lib/db/schema";

export type UserJob = typeof userJobs.$inferSelect;
export type NewUserJob = typeof userJobs.$inferInsert;

export const ApplicationRepository = {
  async getUserApplications(userId: string) {
    return db
      .select({
        userJob: userJobs,
        job: jobs,
      })
      .from(userJobs)
      .innerJoin(jobs, eq(userJobs.jobId, jobs.id))
      .where(eq(userJobs.userId, userId))
      .orderBy(desc(userJobs.updatedAt));
  },

  async setStage(
    userId: string,
    jobId: string,
    stage: "saved" | "planned" | "applied" | "interview" | "offer" | "rejected",
    notes?: string
  ): Promise<UserJob> {
    const existing = await db
      .select()
      .from(userJobs)
      .where(and(eq(userJobs.userId, userId), eq(userJobs.jobId, jobId)))
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(userJobs)
        .set({
          applicationStage: stage,
          notes: notes !== undefined ? notes : existing[0].notes,
          appliedAt: stage === "applied" ? new Date() : existing[0].appliedAt,
          updatedAt: new Date(),
        })
        .where(eq(userJobs.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userJobs)
      .values({
        id: `uj_${Date.now()}`,
        userId,
        jobId,
        applicationStage: stage,
        notes: notes ?? null,
        appliedAt: stage === "applied" ? new Date() : null,
      })
      .returning();
    return created;
  },

  async toggleSave(userId: string, jobId: string): Promise<UserJob> {
    const existing = await db
      .select()
      .from(userJobs)
      .where(and(eq(userJobs.userId, userId), eq(userJobs.jobId, jobId)))
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(userJobs)
        .set({
          isSaved: !existing[0].isSaved,
          updatedAt: new Date(),
        })
        .where(eq(userJobs.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userJobs)
      .values({
        id: `uj_${Date.now()}`,
        userId,
        jobId,
        isSaved: true,
      })
      .returning();
    return created;
  },
};
