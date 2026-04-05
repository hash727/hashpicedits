'use client'

import Link from "next/link";
// import { UserButton } from "./user-button"; 
import { Rocket, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps{
  userButton: React.ReactNode;
}

export function Navbar({
  userButton
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Scroll Effect: Add border/background only after scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Templates", href: "/templates" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-slate-950/80 backdrop-blur-md border-slate-800 py-4" 
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* --- BRAND LOGO --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
             <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            HashPic<span className="text-indigo-400">Edits</span>
          </span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-400 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* --- ACTIONS --- */}
        <div className="hidden md:flex items-center gap-4">
           {/* Wrapper for your existing UserButton to style it if needed */}
           {/* <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium transition">
                Sign In
              </Link>
              <Link href="/signup">
                 <Button size="sm" className="bg-white text-slate-900 hover:bg-indigo-50 rounded-full px-6 font-semibold shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]">
                    Get Started
                 </Button>
              </Link> */}
              {/* Only show this if logged in */}
              {userButton}
           {/* </div> */}
        </div>

        {/* --- MOBILE MENU TOGGLE --- */}
        <button 
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-4 md:hidden shadow-2xl animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
             <Link 
               key={link.name} 
               href={link.href}
               className="text-lg font-medium text-slate-300 hover:text-indigo-400"
               onClick={() => setMobileMenuOpen(false)}
             >
               {link.name}
             </Link>
          ))}
          <div className="h-px bg-slate-800 my-2" />
          <Button className="w-full bg-indigo-600 text-white">Get Started</Button>
        </div>
      )}

    </header>
  );
}
