"use client";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Wand2 } from "lucide-react";

export function ImageToolbar({ applyFilter }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wand2 className="h-4 w-4" /> Edit Image
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => applyFilter("none")}>Original</DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("grayscale")}>Grayscale</DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("sepia")}>Sepia</DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("invert")}>Invert</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
