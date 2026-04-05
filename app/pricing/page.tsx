import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PricingTable } from "@/components/pricing/pricing-table";
import { Navbar } from "@/components/usernavbar/navbar";
import { Footer } from "@/components/layout/footer";
import { UserButton } from "@/components/usernavbar/user-button";

export const metadata = {
  title: "Pricing - Upgrade to Pro",
  description: "Simple pricing for everyone.",
};

export default async function PricingPage() {
  const session = await auth();
  let isPro = false;

  // 1. Securely check the database for the plan
  // We do NOT rely on the cookie here to ensure accuracy
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    
    isPro = user?.plan === "PRO";
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar userButton={<UserButton />} />
      
      {/* 2. Pass the status to the Client Component */}
      <PricingTable isPro={isPro} />
      
      <Footer />
    </main>
  );
}
