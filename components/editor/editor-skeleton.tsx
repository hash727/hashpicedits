// components/editor/editor-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function EditorSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      {/* Navbar Skeleton */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="w-80 border-r bg-white flex flex-col p-4 gap-6 shrink-0">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        </aside>

        {/* Main Canvas Skeleton */}
        <main className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-hidden">
          <Skeleton className="h-[600px] w-[800px] shadow-2xl rounded-sm bg-white" />
        </main>
      </div>
    </div>
  );
}
