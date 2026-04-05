import { fabric } from "fabric";

export const useGuidelines = (canvas: fabric.Canvas | null) => {
  const setupGuidelines = () => {
    if (!canvas) return;

    const ctx = canvas.getSelectionContext();
    const centeringLineColor = "#8b5cf6"; // Canva Purple
    const centeringLineDash = [5, 5];

    canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj || (obj as any)._isEditingContent) return;

      const canvasWidth = canvas.width!;
      const canvasHeight = canvas.height!;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // 1. Calculate object center
      const objCenter = obj.getCenterPoint();

      // 2. Snap to Vertical Center
      if (Math.abs(objCenter.x - centerX) < 5) {
        obj.set({ left: centerX }).setCoords();
        drawVerticalLine(centerX);
      }

      // 3. Snap to Horizontal Center
      if (Math.abs(objCenter.y - centerY) < 5) {
        obj.set({ top: centerY }).setCoords();
        drawHorizontalLine(centerY);
      }
    });

    const drawVerticalLine = (x: number) => {
      canvas.on("after:render", () => {
        ctx.beginPath();
        ctx.setLineDash(centeringLineDash);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height!);
        ctx.strokeStyle = centeringLineColor;
        ctx.stroke();
      });
    };

    const drawHorizontalLine = (y: number) => {
      canvas.on("after:render", () => {
        ctx.beginPath();
        ctx.setLineDash(centeringLineDash);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width!, y);
        ctx.strokeStyle = centeringLineColor;
        ctx.stroke();
      });
    };

    // Clear lines when dragging stops
    canvas.on("mouse:up", () => {
      canvas.off("after:render");
      canvas.renderAll();
    });
  };

  return { setupGuidelines };
};
