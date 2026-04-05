"use client";

import { useState } from "react";
import { Layers, RotateCcw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function ShadowTool({ selectedObject, canvas, applyShadow }: any) {
  const [color, setColor] = useState("#00000080");

  const removeShadow = () => {
    selectedObject.set("shadow", null);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Layers className="h-4 w-4" /> Shadow
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 space-y-4 shadow-xl border-slate-200" align="start">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase text-slate-500">Drop Shadow</p>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeShadow}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        {/* 1. BLUR STRENGTH */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span>Blur</span>
            <span>{Math.round(selectedObject.shadow?.blur || 0)}</span>
          </div>
          <Slider 
            defaultValue={[selectedObject.shadow?.blur || 0]} 
            max={50} 
            onValueChange={([v]) => applyShadow({ blur: v })} 
          />
        </div>

        {/* 2. ANGLE / OFFSET (X & Y) */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span>Offset X</span>
            <span>{selectedObject.shadow?.offsetX || 0}</span>
          </div>
          <Slider 
            defaultValue={[selectedObject.shadow?.offsetX || 0]} 
            min={-50} max={50} 
            onValueChange={([v]) => applyShadow({ offsetX: v })} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span>Offset Y</span>
            <span>{selectedObject.shadow?.offsetY || 0}</span>
          </div>
          <Slider 
            defaultValue={[selectedObject.shadow?.offsetY || 0]} 
            min={-50} max={50} 
            onValueChange={([v]) => applyShadow({ offsetY: v })} 
          />
        </div>

        <Separator />

        {/* 3. SHADOW COLOR */}
        <div className="flex items-center justify-between">
           <span className="text-[10px] font-bold uppercase text-slate-500">Color</span>
           <input 
             type="color" 
             value={color.substring(0, 7)} 
             onChange={(e) => {
               const newColor = e.target.value + "80"; // Add 50% opacity
               setColor(newColor);
               applyShadow({ color: newColor });
             }}
             className="w-8 h-8 rounded-md cursor-pointer border-none"
           />
        </div>
      </PopoverContent>
    </Popover>
  );
}
