"use client";

import { Folder ,  MoreVertical,  Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FolderCardProps {
  folder: any;
}

export function FolderCard({ folder }: FolderCardProps){
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/dashboard/folders/${folder.id}`);
  };
  return (
    <div 
      onClick={handleNavigate}
      className="group relative bg-slate-900/50 border border-slate-800/60 hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-300 rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
      <Link href={`/dashboard/folders/${folder.id}`} className="block p-4 h-full">
        <div className="flex items-start justify-between mb-4">
          {/* Icon: Darker background, lighter icon */}
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Folder className="w-5 h-5" fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium text-slate-200 group-hover:text-white truncate transition-colors">
            {folder.name}
          </h3>
          <p className="text-xs text-slate-500 group-hover:text-slate-400">
            {folder._count.projects} designs
          </p>
        </div>
      </Link>

      {/* Dropdown Trigger: Dark hover state */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={(e) => e.stopPropagation()}>
               <Pencil className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 focus:bg-red-900/20 focus:text-red-300 cursor-pointer" onClick={(e) => e.stopPropagation()}>
               <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
