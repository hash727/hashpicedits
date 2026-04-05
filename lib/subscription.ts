import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getSubscriptionStatus() {
  const session = await auth();
  if (!session?.user) return { isPro: false };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  });

  if (!user) return { isPro: false };

  // A user is Pro if their plan is PRO and their period hasn't ended (+ 1 day grace)
  const isPro =
    user.plan === "PRO" &&
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

  return { isPro: !!isPro };
}
