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

    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string,
    )) as unknown as Stripe.Subscription;

    const userId = session?.metadata?.userId;

    if (!userId) {
      return new NextResponse("User ID missing in metadata", { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "PRO",
        stripeSubscriptionId: subscription.id,
        stripeId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  // 2. Handle Renewals (Invoice Succeeded)
  if (event.type === "invoice.payment_succeeded") {
    // Type: Invoice (NOT Session)
    const invoice = event.data.object as Stripe.Invoice;

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

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
