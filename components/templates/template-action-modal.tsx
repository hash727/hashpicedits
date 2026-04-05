// components/templates/template-action-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyPlus, FilePlus2, Loader2 } from "lucide-react";
import { createProjectAction, getUserProjects } from "@/app/actions/projects"; // Create this action to fetch user's last 5 projects
import { toast } from "sonner";

export function TemplateActionModal({ 
  template, 
  isOpen, 
  onClose 
}: { 
  template: any; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      getUserProjects().then(setProjects);
    }
  }, [isOpen]);

  const handleCreateNew = async () => {
    try {
        setLoading(true);
        
        // 1. Call the server action directly
        const result = await createProjectAction(template.id);
        
        // 2. Redirect to the newly created project ID
        router.push(`/editor/${result.id}`);
        
        toast.success("Project created successfully!");
    } catch (error) {
        console.error(error);
        toast.error("Failed to create project");
    } finally {
        setLoading(false);
    }
  };

  const handleMerge = (projectId: string) => {
    setLoading(true);
    // Redirect to editor with a merge flag
    router.push(`/editor/${projectId}?mergeTemplateId=${template.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {template && (
        <>
            
            <DialogHeader>
            <DialogTitle>How to use {template.name}?</DialogTitle>
            <DialogDescription>Choose to start fresh or add to a project.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
            <Button 
                variant="outline" 
                className="w-full h-20 justify-start gap-4 border-2 hover:border-primary"
                onClick={handleCreateNew}
                disabled={loading}
            >
                <FilePlus2 className="h-6 w-6 text-emerald-500" />
                <div className="text-left">
                <p className="font-bold">Create New Project</p>
                <p className="text-xs text-muted-foreground">Start a fresh design with this template</p>
                </div>
            </Button>

            {projects.length > 0 && (
                <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-slate-500">Add to Existing Project:</p>
                <input
                    type="text" 
                    placeholder="Search your projects..." 
                    className="w-full text-xs p-2 border rounded mb-2"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                    {filteredProjects.map((p) => (
                    <Button 
                        key={p.id} 
                        variant="ghost" 
                        className="w-full justify-between border italic text-xs h-10"
                        onClick={() => handleMerge(p.id)}
                        disabled={loading}
                    >
                        {p.name}
                        <CopyPlus className="h-4 w-4" />
                    </Button>
                    ))}
                </div>
                </div>
            )}
            </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
