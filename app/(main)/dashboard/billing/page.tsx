import { PricingCards } from "@/components/billing/pricing-cards";
import { CompareTable } from "@/components/billing/compare-table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 1. Simple Navigation Header */}
      <header className="h-16 border-b bg-white flex items-center px-6 sticky top-0 z-50">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </header>

      {/* 2. Hero Section */}
      <div className="py-16 px-6 text-center">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Upgrade to <span className="text-primary">HashPic Pro</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Unlock high-definition exports, unlimited storage, and professional design tools to take your creativity to the next level.
        </p>
      </div>

      {/* 3. The Pricing Cards (Client Component) */}
      <section className="px-6">
        <PricingCards />
      </section>

      {/* 4. The Comparison Table (Client Component) */}
      <section className="px-6 mt-10">
        <CompareTable />
      </section>

      {/* 5. Simple Footer Trust Badges */}
      <footer className="text-center mt-10 space-y-2">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
          Secure Payment via Stripe
        </p>
        <div className="flex justify-center gap-4 opacity-30 grayscale">
            <img src="https://upload.wikimedia.org" alt="Stripe" className="h-5" />
        </div>
      </footer>
    </div>
  );
}
