'use client'
// components/editor/gradient-settings.tsx
import { MoveRight, CircleDot, ArrowLeftRight, Sparkles } from "lucide-react";
import { PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const GRADIENT_PRESETS = [
  { name: "Sunset", c1: "#ff512f", c2: "#dd2476" },
  { name: "Ocean", c1: "#2193b0", c2: "#6dd5ed" },
  { name: "Lush", c1: "#56ab2f", c2: "#a8e063" },
  { name: "Midnight", c1: "#232526", c2: "#414345" },
];

export function GradientSettings({ onApply }: { onApply: Function }) {
  const [settings, setSettings] = useState({
    type: "linear" as "linear" | "radial",
    color1: "#3b82f6",
    color2: "#10b981",
    angle: 0
  });

  const update = (newVal: any) => {
    const updated = { ...settings, ...newVal };
    setSettings(updated);
    onApply(updated);
  };

  return (
    <PopoverContent side="left" className="w-64 p-4 space-y-5 shadow-2xl">
      {/* TYPE SELECTOR */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase text-slate-500">Gradient Type</span>
        <div className="flex p-1 bg-slate-100 rounded-lg gap-1">
          <Button 
            variant={settings.type === "linear" ? "secondary" : "ghost"}
            className="flex-1 h-7 text-[10px]" size="sm" onClick={() => update({ type: "linear" })}
          >
            <MoveRight className="h-3 w-3 mr-1" /> Linear
          </Button>
          <Button 
            variant={settings.type === "radial" ? "secondary" : "ghost"}
            className="flex-1 h-7 text-[10px]" size="sm" onClick={() => update({ type: "radial" })}
          >
            <CircleDot className="h-3 w-3 mr-1" /> Radial
          </Button>
        </div>
      </div>

      {/* COLOR STOPS */}
      <div className="flex items-center justify-between gap-2 border-y py-3">
        <input type="color" value={settings.color1} onChange={(e) => update({ color1: e.target.value })} className="w-12 h-9 rounded cursor-pointer border-2 border-white shadow-sm" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => update({ color1: settings.color2, color2: settings.color1 })}>
          <ArrowLeftRight className="h-4 w-4 text-slate-400" />
        </Button>
        <input type="color" value={settings.color2} onChange={(e) => update({ color2: e.target.value })} className="w-12 h-9 rounded cursor-pointer border-2 border-white shadow-sm" />
      </div>

      {/* ANGLE (LINEAR ONLY) */}
      {settings.type === "linear" && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-[10px] font-bold uppercase text-slate-500">Angle</label>
            <span className="text-[10px] font-mono font-bold text-primary">{settings.angle}°</span>
          </div>
          <Slider min={0} max={360} step={45} value={[settings.angle]} onValueChange={([v]) => update({ angle: v })} />
        </div>
      )}

      {/* PRESETS GALLERY */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-slate-500">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase">Presets</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {GRADIENT_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => update({ color1: p.c1, color2: p.c2 })}
              className="h-8 rounded-md border text-[9px] font-medium transition hover:scale-105"
              style={{ background: `linear-gradient(to right, ${p.c1}, ${p.c2})`, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </PopoverContent>
  );
}
