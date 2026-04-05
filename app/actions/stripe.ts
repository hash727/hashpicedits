"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// 1. Updated to accept planType
export async function createCheckoutSession(planType: "MONTHLY" | "6MONTHS") {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email)
    throw new Error("Unauthorized");

  // 2. Dynamically pick the Price ID based on the user's choice
  const priceId =
    planType === "MONTHLY"
      ? process.env.STRIPE_PRO_MONTHLY_PRICE_ID
      : process.env.STRIPE_PRO_6MONTHS_PRICE_ID;

  if (!priceId)
    throw new Error(`Price ID for ${planType} is not configured in .env`);

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  let stripeCustomerId = dbUser?.stripeId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name || undefined,
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeId: customer.id },
    });
  }

  // 3. Create Session with Plan Duration in Metadata
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    metadata: {
      userId: session.user.id,
      planType: planType, // Helps your webhook identify the plan
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }
}

export async function refreshUserStatus() {
  // This clears the Next.js Data Cache for the entire app
  revalidatePath("/", "layout");
  revalidateTag("user-session", "page");
}
