import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ProjectCard } from "@/components/dashboard/project-card"; // Reuse your existing card
import { Button } from "@/components/ui/button";
import { ChevronLeft, FolderOpen, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function FolderPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // 1. Fetch Folder & its Projects
  const folder = await prisma.folder.findUnique({
    where: { 
      id: id,
      userId: session.user.id // Security: Ensure user owns this folder
    },
    include: {
      projects: {
        orderBy: { updatedAt: "desc" }
      },
      _count: { select: { projects: true } }
    }
  });

  if (!folder) notFound();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER & NAVIGATION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FolderOpen className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Folder</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{folder.name}</h1>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <MoreHorizontal className="h-4 w-4" /> Folder Settings
        </Button>
      </div>

      {/* PROJECT GRID */}
      {folder.projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {folder.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50">
          <FolderOpen className="h-12 w-12 text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">This folder is empty</p>
          <Button variant="link" className="text-primary mt-2">Move projects here</Button>
        </div>
      )}
    </div>
  );
}
