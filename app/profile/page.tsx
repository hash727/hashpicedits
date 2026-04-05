import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Ensure you have prisma imported
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, ShieldCheck, History } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // 1. Fetch fresh user data from DB to get the Plan status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-12">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, subscription, and billing.</p>
        </div>
        <Badge variant={user.plan === "PRO" ? "default" : "secondary"} className="h-6 px-4">
          {user.plan === "PRO" ? "PRO MEMBER" : "FREE PLAN"}
        </Badge>
      </div>

      <Separator />
      
      {/* SECTION 1: PROFILE INFO */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
            <div className="p-3 bg-slate-50 rounded-xl border font-medium">{user.name}</div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
            <div className="p-3 bg-slate-50 rounded-xl border font-medium text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SUBSCRIPTION & BILLING */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" /> Subscription Plan
        </h2>
        <div className="p-6 border rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-black text-xl">
              {user.plan === "PRO" ? "HashPic Pro" : "Free Tier"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.plan === "PRO" 
                ? "You have full access to all premium HD tools." 
                : "Upgrade to unlock HD exports and AI tools."}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             {user.plan === "PRO" ? (
               <Button variant="outline" className="rounded-full">Manage Subscription</Button>
             ) : (
               <Link href="/dashboard">
                 <Button className="rounded-full bg-primary hover:bg-primary/90 px-8">Upgrade Now</Button>
               </Link>
             )}
          </div>
        </div>
      </section>

      {/* SECTION 3: BILLING HISTORY */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" /> Billing History
          </h2>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-primary uppercase">
            Download All
          </Button>
        </div>
        <div className="border rounded-2xl overflow-hidden">
          <div className="p-4 text-center text-sm text-muted-foreground bg-slate-50/50">
            {/* You'll loop through your Stripe Invoices here later */}
            No recent invoices found.
          </div>
        </div>
      </section>

      {/* FOOTER ACTION */}
      <div className="pt-10 flex justify-end">
        <Button variant="destructive" className="rounded-full px-8 text-xs font-bold uppercase tracking-widest">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
