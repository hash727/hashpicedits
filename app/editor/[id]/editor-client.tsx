// app/editor/[id]/editor-client.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric"; // Ensure you've run: npm install fabric@5.3.0
import { EditorNavbar } from "./navbar";
import { EditorSidebar } from "./sidebar";
import { Loader2, RefreshCw } from "lucide-react";
import { useAutosave } from "@/hooks/use-autosave";
import { Button } from "@/components/ui/button"
import { SelectionToolbar } from "@/components/editor/selection-toolbar";
import { ZoomControls } from "./zoom-controls";
import { useHistory } from "@/hooks/use-history";
import { useGuidelines } from "@/hooks/use-guidelines";
import { useEditor } from "@/hooks/use-editor";
import { DrawToolbar } from "@/components/editor/draw-toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";


export function EditorClient({ 
  initialData, 
  projectId, 
  width, 
  height,
  userPlan,
  initialName,
}: {
  initialData: any,
  projectId: string,
  width: number,
  height: number,
  userPlan: 'FREE' | 'PRO',
  initialName: string,
}) {
  const [isReady, setIsReady] = useState(false);
  const isPro = userPlan === 'PRO';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const isInitialized = useRef(false);

  const { saveHistory, undo, redo, canUndo, canRedo } = useHistory(canvas);
  const { 
    fitScreen,
    applyGradient, 
    flipHorizontal, 
    flipVertical, 
    groupObjects, 
    ungroupObjects,
    setBrush,
    applyShadow, 
    toggleLock,
    applyFilterPreset,
    addImageToSelectedShape,
    enterEditFrame,
    exitEditFrame,
    isEditingFrame,
    handleFrameSnapping,
    handleObjectScaling,
    updateStrokeWidth,
    updateStrokeColor,
    updateStrokeStyle,
    updateStrokeOpacity,
    updateCornerRadius,
    resetBorder,
    changeColor,
    recentColors,
    handleEyedropper,
    loadTemplateData,
  } = useEditor(canvas);

  const searchParams = useSearchParams();
  const router = useRouter();
  const mergeId = searchParams.get("mergeTemplateId");
  const hasMerged = useRef(false); // Prevent infinite merge loops

  const { setupGuidelines } = useGuidelines(canvas);

  // Initialize Autosave
  useAutosave(canvas, projectId);

  useEffect(() => {
    if (!canvasRef.current || isInitialized.current) return;

    // Ensure initialData is valid Object, not a string
    const parsedData = typeof initialData === "string"
      ? JSON.parse(initialData)
      : initialData;

      let isDisposed = false;   // Flag to track if cleanup has run


    // 1. Initialize Fabric Canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    (window as any).canvas = fabricCanvas;

    try {
      
      fabricCanvas.loadFromJSON(parsedData, () => {
        // clearTimeout(timeout)
        if(isDisposed) return;

        fabricCanvas.renderAll();
        setCanvas(fabricCanvas);
        setLoading(false);
        isInitialized.current = true;

        // Initial Zoom Fit
        const workspaceRatio = fabricCanvas.width! / fabricCanvas.height!;
        // Simple fit logic (you can enhance this via useEditor hook)
        if(containerRef.current) {
           // Fit logic here if needed
        }
      });
    } catch (error) {
       console.error("Critical error during loadFromJSON:", error);
       setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      isDisposed = true;
      fabricCanvas.dispose();
      isInitialized.current = false;
    };
  }, [initialData, width, height]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the user pressed Delete or Backspace
       if ((e.key === "Delete" || e.key === "Backspace") && canvas) {
        // Prevent deleting if editing text
        const activeObj = canvas.getActiveObject();
        if(activeObj && (activeObj.type === 'i-text' || activeObj.type === 'textbox') && (activeObj as any).isEditing) return;

        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          canvas.discardActiveObject(); // Clear selection
          canvas.remove(...activeObjects); // Remove all selected items
          canvas.renderAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canvas]);

  // 2. Selection Tracking
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      setSelectedObject(canvas.getActiveObject());
    };

    const handleClear = () => {
      setSelectedObject(null);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleClear);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleClear);
    };
  }, [canvas]);

  // 3. Guidelines & History
  useEffect(() => {
    if(canvas){
       setupGuidelines()
    };
  }, [canvas, setupGuidelines]);

  useEffect(() => {
    if (!canvas) return;

    const handleModified = () => saveHistory();
    
    canvas.on("object:modified", handleModified);
    canvas.on("object:added", handleModified);
    // canvas.on("object:removed", handleModified);

    return () => {
      canvas.off("object:modified", handleModified);
      canvas.off("object:added", handleModified);
      // canvas.off("object:removed", handleModified);
    };
  }, [canvas, saveHistory]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
  
    const imageUrl = e.dataTransfer.getData("imageUrl");
    const type = e.dataTransfer.getData("imageType");

    if (type === "uploaded-image" && imageUrl && canvas) {
      // 1. Get the drop coordinates relative to the canvas
      const pointer = canvas.getPointer(e.nativeEvent);

      // 2. SMART DETECTION: Is the user dropping the image ON TOP of a shape?
      // findTarget returns the object under the cursor
      const target = canvas.findTarget(e.nativeEvent, false);

      // If target exists and is NOT an image/text, we "Frame" it
      if (target && target.type !== "image" && target.type !== "i-text") {
        // Set target as active so addImageToSelectedShape knows what to frame
        canvas.discardActiveObject();
        canvas.setActiveObject(target);

        addImageToSelectedShape(imageUrl);
        return; 
      }

      // 2. Add image to Fabric
      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: pointer.x,
          top: pointer.y,
          originX: 'center',
          originY: 'center',
        });
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        canvas.fire("object:modified"); // Trigger auto-save
      }, { crossOrigin: "anonymous" });
    }
  }


  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
    const isModKey = e.ctrlKey || e.metaKey;
    // 1. Ensure we have a canvas and aren't typing in an input/textarea
    if (!canvas || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // 2. Group: Ctrl + G
    if (isModKey && e.key === "g") {
      e.preventDefault();
      groupObjects();
    }

    // 3. Ungroup: Ctrl + Shift + G
    if (isModKey && e.shiftKey && e.key === "g") {
      e.preventDefault();
      ungroupObjects();
    }

    // 4. Undo: Ctrl + Z
    if (isModKey && e.key === "z") {
      e.preventDefault();
      undo();
    }

    // 5. Redo: Ctrl + Y (Windows standard) or Ctrl + Shift + Z
    if (isModKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
      e.preventDefault();
      redo();
    }

    // 6. ESC: Exit Drawing Mode & Deselect (The Feature You Asked For)
      if (e.key === "Escape") {
        e.preventDefault();
        
        // If drawing, stop drawing
        if (canvas.isDrawingMode) {
          canvas.isDrawingMode = false;
        }
        
        // Also clear any active selection
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);

}, [canvas, groupObjects, ungroupObjects, undo, redo]); // Dependencies are vital!



