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

  const session = event.data.object as Stripe.Checkout.Session;

  // 1. Handle Successful Checkout (First time purchase)
  if (event.type === "checkout.session.completed") {
    // Retrieve the full subscription object to get the end date
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // CRITICAL: Ensure the metadata contains our userId from createCheckoutSession
    const userId = session?.metadata?.userId;

    if (!userId) {
      return new NextResponse("User ID missing in metadata", { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "PRO", // Upgrade to Pro
        stripeSubscriptionId: subscription.id,
        stripeId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        // Stripe uses seconds, JS Date needs milliseconds
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });

    console.log(
      `✅ User ${userId} upgraded to PRO until ${new Date(subscription.current_period_end * 1000)}`,
    );
  }

  // 2. Handle Renewals or Period Updates (Automatic)
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await prisma.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        plan: "PRO",
        stripeCurrentPeriodEnd: new Date(
          (subscription as Stripe.Subscription).current_period_end * 1000,
        ),
      },
    });

    console.log(`🔄 Subscription ${subscription.id} renewed.`);
  }

  // 3. Handle Cancellations or Expired Payments
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        plan: "FREE", // Downgrade back to Free
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      },
    });

    console.log(`❌ Subscription ${subscription.id} cancelled/expired.`);
  }

  return new NextResponse(null, { status: 200 });
}
