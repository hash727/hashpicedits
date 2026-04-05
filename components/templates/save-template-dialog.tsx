"use client";

import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createTemplateFromProject } from "@/app/actions/templates";
import { toast } from "sonner";

const CATEGORIES = ["Social Media", "Posters", "Business", "Resume", "General"];

type SaveTemplateDialogProps ={
    projectId: string;
    canvas: fabric.Canvas | null;
}

export function SaveTemplateDialog({ 
    projectId,
    canvas
 }: SaveTemplateDialogProps) {
    
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const freshThumbnail = canvas?.toDataURL({
        format: 'jpeg',
        quality: 0.5,   // Low Quality is fine for sidebar preview
        multiplier: 0.2 // Scale down to save space
      });

      await createTemplateFromProject(projectId, category, freshThumbnail);
      toast.success("Design saved to template library!");
      setOpen(false);
    } catch (error) {
      console.error("Error Creating Template: ", error)
      toast.error("Failed to save template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Save as Template</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">
              Select Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Confirm Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
