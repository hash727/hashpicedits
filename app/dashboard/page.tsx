import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DesignGrid } from "@/components/dashboard/design-grid";
import { Separator } from "@/components/ui/separator";
import { CreateFolderButton } from "@/components/dashboard/create-folder-button";
import { CreateProjectCard } from "@/components/dashboard/create-project-card";
import { FolderCard } from "@/components/dashboard/folder-list"; // Import this

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. Fetch Folders and Projects in parallel for speed
  const [folders, designs] = await Promise.all([
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

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Your Workspace</h1>
          <p className="text-muted-foreground text-sm">Organize and manage your professional designs.</p>
        </div>
        <div className="flex items-center gap-3">
          <CreateFolderButton /> 
          {/* <CreateProjectCard /> */}
        </div>
      </div>
      
      <Separator />

      {/* 2. FOLDERS SECTION (Horizontal Scroll or Grid) */}
      {folders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      )}

      {/* 3. RECENT DESIGNS SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Designs</h2>
        {/* Pass folders prop to DesignGrid so ProjectCards can show the "Move" menu */}
        <DesignGrid designs={designs as any} folders={folders} />
      </div>
    </div>
  );
}
