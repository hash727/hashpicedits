// Inside your Navbar.tsx or Header
import { CloudCheck, CloudUpload, Loader2 } from "lucide-react";

export function SavingStatus({ isSaving }: { isSaving: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 min-w-[120px]">
      {isSaving ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse">
            Saving...
          </span>
        </>
      ) : (
        <>
          <CloudCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Saved
          </span>
        </>
      )}
    </div>
  );
}
