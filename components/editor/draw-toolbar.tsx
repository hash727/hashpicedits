"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pencil, Eraser, Undo2, Redo2, Paintbrush, Spline } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";

export function DrawToolbar({ canvas, setBrush, undo, redo, canUndo, canRedo }: any) {
  const [width, setWidth] = useState(10);
  const [color, setColor] = useState("#3b82f6"); // Default to a nice Pro Blue
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "brush" | "lasso">("pencil");

  const { enablePaintBrush, enableLasso } = useEditor(canvas);

  const handleToolChange = (type: any, newColor = color, newWidth = width) => {
    setActiveTool(type);
    
    if (type === "pencil" || type === "eraser") {
      setBrush({ type, color: newColor, width: newWidth });
    } else if (type === "brush") {
      enablePaintBrush(newColor, newWidth);
    } else if (type === "lasso") {
      enableLasso();
    }
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-white border rounded-full shadow-sm animate-in slide-in-from-top-1">
      {/* --- TOOL SELECTORS --- */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button 
          variant={activeTool === "pencil" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleToolChange("pencil")}
          className="h-8 w-8 p-0 rounded-full"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={activeTool === "brush" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleToolChange("brush")}
          className="h-8 w-8 p-0 rounded-full"
        >
          <Paintbrush className="h-4 w-4" />
        </Button>

        <Button 
          variant={activeTool === "lasso" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleToolChange("lasso")}
          className="h-8 w-8 p-0 rounded-full"
        >
          <Spline className="h-4 w-4" />
        </Button>

        <Button 
          variant={activeTool === "eraser" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleToolChange("eraser")}
          className="h-8 w-8 p-0 rounded-full"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      {/* --- SIZE & COLOR (Shared for Pen and Brush) --- */}
      {activeTool !== "lasso" && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase px-2">
                Size: {width}px
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-4">
              <Slider 
                defaultValue={[width]} 
                max={100} 
                min={1} 
                onValueChange={([v]) => {
                  setWidth(v);
                  handleToolChange(activeTool, color, v);
                }} 
              />
            </PopoverContent>
          </Popover>

          {activeTool !== "eraser" && (
            <div className="relative group">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => {
                  setColor(e.target.value);
                  handleToolChange(activeTool, e.target.value, width);
                }}
                className="w-6 h-6 rounded-full cursor-pointer border-2 border-white ring-1 ring-slate-200"
              />
            </div>
          )}
        </>
      )}

      <div className="h-6 w-[1px] bg-slate-200 mx-1" />

      {/* --- HISTORY --- */}
      <div className="flex gap-0.5">
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canUndo} onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canRedo} onClick={redo}>
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
