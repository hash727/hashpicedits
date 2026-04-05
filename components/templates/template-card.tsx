import Image from 'next/image';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    template: any;
    canvas: fabric.Canvas | null;
    isPro: boolean
}

const TemplateCard = ({
    template,
    canvas,
    isPro
}: Props) => {

     const handleLoadTemplate = () => {
    if (!canvas) return;

    // 1. Pro check
    if (template.isPro && !isPro) {
      toast.error("This is a Pro template. Please upgrade!");
      return;
    }

    // 2. Load JSON into Fabric.js
    // Note: fabric 5.x loadFromJSON is callback-based
    canvas.loadFromJSON(template.json, () => {
      // Ensure canvas size matches the template design
      canvas.setDimensions({ 
        width: template.width || 800, 
        height: template.height || 600 
      });
      
      canvas.renderAll();
      
      // Trigger autosave/history hooks
      canvas.fire("object:modified"); 
      toast.success(`Loaded ${template.name}`);
    });
  };

  return (
    <button
      onClick={handleLoadTemplate}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-md border bg-slate-50 hover:border-primary transition-all"
    >
      <img 
        src={template.thumbnail || "/placeholder.jpg"} 
        alt={template.name}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold text-white bg-primary px-2 py-1 rounded">
          Apply
        </span>
      </div>

      {/* Pro Badge */}
      {template.isPro && (
        <div className="absolute top-1 right-1 bg-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
          PRO
        </div>
      )}
    </button>
  );
}

export default TemplateCard