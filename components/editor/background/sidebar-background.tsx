// components/editor/sidebar-background.tsx
import { Plus } from "lucide-react";
import { SidebarContainer } from "./sidebar-container"; 
import { ColorGrid } from "./color-grid";
import { GradientGrid } from "./gradient-grid";
import { PatternGrid } from "./pattern-grid";
import { useEditor } from "@/hooks/use-editor";
import { StockSearch } from "./stock-search";
import { Slider } from "@/components/ui/slider";

export function SidebarBackground({ canvas }: { canvas: any }) {
  const {
    setBackgroundColor,
    setBackgroundGradient,
    setBackgroundPattern,
    setBackgroundImage,
    setBackgroundAdjustment,
    setBackgroundOpacity,
    addImage,
  } = useEditor(canvas);
  
  if (!canvas) return <div className="p-4 text-xs text-muted-foreground text-center">Loading workspace...</div>;

  // 1. EXTRACT UNIQUE COLORS FROM CANVAS OBJECTS [49, 54]
  const getDocumentColors = () => {
    const objects = canvas.getObjects();
    const colors = new Set<string>();
    objects.forEach((obj: any) => {
      if (obj.fill && typeof obj.fill === "string") colors.add(obj.fill);
      if (obj.stroke && typeof obj.stroke === "string") colors.add(obj.stroke);
    });
    return Array.from(colors);
  };

  const docColors = getDocumentColors();

  return (
    <SidebarContainer 
      title="Background" 
      description="Design the foundation of your project with color, gradients, or textures."
    >
      {/* SECTION 1: SOLID COLORS & CUSTOM PICKER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Solid Colors</h4>
          <button 
            onClick={() => document.getElementById("bg-custom-picker")?.click()}
            className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold transition"
          >
            <Plus className="h-3 w-3" /> Custom
          </button>
          <input 
            id="bg-custom-picker" 
            type="color" 
            className="hidden" 
            onChange={(e) => setBackgroundColor(e.target.value)} 
          />
        </div>

        {/* Dynamic Project Palette [22, 54] */}
        {docColors.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-medium">Document Colors</p>
            <ColorGrid colors={docColors} onSelect={setBackgroundColor} />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 font-medium">Default Palette</p>
          <ColorGrid onSelect={setBackgroundColor} />
        </div>
      </div>

      <div className="h-[1px] bg-slate-100 w-full my-6" />

      {/* SECTION 2: GRADIENTS [26, 32] */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Gradients</h4>
        <GradientGrid onSelect={setBackgroundGradient} />
      </div>

      <div className="h-[1px] bg-slate-100 w-full my-6" />

      {/* SECTION 3: TEXTURES [45, 51] */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Textures & Patterns</h4>
        <PatternGrid onSelect={setBackgroundPattern} />
      </div>

      {/* NEW: ADJUSTMENTS SECTION [25, 46] */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Adjustments</h4>
        
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-slate-500">
            <span>Background Blur</span>
            <span>0.5</span>
            </div>
            <Slider defaultValue={[0]} max={1} step={0.01} onValueChange={([v]) => setBackgroundAdjustment('blur', v)} />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-slate-500">
            <span>Brightness</span>
            <span>0</span>
            </div>
            <Slider defaultValue={[0]} min={-1} max={1} step={0.01} onValueChange={([v]) => setBackgroundAdjustment('brightness', v)} />
        </div>
      </div>
      
      <div className="h-[1px] bg-slate-100 w-full my-6" />

      {/* SECTION 4: STOCK PHOTOS */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
            Stock Photography
        </h4>
        <StockSearch 
          onSelect={setBackgroundImage} 
          onAddImage={addImage}
        />
      </div>


        
    </SidebarContainer>
  );
}
