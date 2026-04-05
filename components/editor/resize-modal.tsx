"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Maximize2, Monitor, Smartphone } from "lucide-react";
import { resizeProject } from "@/app/actions/projects";
import { toast } from "sonner";

export function ResizeModal({ projectId, canvas }: any) {
  const handleResize = async (width: number, height: number, name: string) => {
    if (!canvas) return;

    // 1. Update Database
    await resizeProject(projectId, width, height);

    // 2. Update Local Canvas
    canvas.setDimensions({ width, height });
    
    // 3. Optional: Center all objects in new size
    canvas.centerObject(canvas.backgroundImage); // If you have one
    canvas.renderAll();

    toast.success(`Resized to ${name}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Maximize2 className="h-4 w-4" /> Std Resize Modal
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4" align="start">
        <div className="space-y-4">
          <div className="text-xs font-bold text-muted-foreground uppercase">Social Media (HD)</div>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => handleResize(1080, 1920, "Instagram Story")}>
              <Smartphone className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm">Instagram Story</div>
                <div className="text-[10px] text-muted-foreground">1080 x 1920 px</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => handleResize(1920, 1080, "Full HD")}>
              <Monitor className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm">Full HD Desktop</div>
                <div className="text-[10px] text-muted-foreground">1920 x 1080 px</div>
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
