"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Undo2, Redo2 } from "lucide-react";
import Link from "next/link";
import { fabric } from "fabric";
import { ResizeModal } from "@/components/editor/resize-modal";
import { ResizeTool } from "@/components/editor/resize-tool";
import { ExportTool } from "@/components/editor/export-tool";
import { SavingStatus } from "./saving-status";
import { EditableTitle } from "@/components/editor/editable-title";
import { SaveTemplateDialog } from "@/components/templates/save-template-dialog";


interface NavbarProps {
  projectId: string;
  projectName: string;
  canvas: fabric.Canvas | null;
  selectedObject: any;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  fitScreen: () => void;
  isSaving: boolean
}

export function EditorNavbar({ 
  projectId, 
  projectName,
  canvas,  
  canUndo, 
  canRedo, 
  undo, 
  redo,
  fitScreen,
  isSaving 
}: NavbarProps) {
  // if (!selectedObject) return null;

  const exportImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2, // Double resolution for high quality
    });
    const link = document.createElement("a");
    link.download = "my-design.png";
    link.href = dataURL;
    link.click();
  };

  // const onSaveAsTemplate = async () => {
  //   try{
  //     await createTemplateFromProject(projectId);
  //     toast.success("Design added to Template Library!")
  //   } catch (error){
  //     console.error("Error creating Template: ",error)
  //     toast.error("Failed to create template")
  //   }
  // }
 
  return (
    <nav className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        {/* <span className="font-semibold text-sm">Untitled Design</span> */}
        <EditableTitle
          id={projectId}
          initialName={projectName || "Untitled Project"}
        />
        <div className="flex flex-col">
          <SavingStatus
            isSaving={isSaving}
          />
        </div>

        {/* <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-widest ml-4">
          <CloudCheck className="h-3 w-3 text-green-500" />
          Saved to Cloud
        </div> */}
      </div>
      {/* <TextToolbar selectedObject={selectedObject} canvas={canvas} /> */}
      {/* <SelectionToolbar selectedObject={selectedObject} canvas={canvas} /> */}
      {/* // Inside your Editor Navbar/Header */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={!canUndo} 
          onClick={undo}
          className="h-8 w-8"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={!canRedo} 
          onClick={redo}
          className="h-8 w-8"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ResizeTool 
          projectId={projectId} 
          canvas={canvas} 
          currentWidth={canvas?.width} 
          currentHeight={canvas?.height}
          fitScreen={fitScreen} // Pass your fit to screen function here
        />
      
        <ResizeModal
          projectId={projectId}
          canva={canvas}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">Share</Button>
        {/* <Button size="sm" onClick={exportImage} className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button> */}
      </div>
      {/* <Button 
        variant={'outline'}
        size={'sm'}
        onClick={onSaveAsTemplate}
      >
        Save as Template
      </Button> */}
      <SaveTemplateDialog
        projectId={projectId}
        canvas={canvas}
      />
      <ExportTool canvas={canvas} />
    </nav>
  );
}
