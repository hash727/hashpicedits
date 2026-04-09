import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DesignGrid } from "@/components/dashboard/design-grid";
import { CreateFolderButton } from "@/components/dashboard/create-folder-button";
import { FolderCard } from "@/components/dashboard/folder-list"; 
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [user, folders, designs] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId
      },
      select:{
        plan: true,
      },
    }),
    prisma.folder.findMany({
      where: { userId },
      include: { _count: { select: { projects: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })
  ]);

  const isPro = user?.plan === "PRO";

  return (
    // 1. GLOBAL DARK WRAPPER
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      
      {/* Subtle Top Glow (Aurora Echo) */}
      <div className="fixed top-0 left-0 w-full h-64 bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="relative p-8 space-y-12 max-w-7xl mx-auto pt-24">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Workspace
            </h1>
            <p className="text-slate-400 text-lg">
              Welcome back, <span className="text-indigo-400">{session?.user?.name}</span>.
            </p>
          </div>
          
          {/* Primary Actions */}
          <div className="flex items-center gap-4">
            <CreateFolderButton />
            <Link href="/editor/new">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </Link>
          </div>
        </div>
        
        {/* --- FOLDERS SECTION --- */}
        {folders.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Folders
              </h2>
              <span className="text-xs text-slate-600">{folders.length} Active</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {folders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </div>
          </div>
        )}

        {/* --- RECENT DESIGNS SECTION --- */}
        <div className="space-y-6">
           <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Recent Projects
              </h2>
            </div>
          
          {/* Pass dark mode classes down if needed, or handle in component */}
          <DesignGrid 
            designs={designs as any} 
            folders={folders} 
            isPro={isPro}
          />
        </div>

      </div>
    </div>
  );
}
