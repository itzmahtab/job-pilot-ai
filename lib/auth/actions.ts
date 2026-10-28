"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { UserRepository } from "@/lib/repositories/user-repository";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function signInAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectUrl = (formData.get("redirect") as string) || "/dashboard";

  const validation = SignInSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: "Please correct the highlighted fields",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      return { error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    return { error: message };
  }

  redirect(redirectUrl);
}

export async function signUpAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = SignUpSchema.safeParse({ name, email, password });
  if (!validation.success) {
    return {
      error: "Please correct the highlighted fields",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      return { error: "An account with this email already exists" };
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}`;

    const newUser = await UserRepository.createUser({
      id: userId,
      email,
      name,
      passwordHash,
      role: "user",
    });

    await createSession({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create account";
    return { error: message };
  }

  redirect("/onboarding");
}

export async function demoSignInAction(): Promise<void> {
  // Demo Candidate user fixture
  await createSession({
    id: "usr_demo_developer_2026",
    email: "candidate.demo@jobpilot.local",
    name: "Alex Dev (Demo Candidate)",
    role: "user",
  });

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
