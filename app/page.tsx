'use client'

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Zap, Layout, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide mb-6">
              V 2.0 IS NOW LIVE
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Design Anything.<br />Publish Everywhere.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              HasHPicEdits is the open-source creative suite for the modern web. 
              Create stunning visuals, edit photos, and manage templates with zero friction.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all hover:scale-105">
                  Start Creating <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full">
                  View Templates
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual / Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-2xl overflow-hidden">
  
              {/* 1. Browser Window Header */}
              <div className="h-12 border-b border-slate-800 flex items-center px-4 space-x-2 bg-slate-900/50">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                <div className="ml-4 px-3 py-1 rounded-md bg-slate-800/50 text-[10px] text-slate-500 font-mono border border-slate-700/50">
                  hashpicedits.com/editor/new
                </div>
              </div>

              {/* 2. Editor Workspace Grid */}
              <div className="flex h-[500px] md:h-[600px]">
                
                {/* Left Sidebar (Tools) */}
                <div className="w-16 border-r border-slate-800 flex flex-col items-center py-6 gap-6 bg-slate-900/30 z-10">
                  {[Layout, Layers, Zap, Download].map((Icon, i) => (
                    <div key={i} className="p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-400 transition-colors cursor-pointer">
                      <Icon className="w-5 h-5" />
                    </div>
                  ))}
                </div>

                {/* Center Canvas Area */}
                <div className="flex-1 bg-slate-950/50 relative flex items-center justify-center p-8 overflow-hidden">
                  
                  {/* Background Grid Pattern */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" 
                      style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                  />

                  {/* The "Canvas" (White Card) */}
                  <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-square bg-white rounded-sm shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                    
                    {/* Design Elements inside Canvas */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100" />
                    
                    {/* Circle Shape */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                    <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

                    {/* Text Content */}
                    <div className="relative z-10 text-center p-8">
                      <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-2">
                        SUMMER<br/>SALE
                      </h3>
                      <p className="text-slate-600 font-medium tracking-widest uppercase text-sm">Up to 50% Off</p>
                      <button className="mt-6 px-6 py-2 bg-black text-white font-bold rounded-full text-sm">Shop Now</button>
                    </div>

                    {/* Selection Box (Simulating active state) */}
                    <div className="absolute inset-12 border-2 border-indigo-500 rounded-sm pointer-events-none opacity-0 md:opacity-100">
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                    </div>

                  </div>

                  {/* Floating "AI Toolbar" (Simulating functionality) */}
                  <div className="absolute bottom-8 bg-slate-900/90 backdrop-blur border border-slate-700/50 p-2 rounded-full shadow-2xl flex gap-2 items-center px-4 animate-bounce-slow">
                    <span className="text-xs font-medium text-indigo-300">✨ AI Assistant</span>
                    <div className="h-4 w-[1px] bg-slate-700" />
                    <span className="text-xs text-slate-400">Remove Background</span>
                    <span className="text-xs text-slate-400">Upscale</span>
                  </div>

                </div>

                {/* Right Sidebar (Properties) - Hidden on Mobile */}
                <div className="hidden md:flex w-64 border-l border-slate-800 bg-slate-900/30 flex-col p-4 gap-4 z-10">
                  <div className="h-32 rounded-lg bg-slate-800/50 border border-slate-700/50" />
                  <div className="space-y-2">
                    <div className="h-2 w-12 rounded bg-slate-700/50" />
                    <div className="h-8 rounded bg-slate-800/50 border border-slate-700/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-12 rounded bg-slate-700/50" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded bg-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900" />
                      <div className="h-8 w-8 rounded bg-purple-500" />
                      <div className="h-8 w-8 rounded bg-pink-500" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            
          </motion.div>
        </div>
      </section>

      {/* --- FEATURE BENTO GRID --- */}
      <section className="py-24 bg-slate-950 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to create</h2>
            <p className="text-slate-400">Powerful tools wrapped in a simple interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Item */}
            <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition duration-300">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-6">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Templates</h3>
              <p className="text-slate-400 mb-6">Start with hundreds of pre-designed templates for Instagram, LinkedIn, and more. Customize them in seconds.</p>
              {/* Template Visual Container */}
              <div className="h-40 relative mt-4 group/cards flex items-center justify-center">
                
                {/* Card 1: Back (Rotated Left) */}
                <div className="absolute w-24 h-32 bg-slate-800 rounded-lg border border-slate-700 shadow-xl transform -rotate-12 translate-x-0 scale-90 opacity-60 transition-all duration-500 group-hover/cards:-translate-x-16 group-hover/cards:-rotate-12 group-hover/cards:opacity-100">
                  <div className="h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-t-lg" />
                  <div className="p-2 space-y-1">
                    <div className="h-1.5 w-8 bg-slate-600 rounded-full" />
                    <div className="h-1.5 w-12 bg-slate-700 rounded-full" />
                  </div>
                </div>

                {/* Card 2: Middle (Rotated Right) */}
                <div className="absolute w-24 h-32 bg-slate-800 rounded-lg border border-slate-700 shadow-xl transform rotate-6 translate-x-2 scale-95 opacity-80 z-10 transition-all duration-500 group-hover/cards:translate-x-16 group-hover/cards:rotate-12 group-hover/cards:opacity-100">
                  <div className="h-16 bg-gradient-to-br from-purple-600/20 to-pink-500/20 rounded-t-lg flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="h-1.5 w-10 bg-slate-600 rounded-full" />
                    <div className="h-1.5 w-14 bg-slate-700 rounded-full" />
                  </div>
                </div>

                {/* Card 3: Front (Hero) */}
                <div className="absolute w-24 h-32 bg-slate-900 rounded-lg border border-slate-600 shadow-2xl transform -rotate-3 z-20 transition-all duration-500 group-hover/cards:rotate-0 group-hover/cards:scale-110">
                  {/* Mini Design: "Summer Sale" */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="h-20 bg-gradient-to-br from-amber-500 to-orange-600 relative">
                        <div className="absolute bottom-2 left-2 text-[8px] font-black text-white uppercase tracking-wider">
                          New<br/>Season
                        </div>
                    </div>
                    <div className="p-2 bg-slate-900 h-full">
                      <div className="flex justify-between items-center mb-1">
                          <div className="text-[6px] text-slate-400">Instagram Post</div>
                          <div className="w-1 h-1 rounded-full bg-green-500" />
                      </div>
                      <div className="h-1.5 w-12 bg-slate-700 rounded-full mb-1" />
                      <button className="w-full py-0.5 bg-indigo-600 rounded-[2px] text-[5px] text-white font-medium text-center">
                          Edit Now
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Tall Item */}
            <div className="md:row-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition duration-300">
               <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Tools</h3>
              <p className="text-slate-400 mb-6">Remove backgrounds, upscale images, and generate assets.</p>
              <div className="aspect-square bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden group">
  
                {/* 1. Cyber Grid Background */}
                <div className="absolute inset-0 opacity-20" 
                    style={{ backgroundImage: 'linear-gradient(#db2777 1px, transparent 1px), linear-gradient(to right, #db2777 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>
                
                {/* 2. Central "Neural" Node */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  
                  {/* Glowing Orb */}
                  <div className="relative">
                      <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 animate-pulse" />
                      <div className="relative w-16 h-16 bg-slate-900 rounded-2xl border border-pink-500/50 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]">
                        {/* Lucide Icon: Sparkles or Brain */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-pink-400">
                            <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>
                        </svg>
                      </div>
                  </div>

                  {/* "Thinking" Dots */}
                  <div className="flex gap-1 mt-6">
                      <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>

                </div>

                {/* 3. "Coming Shortly" Badge */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-slate-950/90 backdrop-blur border border-slate-800 rounded-full py-1.5 px-4 flex items-center gap-2 shadow-xl">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          Coming Shortly
                      </span>
                  </div>
                </div>
                
                {/* 4. Scanning Line Animation (Optional Polish) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />

              </div>

            </div>

            {/* Small Item 1 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition duration-300">
               <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Layer Management</h3>
              <p className="text-slate-400">Complex compositions made simple with advanced layer tools.</p>
            </div>

            {/* Small Item 2 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition duration-300">
               <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Export</h3>
              <p className="text-slate-400">Export to PNG, JPG, SVG, or JSON in high resolution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 text-center">
        <div className="container mx-auto px-6">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} HasHPicEdits. Built for creators.
          </p>
        </div>
      </footer>

    </div>
  );
}
