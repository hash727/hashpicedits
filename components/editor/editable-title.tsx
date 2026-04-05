// components/editor/editable-title.tsx
"use client"

import { useState, useRef, useEffect } from "react";
import { renameProject } from "@/app/actions/projects";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function EditableTitle({ id, initialName }: { id: string, initialName: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if initialName changes from server
  useEffect(() => setName(initialName), [initialName]);

  const handleBlur = async () => {
    setIsEditing(false);
    if (name === initialName || !name.trim()) {
      setName(initialName); // Reset if empty or unchanged
      return;
    }

    try {
      await renameProject(id, name);
      toast.success("Project renamed");
    } catch (error) {
      setName(initialName);
      toast.error("Failed to rename");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") {
      setName(initialName);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-8 w-auto min-w-[150px] font-bold text-lg px-2 bg-slate-50 border-primary focus-visible:ring-1"
        autoFocus
      />
    );
  }

  return (
    <span 
      onDoubleClick={() => setIsEditing(true)}
      className="text-lg font-bold px-2 py-1 rounded-md hover:bg-slate-100 cursor-text transition-colors truncate max-w-[300px]"
      title="Double click to rename"
    >
      {name}
    </span>
  );
}
