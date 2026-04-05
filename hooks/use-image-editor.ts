import { useCallback } from "react";
import { fabric } from "fabric";

export const useImageEditor = (canvas: fabric.Canvas | null) => {
  // 1. Add Image to Canvas
  const addImage = useCallback(
    (url: string) => {
      if (!canvas) return;
      fabric.Image.fromURL(
        url,
        (img) => {
          img.scaleToWidth(300);
          canvas.add(img).centerObject(img).setActiveObject(img);
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" },
      ); // Vital for Exporting
    },
    [canvas],
  );

  // 2. Apply Filters (Canva-style)
  const applyFilter = useCallback(
    (filterType: "grayscale" | "sepia" | "invert" | "none") => {
      const activeObject = canvas?.getActiveObject() as fabric.Image;
      if (!activeObject || activeObject.type !== "image") return;

      activeObject.filters = []; // Clear existing
      if (filterType === "grayscale")
        activeObject.filters.push(new fabric.Image.filters.Grayscale());
      if (filterType === "sepia")
        activeObject.filters.push(new fabric.Image.filters.Sepia());
      if (filterType === "invert")
        activeObject.filters.push(new fabric.Image.filters.Invert());

      activeObject.applyFilters();
      canvas?.renderAll();
      canvas?.fire("object:modified");
    },
    [canvas],
  );

  return { addImage, applyFilter };
};
