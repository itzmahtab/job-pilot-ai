import { eq, and, desc, sql, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";

export type NewJob = typeof jobs.$inferInsert;
export type Job = typeof jobs.$inferSelect;

export interface FindJobsParams {
  query?: string;
  workMode?: string;
  employmentType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const JobRepository = {
  async findById(id: string): Promise<Job | null> {
    const results = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return results[0] ?? null;
  },

  async findBySourceJobId(source: string, sourceJobId: string): Promise<Job | null> {
    const results = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.source, source), eq(jobs.sourceJobId, sourceJobId)))
      .limit(1);
    return results[0] ?? null;
  },

  async findMany(params: FindJobsParams = {}): Promise<Job[]> {
    const { workMode, employmentType, status = "active", limit = 50, offset = 0 } = params;

    const conditions = [];

    if (status) {
      conditions.push(eq(jobs.status, status));
    }
    if (workMode && workMode !== "all") {
      conditions.push(eq(jobs.workMode, workMode));
    }
    if (employmentType && employmentType !== "all") {
      conditions.push(eq(jobs.employmentType, employmentType));
    }

    return db
      .select()
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(jobs.postedAt), desc(jobs.firstSeenAt))
      .limit(limit)
      .offset(offset);
  },

  /**
   * Idempotently upserts a job record based on source and source_job_id
   */
  async upsert(jobData: NewJob): Promise<Job> {
    const existing = jobData.sourceJobId
      ? await this.findBySourceJobId(jobData.source, jobData.sourceJobId)
      : null;

    if (existing) {
      // Update freshness timestamps and content
      const [updated] = await db
        .update(jobs)
        .set({
          ...jobData,
          lastSeenAt: new Date(),
        })
        .where(eq(jobs.id, existing.id))
        .returning();
      return updated;
    }

    const [inserted] = await db.insert(jobs).values(jobData).returning();
    return inserted;
  },
};
