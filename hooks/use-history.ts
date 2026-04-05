import { useState, useCallback } from "react";
import { fabric } from "fabric";

export const useHistory = (canvas: fabric.Canvas | null) => {
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);

  // Save state to history
  const saveHistory = useCallback(() => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());

    setHistory((prev) => {
      const newHistory = prev.slice(0, index + 1);
      return [...newHistory, json];
    });
    setIndex((prev) => prev + 1);
  }, [canvas, index]);

  const undo = useCallback(() => {
    if (!canvas || index <= 0) return;
    const previousState = history[index - 1];
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      setIndex(index - 1);
    });
  }, [canvas, history, index]);

  const redo = useCallback(() => {
    if (!canvas || index >= history.length - 1) return;
    const nextState = history[index + 1];
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setIndex(index + 1);
    });
  }, [canvas, history, index]);

  return {
    saveHistory,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
};
