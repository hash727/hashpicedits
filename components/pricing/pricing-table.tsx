"use client";

import { useState } from "react";
import { Check, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";
import { cn } from "@/lib/utils";

type Interval = "MONTHLY" | "6MONTHS";

interface PricingProps {
  isPro: boolean;
}

export function PricingTable({ isPro }: PricingProps) {
  const [interval, setInterval] = useState<Interval>("MONTHLY");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleManageBilling = async () => {
    setIsLoading("manage");
    try {
      await createCustomerPortalSession();
    } catch (error) {
      console.error("Failed to open portal:", error);
      setIsLoading(null);
    }
  };

  const handleCheckout = async (planType: Interval) => {
    setIsLoading("checkout");
    try {
      await createCheckoutSession(planType);
    } catch (error) {
      console.error(error);
      setIsLoading(null);
    }
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Simple, transparent pricing
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Choose the plan that fits your workflow.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={cn("text-sm font-medium", interval === "MONTHLY" ? "text-slate-900 dark:text-white" : "text-slate-500")}>
            Monthly
          </span>
          <Switch
            checked={interval === "6MONTHS"}
            onCheckedChange={(checked) => setInterval(checked ? "6MONTHS" : "MONTHLY")}
          />
          <span className={cn("text-sm font-medium", interval === "6MONTHS" ? "text-slate-900 dark:text-white" : "text-slate-500")}>
            10 Months <span className="ml-1 text-indigo-600 text-xs font-bold uppercase">(Save ~16%)</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* --- FREE TIER --- */}
        <div className={cn(
          "relative rounded-2xl border bg-white p-8 shadow-sm flex flex-col transition-all",
          !isPro ? "border-indigo-600 ring-1 ring-indigo-600 shadow-md" : "border-slate-200"
        )}>
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide">
              Current Plan
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Free</h3>
            <p className="text-slate-500 text-sm mt-1">Perfect for hobbyists.</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">$0</span>
            <span className="text-slate-500">/mo</span>
          </div>
          
          <ul className="space-y-3 mb-8 flex-1">
            {["1 Project", "Basic Analytics", "Community Support"].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="h-4 w-4 text-indigo-600" /> {feat}
              </li>
            ))}
          </ul>

          {isPro ? (
             // If Pro, offer downgrade via Portal
            <Button 
              onClick={handleManageBilling} 
              variant="outline" 
              className="w-full hover:bg-slate-100"
              disabled={isLoading === "manage"}
            >
              {isLoading === "manage" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Downgrade"}
            </Button>
          ) : (
            // If Free, show disabled "Current Plan"
            <Button variant="secondary" disabled className="w-full bg-slate-100 text-slate-400">
              Current Plan
            </Button>
          )}
        </div>

        {/* --- PRO TIER --- */}
        <div className={cn(
          "relative rounded-2xl border p-8 shadow-2xl flex flex-col transition-all",
          isPro ? "border-indigo-500 bg-slate-900 ring-1 ring-indigo-500" : "border-indigo-600 bg-slate-900"
        )}>
          {isPro ? (
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide">
              Active Plan
            </div>
          ) : (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide">
              Most Popular
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <p className="text-indigo-200 text-sm mt-1">For serious creators.</p>
          </div>
          
          <div className="mb-6 text-white">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">
                {interval === "MONTHLY" ? "$9" : "$99"}
              </span>
              <span className="text-slate-400">
                /{interval === "MONTHLY" ? "mo" : "10mo"}
              </span>
            </div>
            <p className="text-xs text-indigo-300/80 mt-1 font-medium">
               approx. {interval === "MONTHLY" ? "₹840" : "₹9,200"}
            </p>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {["Unlimited Projects", "Advanced Analytics", "Priority Support"].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="bg-indigo-500/20 p-1 rounded-full">
                  <Check className="h-3 w-3 text-indigo-400" />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          {isPro ? (
            <Button 
              onClick={handleManageBilling}
              variant="outline"
              className="w-full border-indigo-500 text-indigo-400 hover:bg-indigo-950 hover:text-white"
              disabled={isLoading === "manage"}
            >
               {isLoading === "manage" ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                 <>
                   <Settings className="mr-2 h-4 w-4" /> Manage Subscription
                 </>
               )}
            </Button>
          ) : (
            <Button 
              onClick={() => handleCheckout(interval)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              disabled={isLoading === "checkout"}
            >
              {isLoading === "checkout" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Upgrade Now"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
