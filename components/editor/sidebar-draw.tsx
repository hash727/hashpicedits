"use client";

import { useEffect, useState } from "react";
import { 
  Pencil, 
  Paintbrush, 
  Eraser, 
  Spline, 
  Undo2, 
  Redo2,
  Trash2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface SidebarDrawProps {
  canvas: any;
  setBrush: (opts: {
    type: string;
    color?: string;
    width: number;
  }) => void;
  undo: () => void;
  redo: () => void;
  enablePaintBrush: any;
  enableLasso: any;
}

export function SidebarDraw({ 
  canvas, 
  setBrush, 
  enablePaintBrush, 
  enableLasso,
  undo,
  redo 
}: SidebarDrawProps) {
  const [activeTool, setActiveTool] = useState<string>("pencil");
  const [width, setWidth] = useState(10);
  const [color, setColor] = useState("#3b82f6");
  const [usePressure, setUsePressure] = useState(false);

  // const changeTool = (type: string) => {
  //   setActiveTool(type);
  //   if (type === "pencil") setBrush({ type: "pencil", color, width });
  //   if (type === "eraser") setBrush({ type: "eraser", width });
  //   if (type === "brush") enablePaintBrush(color, width);
  //   if (type === "lasso") enableLasso();
  // };

  // const updateSettings = (newWidth: number, newColor: string) => {
  //   setWidth(newWidth);
  //   setColor(newColor);
  //   // Refresh current active tool with new settings
  //   if (activeTool === "pencil") setBrush({ type: "pencil", color: newColor, width: newWidth });
  //   if (activeTool === "brush") enablePaintBrush(newColor, newWidth);
  // };
  useEffect(() => {
    if(!canvas) return;

    // 1. Apply updates based on the active tool
    if (activeTool === "pencil") {
      // Calls your parent setBrush logic
      setBrush({ type: "pencil", color, width });
    } 
    else if (activeTool === "brush") {
      // Explicitly handle "Pro Brush" (Spray/Circle)
      setBrush({ type: "brush", color, width });
    } 
    else if (activeTool === "eraser") {
      // Eraser ignores color, but needs width
      setBrush({ type: "eraser", width });
    }
    else if ( activeTool === "lasso"){
      setBrush({ type: "lasso", width })
    }
  },[activeTool, width, color, canvas, setBrush])

  const togglePressure = (checked: boolean) => {
    setUsePressure(checked);
    // Re-enable brush with the new pressure setting
    enablePaintBrush(color, width, checked);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Drawing Tools</p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={activeTool === "pencil" ? "default" : "outline"} 
            className="flex-col h-20 gap-1"
            onClick={() => setActiveTool("pencil")}
          >
            <Pencil className="h-5 w-5" /> <span className="text-[10px]">Pen</span>
          </Button>
          <Button 
            variant={activeTool === "brush" ? "default" : "outline"} 
            className="flex-col h-20 gap-1"
            onClick={() => setActiveTool("brush")}
          >
            <Paintbrush className="h-5 w-5" /> <span className="text-[10px]">Pro Brush</span>
          </Button>
          <Button 
            variant={activeTool === "lasso" ? "default" : "outline"} 
            className="flex-col h-20 gap-1"
            onClick={() => setActiveTool("lasso")}
          >
            <Spline className="h-5 w-5" /> <span className="text-[10px]">Lasso</span>
          </Button>
          <Button 
            variant={activeTool === "eraser" ? "default" : "outline"} 
            className="flex-col h-20 gap-1"
            onClick={() => setActiveTool("eraser")}
          >
            <Eraser className="h-5 w-5" /> <span className="text-[10px]">Eraser</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* --- SETTINGS: Width & Color --- */}
      {activeTool !== "lasso" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>Brsuh Size</span>
              <span>{width}px</span>
            </div>
            <Slider 
              defaultValue={[width]} 
              max={100} 
              min={1} 
              step={1}
              onValueChange={([v]) => setWidth(v)} 
              className="[&_.bg-primary]:bg-indigo-600"
            />
          </div>

          {activeTool !== "eraser" && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-slate-500">Brush Color</p>
              <div className="flex flex-wrap gap-2">
                {["#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-primary scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center bg-slate-100 pointer-events-none">
                   <span className="text-[8px]">MIX</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- FOOTER: Actions --- */}
      <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={undo} className="gap-2">
          <Undo2 className="h-4 w-4" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} className="gap-2">
          <Redo2 className="h-4 w-4" /> Redo
        </Button>
        <Button 
          variant="ghost" 
          className="col-span-2 text-destructive hover:bg-destructive/10 text-[10px] font-bold uppercase"
          onClick={() => { 
            canvas.clear(); 
            canvas.setBackground("#ffffff", () => {
               canvas.renderAll(); 
            });  
            // Trigger auto save
            canvas.fire("object:modified");
          }}
        >
          <Trash2 className="h-3 w-3 mr-2" /> Clear Canvas
        </Button>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${usePressure ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
            <label htmlFor="pressure" className="text-xs font-bold uppercase cursor-pointer">
              Pressure Sensitivity
            </label>
          </div>
          <Switch 
            id="pressure" 
            checked={usePressure} 
            onCheckedChange={togglePressure} 
          />
        </div>
        
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Simulates a tablet pen by tapering brush ends. Best for calligraphy and freehand sketching.
        </p>
      </div>
    </div>
  );
}
