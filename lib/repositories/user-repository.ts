import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, profiles } from "@/lib/db/schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export const UserRepository = {
  async findById(id: string): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return results[0] ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return results[0] ?? null;
  },

  async createUser(data: NewUser): Promise<User> {
    const [created] = await db.insert(users).values(data).returning();
    return created;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const results = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    return results[0] ?? null;
  },

  async upsertProfile(
    userId: string,
    data: Partial<NewProfile>
  ): Promise<Profile> {
    const [saved] = await db
      .insert(profiles)
      .values({
        id: `prof_${Date.now()}`,
        userId,
        ...data,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
      .returning();

    return saved;
  },
};