useEffect(() => {
    // Only run if we have a mergeId, a working canvas, and haven't merged yet
    if (mergeId && canvas && !hasMerged.current) {
      const fetchAndMerge = async () => {
        try {
          // 1. Fetch the template JSON from your database/API
          const response = await fetch(`/api/templates/${mergeId}`);
          if (!response.ok) throw new Error("Failed to fetch template");
          
          const template = await response.json();
          const templateData = typeof template.json === 'string' 
            ? JSON.parse(template.json) 
            : template.json;

          // 2. Convert JSON objects to Fabric Objects
          fabric.util.enlivenObjects(
            templateData.objects,
            (objects: fabric.Object[]) => {
              // Create a group to make them easier to move initially
              const group = new fabric.Group(objects, {
                left: 50,
                top: 50,
              });

              canvas.add(group);
              canvas.setActiveObject(group);
              canvas.renderAll();
              
              // 3. Mark as merged and clean the URL (optional but recommended)
              hasMerged.current = true;
              toast.success(`Merged ${template.name} into project`);
              
              // Trigger autosave
              canvas.fire("object:modified");

              // Remove the merge ID from URL without refreshing
              const params = new URLSearchParams(searchParams);
              params.delete("mergeTemplateId");
              router.replace(`?${params.toString()}`, { scroll: false });
            },
            null!, // Namespace
            undefined   // Reviver
          );
        } catch (error) {
          console.error("Merge error:", error);
          toast.error("Could not merge template");
        }
      };

      fetchAndMerge();
    }
  }, [mergeId, canvas, searchParams, router]);

  // app/editor/[id]/editor-client.tsx

  useEffect(() => {
    if (!canvas) return;

    const handleDblClick = (options: fabric.IEvent) => {

      // Chek for subtargets in case the object is grouped
      const target = (options.subTargets && options.subTargets[0] || options.target);

      // 2. DIAGNOSTIC LOG: See exactly what Fabric found
      console.log("DblClick Target:", {
        type: target?.type,
        isFrame: (target as any)?._isFrame,
        hasUrl: !!(target as any)?._originalImage
      });

      // CHANGE: Detect our custom '_isFrame' property on the shape
      if (target && (target as any)._isFrame) {
        canvas.setActiveObject(target);
        enterEditFrame();
      }else{
        console.warn("Target is missing '_isFrame' property. Was it saved correctly?");
      }
    };

    canvas.on("mouse:dblclick", handleDblClick);
    return () => {
      canvas.off("mouse:dblclick", handleDblClick);
    };
  }, [canvas, enterEditFrame]);

  // Enter Key to Save Position
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isEditingFrame) {
        exitEditFrame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditingFrame, exitEditFrame]);

  // Snap during repositioning
  useEffect(() => {
    if (!canvas || !isEditingFrame) return;

    const onObjectMoving = (options: fabric.IEvent) => {
      if (options.target) {
        handleFrameSnapping(options.target);
      }
    };

    canvas.on("object:moving", onObjectMoving);
    return () => {
      canvas.off("object:moving", onObjectMoving);
    };
  }, [canvas, isEditingFrame, handleFrameSnapping]);

  useEffect(() => {
    if (!canvas || !isEditingFrame) return;

    const handleClickOutside = (options: fabric.IEvent) => {
      // 1. If the user clicks the background (no target) 
      // or selects a different object entirely, exit the edit mode
      if (!options.target || options.target !== canvas.getActiveObject()) {
        exitEditFrame();
      }
    };

    canvas.on("mouse:down", handleClickOutside);

    // 2. Wrap cleanup in curly braces to return 'void' for TypeScript [2]
    return () => {
      canvas.off("mouse:down", handleClickOutside);
    };
  }, [canvas, isEditingFrame, exitEditFrame]);

  useEffect(() => {
    if (!canvas) return;

    const onScaling = (e: fabric.IEvent) => {
      if (e.target) handleObjectScaling(e.target);
    };

    // Listen for real-time scaling updates [30, 32]
    canvas.on("object:scaling", onScaling);

    return () => {
      canvas.off("object:scaling", onScaling);
    };
  }, [canvas, handleObjectScaling]);

  
  const { isSaving } = useAutosave(canvas, projectId);

  // if (loading) {
  //   return <EditorSkeleton />;
  // }
  



  return (
    <TooltipProvider delayDuration={0}>
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
        
        <EditorNavbar 
          projectId={projectId}
          projectName={initialName}
          canvas={canvas} 
          selectedObject={selectedObject} 
          canUndo={canUndo}
          canRedo={canRedo}
          undo={undo}
          redo={redo}
          fitScreen={fitScreen}
          isSaving={isSaving}
        />

      

      {/* Sidebar section */}
      <div className="flex-1 flex h-full overflow-hidden ">
        <aside className="w-[400px] flex-shrink-0 border-r border-slate-200 bg-white z-20" >
          <EditorSidebar 
            canvas={canvas} 
            selectedObject={selectedObject}
            isPro={isPro}
            applyFilterPreset={applyFilterPreset}
          />
        </aside>

        {/* MAIN CANVAS AREA  */}
        <main 
          className=" flex-1 relative bg-slate-100 overflow-hidden"
          onDragOver={(e) => e.preventDefault()} //Required to allow drop
          onDrop={onDrop}
        >

          {/* Centering Container */}
          <div 
            ref={containerRef} 
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            
              {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-100/50">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              )}
             {/* The Actual Fabric Canvas */}
             <div className="shadow-2xl border border-slate-200 bg-white">
                <canvas ref={canvasRef} />
             </div>
          </div>

          {/* Floating Draw Toolbar */}
          {canvas?.isDrawingMode && ( 
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
              <DrawToolbar
                canvas={canvas}
                setBrush={setBrush}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          )}

          {/* Dynamic Selection Toolbar */}
          
          {/* 2. SECONDARY TOOLBAR (Only shows when something is selected) */}
          {selectedObject && !canvas?.isDrawingMode && (
            <div className="h-12 border-b bg-white flex items-center px-4 shrink-0 z-40">
              <SelectionToolbar 
                selectedObject={selectedObject} 
                canvas={canvas}
                applyGradient={applyGradient}
                flipHorizontal={flipHorizontal} 
                flipVertical={flipVertical}
                applyShadow={applyShadow}
                groupObjects={groupObjects}
                ungroupObjects={ungroupObjects}
                toggleLock={toggleLock}
                updateStrokeWidth={updateStrokeWidth}
                updateStrokeColor={updateStrokeColor}
                updateStrokeStyle={updateStrokeStyle}
                updateStrokeOpacity={updateStrokeOpacity}
                updateCornerRadius={updateCornerRadius}
                resetBorder={resetBorder}
                changeColor={changeColor}
                recentColors={recentColors}
                handleEyedropper={handleEyedropper}
              />
            </div>
          )}


          {/* ZOOM CONTROLS (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-50">
              <ZoomControls canvas={canvas} />
            </div>
          
        </main>
      </div>

      
    </div>
    {isEditingFrame && (
      <div className="absolute Bottom-20 right-1/2 translate-x-1/2 z-50">
        <Button 
          onClick={exitEditFrame} 
          className="bg-purple-600 hover:bg-purple-700 shadow-xl gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Done Repositioning
        </Button>
      </div>
      )}
    </TooltipProvider>
  );
}
