"use client";

import { useState, useEffect } from "react"; // Added useState
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Maximize } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";

export function ZoomControls({ canvas }: { canvas: any }) {
  const { zoomIn, zoomOut, resetZoom, fitScreen } = useEditor(canvas);
  
  // 1. Local state to force React re-renders on zoom
  const [currentZoom, setCurrentZoom] = useState(1);

  useEffect(() => {
    if (!canvas || typeof canvas.on !== 'function') return;
    
    // Function to update local state
    const updateZoomState = () => {
      setCurrentZoom(canvas.getZoom());
    };

    const handleWheel = (opt: any) => {
      if (opt.e.ctrlKey) {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** opt.e.deltaY;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        updateZoomState(); // Update React state
      }
    };

    // 2. Listen to zoom events to sync the UI
    canvas.on('mouse:wheel', handleWheel);
    canvas.on('after:render', updateZoomState); // Syncs when buttons are clicked too

    return () => {
      canvas.off("mouse:wheel", handleWheel);
      canvas.off("after:render", updateZoomState);
    };
  }, [canvas]);

  // Use the local state for the display
  const zoomPercentage = Math.round(currentZoom * 100);

  return (
    <div className="flex items-center gap-1 bg-white border shadow-xl rounded-full px-2 py-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={zoomOut}>
        <Minus className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        className="h-8 px-2 text-[11px] font-bold min-w-[60px]" 
        onClick={resetZoom}
      >
        {zoomPercentage}%
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={zoomIn}>
        <Plus className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-4 mx-1" />

      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full text-primary hover:bg-primary/10" 
        onClick={fitScreen}
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
}
