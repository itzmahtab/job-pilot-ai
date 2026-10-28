import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "./session";

export async function requireSessionUser(
  pathname: string
): Promise<SessionUser> {
  const session = await getSession();

  if (!session?.user) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return session.user;
}
