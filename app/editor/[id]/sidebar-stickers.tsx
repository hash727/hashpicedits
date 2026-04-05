"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getTrendingStickers } from "@/app/actions/stickers";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";

import { fabric } from "fabric";


const CATEGORIES = ["Emojis","Trending", "Neon", "Animals", "Frames", "3D", "Shapes", "Retro", "Cute"];

export function SidebarStickers({ canvas }: { canvas: any }) {
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition(); // 1. Use React 19 Transitions
  const abortControllerRef = useRef<AbortController | null>(null);
  const [activeCategory, setActiveCategory] = useState("Trending");

  const loadStickers = async (query: string) => {
    // Cancel previous request if it's still running
    if(abortControllerRef.current){
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // User StartTransition to keep the UI responsive while fetching
    startTransition( async () => {
        try {
            // setLoading(true);
            const searchTerm = query === "Emojis" ? "" : query;
            const data = await getTrendingStickers(searchTerm);
            setStickers(data);
            // setLoading(false);
        } catch (error: any){
            if(error.name === 'AbortError') return;
            console.error("Search failed", error)
        }
    })
    
  };

  useEffect(() => { loadStickers("Trending"); }, []);

  const addSticker = (url: string) => {
    if (!canvas) return;

    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(200); // Set a good default size
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      
      // 2. Trigger your auto-save logic
      canvas.fire("object:modified");
    }, { 
      crossOrigin: "anonymous" // Crucial for PDF/PNG exporting later!
    });
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search stickers..." 
          className="pl-8 h-9"
          onKeyDown={(e) => e.key === "Enter" && loadStickers(e.currentTarget.value)}
        />
      </div>

      {/* 2. Horizontal Category Chips */}
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="h-7 px-3 text-[10px] rounded-full"
              onClick={() => {
                setActiveCategory(cat);
                loadStickers(cat);
              }}
            >
              {cat}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* 3. Sticker Grid */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1 p-2 pb-4">
            {stickers.map((s) => (
              <div 
                key={s.id} 
                onClick={() =>  addSticker(s.url)}
                className="relative aspect-square bg-slate-50 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all p-2 flex items-center justify-center"
              >
                <Image 
                    src={s.url} 
                    alt={s.title} 
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 40vw, 22vw" // Optimization for Windows/Chrome
                    className="object-contain p-2" // 'object-contain' preserves the sticker's shape 
                />
              </div>
            ))}
          </div>
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
