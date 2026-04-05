// components/editor/template-import-modal.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CopyPlus, FilePlus2 } from "lucide-react";

interface TemplateImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmNew: () => void; // Create new project
  onConfirmMerge: () => void; // Add to existing canvas
}

export function TemplateImportModal({ 
  isOpen, 
  onClose, 
  onConfirmNew, 
  onConfirmMerge 
}: TemplateImportModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>How would you like to use this template?</AlertDialogTitle>
          <AlertDialogDescription>
            You can start a completely new design with these dimensions, or add the template elements into your current project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="h-32 flex-col gap-3 border-2 hover:border-primary hover:bg-primary/5"
            onClick={onConfirmMerge}
          >
            <CopyPlus className="h-8 w-8 text-primary" />
            <div className="text-center">
              <p className="text-sm font-bold">Add to Current</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">Keep your existing work</p>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-32 flex-col gap-3 border-2 hover:border-primary hover:bg-primary/5"
            onClick={onConfirmNew}
          >
            <FilePlus2 className="h-8 w-8 text-emerald-600" />
            <div className="text-center">
              <p className="text-sm font-bold">Create New</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">Start fresh design</p>
            </div>
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
