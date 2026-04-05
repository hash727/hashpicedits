"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  const session = await auth();

  // 1. Security Guard: Check for ADMIN role
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { Role: true },
  });

  if (user?.Role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access only.");
  }

  // 2. Fetch User Metrics
  const [totalUsers, proUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "PRO" } }),
  ]);

  // 3. Fetch Revenue from Stripe
  // Note: This fetches the last 100 successful payments
  const payments = await stripe.paymentIntents.list({
    limit: 100,
  });

  const totalRevenue =
    payments.data
      .filter((p) => p.status === "succeeded")
      .reduce((acc, curr) => acc + curr.amount, 0) / 100; // Convert cents to currency

  return {
    totalUsers,
    proUsers,
    totalRevenue,
    conversionRate:
      totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : 0,
  };
}

// Fetch all users with basic info
export async function getAllUsers(search?: string) {
  const session = await auth();
  const admin = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { Role: true },
  });

  if (admin?.Role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      Role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Manually change a user's plan or role
export async function updateUserStatus(
  userId: string,
  data: { plan?: "FREE" | "PRO"; role?: "USER" | "ADMIN" },
) {
  const session = await auth();
  // ... include the same Admin check as above ...
  const admin = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { Role: true },
  });
  if (admin?.Role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: data,
  });

  revalidatePath("/admin");
  return { success: true };
}
