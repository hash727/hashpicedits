import { Navbar } from "@/components/usernavbar/navbar";
import { UserButton } from "@/components/usernavbar/user-button";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Navbar lives here, so it only appears for (main) routes */}
      <Navbar userButton={<UserButton />} />
      <main className="flex-1 relative z-0 pt-24">
        {children}
      </main>
    </div>
  );
}
