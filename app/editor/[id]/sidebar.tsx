"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fabric } from "fabric";
import { 
  Square, Circle, Triangle, Type, 
  Image as ImageIcon, LayoutGrid, Palette, 
  SquareActivity,
  Ellipse,
  Pentagon,
  Pencil,
  RefreshCw,
  Trash2,
  Minus,
  Filter,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useEditor } from "@/hooks/use-editor";
// import { SidebarBackground } from "./sidebar-background";
import { SidebarBackground } from "@/components/editor/background/sidebar-background";
import { SidebarUploads } from "./sidebar-uploads";
import { deleteAssetAction, getUserAssets } from "@/app/actions/assets";
import { SidebarStickers } from "./sidebar-stickers";
import { toast } from "sonner";
import { FontTool } from "@/components/editor/font-tool";
import Link from "next/link";
import { SidebarDraw } from "@/components/editor/sidebar-draw";
import { useHistory } from "@/hooks/use-history";
import { FilterSidebar } from "@/components/editor/filter-sidebar";
import { getPublicTemplates } from "@/app/actions/templates";
import TemplateCard from "@/components/templates/template-card";
import { createProjectFromTemplate } from "@/app/actions/projects";
import { TemplateImportModal } from "@/components/templates/template-import-modal";
import { TextTab } from "@/components/editor/tabs/text-tab";

interface EditorSidebarProps {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null; // Add this
  isPro: boolean;
  applyFilterPreset: any;
}

const CATEGORIES = ["General", "Social Media", "Posters", "Business", "Resume"]

export function EditorSidebar({ 
  canvas, 
  selectedObject, 
  isPro,
  applyFilterPreset, 
}: EditorSidebarProps) {
  const { 
    addLine, 
    addText,
    addTextbox, 
    addShape, 
    toggleDrawingMode,
    setBrush,
    enablePaintBrush,
    enableLasso,
    addImageToSelectedShape,
    updateStrokeWidth,
    updateStrokeStyle,
    updateStrokeColor,
  } = useEditor(canvas);
  const { saveHistory, undo, redo, canUndo, canRedo } = useHistory(canvas);
  
  const [assets, setAssets] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Code for templates
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isImageSelected = selectedObject?.type === "image";
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 1. Define the Fetch Logic as a reusable function
  const fetchAssets = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      
      const data = await getUserAssets();
      setAssets(data);
      
      if (isManual) {
        toast.success("Gallery updated", { duration: 1500 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch images");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // const fetchAssets = async () => {
    //   const data = await getUserAssets();
    //   setAssets(data);
    // };
    fetchAssets();
  }, [fetchAssets]);

  const addImageToCanvas = (url: string) => {
    if (!canvas) return;
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(200);
      canvas.add(img).centerObject(img).setActiveObject(img);
      canvas.renderAll();
      canvas.fire("object:modified");
    }, { crossOrigin: "anonymous" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this image from storage?")) return;

    try {
      await deleteAssetAction(id);
      // Refresh your local 'assets' state
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted from S3 and Gallery");
    } catch (err) {
      toast.error("Delete failed. Check S3 permissions.");
    }
  }

  
  // 1. Function to handle manual button scrolling
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleImageClick = (url: string) => {
    if (!canvas) return;

    // 1. Try to insert into the selected shape
    const wasFramed = addImageToSelectedShape(url);

    // 2. Fallback: Add as a new image if no shape was selected
    if (!wasFramed) {
      fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(200);
        canvas.add(img).centerObject(img).setActiveObject(img);
        canvas.renderAll();
        canvas.fire("object:modified");
      }, { crossOrigin: "anonymous" });
    }
  };

  // get templates
  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getPublicTemplates();
      setTemplates(data);
    };
    fetchTemplates();
  }, [])

  // Get Filtered Category wise templates
  useEffect(() => {
    const fetchFiltered = async () => {
      const data = await getPublicTemplates(activeCategory);
      setTemplates(data);
    };
    fetchFiltered();
  }, [activeCategory])

  const handleTemplateClick = (template: any) => {
  setSelectedTemplate(template);
  setIsModalOpen(true);
};

const onMerge = () => {
  if (!canvas || !selectedTemplate) return;
  
  // Fabric 5.3.0 logic to add objects from JSON
  fabric.util.enlivenObjects(
    selectedTemplate.json.objects, 
    (objects: fabric.Object[]) => {
      if(!canvas || !canvas.getContext()) return;

      objects.forEach((obj) => {
        canvas.add(obj);
      });
      canvas.renderAll();
      canvas.fire("object:modified");
      toast.success("Template added to current design");
    },
    null!, // namespace
    undefined  // reviver
  );
  setIsModalOpen(false);
};

