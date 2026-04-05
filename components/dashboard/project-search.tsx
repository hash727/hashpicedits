"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Folder, Calendar } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function ProjectSearch({ projects }: { projects: any[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  // 1. Setup Keyboard Shortcut (Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      {/* Visual Search Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-full max-w-sm items-center gap-2 rounded-xl border bg-white px-3 text-sm text-muted-foreground hover:bg-slate-50 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search designs...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      {/* The Search Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search your projects and folders..." />
        <CommandList className="max-h-[300px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => {
                  setOpen(false)
                  router.push(`/editor/${project.id}`)
                }}
                className="gap-3 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-2 w-2" /> 
                    Edited {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
