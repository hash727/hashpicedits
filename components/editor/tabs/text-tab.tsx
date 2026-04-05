// components/editor/tabs/text-tab.tsx
import { useState, useMemo, useEffect } from "react";
import { Check, Search, X, Type, AlignLeft, TextQuote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { loadGoogleFont } from "@/utils/font-loader";

// Expanded professional font list for 2026 [1, 2, 29]
const CATEGORIES = ["All", "Sans Serif", "Serif", "Display", "Monospace", "Handwriting"];
const GOOGLE_FONTS = [
  { name: "Inter", category: "Sans Serif" },
  { name: "Playfair Display", category: "Serif" },
  { name: "Satoshi", category: "Sans Serif" },
  { name: "Fraunces", category: "Serif" },
  { name: "Space Grotesk", category: "Display" },
  { name: "SUSE Mono", category: "Monospace" },
  { name: "Montserrat", category: "Sans Serif" },
  { name: "Lora", category: "Serif" },
  { name: "Outfit", category: "Sans Serif" },
  { name: "Epilogue", category: "Sans Serif" },
  { name: "Dancing Script", category: "Handwriting" },
];

export function TextTab({ canvas, selectedObject, addText, addTextbox }: any) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Multi-tier filtering logic [30]
  const filteredFonts = useMemo(() => {
    return GOOGLE_FONTS.filter(font => {
      const matchesQuery = font.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "All" || font.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  useEffect(() => {
    filteredFonts.forEach(font => loadGoogleFont(font.name));
  }, [filteredFonts]);

  const currentFont = selectedObject?.get("fontFamily");

  
  const applyFont = (fontName: string) => {
    loadGoogleFont(fontName); // Fetch the .woff2 file [15]

    if (selectedObject) {
      // 1. Update the existing selection
      selectedObject.set("fontFamily", fontName);
      canvas?.renderAll();
      canvas?.fire("object:modified");
    } else {
      // 2. Or create new text with this font
      addText("Type something...", { 
        fontFamily: fontName,
        fontSize: 32 
      });
    }
  };

  return (
    <TabsContent value="text" className="h-full m-0 bg-white flex flex-col">
      {/* 1. SEARCH & CATEGORY HEADER */}
      <div className="p-4 border-b space-y-4 bg-slate-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search 1,000+ fonts..." 
            className="pl-9 h-10 bg-white shadow-sm border-slate-200 text-xs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-3">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* HORIZONTAL CATEGORY PILLS */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all
                  ${selectedCategory === cat 
                    ? "bg-primary text-white border-primary shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {query.length > 0 || selectedCategory !== "All" ? (
            /* 2. FILTERED RESULTS VIEW */
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-[10px] font-bold uppercase text-slate-400">
                  {selectedCategory} Results
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{filteredFonts.length} found</span>
              </div>
              {filteredFonts.map(font => (
                <button
                  key={font.name}
                  onClick={() => applyFont(font.name, selectedObject, canvas, addText)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl border transition-all mb-2
                    ${currentFont === font.name ? "border-primary bg-primary/5" : "border-transparent hover:bg-slate-50"}
                  `}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-lg" style={{ fontFamily: font.name }}>{font.name}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">{font.category}</span>
                  </div>
                  {currentFont === font.name && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          ) : (
            /* 3. DEFAULT CREATION VIEW (Headings, Paragraphs) */
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase text-slate-400 px-1">Add Text</h3>
                <Button variant="outline" className="w-full h-16 justify-start px-4 hover:border-primary group" onClick={() => addText("Heading", { fontSize: 48, fontWeight: "bold" })}>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-black group-hover:text-primary leading-none">Heading</span>
                    <span className="text-[9px] text-slate-400 mt-1">Extra Bold • 48px</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full h-12 justify-start px-4 hover:border-primary group" onClick={() => addTextbox("Paragraph text...", { fontSize: 16, width: 280 })}>
                  <div className="flex items-center gap-3">
                    <AlignLeft className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-primary">Paragraph</span>
                  </div>
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase text-slate-400 px-1">Style Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addText("QUOTE", { fontSize: 20, fontStyle: "italic", fontFamily: "serif" })} className="p-4 border rounded-xl hover:border-primary bg-slate-50/50 flex flex-col items-center">
                    <TextQuote className="h-4 w-4 mb-2 text-slate-400" />
                    <span className="text-[10px] font-serif italic">Quote</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