const onNew = async () => {
  // Call your Server Action from step 1
  await createProjectFromTemplate(selectedTemplate.id);
  setIsModalOpen(false);
};

  return (
    <aside className="w-full border-r bg-white h-full flex flex-col">

      <Tabs defaultValue="elements" className="flex-1 flex flex-col overflow-hidden py-2">


      <div className="group relative w-full border-b bg-white shrink-0 py-2">
      
      {/* LEFT BUTTON & GRADIENT Overlay */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <button 
          onClick={() => scroll("left")}
          className="absolute left-1 p-1 rounded-full bg-white border shadow-md hover:bg-slate-50 pointer-events-auto"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* SCROLLABLE CONTAINER */}
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth select-none"
      >
      
        {/* 1. Professional Tab List (4 Columns) */}
        {/* <div className="w-full border-b bg-white shrink-0 overflow-x-auto overflow-y-hidden no-scrollbar py-4 select-none"> */}
          <TabsList className="inline-flex h-auto w-auto justify-start rounded-none bg-transparent py-2 p-0 flex-nowrap">
            {[
              { val: "templates", icon: LayoutGrid, label: "Templates"},
              { val: "elements", icon: LayoutGrid, label: "Elements" },
              { val: "draw", icon: Pencil, label: "Draw" },
              { val: "text", icon: Type, label: "Text" },
              { val: "background", icon: Palette, label: "Bg" },
              { val: "filters", icon: Filter, label: "Filters"},
              { val: "uploads", icon: ImageIcon, label: "Uploads" },
            ].map((item) => (
              <TabsTrigger
                key={item.val}
                value={item.val}
                disabled={item.val == "filters" && !isImageSelected}
                className="flex h-full min-h-[70px] shrink-0 flex-col items-center justify-center gap-1.5 px-4 py-5 text-[10px] data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all cursor-pointer"
              >
                <item.icon className="h-4 w-4" />
                <span className="font-bold uppercase tracking-tighter text-[9px]">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        {/* </div> */}

        {/* RIGHT BUTTON & GRADIENT Overlay */}
      <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        <button 
          onClick={() => scroll("right")}
          className="absolute right-1 p-1 rounded-full bg-white border shadow-md hover:bg-slate-50 pointer-events-auto"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
    </div>

        {/* 2. Content Area */}
        <div className="flex-1 overflow-hidden">

          {/* Templates Tab */}
          <TabsContent value="templates" className="h-full flex flex-col m-0">
              {/* Category Pill Filters */}
              <div className="px-4 py-2 border-b">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-2 pb-2">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        size="sm"
                        className="rounded-full text-[10px] h-7"
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              {/* Templates Grid */}

              {/* Templates Grid */}
            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-2 gap-3">
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <>
                      <TemplateCard 
                        key={template.id} 
                        template={template} 
                        canvas={canvas}
                        isPro={isPro}
                      />

                    </>
                  ))
                ) : (
                  <p className="text-[10px] text-center text-muted-foreground col-span-2">
                    No templates found in this category.
                  </p>
                )}
              </div>
            </ScrollArea>
            
          </TabsContent>
          {/* Elements Tab */}
          <TabsContent value="elements" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-tight">Shapes</p>
              <div className="grid grid-cols-3 gap-3 py-4">
                {/* Line */}
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addLine()}>
                  <Minus className="h-6 w-6" />
                  <span className="text-[10px]">Line</span>
                </Button>

                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addShape("rect")}>
                  <SquareActivity className="h-6 w-6" />
                  <span className="text-[10px]">Rectangle</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addShape("square")}>
                  <Square className="h-6 w-6" />
                  <span className="text-[10px]">Square</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addShape("circle")}>
                  <Circle className="h-6 w-6" />
                  <span className="text-[10px]">Circle</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addShape("ellipse")}>
                  <Ellipse className="h-6 w-6" />
                  <span className="text-[10px]">Ellipse</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addShape("triangle")}>
                  <Triangle className="h-6 w-6" />
                  <span className="text-[10px]">Triangle</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:border-primary transition-all" onClick={() => addShape("pentagon")}>
                  <Pentagon className="h-6 w-6" />
                  <span className="text-[10px]">Pentagor</span>
                </Button>

              </div>
              <Separator />
              <p className="text-xs font-bold text-slate-500 uppercase mb-4 py-2">Emojis</p>
              <div className="grid grid-cols-6 gap-1 mb-6">
                {["😀", "🔥", "🚀", "✨", "❤️", "👍", "🎉", "💡","😊", "😂","🤣","❤","😍","😒","👌","😘","💕","😁","🙌","🤦‍♀️","🤦‍♂️","🤷‍♀️","🤷‍♂️","✌","🤞","😉","😎","🎶","😢","💖","😜","👏","💋","🌹","🎂","🤳","🐱‍👤","🐱‍🏍","🐱‍💻","🐱‍🐉","🐱‍👓","🐱‍🚀","✔","👀","😃","😆","🤔","🤢","🎁"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addText(emoji, { fontSize: 36 })}
                    className="h-4 flex items-center justify-center text-xl hover:bg-slate-100 py-4 rounded-md transition"
                  >
                    {emoji}
                  </button>
                ))}

              </div>
              
              <Separator />
              {/* Stickers */}
              <div className="grid grid-cols-1 gap-2 mb-6">
              
                <SidebarStickers 
                  canvas={canvas}
                />
              </div>
              
            </ScrollArea>
          </TabsContent>
          
          {/* // New "Draw" Tab */}
          <TabsContent value="draw" className="p-4 space-y-4">
            <p className="text-[10px] font-bold uppercase text-slate-500">Brushes</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className={canvas?.isDrawingMode ? "border-primary bg-primary/5" : ""}
                onClick={() => toggleDrawingMode(true, "pencil")}
              >
                <Pencil className="mr-2 h-4 w-4" /> Pen
              </Button>
              <Button variant="outline" onClick={() => toggleDrawingMode(false)}>
                <Type className="mr-2 h-4 w-4" /> Select Mode
              </Button>
            </div>
            <SidebarDraw
              canvas={canvas}
              setBrush={setBrush}
              enablePaintBrush={enablePaintBrush}
              enableLasso={enableLasso}
              undo={undo}
              redo={redo}
            />
          </TabsContent>

          {/* Text Tab */}
          {/* <TabsContent value="text" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-tight">Selects Fonts:</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FontTool selectedObject={selectedObject} canvas={canvas} />
                  <Separator orientation="vertical" className="h-6" />
                  
                </div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-tight">Typography</p>
                <Button variant="outline" className="w-full h-16 justify-start px-4 text-2xl font-black" onClick={() => addText("Add a heading", { fontSize: 40, fontWeight: "bold" })}>
                  Add a heading
                </Button>
                <Button variant="outline" className="w-full h-12 justify-start px-4 text-lg font-bold" onClick={() => addText("Add a subheading", { fontSize: 24, fontWeight: "semibold" })}>
                  Add a subheading
                </Button>
                <Button variant="outline" className="w-full h-10 justify-start px-4 text-sm" onClick={() => addText("Body text", { fontSize: 16 })}>
                  Add body text
                </Button>
              </div>
            </ScrollArea>
          </TabsContent> */}

          <TextTab
            canvas={canvas}
            selectedObject={selectedObject}
            addText={addText}
            addTextbox={addTextbox}
          />

          {/* Background Tab */}
          <TabsContent value="background" className="h-full m-0">
            <ScrollArea className="h-full">
              <SidebarBackground canvas={canvas} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="filters" className="flex-1 overflow-y-auto">
            <FilterSidebar 
              applyFilterPreset={applyFilterPreset} 
              selectedObject={selectedObject} 
            />
          </TabsContent>

          {/* Uploads Tab */}
          <TabsContent value="uploads" className="h-full m-0 flex flex-col">
            {/* Sticky Upload Header */}
            <div className="p-4 border-b bg-white z-10 shrink-0">
              <SidebarUploads canvas={canvas} onUploadSuccess={() => fetchAssets()} />
            </div>

            {/* Scrollable Gallery Header with Refresh */}
            <div className="px-4 py-3 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Your Assets
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => fetchAssets(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>


            {/* Gallery Grid */}
            <ScrollArea className="flex-1 p-4">
              <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-tight">Your Gallery</p>
              <div className="grid grid-cols-2 gap-3 pb-4">
                {assets.map((asset) => (
                  <div 
                    key={asset.id} 
                    draggable
                    onDragStart={(e) => {
                      // Store the URL to be retrieved on drop
                      e.dataTransfer.setData("imageType", "uploaded-image")
                      e.dataTransfer.setData("imageUrl", asset.url)
                    }}
                    className="group relative aspect-square bg-slate-50 rounded-lg overflow-hidden cursor-pointer border border-slate-200 hover:border-primary transition-all shadow-sm"
                    onClick={() => addImageToCanvas(asset.url)}
                  >
                    <Image 
                      src={asset.url} 
                      alt={asset.name || "Upload"} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      // onClick={() => handleImageClick(asset.url)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("imageUrl", asset.url);
                        e.dataTransfer.setData("imageType", "uploaded-image")
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    {/* delete button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents adding image to canvas
                        handleDelete(asset.id);
                      }}
                      className="absolute top-1 right-1 p-1 bg-white/90 rounded text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              
              

              <p className="text-xs font-bold text-slate-500 uppercase mb-4">Stickers</p>
              <div className="grid grid-cols-2 gap-2">
                {/* Example static sticker assets */}
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="relative h-24 bg-slate-50 rounded-lg border flex items-center justify-center cursor-pointer hover:border-primary p-2 overflow-hidden"
                    onClick={() => addImageToCanvas(`/stickers/sticker-${i}.png`)}
                  >
                    <img src={`/stickers/sticker-${i}.png`} alt="Sticker" className="object-contain p-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
      {/* // At the bottom of sidebar.tsx */}
      {!isPro && (
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/20 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-primary text-center">
              Daily Limit: 3/3 Exports
            </p>
            <Link href="/dashboard/billing" className="block">
              <Button className="w-full h-8 text-[10px] font-black uppercase tracking-wider shadow-md">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      )}

      <TemplateImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmMerge={onMerge}
        onConfirmNew={onNew}
      />

    </aside>
  );
}
