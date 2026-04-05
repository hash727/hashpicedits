import { UserButton } from "@/components/usernavbar/user-button";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-950 flex flex-col">
      
      {/* Floating Header: Absolute Positioned Top-Right */}
      <header className="absolute top-10 right-6 z-50">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full p-1 shadow-xl">
          <UserButton />
        </div>
      </header>

      {/* The Editor Canvas (EditorClient) */}
      <main className="flex-1 relative z-0">
        {children}
      </main>
      
    </div>
  );
}
