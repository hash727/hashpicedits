// hooks/use-editor.ts
// import { useCallback } from "react";
import { fabric } from "fabric";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useEditor = (canvas: fabric.Canvas | null) => {
  const [isCropMode, setIsCropMode] = useState(false);
  const [currentCropBox, setCurrentCropBox] = useState<fabric.Rect | null>(
    null,
  );

  const [isEditingFrame, setIsEditingFrame] = useState(false);
  const [activeFrameGhost, setActiveFrameGhost] =
    useState<fabric.Object | null>(null);

  const [editingImage, setEditingImage] = useState<fabric.Image | null>(null);
  const [editingShape, setEditingShape] = useState<any | null>(null);

  const [recentColors, setRecentColors] = useState<string[]>([]);

  const addText = (content: string, options?: any) => {
    if (!canvas) return;

    const text = new fabric.IText(content, {
      left: 100,
      top: 100,
      padding: 10,
      objectCaching: false,
      fontFamily: "Arial",
      fontSize: 32,
      ...options,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addTextbox = (content: string, options?: any) => {
    if (!canvas) return;
    // Textbox is specialized for paragraphs/wrapping [15]
    const textbox = new fabric.Textbox(content, {
      left: 100,
      top: 100,
      width: 250, // Default width triggers wrapping logic
      padding: 10, // Prevents clipping on line wraps [53]
      objectCaching: false, // Ensures crisp rendering at any zoom [30]
      ...options,
    });
    canvas?.add(textbox);
    canvas?.setActiveObject(textbox);
    canvas?.renderAll();
  };

  const addShape = (type: string) => {
    if (!canvas) return;
    const common = {
      left: 150,
      top: 150,
      fill: "#3b82f6",
      width: 100,
      height: 100,
    };
    let shape;

    // if (type === "rect") shape = new fabric.Rect({ ...common, rx: 8, ry: 8 });
    // else if (type === "circle")
    //   shape = new fabric.Circle({ ...common, radius: 50 });
    // else shape = new fabric.Triangle(common);
    switch (type) {
      case "rect":
        shape = new fabric.Rect({ ...common, rx: 0, ry: 0 });
        break;
      case "square":
        shape = new fabric.Rect({ ...common, width: 100, height: 100, rx: 8 });
        break;
      case "circle":
        shape = new fabric.Circle({ ...common, radius: 50 });
        break;
      case "triangle":
        shape = new fabric.Triangle({ ...common });
        break;
      case "ellipse":
        shape = shape = new fabric.Ellipse({ ...common, rx: 80, ry: 50 });
        break;
      case "pentagon":
        shape = new fabric.Polygon(
          [
            { x: 50, y: 0 },
            { x: 100, y: 38 },
            { x: 81, y: 100 },
            { x: 19, y: 100 },
            { x: 0, y: 38 },
          ],
          common,
        );
        break;
      default:
        shape = new fabric.Rect({ ...common, width: 100, height: 100, rx: 8 });
        break;
    }
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };

  // Line Tool Login
  const addLine = () => {
    if (!canvas) return;
    const line = new fabric.Line([50, 50, 250, 50], {
      stroke: "#000000",
      strokeWidth: 2,
      selectable: true,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  // 2. Pen & Brush Logic (Drawing Mode)
  const toggleDrawingMode = (
    isDrawing: boolean,
    brushType: "pencil" | "spray" = "pencil",
  ) => {
    if (!canvas) return;
    canvas.isDrawingMode = isDrawing;

    if (isDrawing) {
      canvas.freeDrawingBrush =
        brushType === "pencil"
          ? new fabric.PencilBrush(canvas)
          : new fabric.SprayBrush();
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "#000000";
    }
  };

  const changeColor = (color: string) => {
    const activeObject = canvas?.getActiveObject();

    if (!activeObject) return;

    // 1. Update the fill property [15]
    activeObject.set({ fill: color });

    // 2. Re-render the canvas to show changes [1]
    canvas?.renderAll();

    // 3. Fire events for auto-save and history [56, 70]
    canvas?.fire("object:modified");
  };

  // 3. Image Cropping (Basic Implementation)
  const enterCropMode = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    if (!activeObject || activeObject.type !== "image") return;

    // 1. Create the Crop Overlay Rectangle
    const cropBox = new fabric.Rect({
      left: activeObject.left,
      top: activeObject.top,
      width: activeObject.width! * activeObject.scaleX!,
      height: activeObject.height! * activeObject.scaleY!,
      fill: "rgba(0,0,0,0.3)", // Dim the area
      stroke: "#8b5cf6", // Canva Purple
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      cornerColor: "#8b5cf6",
      cornerStyle: "circle",
      borderColor: "#8b5cf6",
      transparentCorners: false,
    });

    // 2. Add to canvas and focus it
    canvas?.add(cropBox);
    canvas?.setActiveObject(cropBox);
    setCurrentCropBox(cropBox);
    setIsCropMode(true);
  };
  // 3. Simple Crop Execution (On Double Click or Button)
  const applyCrop = () => {
    const activeObject = canvas
      ?.getObjects()
      .find((obj) => obj.type === "image" && !obj.clipPath) as fabric.Image;
    if (!activeObject || !currentCropBox) return;

    // Calculate relative position for the clipPath
    const clipPath = new fabric.Rect({
      left: currentCropBox.left! - activeObject.left!,
      top: currentCropBox.top! - activeObject.top!,
      width: currentCropBox.width! * currentCropBox.scaleX!,
      height: currentCropBox.height! * currentCropBox.scaleY!,
      absolutePositioned: false, // Essential for relative clipping
    });

    activeObject.set("clipPath", clipPath);
    canvas?.remove(currentCropBox);
    canvas?.setActiveObject(activeObject);
    canvas?.renderAll();

    setIsCropMode(false);
    setCurrentCropBox(null);
    canvas?.fire("object:modified");
  };

  // Attach a temporary listener for the 'Enter' key to apply crop
  // const handleKey = (e: KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     applyCrop();
  //     window.removeEventListener("keydown", handleKey);
  //   }
  // };
  // window.addEventListener("keydown", handleKey)

  const setBrush = ({
    type,
    color,
    width,
  }: {
    type: string;
    color?: string;
    width: number;
  }) => {
    if (!canvas) return;

    // 1. FORCE DRAWING MODE ON
    // Do not check if it's on; just turn it on.
    canvas.isDrawingMode = true;

    // 2. SAFE ACCESS TO ERASER (Bypass TS types)
    const fabricAny = fabric as any;
    const EraserBrush = fabricAny.EraserBrush;

    // --- PENCIL ---
    if (type === "pencil") {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color || "#000000";
      canvas.freeDrawingBrush.width = width;
    }

    // --- SPRAY ---
    else if (type === "brush") {
      const SprayBrush = (fabric as any).SprayBrush;

      canvas.freeDrawingBrush = new SprayBrush(canvas);
      canvas.freeDrawingBrush.color = color || "#000000";
      canvas.freeDrawingBrush.width = width;
    }

    // --- ERASER ---
    else if (type === "eraser") {
      if (EraserBrush) {
        // Native Eraser (True Transparency)
        canvas.freeDrawingBrush = new EraserBrush(canvas);
        canvas.freeDrawingBrush.width = width;
      } else {
        // Fallback (White Paint)
        console.warn("EraserBrush not found. Using Whiteout fallback.");
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = "#ffffff";
        canvas.freeDrawingBrush.width = width;
      }
    }
  };

  const enablePaintBrush = (
    color: string = "#000000",
    width: number = 10,
    usePressure: boolean = false,
  ) => {
    if (!canvas) return;

    // canvas.isDrawingMode = true;
    Object.assign(canvas, { isDrawingMode: true });
    const brush = new fabric.PencilBrush(canvas);

    // 1. THE PHOTOSHOP FEEL: Rounded tips and smoothing
    brush.width = width;
    brush.color = color;
    brush.strokeLineCap = "round";
    brush.strokeLineJoin = "round";

    if (usePressure) {
      // 1. SIMULATED PRESSURE: Adjusts stroke based on mouse speed
      // Higher decimation = smoother, more "tapered" look
      brush.decimate = 1.5;

      // 2. SHADOW GLOW: Makes it look like ink on paper
      brush.shadow = new fabric.Shadow({
        blur: width / 4,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: color,
      });

      // canvas.freeDrawingBrush = brush;
      Object.assign(canvas, { freeDrawingBrush: brush });
    }
  };

  // const setBackgroundColor = (color: string) => {
  //   if (!canvas) return;
  //   canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  //   canvas.fire("object:modified"); // Trigger auto save
  // };

  const applyGradient = (options: {
    type: "linear" | "radial";
    color1: string;
    color2: string;
    angle: number; // 0 to 360
  }) => {
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    const { type, color1, color2, angle } = options;

    // 1. Calculate Coordinates for Linear Angles [15, 30]
    const angleRad = (angle * Math.PI) / 180;
    const coords =
      type === "linear"
        ? {
            x1: 0.5 - Math.cos(angleRad) * 0.5,
            y1: 0.5 - Math.sin(angleRad) * 0.5,
            x2: 0.5 + Math.cos(angleRad) * 0.5,
            y2: 0.5 + Math.sin(angleRad) * 0.5,
          }
        : {
            x1: 0.5,
            y1: 0.5,
            r1: 0, // Center start
            x2: 0.5,
            y2: 0.5,
            r2: 0.5, // Edge end
          };

    const gradient = new fabric.Gradient({
      type,
      gradientUnits: "percentage", // Simplifies scaling logic [1]
      coords,
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 },
      ],
    });

    obj.set("fill", gradient);
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  // Add these to your useEditor hook
  const zoomIn = () => {
    if (!canvas) return;
    let zoom = canvas.getZoom();
    zoom *= 1.1;
    if (zoom > 20) zoom = 20;
    canvas.setZoom(zoom);
  };

  const zoomOut = () => {
    if (!canvas) return;
    let zoom = canvas.getZoom();
    zoom /= 1.1;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
  };

  const resetZoom = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  };

  // Add this to your useEditor hook
  const fitScreen = () => {
    if (!canvas) return;

    const container = canvas.getElement().parentElement;
    if (!container) return;

    // 1. Get available space in the grey area
    const padding = 100;
    const availableWidth = container.clientWidth - padding;
    const availableHeight = container.clientHeight - padding;

    // 2. Calculate the scale ratio
    const scaleX = availableWidth / canvas.width!;
    const scaleY = availableHeight / canvas.height!;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up past 100%

    // 3. Apply Zoom using the official method
    canvas.setZoom(scale);

    // 4. THE FIX: Clone the viewportTransform array to bypass React 19 restriction
    // Using [...] creates a new memory reference that React doesn't "lock"
    const vpt = [...(canvas.viewportTransform || [1, 0, 0, 1, 0, 0])];

    // 5. Apply Zoom
    canvas.setZoom(scale);

    // 6. Center the viewport
    if (vpt) {
      vpt[4] = (container.clientWidth - canvas.width! * scale) / 2;
      vpt[5] = (container.clientHeight - canvas.height! * scale) / 2;

      canvas.setViewportTransform(vpt);

      canvas.requestRenderAll();
    }
  };

  const flipHorizontal = () => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    activeObject.set("flipX", !activeObject.flipX);
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  const flipVertical = () => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    activeObject.set("flipY", !activeObject.flipY);
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  // Group or unGroup items
  const groupObjects = () => {
    if (!canvas) return;

    // Get the current multi-selection
    const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeSelection || activeSelection.type !== "activeSelection") return;

    // Convert multi-selection into a single Group
    activeSelection.toGroup();
    canvas.requestRenderAll();
    canvas.fire("object:modified");
  };

  const ungroupObjects = () => {
    if (!canvas) return;

    // Get the current single Group
    const activeObject = canvas.getActiveObject() as fabric.Group;
    if (!activeObject || activeObject.type !== "group") return;

    // Explode the Group back into individual items
    activeObject.toActiveSelection();
    canvas.requestRenderAll();
    canvas.fire("object:modified");
  };

  // hooks/use-editor.ts
  const applyShadow = (options: {
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
    affectStroke?: boolean;
  }) => {
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    // 1. Create or Update the Shadow object
    const currentShadow =
      (obj.shadow as fabric.Shadow) ||
      new fabric.Shadow({
        color: "rgba(0,0,0,0.5)",
        blur: 5,
        offsetX: 5,
        offsetY: 5,
      });

    // 2. Apply new values
    if (options.color) currentShadow.color = options.color;
    if (options.blur !== undefined) currentShadow.blur = options.blur;
    if (options.offsetX !== undefined) currentShadow.offsetX = options.offsetX;
    if (options.offsetY !== undefined) currentShadow.offsetY = options.offsetY;
    if (options.affectStroke !== undefined)
      currentShadow.affectStroke = options.affectStroke;

    obj.set("shadow", currentShadow);
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  const enableLasso = () => {
    if (!canvas) return;

    // canvas.isDrawingMode = true;
    Object.assign(canvas, { isDrawingMode: true });
    const lassoBrush = new fabric.PencilBrush(canvas);
    lassoBrush.width = 2;
    lassoBrush.color = "#8b5cf6"; // Pro Purple
    lassoBrush.strokeDashArray = [5, 5]; // Dashed look

    // canvas.freeDrawingBrush = lassoBrush;
    Object.assign(canvas, { freeDrawingBrush: lassoBrush });

    // 3. THE LOGIC: On path completion, select objects inside
    canvas.on("path:created", (e: any) => {
      if (canvas.freeDrawingBrush !== lassoBrush) return;

      const path = e.path;
      const objects = canvas.getObjects().filter((obj) => {
        // Check if object is contained within the lasso path bounds
        return path.containsPoint(obj.getCenterPoint());
      });

      canvas.remove(path); // Remove the dashed line
      canvas.isDrawingMode = false;

      if (objects.length > 0) {
        const selection = new fabric.ActiveSelection(objects, { canvas });
        canvas.setActiveObject(selection);
      }
      canvas.requestRenderAll();
    });
  };

  const toggleLock = () => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    // 1. Determine the new state (if currently lockable, then lock it)
    const isLocked = activeObject.lockMovementX;
    const newState = !isLocked;

    // 2. Set all transformation properties to the new state
    activeObject.set({
      lockMovementX: newState,
      lockMovementY: newState,
      lockRotation: newState,
      lockScalingX: newState,
      lockScalingY: newState,
      hasControls: !newState, // Hide the "handles" when locked
      hoverCursor: newState ? "not-allowed" : "move",
      selectable: true, // Keep selectable so we can unlock it later
    });

    canvas?.discardActiveObject();
    canvas?.setActiveObject(activeObject);

    canvas?.requestRenderAll();
    canvas?.fire("object:modified"); // Trigger autosave
  };

  const applyFilterPreset = (presetName: string | null) => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;

    // 1. Guard: Ensure we have an image
    if (!activeObject || activeObject.type !== "image") return;

    // 2. Reset: Clear existing filters
    activeObject.filters = [];

    if (presetName) {
      // 3. Type Safety: Access filters safely
      // We cast to 'any' to allow dynamic string indexing
      const filterNamespace = fabric.Image.filters as any;
      const FilterClass = filterNamespace[presetName];

      // 4. Runtime Safety: Check if the class actually exists
      if (FilterClass) {
        const filter = new FilterClass();
        activeObject.filters.push(filter);
      } else {
        console.warn(
          `Filter "${presetName}" not found in fabric.Image.filters`,
        );
      }
    }

    // 5. Commit Changes
    activeObject.applyFilters();
    canvas?.renderAll();

    // 6. Trigger Auto-Save
    canvas?.fire("object:modified");
  };

  // hooks/use-editor.ts

  const updateStrokeColor = (color: string) => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ stroke: color, dirty: true });
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  const updateStrokeWidth = (width: number) => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    activeObject.set({
      strokeWidth: width,
      strokeUniform: true, // Essential: Border won't distort when scaling [24, 30]
      dirty: true,
    });

    // Safety: Ensure stroke color exists if width is applied
    if (width > 0 && !activeObject.stroke) {
      activeObject.set("stroke", "#000000");
    }

    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  const updateStrokeStyle = (style: "solid" | "dashed" | "dotted") => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    const styleMap = {
      solid: null,
      dashed: [10, 5], // 10px dash, 5px gap [1, 5]
      dotted: [2, 2], // 2px dash, 2px gap [13, 21]
    };

    activeObject.set({
      strokeDashArray: styleMap[style] || undefined,
      dirty: true,
    });

    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  const updateStrokeOpacity = (opacity: number) => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    // 1. Get current stroke (hex or rgb)
    const currentColor = activeObject.stroke || "#000000";

    // 2. Convert to RGBA (Value is 0 to 1) [15, 48]
    // Note: Fabric.js 'stroke' accepts standard CSS color strings
    const r = parseInt(currentColor.slice(1, 3), 16);
    const g = parseInt(currentColor.slice(3, 5), 16);
    const b = parseInt(currentColor.slice(5, 7), 16);

    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;

    activeObject.set({
      stroke: rgbaColor,
      dirty: true,
    });

    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  // Rectangle corner round tool
  const updateCornerRadius = (value: number) => {
    const activeObject = canvas?.getActiveObject() as fabric.Rect;

    // Corner radius (rx/ry) only applies to Rectangles in Fabric.js [15]
    if (!activeObject || activeObject.type !== "rect") return;

    // ✅ STEP 1: Normalize Scale (Convert visual stretch to physical dimensions) [59]
    const currentWidth = activeObject.width! * activeObject.scaleX!;
    const currentHeight = activeObject.height! * activeObject.scaleY!;

    (activeObject as fabric.Rect).set({
      width: currentWidth,
      height: currentHeight,
      scaleX: 1,
      scaleY: 1,
      rx: value,
      ry: value,
      dirty: true,
    });

    activeObject.setCoords();

    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  // Code for reset border
  const resetBorder = () => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    // Restore all properties to their "Clean" defaults [15, 30]
    (activeObject as fabric.Rect).set({
      stroke: undefined, // Removes border color
      strokeWidth: 0, // Sets thickness to zero
      strokeDashArray: undefined, // Removes dashed/dotted styles
      rx: 0, // Removes rounded corners (X)
      ry: 0, // Removes rounded corners (Y)
      dirty: true,
    });

    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  // color history
  useEffect(() => {
    const saved = localStorage.getItem("recent-colors");
    if (saved) setRecentColors(JSON.parse(saved));
  }, []);

  const addToHistory = (color: string) => {
    setRecentColors((prev) => {
      // 1. Remove color if it exists, then prepend it [8]
      const filtered = prev.filter((c) => c !== color);
      const updated = [color, ...filtered].slice(0, 8); // Keep last 8

      // 2. Persist to storage [6, 14]
      localStorage.setItem("recent-colors", JSON.stringify(updated));
      return updated;
    });
  };
  // Eyedropper to select colors
  const handleEyedropper = async () => {
    // Check if the API exists on window before using it [28]
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      const eyeDropper = new window.EyeDropper();

      try {
        // The promise resolves once a pixel is clicked [21]
        const result = await eyeDropper.open();
        const pickedColor = result.sRGBHex;

        changeColor(pickedColor);
        addToHistory(pickedColor); // Add to your recent colors list

        canvas?.renderAll();
      } catch (err) {
        // Occurs if the user cancels or the browser dismisses the tool [20]
        console.log("Eyedropper was cancelled or failed", err);
      }
    }
  };

  const addImageToSelectedShape = (imageUrl: string) => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") {
      toast.error("Please select a single shape or group to frame");
      return false;
    }

    // 2. Prevent framing into existing images or text
    if (activeObject.type === "image" || activeObject.type === "i-text") {
      return false;
    }

    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        // Ensure the image is fully loaded before creating the pattern [46]
        const imgElement = img.getElement() as HTMLImageElement;
        if (!imgElement) return;
        // 2. Calculate scaling to "Cover" the shape (Canva style)
        const shapeWidth = activeObject.width! * activeObject.scaleX!;
        const shapeHeight = activeObject.height! * activeObject.scaleY!;

        const scale = Math.max(
          shapeWidth / img.width!,
          shapeHeight / img.height!,
        );

        // Create the Pattern
        const pattern = new fabric.Pattern({
          source: imgElement,
          repeat: "no-repeat",
        });

        // Apply Matrix Transform for Scaling
        // This forces the pattern to scale to the "Cover size"
        pattern.patternTransform = [scale, 0, 0, scale, 0, 0];

        //  Assign Metadata
        const shape = activeObject as any;
        shape._isFrame = true;
        shape._originalImage = imageUrl;
        shape._patternScale = scale;

        // Override toObject to persist these fields
        const originalToObject = activeObject.toObject;
        activeObject.toObject = function (additionalProperties) {
          return originalToObject.call(this, [
            "_isFrame",
            "_originalImage",
            "_patternScale",
            ...(additionalProperties || []),
          ]);
        };

        // Apply pattern as shape's background fill
        // store the original image URL and scale for later repositioning
        activeObject.set({
          fill: pattern,
          dirty: true,
        });

        canvas?.renderAll();
        canvas?.fire("object:modified");
        toast.success("Background merged!");
      },
      { crossOrigin: "anonymous" },
    );
    return true; // Successfully framed
  };

  const enterEditFrame = () => {
    const shape = canvas?.getActiveObject() as any;
    // 1. Guard: Ensure it's a valid frame with an image URL
    if (!shape || !shape._isFrame || !shape._originalImage) {
      console.warn("Target is not a valid frame:", shape);
      return;
    }

    fabric.Image.fromURL(
      shape._originalImage,
      (img) => {
        if (!img) {
          console.error("Failed to load image for editing.");
          return;
        }

        shape.clone((clonedMask: fabric.Object) => {
          // 1. Calculate the 'Cover' Scale
          const shapeWidth = shape.getScaledWidth();
          const shapeHeight = shape.getScaledHeight();

          const scale = Math.max(
            shapeWidth / img.width!,
            shapeHeight / img.height!,
          );

          // 2. Calculate Centering Coordinates
          // Centers the scaled image exactly over the shape
          const centerX = shape.left! + shapeWidth / 2;
          const centerY = shape.top! + shapeHeight / 2;

          clonedMask.set({
            absolutePositioned: true,
            left: shape.left,
            top: shape.top,
            fill: "transparent",
            stroke: "#8b5cf6",
            strokeWidth: 3,
            selectable: false,
            evented: false,
          });

          (img as any).set({
            originX: "center",
            originY: "center",
            left: centerX,
            top: centerY,
            scaleX: scale,
            scaleY: scale,
            opacity: 0.5,
            _isEditingContent: true,
          });
          canvas?.add(img);
          canvas?.add(clonedMask);

          img.bringToFront();
          clonedMask.bringToFront();

          shape.set("visible", false);
          canvas?.setActiveObject(img);

          // Store the specific scale used for this session

          setEditingImage(img);
          setEditingShape(shape);
          setActiveFrameGhost(clonedMask);
          setIsEditingFrame(true);
          (shape as any)._currentEditScale = scale;

          canvas?.renderAll();
        });
      },
      { crossOrigin: "anonymous" },
    );
  };

  const exitEditFrame = () => {
    if (!editingImage || !editingShape || !activeFrameGhost) return;

    // 1. ROBUST ELEMENT EXTRACTION
    // We check multiple internal Fabric properties to find the real HTML element
    const imgElement =
      (editingImage as any)._element ||
      editingImage.getElement() ||
      (editingImage as any)._originalElement;

    // 2. CRITICAL TYPE GUARD: prevent 'createPattern' crash
    if (
      !imgElement ||
      !(
        imgElement instanceof HTMLImageElement ||
        imgElement instanceof HTMLCanvasElement
      )
    ) {
      console.error(
        "Invalid image element source for pattern. Aborting merge to prevent crash.",
      );
      return;
    }

    // const scale = (editingShape as any)._currentEditScale || 1;

    // 2. Calculate Global Top-Left of the Image
    // Since editingImage uses originX: 'center', we find its canvas-relative top-left
    const imgLeft = editingImage.left! - editingImage.getScaledWidth() / 2;
    const imgTop = editingImage.top! - editingImage.getScaledHeight() / 2;

    // 3. Calculate Global Top-Left of the Shape
    // Based on your enterEditFrame logic (centerX = shape.left + width/2),
    // your shape uses the default 'left/top' origin.
    const shapeLeft = editingShape.left!;
    const shapeTop = editingShape.top!;

    // 4. THE FIX: Normalize for Local Coordinate Space [7, 12]
    // We divide the image's attributes by the shape's scale to prevent "Double Scaling"
    const normalizedScaleX = editingImage.scaleX! / editingShape.scaleX!;
    const normalizedScaleY = editingImage.scaleY! / editingShape.scaleY!;

    const offsetX = (imgLeft - shapeLeft) / editingShape.scaleX!;
    const offsetY = (imgTop - shapeTop) / editingShape.scaleY!;

    // 5. Create Pattern with Normalized Matrix [33, 48]
    const newPattern = new fabric.Pattern({
      source: imgElement as HTMLImageElement,
      repeat: "no-repeat",
    });

    // Matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
    newPattern.patternTransform = [
      normalizedScaleX,
      0,
      0,
      normalizedScaleY,
      offsetX,
      offsetY,
    ];

    // 6. Final Swap & Refresh
    editingShape.set({
      fill: newPattern,
      visible: true,
      dirty: true, // Forces Fabric to re-render the pattern pixels
    });

    canvas?.remove(editingImage, activeFrameGhost);

    // Reset States
    setEditingImage(null);
    setEditingShape(null);
    setActiveFrameGhost(null);
    setIsEditingFrame(false);

    canvas?.setActiveObject(editingShape);
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  // hooks/use-editor.ts

  const handleFrameSnapping = (target: fabric.Object) => {
    if (!isEditingFrame || !activeFrameGhost || target.type !== "image") return;

    const threshold = 5; // Snap sensitivity in pixels

    // 1. Calculate Centers of the Ghost Frame (The Window)
    const frameCenter = activeFrameGhost.getCenterPoint();

    // 2. Calculate Centers of the Image
    const imageCenter = target.getCenterPoint();

    // 3. Horizontal Snapping (X-axis)
    if (Math.abs(imageCenter.x - frameCenter.x) < threshold) {
      target.set({
        left: frameCenter.x - (target.width! * target.scaleX!) / 2,
      });
    }

    // 4. Vertical Snapping (Y-axis)
    if (Math.abs(imageCenter.y - frameCenter.y) < threshold) {
      target.set({
        top: frameCenter.y - (target.height! * target.scaleY!) / 2,
      });
    }

    canvas?.renderAll();
  };

  const handleObjectScaling = (target: fabric.Object) => {
    const shape = target as any;
    if (!shape._isFrame || !(shape.fill instanceof fabric.Pattern)) return;

    const pattern = shape.fill as fabric.Pattern;
    const img = pattern.source as HTMLImageElement;

    // CRITICAL GUARD: Ensure the source is a valid HTML element with dimensions [34, 45]
    if (
      !img ||
      typeof img === "string" ||
      img.width === 0 ||
      img.height === 0
    ) {
      console.warn("Pattern source not ready for scaling.");
      return;
    }

    const w = shape.getScaledWidth();
    const h = shape.getScaledHeight();

    const scale = Math.max(w / img.width, h / img.height);
    const offsetX = (w - img.width * scale) / 2;
    const offsetY = (h - img.height * scale) / 2;

    pattern.patternTransform = [scale, 0, 0, scale, offsetX, offsetY];
    shape.set("dirty", true);
  };

  const setBackgroundColor = (color: string) => {
    if (!canvas) return;
    canvas.setBackgroundColor(color, () => {
      canvas.renderAll();
      canvas.fire("object:modified");
    });
  };

  const setBackgroundGradient = (
    stops: { offset: number; color: string }[],
  ) => {
    if (!canvas) return;
    const gradient = new fabric.Gradient({
      type: "linear",
      coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
      colorStops: stops,
    });
    canvas.setBackgroundColor(gradient, canvas.renderAll.bind(canvas));
    canvas.fire("object:modified");
  };

  const setBackgroundPattern = (url: string) => {
    if (!canvas) return;
    fabric.util.loadImage(
      url,
      (img) => {
        canvas.setBackgroundColor(
          new fabric.Pattern({
            source: img as HTMLImageElement,
            repeat: "repeat",
          }),
          canvas.renderAll.bind(canvas),
        );
        canvas.fire("object:modified");
      },
      { crossOrigin: "anonymous" },
    ); // Essential for exports [1, 15]
  };

  const setBackgroundImage = (url: string) => {
    if (!canvas) return;

    fabric.Image.fromURL(
      url,
      (img) => {
        // 1. Calculate cover scaling [23, 34]
        const scaleX = canvas.width! / img.width!;
        const scaleY = canvas.height! / img.height!;
        const scale = Math.max(scaleX, scaleY); // Math.max ensures "Cover" behavior [73]

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: scale,
          scaleY: scale,
          originX: "center",
          originY: "center",
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          crossOrigin: "anonymous", // Essential for preventing tainted canvas [62, 68]
        });

        canvas.fire("object:modified");
      },
      { crossOrigin: "anonymous" },
    );
  };

  // 1. Adjust Background Image Filters (Blur/Brightness) [41]
  const setBackgroundAdjustment = (
    type: "blur" | "brightness",
    value: number,
  ) => {
    if (!canvas || !canvas.backgroundImage) return;

    const img = canvas.backgroundImage as fabric.Image;
    img.filters = img.filters || [];

    if (type === "blur") {
      img.filters[0] = new fabric.Image.filters.Blur({ blur: value });
    } else if (type === "brightness") {
      img.filters[1] = new fabric.Image.filters.Brightness({
        brightness: value,
      });
    }

    img.applyFilters();
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  // 2. Set Background Pattern Opacity [3, 53]
  const setBackgroundOpacity = (value: number) => {
    if (!canvas) return;
    const bg = canvas.backgroundColor;
    if (bg instanceof fabric.Pattern) {
      // Patterns require custom source drawing for opacity or a Rect-based BG
    }
  };

  return {
    addText,
    addTextbox,
    addShape,
    addLine,
    changeColor,
    toggleDrawingMode,
    setBrush,
    enterCropMode,
    applyCrop,
    isCropMode,
    applyGradient,
    zoomIn,
    zoomOut,
    resetZoom,
    fitScreen,
    flipHorizontal,
    flipVertical,
    groupObjects,
    ungroupObjects,
    applyShadow,
    enablePaintBrush,
    enableLasso,
    toggleLock,
    applyFilterPreset,
    addImageToSelectedShape,
    enterEditFrame,
    exitEditFrame,
    isEditingFrame,
    handleFrameSnapping,
    handleObjectScaling,
    updateStrokeWidth,
    updateStrokeColor,
    updateStrokeStyle,
    updateStrokeOpacity,
    updateCornerRadius,
    resetBorder,
    handleEyedropper,
    recentColors,
    addToHistory,
    setBackgroundColor,
    setBackgroundGradient,
    setBackgroundPattern,
    setBackgroundImage,
    setBackgroundAdjustment,
    setBackgroundOpacity,
  };
};
