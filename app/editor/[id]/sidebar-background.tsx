// app/editor/[id]/sidebar-background.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "@/hooks/use-editor";
import { Palette, Check } from "lucide-react";

export function SidebarBackground({ canvas }: { canvas: any }) {
  const { setBackgroundColor } = useEditor(canvas);
  
  // 1. CRITICAL GUARD: If canvas is null, return a loading state or nothing
  // This prevents the 'clearRect' error during the initial mount
  if (!canvas) {
    return (
      <div className="p-4 flex items-center justify-center text-xs text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  const currentColor = canvas?.backgroundColor as string || "#ffffff";

  const presetColors = [
    "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", // Whites/Grays
    "#000000", "#1e293b", "#334155", "#475569", // Darks
    "#ef4444", "#f97316", "#f59e0b", "#10b981", // Vibrant
    "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", // Cool
  ];

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Palette className="h-4 w-4" />
        Document Colors
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className="group relative aspect-square rounded-md border shadow-sm transition hover:scale-105"
              style={{ backgroundColor: color }}
            >
              {currentColor === color && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
                  <Check className={`h-4 w-4 ${color === "#ffffff" ? "text-black" : "text-white"}`} />
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* You can add a Custom Color Picker here later */}
        <Button variant="outline" className="w-full mt-4 text-xs">
          + Custom Color
        </Button>
      </ScrollArea>
    </div>
  );
}
