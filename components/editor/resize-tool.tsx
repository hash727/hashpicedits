"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"; // Better for long lists
import { Maximize2 } from "lucide-react";
import { resizeProject } from "@/app/actions/projects";
import { toast } from "sonner";

const PRESET_SIZES = {
  social: [
    { name: "Instagram Post", width: 1080, height: 1080, icon: "📸" },
    { name: "Instagram Story", width: 1080, height: 1920, icon: "📱" },
    { name: "Facebook Cover", width: 820, height: 312, icon: "📘" },
  ],
  web: [
    { name: "Full HD (1080p)", width: 1920, height: 1080, icon: "🖥️" },
    { name: "SD Video (480p)", width: 640, height: 480, icon: "📺" },
    { name: "YouTube Thumbnail", width: 1280, height: 720, icon: "🎥" },
  ],
};

export function ResizeTool({ projectId, canvas, currentWidth, currentHeight, fitScreen }: any) {
  const [customWidth, setCustomWidth] = useState(currentWidth);
  const [customHeight, setCustomHeight] = useState(currentHeight);

  const handleResize = async (width: number, height: number, name: string) => {
    if (!canvas) return;

    await resizeProject(projectId, width, height);
    canvas.setDimensions({ width, height });
    canvas.renderAll();
    
    // Smoothly re-fit to screen after resizing
    setTimeout(() => fitScreen(), 50); 
    
    toast.success(`Resized to ${name} (${width}x${height}px)`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Maximize2 className="h-4 w-4" /> Resize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="start">
        <div className="p-4 bg-slate-50/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Custom Size</p>
          <div className="flex items-center gap-2">
            <Input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="h-8 bg-white" placeholder="W" />
            <span className="text-muted-foreground text-xs">×</span>
            <Input type="number" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="h-8 bg-white" placeholder="H" />
            <Button size="sm" className="h-8" onClick={() => handleResize(customWidth, customHeight, "Custom")}>Apply</Button>
          </div>
        </div>

        <Separator />

        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-6">
            {/* SOCIAL CATEGORY */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Social Media</p>
              <div className="grid grid-cols-1 gap-1">
                {PRESET_SIZES.social.map((p) => (
                  <Button key={p.name} variant="ghost" className="justify-start h-12 w-full gap-3 px-2" onClick={() => handleResize(p.width, p.height, p.name)}>
                    <span className="text-lg">{p.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.width} × {p.height} px</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* WEB CATEGORY */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Web & Video</p>
              <div className="grid grid-cols-1 gap-1">
                {PRESET_SIZES.web.map((p) => (
                  <Button key={p.name} variant="ghost" className="justify-start h-12 w-full gap-3 px-2" onClick={() => handleResize(p.width, p.height, p.name)}>
                    <span className="text-lg">{p.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.width} × {p.height} px</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
