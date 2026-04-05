"user server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import React from "react";

export const registerUser = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create the user
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // 2. Trigger the Auth.js Magic Link flow
  // This sends the email via the Resend provider configured in auth.ts
  await signIn("resend", { email, redirect: false });

  return { success: "Verification email sent!" };
};
