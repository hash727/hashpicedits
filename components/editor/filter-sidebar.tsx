import { FILTER_PRESETS } from "@/lib/filters";

export function FilterSidebar({ applyFilterPreset, selectedObject }: any) {
  return (
    <div className="p-4 space-y-4">
      <p className="text-[10px] font-bold uppercase text-slate-500">Filter Presets</p>
      
      <div className="grid grid-cols-2 gap-3">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyFilterPreset(preset.filter)}
            className="group flex flex-col items-center gap-2"
          >
            {/* Filter Preview Box */}
            <div className="w-full aspect-square rounded-lg border-2 border-transparent group-hover:border-primary transition-all bg-slate-100 flex items-center justify-center overflow-hidden">
               <span className="text-[10px] font-medium text-slate-400">{preset.name}</span>
            </div>
            <span className="text-[11px] font-medium">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
