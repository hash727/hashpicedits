import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 1. Handle New Subscriptions (Checkout Completed)
  if (event.type === "checkout.session.completed") {
    // Type: Session
    const session = event.data.object as Stripe.Checkout.Session;

    // 🛑 SAFETY CHECK: Ensure this is actually a subscription
    if (!session.subscription) {
      console.warn(
        `⚠️ Checkout Session ${session.id} is missing a Subscription ID. Mode was: ${session.mode}`,
      );
      // Return 200 to tell Stripe "We received it, but we don't need to do anything."
      return new NextResponse(null, { status: 200 });
    }

    try {
      console.log("👉 Starting Checkout Logic for Session:", session.id);

      const userId = session?.metadata?.userId;

      if (!userId) {
        return new NextResponse("User ID missing in metadata", { status: 400 });
      }
      console.log("👤 User ID found:", userId);

      const subscription: any = (await stripe.subscriptions.retrieve(
        session.subscription as string,
      )) as Stripe.Subscription;

      console.log("💳 Subscription retrieved:", subscription.id);

      // 1. Safe Date Calculation
      // If Stripe data is missing, fallback to 30 days from now to prevent crash
      const periodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Fallback: +30 days

      // 2. Debug Log (Check this in Vercel logs)
      console.log(
        `📅 Period End: ${periodEnd.toISOString()} (Raw: ${subscription.current_period_end})`,
      );

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          stripeSubscriptionId: subscription.id,
          stripeId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: periodEnd,
        },
      });

      console.log("✅ Database Updated Successfully for:", user.email);
    } catch (internalError: any) {
      // 🛑 THIS LOG WILL REVEAL THE BUG
      console.error("❌ CRASH IN CHECKOUT HANDLER:", internalError.message);
      // Return 200 anyway so Stripe doesn't retry endlessly while you debug
      return new NextResponse("Internal Logic Error (Logged)", { status: 200 });
    }
  }

  // 2. Handle Renewals (Invoice Succeeded)
  if (event.type === "invoice.payment_succeeded") {
    // Type: Invoice (NOT Session)
    const invoice = event.data.object as Stripe.Invoice;

    const subscription: any = (await stripe.subscriptions.retrieve(
      (invoice as any).subscription as string,
    )) as unknown as Stripe.Subscription;

    // Ensure we have a valid subscription ID before updating
    if (subscription.id) {
      await prisma.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          plan: "PRO", // Ensure they stay/become Pro on renewal
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
    }
  }

  // 3. Handle Cancellations (Subscription Deleted)
  if (event.type === "customer.subscription.deleted") {
    // Type: Subscription (NOT Session)
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        plan: "FREE",
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
