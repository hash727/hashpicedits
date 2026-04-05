// components/editor/border-settings.tsx
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Type, Square, Minus, GripHorizontal, Pipette, RotateCcw } from "lucide-react";

export function BorderSettings({ 
  selectedObject, 
  updateStrokeWidth, 
  updateStrokeColor, 
  updateStrokeStyle,
  updateStrokeOpacity = () => {} ,
  updateCornerRadius = () => {},
  resetBorder = () => {},
}: any) {
  const strokeWidth = selectedObject?.strokeWidth || 0;
  const strokeColor = selectedObject?.stroke || "#000000";
  const dashArray = JSON.stringify(selectedObject?.strokeDashArray);

  const currentStroke = selectedObject?.stroke || "rgba(0,0,0,1)";
  const alphaMatch = currentStroke.match(/[\d\.]+\)$/);
  const opacityValue = alphaMatch ? parseFloat(alphaMatch[0]) * 100 : 100;

  const activeStyle = !selectedObject?.strokeDashArray ? "solid" : 
                     dashArray === JSON.stringify([10, 5]) ? "dashed" : "dotted";

  // Code for corner radius
  const cornerRadius = selectedObject?.rx || 0;
  const isRect = selectedObject?.type === "rect";

  return (
    <Popover>
      {/* 1. THE TRIGGER: The single button shown in your toolbar */}
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Square className="h-4 w-4" />
          <span className="text-xs">Border</span>
        </Button>
      </PopoverTrigger>

      {/* 2. THE CONTENT: All tools stacked vertically */}
      <PopoverContent className="w-64 p-4 space-y-4" side="top" align="start">
        
        {/* COLOR & WIDTH ROW */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Color</span>
            <input 
              type="color" 
              value={strokeColor} 
              onChange={(e) => updateStrokeColor(e.target.value)}
              className="w-10 h-8 rounded border-none p-0 cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-slate-500">Width</span>
              <span className="text-[10px] font-mono">{strokeWidth}px</span>
            </div>
            <Slider 
              value={[strokeWidth]} 
              max={20} 
              onValueChange={([v]) => updateStrokeWidth(v)} 
            />
          </div>
        </div>

        <div className="h-[1px] bg-slate-100 w-full" />

        {/* STYLE SELECTOR */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-500">Border Style</span>
          <div className="flex gap-1">
            <Button 
              variant={activeStyle === "solid" ? "secondary" : "outline"} 
              className="flex-1 h-8" onClick={() => updateStrokeStyle("solid")}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button 
              variant={activeStyle === "dashed" ? "secondary" : "outline"} 
              className="flex-1 h-8" onClick={() => updateStrokeStyle("dashed")}
            >
              <GripHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant={activeStyle === "dotted" ? "secondary" : "outline"} 
              className="flex-1 h-8" onClick={() => updateStrokeStyle("dotted")}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-[1px] bg-slate-100 w-full" />

        {/* OPACITY SLIDER */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-slate-500">Opacity</span>
            <span className="text-[10px] font-mono font-bold">{Math.round(opacityValue)}%</span>
          </div>
          <Slider 
            value={[opacityValue]} 
            max={100} 
            onValueChange={([v]) => updateStrokeOpacity(v)} 
          />
        </div>

        {/* --- CORNER RADIUS (Only for Rectangles) --- */}
        {isRect && (
          <>
            <div className="h-[1px] bg-slate-100 w-full" />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-slate-500">Corner Radius</span>
                <span className="text-[10px] font-mono font-bold">{Math.round(cornerRadius)}px</span>
              </div>
              <Slider 
                value={[cornerRadius]} 
                max={100} 
                step={1}
                onValueChange={([v]) => updateCornerRadius(v)} 
              />
            </div>
          </>
        )}

        {/* --- RESET BUTTON --- */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetBorder}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 h-8"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase">Reset All Border Settings</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
