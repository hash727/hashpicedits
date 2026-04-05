// components/editor/selection-toolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { motion, useDragControls } from "framer-motion";

import { 
  Trash2, 
  Type, 
  Palette, 
  PaintBucket,
  Layers, 
  Maximize, 
  ArrowUp, 
  ArrowDown, 
  Minimize, 
  Copy,
  SlidersHorizontal,
  Wand2,
  FlipHorizontal,
  ChevronDown,
  FlipVertical,
  Group,
  Ungroup,
  MousePointer2,
  Crop,
  Check,
  Lock,
  Unlock,
  Pipette,
  History, 
  GripVertical,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { TextToolbar } from "./text-toolbar";
import { fabric } from "fabric";
import { useRef, useState } from "react";
import { useEditor } from "@/hooks/use-editor";
import { ShadowTool } from "./shadow-tool";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { BorderSettings } from "./border-settings";
import { cn } from "@/lib/utils";
import { GradientSettings } from "./gradient-settings";

// Define indexes to keep filters organized
const FILTER_INDEXES = {
  brightness: 0,
  contrast: 1,
  saturation: 2,
  blur: 0
};

const PRESET_COLORS = ["#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

interface SelectionToolbarProps {
  selectedObject: any;
  canvas: any;
  applyGradient: (options:{
    type: "linear" | "radial";
    color1: string;
    color2: string;
    angle: number;
  }) => void;
  flipHorizontal: () => void;
  flipVertical: () => void,
  groupObjects: () => void;
  ungroupObjects: () => void;
  applyShadow: (options: any) => void;
  toggleLock: any;
  updateStrokeWidth: any;
  updateStrokeColor: any;
  updateStrokeStyle: any;
  updateStrokeOpacity: any;
  updateCornerRadius: any;
  resetBorder: any;
  handleEyedropper: any;
  recentColors: string[];
  changeColor: (color: string) => void;
}

export function SelectionToolbar({ 
  selectedObject, 
  canvas, 
  applyGradient,
  flipHorizontal, 
  flipVertical,
  groupObjects,
  ungroupObjects,
  applyShadow,
  toggleLock,
  updateStrokeWidth,
  updateStrokeColor,
  updateStrokeStyle,
  updateStrokeOpacity,
  updateCornerRadius,
  resetBorder,
  handleEyedropper,
  recentColors = [],
  changeColor,
}: SelectionToolbarProps) {
   const constraintsRef = useRef(null); // Optional: constrain to specific parent [3]
   const dragControls = useDragControls();

   const initialBrightness = (selectedObject?.filters?.[FILTER_INDEXES.brightness] as any)?.brightness * 100 || 0;
   const [brightness, setBrightness] = useState(initialBrightness);
   const [activeTool, setActiveTool] = useState("select");
   const [isProcessing, setIsProcessing] = useState(false);

   const isDropperSupported = typeof window !== "undefined" && "EyeDropper" in window;

  //  check if the object is currently locked?
  const isLocked = selectedObject?.lockMovementX;

   const { enterCropMode, isCropMode, applyCrop } = useEditor(canvas)
  if (!selectedObject) return null;
  
  
  // const isText = selectedObject.type === "i-text" || selectedObject.type === "text";
  const isText = ["i-text", "text", "textbox"].includes(selectedObject?.type || "");

  // const isText = selectedObject.type === "i-text";
  
  // Logic: is this a multi-selection?
  const isMultiSelect = selectedObject.type === "activeSelection";
  // Logic: Is this a group?
  const isGroup = selectedObject.type === "group";


   // const changeColor = (color: string) => {
  //   selectedObject.set("fill", color);
  //   canvas.renderAll();
  //   canvas.fire("object:modified"); // Triggers auto-save
  // };

  const deleteObject = () => {
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const colors = ["#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

  // Layering Functions
  const bringToFront = () => {
    selectedObject.bringToFront();
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const sendToBack = () => {
    selectedObject.sendToBack();
    // Ensure the background/clipPath stays at the bottom if you have one
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const bringForward = () => {
    selectedObject.bringForward();
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const sendBackward = () => {
    selectedObject.sendBackwards();
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  // 1. Duplicate Logic
  const duplicateObject = () => {
    selectedObject.clone((cloned: any) => {
      canvas.discardActiveObject();
      cloned.set({
        left: cloned.left + 20, // Offset so the user sees it
        top: cloned.top + 20,
        evented: true,
      });
      if (cloned.type === "activeSelection") {
        cloned.canvas = canvas;
        cloned.forEachObject((obj: any) => canvas.add(obj));
        cloned.setCoords();
      } else {
        canvas.add(cloned);
      }
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      canvas.fire("object:modified");
    });
  };

  // 2. Opacity Logic
  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0] / 100;
    selectedObject.set("opacity", newOpacity);
    canvas.renderAll();
    canvas.fire("object:modified");
  };





const applyAdjustment = (property: string, value: number) => {
  // 1. Cast to a local variable to "detach" it from the strict prop check
  const img = selectedObject as fabric.Image;
  if (!img || img.type !== "image") return;

  // 2. Ensure the filters array exists on the local reference
  const currentFilters = [...(img.filters || [])];
  const val = value / 100;

  let filter;
  switch (property) {
    case "brightness":
      filter = new fabric.Image.filters.Brightness({ brightness: val });
      // 3. Update the local array reference
      currentFilters[FILTER_INDEXES.brightness] = filter;
      setBrightness(val);
      break;
    case "contrast":
      filter = new fabric.Image.filters.Contrast({ contrast: val });
      //  update the local array reference
      currentFilters[FILTER_INDEXES.contrast] = filter;
      break;
    case "blur":
      filter = new fabric.Image.filters.Blur({ blur: val });
      currentFilters[FILTER_INDEXES.blur] = filter;
      break;
  }

  // 4. Re-assign the array to the object using Fabric's internal 'set'
  img.set("filters", currentFilters);
  
  // 5. Finalise
  img.applyFilters();
  canvas.renderAll();
  canvas.fire("object:modified");
};

const currentFill = selectedObject?.fill as string;

  
  return (
    // <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200 flex-wrap">
    // <div className="flex items-center gap-2 p-1.5 bg-white border rounded-xl shadow-lg animate-in fade-in zoom-in duration-200 w-fit mx-auto flex-wrap">
    <motion.div 
      drag
      // ✅ Constraint Options:
      // Option A: Screen boundaries in pixels [4]
       dragConstraints={{ left: -1000, right: 24, top: 24, bottom: 800 }} 
      
      // Option B: Snap back to start if dragged too far [11]
      dragElastic={0.1} 

      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      className={cn(
        "absolute top-6 right-6 z-[50]", // Floating position [46]
        "flex flex-col items-center gap-3 p-2", // Vertical stack [72]
        "bg-white/90 backdrop-blur-sm border rounded-2xl shadow-2xl",
        // "w-14",
        "max-h-[85vh] overflow-y-auto",
        // --- HIDE SCROLLBAR LOGIC ---
        "ms-overflow-style-none",           // IE and Edge [5]
        "[scrollbar-width:none]",           // Firefox [12]
        "[&::-webkit-scrollbar]:hidden",     // Chrome, Safari, and Opera [44]
        "scrollbar-none",
        "animate-in fade-in slide-in-from-right-4 duration-300"
      )}
    >

      {/* --- DRAG HANDLE --- */}
      <div 
        onPointerDown={(e) => dragControls.start(e)} // Trigger drag [1]
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded-md transition-colors"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      <Separator orientation="horizontal" className="w-8" />

      {/* Border tool */}
      <BorderSettings 
        selectedObject={selectedObject}
        updateStrokeWidth={updateStrokeWidth}
        updateStrokeColor={updateStrokeColor}
        updateStrokeStyle={updateStrokeStyle}
        updateStrokeOpacity={updateStrokeOpacity}
        updateCornerRadius={updateCornerRadius}
        resetBorder={resetBorder}
      />
      <Separator orientation="vertical" />
      
      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <div 
              className="w-4 h-4 rounded-full border" 
              style={{ backgroundColor: selectedObject.fill as string }} 
            />
            Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="grid grid-cols-4 gap-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                className={cn(
                  "w-5 h-5 rounded-full border border-slate-200 transition hover:scale-110",
                  currentFill === c && "ring-2 ring-primary ring-offset-1"
                )}
                style={{ backgroundColor: c }}
                onClick={() => changeColor(c)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

       {/* Main Color Popover (For custom colors) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border ml-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: currentFill }} 
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
             <input 
                type="color" 
                value={currentFill} 
                onChange={(e) => changeColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
          </PopoverContent>
        </Popover>

        {/* --- RECENT COLORS BOX --- */}
        {recentColors.length > 0 && (
          <div className="flex flex-col items-center gap-2 w-full">
            <Separator orientation="horizontal" className="w-8" />
            
            <div className="flex flex-col items-center p-2 bg-slate-50/80 rounded-xl border border-slate-100 shadow-inner w-full">
              <div className="flex gap-2 items-center justify-center mb-2">
                <History className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500">
                  Recently used colors
                </span> 
              </div>

              {/* 2-Column Grid for compact storage */}
              <div className="grid grid-cols-4 gap-1.5">
                {recentColors.slice(0, 8).map((color: string) => (
                  <button
                    key={color}
                    onClick={() => changeColor(color)}
                    className="w-4 h-4 rounded-md border border-white shadow-sm hover:scale-110 transition-transform shrink-0"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      
      {isDropperSupported && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleEyedropper}
          className="h-8 w-8 rounded-full border border-dashed hover:bg-slate-50"
          title="Pick color from screen"
        >
          <Pipette className="h-4 w-4 text-slate-600" />
        </Button>
      )}

      <Separator orientation="horizontal" className="w-8" />
      {/* Shadow tool */}
      <ShadowTool
        selectedObject={selectedObject}
        canvas={canvas}
        applyShadow={applyShadow}
      />

      {isText && (
        <>
          <TextToolbar 
            selectedObject={selectedObject as fabric.IText} 
            canvas={canvas} 
          />
          <Button variant="outline" size="sm" onClick={() => {
            const current = selectedObject.fontWeight;
            selectedObject.set("fontWeight", current === "bold" ? "normal" : "bold");
            canvas.renderAll();
          }}>
            <Type className="h-4 w-4" />
            {selectedObject.fontWeight === "bold" ? "Bold" : "Normal"}
          </Button>
        </>
      )}

      {/* <Button variant="ghost" size="icon" onClick={deleteObject} className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button> */}
    
    {/* Opacity Slider */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-[10px] font-bold">{Math.round(selectedObject.opacity * 100)}%</span>
            Opacity
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4">
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-medium">
              <span>Transparency</span>
              <span>{Math.round(selectedObject.opacity * 100)}</span>
            </div>
            <Slider 
              defaultValue={[selectedObject.opacity * 100]} 
              max={100} 
              step={1} 
              onValueChange={handleOpacityChange} 
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* 2. Gradient Color Picker */}
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline"><PaintBucket className="h-4 w-4 mr-2" /> Gradient</Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3 space-y-3">
          <p className="text-[10px] font-bold uppercase">Linear Gradient</p>
          <div className="flex gap-2">
            <input type="color" onChange={(e) => applyGradient(e.target.value, "#ffffff")} />
            <input type="color" onChange={(e) => applyGradient("#000000", e.target.value)} />
          </div>
        {/* </ScrollArea> 
        </PopoverContent>
      </Popover> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 border-2">
            <PaintBucket className="h-4 w-4" /> Gradient
          </Button>
        </PopoverTrigger>
        
        {/* Pass the applyGradient function to the settings component */}
        <GradientSettings onApply={applyGradient} />
      </Popover>

      {/* MIRROR / FLIP TOOL */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8">
            <FlipHorizontal className="h-4 w-4" />
            Flip
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={flipHorizontal} className="gap-2">
            <FlipHorizontal className="h-4 w-4" /> Flip Horizontal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={flipVertical} className="gap-2">
            <FlipVertical className="h-4 w-4" /> Flip Vertical
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Group Button: Show when 2+ items are selected */}
      {isMultiSelect && (
        <Button variant="outline" size="sm" className="gap-2 h-8" onClick={groupObjects}>
          <Group className="h-4 w-4" />
          Group
        </Button>
      )}

      {/* UNGROUP BUTTON: Show when a group is selected */}
      {isGroup && (
        <Button variant="outline" size="sm" className="gap-2 h-8" onClick={ungroupObjects}>
          <Ungroup className="h-4 w-4" />
          Ungroup
        </Button>
      )}

      {/* Duplicate Button */}
      <Button variant="outline" size="sm" onClick={duplicateObject} className="gap-2">
        <Copy className="h-4 w-4" />
        Duplicate
      </Button>


    {/* Layering Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Layers className="h-4 w-4" />
            Layer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={bringToFront} className="gap-2">
            <Maximize className="h-4 w-4" /> Bring to Front
          </DropdownMenuItem>
          <DropdownMenuItem onClick={bringForward} className="gap-2">
            <ArrowUp className="h-4 w-4" /> Bring Forward
          </DropdownMenuItem>
          <DropdownMenuItem onClick={sendBackward} className="gap-2">
            <ArrowDown className="h-4 w-4" /> Send Backward
          </DropdownMenuItem>
          <DropdownMenuItem onClick={sendToBack} className="gap-2">
            <Minimize className="h-4 w-4" /> Send to Back
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selection & Crop */}
      <div className="flex items-center gap-2 px-2">
        {!isCropMode ? (
          <Button onClick={enterCropMode} variant="outline" className="w-full">
            <Crop className="w-4 h-4" /> Crop Image
          </Button>
        ) : (
          /* The UI block you requested */
          <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-lg border border-dashed border-primary/50 animate-in fade-in zoom-in">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Crop Mode Active
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Adjust the purple box over your image and click apply.
            </p>
            <Button 
              size="sm" 
              onClick={applyCrop} 
              className="w-full h-8 gap-2 bg-primary hover:bg-primary/90 mt-1"
            >
              <Check className="h-4 w-4" /> Apply Crop
            </Button>
          </div>
        )}
        </div>
        

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Adjust
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase text-slate-500">Brightness</label>
            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border text-primary">         
                {brightness > 0 ? `+${brightness * 100}` : brightness * 100}
              </span>
            </div>
            {/* 2. THE CENTERED SLIDER CONFIG */}
            <div className="relative pt-2">
              {/* Optional: Visual Center Notch (Canva Style) */}
              <div className="absolute left-1/2 top-0 h-1.5 w-0.5 bg-slate-300 -translate-x-1/2" />

                <Slider 
                  key={`bright-${selectedObject.id}`}
                  defaultValue={[brightness]} 
                  min={-100} 
                  max={100} 
                  step={1}
                  className="cursor-pointer"
                  onValueChange={([v]) => applyAdjustment("brightness", v)} 
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground px-1">
                <span>-100</span>
                <span>0</span>
                <span>100</span>
              </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase text-slate-500">Blur</label>
              <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border text-primary">         
                  {
                    (() => {
                      // 1. Safely access the contrast value
                      const blurVal = (selectedObject?.filters?.[FILTER_INDEXES.blur] as any)?.blur;
                      
                      // 2. If it's not a number (undefined/null), return 0
                      const displayValue = Math.round((blurVal || 0) * 100);
                      
                      // 3. Format with a '+' for positive values for a Pro look
                      return displayValue > 0 ? `+${displayValue}` : displayValue;
                    })()
                  }
              </span>
            </div>
            <Slider 
              defaultValue={[0]} 
              min={0} 
              max={100} 
              step={5}
              onValueChange={([v]) => applyAdjustment("blur", v)} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase text-slate-500">Contrast</label>
            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border text-primary">         
                {
                  (() => {
                    // 1. Safely access the contrast value
                    const contrastVal = (selectedObject?.filters?.[FILTER_INDEXES.contrast] as any)?.contrast;
                    
                    // 2. If it's not a number (undefined/null), return 0
                    const displayValue = Math.round((contrastVal || 0) * 100);
                    
                    // 3. Format with a '+' for positive values for a Pro look
                    return displayValue > 0 ? `+${displayValue}` : displayValue;
                  })()
                }
              </span>
            </div>
            <Slider 
              defaultValue={[0]} 
              min={0} 
              max={100} 
              step={10}
              onValueChange={([v]) => applyAdjustment("contrast", v)} 
            />
          </div>
        </PopoverContent>
      </Popover> 

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isLocked ? "default" : "outline"}
            size="sm"
            onClick={toggleLock}
            className={`h-8 w-8 p-0 ${isLocked ? "bg-amber-500 hover:bg-amber-600" : ""}`}
          >
            {isLocked ? (
              <Lock className="h-4 w-4 text-white" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{isLocked ? "Unlock Layer" : "Lock Layer"}</p>
        </TooltipContent>
      </Tooltip>     

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => {
          canvas.remove(selectedObject);
          canvas.discardActiveObject();
          canvas.renderAll();
        }} 
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
