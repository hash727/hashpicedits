"use client";

import { createProject } from "@/app/actions/projects";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <div className="bg-primary/10 p-4 rounded-full transition-transform group-hover:scale-110">
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

export function CreateProjectCard() {
  return (
    <form action={createProject}>
      <Card className="group cursor-pointer border-dashed h-[280px] hover:border-primary hover:bg-accent/50 transition-all">
        <SubmitButton />
      </Card>
    </form>
  );
}
