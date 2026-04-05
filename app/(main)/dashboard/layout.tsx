import { ConfettiCelebration } from "@/components/editor/confetti-celebration";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <ConfettiCelebration />
      </Suspense>
      {children}
    </div>
  );
}
