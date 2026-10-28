import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "jobpilot_session";
const DEFAULT_SECRET = "jobpilot-secret-key-32-character-minimum-development";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || DEFAULT_SECRET
);

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export interface SessionPayload {
  user: SessionUser;
  expiresAt: string;
}

/**
 * Signs and sets a secure HTTP-only session cookie
 */
export async function createSession(user: SessionUser): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

/**
 * Reads and verifies the current session from HTTP-only cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Removes the session cookie
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Helper for Server Actions & Route Handlers to enforce authentication
 * Throws an unauthorized error if no valid session exists
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}
