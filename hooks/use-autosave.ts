// hooks/use-autosave.ts
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash"; // npm install lodash @types/lodash
import { updateProjectContent } from "@/app/actions/projects";
import { fabric } from "fabric";
import { createAutoSnapshot } from "@/app/actions/revisions";

export const useAutosave = (
  canvas: fabric.Canvas | null,
  projectId: string,
) => {
  const [isSaving, setIsSaving] = useState(false); // 1. Track saving state

  // 1. Define the debounced save function
  const debouncedSave = useRef(
    debounce(async (json: any, projectId: string) => {
      try {
        await updateProjectContent(projectId, json);
        // small delay before hiding "Saving"
        setTimeout(() => setIsSaving(false), 500);
        // console.log("Cloud Saved ✅");
      } catch (err) {
        console.error("Save failed ❌", err);
      }
    }, 2000),
  );

  const snapshotRef = useRef(
    debounce(
      async (json: any, projectId: string) => {
        try {
          await createAutoSnapshot(projectId, json);
          console.log("📸 Auto-Snapshot Created");
        } catch (err) {
          console.error("Snapshot failed", err);
        }
      },
      5 * 60 * 1000,
    ),
  );

  useEffect(() => {
    if (!canvas) return;

    // 2. Attach listeners to Fabric.js
    const saveState = () => {
      setIsSaving(true);
      const json = canvas.toJSON([
        "rx", // Corner Radius (Horizontal)
        "ry", // Corner Radius (Vertical)
        "stroke", // Border Color (includes RGBA for opacity)
        "strokeWidth", // Border Thickness
        "strokeDashArray", // Border Style (Dashed/Dotted)
        "strokeUniform", // Prevents border distortion
        "opacity", // Object Transparency
        "_isFrame", // Our custom Frame flag [61]
        "_originalImage", // Image URL for frames
        "_patternScale", // Saved scale of the image in frame
      ]);
      // Regular Autosave (2 seconds)
      debouncedSave.current(json, projectId);

      // Auto-snapshot (5 min of no activity)
      snapshotRef.current(json, projectId);
    };

    canvas.on("object:modified", saveState);
    canvas.on("object:added", saveState);
    canvas.on("object:removed", saveState);

    return () => {
      canvas.off("object:modified", saveState);
      canvas.off("object:added", saveState);
      canvas.off("object:removed", saveState);
      debouncedSave.current.cancel(); // Clean up lodash debounce on unmount
      snapshotRef.current.cancel();
    };
  }, [canvas, projectId]);

  return { isSaving };
};
