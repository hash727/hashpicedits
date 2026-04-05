// app/actions/auth-actions.ts
"use server";

import { signIn } from "@/auth";

export async function loginWithSocial(
  provider: "google" | "twitter" | "facebook",
) {
  await signIn(provider, { redirectTo: "/dashboard" });
}

export async function loginWithCredentials(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    // Auth.js throws redirects as errors, so re-throw them
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Invalid credentials" };
  }
}
