// components/templates/template-action-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyPlus, FileEdit, FilePlus2, Loader2, Plus } from "lucide-react";
import { createProjectAction, updateProjectWithTemplate, getUserProjects } from "@/app/actions/projects"; // Create this action to fetch user's last 5 projects
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
}

export function TemplateActionModal({ 
  template, 
  isOpen, 
  onClose 
}: TemplateModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"SELECT_MODE" | "SELECT_PROJECT">("SELECT_MODE");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // const [searchQuery, setSearchQuery] = useState("");

  // Load projects when user chooses "Existing"
  useEffect(() => {
    if (mode === "SELECT_PROJECT" && projects.length === 0) {
      getUserProjects().then(setProjects);
    }
  }, [mode, projects.length]);

  // const filteredProjects = projects.filter((p) =>
  //   p.name.toLowerCase().includes(searchQuery.toLowerCase())
  // )

  // useEffect(() => {
  //   if (isOpen) {
  //     getUserProjects().then(setProjects);
  //   }
  // }, [isOpen]);

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

  // const handleMerge = (projectId: string) => {
  //   setLoading(true);
  //   // Redirect to editor with a merge flag
  //   router.push(`/editor/${projectId}?mergeTemplateId=${template.id}`);
  // };
  const handleOverwrite = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      await updateProjectWithTemplate(selectedProjectId, template.id);
      router.push(`/editor/${selectedProjectId}`)
    } catch (error) {
      console.log("Template - Porject merger error: ", error)
      toast.error("Failed to update project");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        {template && (
        <>
            <DialogHeader>
              <DialogTitle>How to use {template.name}?</DialogTitle>
              <DialogDescription>
                Choose to start fresh or add to a project.
              </DialogDescription>
            </DialogHeader>

            <div className="grid space-y-4 py-4">
              {mode === "SELECT_MODE" ? (

              <div className="grid grid-cols-2 gap-4">
               {/* OPTION 1: NEW PROJECT */}
                <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-500 dark:hover:bg-slate-900 transition-all group"
                    onClick={handleCreateNew}
                    disabled={loading}
                >
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">New Project</h3>
                      <p className="text-xs text-slate-500 mt-1">Start from scratch</p>
                    </div>
                </Button>

                {/* OPTION 2: EXISTING PROJECT */}
                  <Button
                    onClick={() => setMode("SELECT_PROJECT")}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50/50 dark:border-slate-800 dark:hover:border-amber-500 dark:hover:bg-slate-900 transition-all group"
                  >
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <FileEdit className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">Existing Project</h3>
                      <p className="text-xs text-slate-500 mt-1">Overwrite current design</p>
                    </div>
                  </Button>
                </div>
                ) : (
                   <div className="space-y-4 animate-in fade-in zoom-in-95">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500">Select Project to Overwrite</label>
                      <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project..." />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-red-500 font-medium">
                        ⚠️ Warning: This will replace all current layers in the selected project.
                      </p>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-2">
                      <Button variant="ghost" onClick={() => setMode("SELECT_MODE")}>Back</Button>
                      <Button 
                        onClick={handleOverwrite} 
                        disabled={!selectedProjectId || loading}
                        className="bg-indigo-600 hover:bg-indigo-500"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Apply Template"}
                      </Button>
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
