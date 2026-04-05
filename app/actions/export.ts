"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getExportSettings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const isPro = user?.plan === "PRO";

  return {
    isPro,
    // Pro gets 3x Scale (HD), Free gets 1x Scale (SD)
    multiplier: isPro ? 3 : 1,
    // Pro gets 100% quality, Free gets 60%
    quality: isPro ? 1 : 0.6,
    shouldWatermark: !isPro,
  };
}
