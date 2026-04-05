"use client";

import { MoreVertical, ExternalLink, Calendar, Layers, FolderInput, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuPortal, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { moveProjectToFolder } from "@/app/actions/projects";
import { useState } from "react";
import { RenameProjectDialog } from "./rename-project-dialog";

export function ProjectCard({ project, folders = [] }: any) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const handleMove = async (folderId: string | null) => {
    try {
      await moveProjectToFolder(project.id, folderId);
      toast.success(folderId ? "Moved to folder" : "Moved to main dashboard");
    } catch (error) {
      toast.error("Failed to move project");
    }
  };

  return (
    <div className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all border-slate-200">
      {/* 1. PROJECT PREVIEW */}
      <Link href={`/editor/${project.id}`}>
        <div className="aspect-video bg-slate-100 flex items-center justify-center relative cursor-pointer group-hover:bg-slate-200 transition-colors">
          <Layers className="h-10 w-10 text-slate-300" />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ExternalLink className="h-6 w-6 text-white" />
          </div>
        </div>
      </Link>

      {/* 2. PROJECT INFO */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col gap-1 overflow-hidden">
          <Link href={`/editor/${project.id}`}>
            <h3 className="font-bold text-sm truncate hover:underline cursor-pointer">
              {project.name}
            </h3>
          </Link>
          <div 
            className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter"
            suppressHydrationWarning
          >
            <Calendar className="h-3 w-3" />
            {new Date(project.updatedAt).toLocaleDateString()}
            <span>•</span>
            <span>{project.width}x{project.height}</span>
          </div>
        </div>

        {/* 3. SETTINGS DROPDOWN (Fixed & Merged) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/editor/${project.id}`} className="cursor-pointer">Open in Editor</Link>
            </DropdownMenuItem>

            {/* --- MOVE TO FOLDER SUB-MENU --- */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 cursor-pointer">
                <FolderInput className="h-4 w-4" /> Move to folder
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleMove(null)} className="cursor-pointer">
                    <Check className={`mr-2 h-4 w-4 ${!project.folderId ? "opacity-100" : "opacity-0"}`} />
                    Main Dashboard
                  </DropdownMenuItem>
                  {folders.map((f: any) => (
                    <DropdownMenuItem key={f.id} onClick={() => handleMove(f.id)} className="cursor-pointer">
                      <Check className={`mr-2 h-4 w-4 ${project.folderId === f.id ? "opacity-100" : "opacity-0"}`} />
                      {f.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <RenameProjectDialog
          projectId={project.id}
          currentName={project.name}
          open={isRenameOpen}
          onOpenChange={setIsRenameOpen}
        />
      </div>
    </div>
  );
}
