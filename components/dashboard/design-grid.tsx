"use client";

import { Plus, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/actions/projects";
import { ProjectCard } from "./project-card";

interface Design {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  updatedAt: Date | string;
  width: number;
  height: number;
  isPro: boolean;
  folderId?: string | null; // Added this for the check icon in "Move to Folder"
}

interface Folder {
  id: string;
  name: string;
  _count?: {
    projects: number;
  };
}

interface DesignGridProps {
  designs: Design[];
  folders?: Folder[];
  isPro: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex flex-col items-center justify-center w-full h-full disabled:cursor-not-allowed"
    >
      <div className="bg-primary/10 p-4 rounded-full transition-transform group-hover:scale-110 flex items-center justify-center">
        {pending ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : (
          <Plus className="w-8 h-8 text-primary" />
        )}
      </div>
      <span className="mt-4 font-medium text-muted-foreground">
        {pending ? "Creating..." : "Create New"}
      </span>
    </button>
  );
}

export function DesignGrid({ designs, folders = [], isPro }: DesignGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
      {/* 1. THE "CREATE NEW" CARD */}
      <form action={createProject}>
        <Card className="group cursor-pointer border-dashed flex flex-col items-center justify-center h-[280px] hover:border-primary hover:bg-accent/50 transition-all">
          <SubmitButton />
        </Card>
      </form>

      {/* 2. DYNAMIC PROJECT CARDS */}
      {/* 
          We use the dedicated ProjectCard component which already 
          contains the dropdown, "Move to Folder" menu, and formatting.
      */}
      {designs.map((design) => (
        <ProjectCard
          key={design.id}
          project={design}
          folders={folders} // Passing folders allows the "Move to Folder" menu to work
          isPro={isPro}
        />
      ))}
    </div>
  );
}
