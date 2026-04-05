import Link from "next/link";
import { UserButton } from "./user-button"; // Your UserButton component
import { Rocket } from "lucide-react";

export function Navbar() {
  return (
    <nav className="h-16 border-b bg-white flex items-center px-8 shrink-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* LEFT SIDE: Brand/Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="bg-primary p-1.5 rounded-xl">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            HashPic<span className="text-primary text-sm">.pro</span>
          </span>
        </Link>

        {/* MIDDLE: Optional Links (Navigation) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-primary">Projects</Link>
          <Link href="/templates" className="text-sm font-bold text-slate-600 hover:text-primary">Templates</Link>
        </div>

        {/* RIGHT SIDE: The User Button */}
        <div className="flex items-center gap-4">
          {/* You can add a 'New Project' button here too */}
          <UserButton />
        </div>

      </div>
    </nav>
  );
}
