"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export function ConfettiCelebration() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      // 1. Trigger the "Pro" Celebration
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => 
        Math.random() * (max - min) + min;

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Shoot from left and right corners
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        });
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        });
      }, 250);

      // 2. Show a welcoming toast
      toast.success("Welcome to Pro!", {
        description: "All HD features and unlimited exports are now unlocked.",
        duration: 5000,
      });

      // 3. Optional: Clean up the URL (Removes the ?success=true)
      window.history.replaceState({}, "", window.location.pathname);

      setTimeout(() => {
        // This clears the Next.js client-side cache and re-fetches user status
        window.location.reload(); 
      }, 2500);
    }
  }, [success, router]);

  return null; // This component handles logic, no UI needed
}
