"use client";

import { MoreVertical, ExternalLink, Calendar, Layers, FolderInput, Check, Loader2, Trash2, AlertTriangle, Crown } from "lucide-react";
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
import { deleteProject, moveProjectToFolder } from "@/app/actions/projects";
import { useState, useTransition } from "react";
import { RenameProjectDialog } from "./rename-project-dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ProjectCardProps{
  project: any;
  folders?: any[];
  isPro: boolean;
}

export function ProjectCard({ 
  project, 
  folders = [],
  isPro,
 }: ProjectCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // State for Type-to-Confirm
  const [confirmText, setConfirmText] = useState("");

  const router = useRouter()

  // 1. THE GATEKEEPER FUNCTION
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPro) {
      setShowDeleteDialog(true);
    } else {
      setShowUpgradeDialog(true);
    }
  };

  const handleDelete = async () => {
    
    // Optional: Add a real Dialog for confirmation if preferred
    // const confirmed = window.confirm("Are you sure you want to delete this project?");
    // if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Project deleted");
        setShowDeleteDialog(false);
      }
    });
  };

  const handleMove = async (folderId: string | null) => {
    try {
      await moveProjectToFolder(project.id, folderId);
      toast.success(folderId ? "Moved to folder" : "Moved to main dashboard");
    } catch (error) {
      toast.error("Failed to move project");
    }
  };

  // Loading State (Optimistic UI)
  if (isPending) {
    return (
      <div className="h-[280px] rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <span className="text-xs font-medium">Deleting...</span>
      </div>
    );
  }

  return (
    <>
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
            <DropdownMenuItem 
              onClick={onDeleteClick}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" /> 
                    {isPro ? "Delete" : "Delete (Pro)"}
                    {!isPro && <Crown className="ml-auto h-3 w-3 text-amber-500" />}
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

     {/* 3. PROFESSIONAL ALERT DIALOG (Outside the card to avoid z-index issues) */}
      <AlertDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete 
              <span className="font-bold text-slate-900"> {project.name} </span> 
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* Type-to-Confirm Input */}
          <div className="py-4 space-y-3">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Type <span className="text-slate-900 font-bold select-all"> {project.name} </span> to confirm:
            </Label>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project.name}
              className="border-red-200 focus-visible:ring-red-500"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={confirmText !== project.name || isPending}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "I understand, delete this project"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* 3. FREE USER: UPSELL MODAL */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
               <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">Unlock Deletion</DialogTitle>
            <DialogDescription className="pt-2">
              Project management features like <strong>Deletion</strong> and <strong>Archiving</strong> are available exclusively on the Pro plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)}>
              Keep Project
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              onClick={() => router.push("/pricing")}
            >
              Upgrade to Pro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
