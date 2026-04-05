"use client";

import { Folder as FolderIcon, Plus, MoreVertical, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

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
      className="group relative flex flex-col p-4 bg-white border rounded-xl hover:border-primary hover:shadow-sm cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-primary/10 transition-colors">
          <FolderIcon className="h-6 w-6 text-blue-500 group-hover:text-primary" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive">Delete Folder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <span className="font-bold text-sm truncate">{folder.name}</span>
      <span className="text-[10px] text-muted-foreground uppercase font-bold">
        {folder._count.projects} Projects
      </span>
    </div>
  );
}
