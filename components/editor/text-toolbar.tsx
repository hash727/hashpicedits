"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { fabric } from "fabric";
import { 
    Type, 
    Layers as ShadowIcon, 
    Palette, 
    Square,
    Highlighter,
    Italic,
    Bold, 
    Orbit,
    Underline,
    CaseSensitive,
    Weight,
    AlignRight,
    AlignCenter,
    AlignLeft,
    RotateCcw,
    BetweenVerticalEnd,
    X,
    AlignJustify,
    AlignLeftIcon
} from "lucide-react";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const QUICK_SIZES = [12, 16, 24, 32, 48, 72, 96, 144];

export function TextToolbar({ selectedObject, canvas }: { selectedObject: fabric.IText, canvas: fabric.Canvas }) {

  if (!selectedObject) return null;

  //  SAFETY CHECK: Ensure it's a text type object
  // const isText = selectedObject.type === "i-text" || selectedObject.type === "text";
  const isText = ["i-text", "text", "textbox"].includes(selectedObject?.type || "");
  if (!isText) return null;
  
  const currentAlign = selectedObject.textAlign || "left";

  const currentSize = selectedObject.fontSize || 32;
 

  // 3. Implementation: Gradient Filling
  const applyGradient = () => {
    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels', // or 'percentage'
      coords: { x1: 0, y1: 0, x2: selectedObject.width, y2: 0 },
      colorStops: [
        { offset: 0, color: '#ec4899' }, // Pink-500
        { offset: 1, color: '#8b5cf6' }  // Violet-500
      ]
    });
    selectedObject.set("fill", gradient);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  // 4. Implementation: Curved Text (Simplified Pro Logic)
  // Note: For a true curve, we manipulate the 'path' property in Fabric 5.x
  const applyTextCurve = (value: number, obj: any, canvas: any) => {
    if (!obj || !canvas) return;

    if (value === 0) {
      obj.set("path", undefined);
    } else {
      // Math: High value = flatter curve, Low value = tighter curve [12]
      const radius = 1000 / (value / 10);
      const path = new fabric.Path(
        `M 0 0 A ${radius} ${radius} 0 0 1 ${obj.width} 0`, 
        { visible: false }
      );
      obj.set("path", path);
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const toggleBold = () => {
    const isBold = selectedObject.fontWeight === "bold";
    selectedObject.set("fontWeight", isBold ? "normal" : "bold");
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const toggleItalic = () => {
    const isItalic = selectedObject.fontStyle === "italic";
    selectedObject.set("fontStyle", isItalic ? "normal" : "italic");
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const toggleUnderline = () => {
    const isUnderline = selectedObject.underline;
    selectedObject.set("underline", !isUnderline);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const applyFontWeight = (weight: number, obj: fabric.IText, canvas: fabric.Canvas) => {
    // Fabric supports numeric weights (100, 400, 700, 900) or strings
    obj.set("fontWeight", weight);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const applyLetterSpacing = (spacing: number, obj: fabric.IText, canvas: fabric.Canvas) => {
    // Value is usually between -100 and 500 for readable results
    obj.set("charSpacing", spacing);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const applyTextAlign = (align: "left" | "center" | "right" | "justify", obj: fabric.IText, canvas: fabric.Canvas) => {
    // Fabric.js handles the geometry recalculation automatically [15]
    obj.set("textAlign", align);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const applyLineHeight = (value: number, obj: fabric.IText, canvas: fabric.Canvas) => {
    if (!obj || !canvas) return;

    // Standard range is 0.5 to 3.0 [15]
    obj.set("lineHeight", value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const applyTextBackground = (color: string, obj: fabric.IText, canvas: fabric.Canvas) => {
    if (!obj || !canvas) return;

    // Set the background color (supports hex, rgb, or 'transparent') [1]
    obj.set("textBackgroundColor", color);
    
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const applyFontSize = (size: number, obj: fabric.IText, canvas: fabric.Canvas) => {
    if (!obj || !canvas) return;

    // 1. Apply the new numeric size [1]
    obj.set("fontSize", size);
    
    // 2. Force recalculation of the bounding box and controls [52]
    obj.setCoords(); 
    
    canvas.renderAll();
    canvas.fire("object:modified");
  };


  return (
    <Popover>
      {/* --- MASTER TRIGGER BUTTON --- */}
      <PopoverTrigger asChild>
        <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 rounded-xl border border-transparent hover:border-indigo-200"
        >
          <Type className="h-4 w-4" />
          <span className="font-medium text-xs hidden sm:inline">Text Tools</span>
        </Button>
      </PopoverTrigger>

      {/* --- EXPANDED MENU CONTENT --- */}
      <PopoverContent side="top" align="center" className="w-80 p-0 shadow-2xl border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50/50 border-b p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Typography</span>
            <div className="flex gap-1">
               <span className="text-[10px] bg-slate-100 border px-1.5 py-0.5 rounded font-mono text-slate-500">
                  {currentSize}px
               </span>
            </div>
        </div>
        
        <ScrollArea className="h-[400px] p-4">
            <div className="space-y-6">
                
                {/* 1. SIZE & STYLE */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Size</label>
                    </div>
                    <Slider 
                        min={8} max={200} step={1}
                        defaultValue={[currentSize]}
                        onValueChange={([v]) => applyFontSize(v, selectedObject, canvas)} 
                    />
                    
                    <div className="flex items-center gap-2 pt-1">
                        {/* B / I / U Group */}
                        <div className="flex bg-slate-100 p-1 rounded-lg border flex-1 justify-between">
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7", selectedObject.fontWeight === "bold" && "bg-white shadow-sm text-indigo-600")} onClick={toggleBold}><Bold className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7", selectedObject.fontStyle === "italic" && "bg-white shadow-sm text-indigo-600")} onClick={toggleItalic}><Italic className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7", selectedObject.underline && "bg-white shadow-sm text-indigo-600")} onClick={toggleUnderline}><Underline className="h-3.5 w-3.5" /></Button>
                        </div>

                         {/* Align Group */}
                         <div className="flex bg-slate-100 p-1 rounded-lg border flex-1 justify-between">
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7", currentAlign === "left" && "bg-white shadow-sm")} onClick={() => applyTextAlign("left", selectedObject, canvas)}><AlignLeft className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7", currentAlign === "center" && "bg-white shadow-sm")} onClick={() => applyTextAlign("center", selectedObject, canvas)}><AlignCenter className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7", currentAlign === "right" && "bg-white shadow-sm")} onClick={() => applyTextAlign("right", selectedObject, canvas)}><AlignRight className="h-3.5 w-3.5" /></Button>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* 2. ADVANCED PROPERTIES */}
                <div className="space-y-4">
                     {/* Weight */}
                     <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex gap-2 items-center">
                                <Weight className="h-3 w-3" /> Weight
                            </label>
                            <span className="text-[10px] font-mono text-slate-600">{selectedObject.fontWeight}</span>
                        </div>
                        <Slider 
                            min={100} max={900} step={100}
                            defaultValue={[typeof selectedObject.fontWeight === 'number' ? selectedObject.fontWeight : 400]}
                            onValueChange={([v]) => applyFontWeight(v, selectedObject, canvas)} 
                        />
                     </div>

                     {/* Spacing */}
                     <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex gap-2 items-center">
                                <CaseSensitive className="h-3 w-3" /> Spacing
                            </label>
                            <span className="text-[10px] font-mono text-slate-600">{selectedObject.charSpacing || 0}</span>
                        </div>
                        <Slider 
                            min={-50} max={300} step={10}
                            defaultValue={[selectedObject.charSpacing || 0]}
                            onValueChange={([v]) => applyLetterSpacing(v, selectedObject, canvas)} 
                        />
                     </div>

                     {/* Line Height */}
                     <div className="space-y-1.5">
                        <div className="flex justify-between">
                             <label className="text-[10px] font-bold text-slate-400 uppercase flex gap-2 items-center">
                                <BetweenVerticalEnd className="h-3 w-3" /> Height
                            </label>
                            <span className="text-[10px] font-mono text-slate-600">{selectedObject.lineHeight || 1}</span>
                        </div>
                        <Slider 
                            min={0.5} max={2.5} step={0.1}
                            defaultValue={[selectedObject.lineHeight || 1]}
                            onValueChange={([v]) => applyLineHeight(v, selectedObject, canvas)} 
                        />
                     </div>
                </div>

                <Separator />

                {/* 3. EFFECTS & DECORATION */}
                <div className="space-y-4">
                    {/* Curve */}
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-slate-400 uppercase flex gap-2 items-center">
                                <Orbit className="h-3 w-3" /> Curve
                            </label>
                            <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px] text-red-500" onClick={() => applyTextCurve(0, selectedObject, canvas)}>
                                Reset
                            </Button>
                         </div>
                         <Slider 
                            min={-100} max={100} step={5}
                            onValueChange={([v]) => applyTextCurve(v, selectedObject, canvas)} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        {/* Highlight */}
                         <div className="flex items-center gap-2 p-2 border rounded-lg bg-slate-50">
                             <Highlighter className="h-4 w-4 text-slate-400" />
                             <div className="flex-1 relative h-6 rounded overflow-hidden border cursor-pointer">
                                 <input 
                                    type="color" 
                                    value={selectedObject.textBackgroundColor || "#ffffff"} 
                                    onChange={(e) => applyTextBackground(e.target.value, selectedObject, canvas)}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/2 -left-1/2 p-0 border-0"
                                 />
                             </div>
                             {selectedObject.textBackgroundColor && (
                                 <button onClick={() => applyTextBackground("", selectedObject, canvas)} className="text-slate-400 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                 </button>
                             )}
                         </div>

                         {/* Gradient */}
                         <Button variant="outline" className="h-full justify-start gap-2 text-xs" onClick={applyGradient}>
                             <Palette className="h-4 w-4 text-purple-500" />
                             Gradient
                         </Button>
                    </div>
                </div>

            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
