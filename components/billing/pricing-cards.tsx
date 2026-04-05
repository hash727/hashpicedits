"use client";

import { Check, Crown, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const FEATURES = [
  "Unlimited HD Exports (2x-3x)",
  "No Daily Export Limits",
  "Premium Elements & Stickers",
  "Custom Font Uploads",
  "Advanced Photo Filters",
  "No Watermarks",
];

export function PricingCards() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: "MONTHLY" | "6MONTHS") => {
    setLoadingPlan(plan);
    try {
      await createCheckoutSession(plan);
    } catch (error) {
      console.error(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-6">
      {/* --- MONTHLY PLAN --- */}
      <div className="relative flex flex-col p-8 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Pro Monthly</h3>
          <p className="text-sm text-slate-500 mt-2">Perfect for short-term projects.</p>
        </div>
        
        <div className="mb-6">
          <span className="text-4xl font-black">₹499</span>
          <span className="text-slate-500"> / month</span>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {f}
            </li>
          ))}
        </ul>

        <Button 
          variant="outline" 
          className="w-full h-12 text-md font-bold border-2"
          disabled={!!loadingPlan}
          onClick={() => handleSubscribe("MONTHLY")}
        >
          {loadingPlan === "MONTHLY" ? <Loader2 className="animate-spin h-5 w-5" /> : "Start 1 Month"}
        </Button>
      </div>

      {/* --- 6-MONTH PLAN (FEATURED) --- */}
      <div className="relative flex flex-col p-8 bg-white border-2 border-primary rounded-2xl shadow-xl scale-105 z-10">
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-widest">
          Save 20%
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Pro Semi-Annual</h3>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-sm text-slate-500 mt-2">Best value for power creators.</p>
        </div>
        
        <div className="mb-6">
          <span className="text-4xl font-black">₹2,499</span>
          <span className="text-slate-500"> / 6 months</span>
          <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">
            Only ₹416 per month
          </div>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
              <div className="bg-primary/10 p-0.5 rounded-full">
                <Check className="h-3 w-3 text-primary shrink-0" /> 
              </div>
              {f}
            </li>
          ))}
          <li className="flex items-center gap-3 text-sm font-bold text-primary italic">
            <Zap className="h-4 w-4 fill-primary" /> Priority Email Support
          </li>
        </ul>

        <Button 
          className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20"
          disabled={!!loadingPlan}
          onClick={() => handleSubscribe("6MONTHS")}
        >
          {loadingPlan === "6MONTHS" ? <Loader2 className="animate-spin h-5 w-5" /> : "Get 6 Months Pro"}
        </Button>
      </div>
    </div>
  );
}
