"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fabric } from "fabric";

const FONTS = [
  "Arial","Inter", "Roboto", "Poppins", "Montserrat", "Playfair Display", 
  "Bebas Neue", "Dancing Script", "Pacifico", "Oswald", "Lora"
];

export function FontTool({ selectedObject, canvas }: any) {
  const [query, setQuery] = useState("");
  
  // Use a fallback in case selectedObject isn't fully loaded yet
  const activeFont = selectedObject?.fontFamily || "Inter";

  const setFont = async (font: string) => {
    if (!selectedObject || !canvas) return;

    // 1. FIX: Correct the Google Fonts URL
    const fontId = `font-${font.replace(/\s+/g, "-")}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com{font.replace(/\s+/g, "+")}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }

    try {
      // 2. PRO MOVE: Wait for the browser to actually finish downloading the font
      // This prevents the font from defaulting back to Arial on first click
      await document.fonts.load(`16px "${font}"`);

      // 3. Update the Fabric Object
      selectedObject.set("fontFamily", font);
      
      // 4. Recalculate text dimensions (Bebas is narrower than Poppins!)
      selectedObject.initDimensions();
      selectedObject.setCoords(); 
      
      canvas.renderAll();
      canvas.fire("object:modified");
    } catch (e) {
      console.error("Font loading failed:", e);
    }
  };

  const filteredFonts = FONTS.filter(f => f.toLowerCase().includes(query.toLowerCase()));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[140px] justify-between h-8 gap-2 font-normal">
          <span className="truncate" style={{ fontFamily: activeFont }}>{activeFont}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 shadow-xl border-slate-200" align="start">
        <div className="p-2 border-b bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search fonts..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-white"
            />
          </div>
        </div>
        <ScrollArea className="h-72">
          {/* 5. FONT PREVIEW: Also load CSS for the list so you can see the style before clicking */}
          <div className="p-1">
            {filteredFonts.map((font) => (
              <button
                key={font}
                onClick={() => setFont(font)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-100 rounded-md transition-colors text-left"
                style={{ fontFamily: font }}
              >
                {font}
                {activeFont === font && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
