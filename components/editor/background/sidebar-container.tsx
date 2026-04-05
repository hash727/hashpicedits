// components/editor/sidebar-container.tsx
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SidebarContainer({ title, description, children }: SidebarContainerProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* FIXED HEADER: Provides context that stays visible [46] */}
      <div className="p-4 border-b space-y-1">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {description && (
          <p className="text-[11px] text-slate-500 leading-tight">
            {description}
          </p>
        )}
      </div>

      {/* SCROLLABLE BODY: Flexible container for dense tools [1, 15] */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
