"use client";

import { getExportSettings } from "@/app/actions/export";
import { fabric } from "fabric";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf"; // npm install jspdf

export function ExportTool({ canvas }: { canvas: fabric.Canvas | null }) {
  
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    if (!canvas) return;

    const toastId = toast.loading(`Preparing ${format.toUpperCase()}...`);
    const settings = await getExportSettings();
    
    // 1. Watermark Logic for Free Users
    let watermark: fabric.Text | null = null;
    if (settings.shouldWatermark) {
      watermark = new fabric.Text("Made with HashPic Editor", {
        fontSize: 40,
        fill: "rgba(255,255,255,0.4)",
        left: canvas.width! / 2,
        top: canvas.height! / 2, // Centered watermark is harder to crop out
        originX: "center",
        originY: "center",
        angle: -45,
        selectable: false,
      });
      canvas.add(watermark);
      canvas.renderAll();
    }

    try {
      if (format === "pdf") {
        // --- PRO PDF EXPORT ---
        if (!settings.isPro) {
          toast.error("PDF Export is a Pro feature!", { id: toastId });
          if (watermark) canvas.remove(watermark);
          return;
        }

        const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
        const pdf = new jsPDF({
          orientation: canvas.width! > canvas.height! ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width!, canvas.height!]
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width!, canvas.height!);
        pdf.save(`design-${Date.now()}.pdf`);

      } else {
        // --- PNG / JPG EXPORT ---
        const dataUrl = canvas.toDataURL({
          format: format === "jpg" ? "jpeg" : "png",
          multiplier: settings.multiplier,
          quality: settings.quality,
        });

        const link = document.createElement("a");
        link.download = `design-${settings.isPro ? "HD" : "SD"}.${format}`;
        link.href = dataUrl;
        link.click();
      }

      toast.success(`${format.toUpperCase()} Exported!`, { id: toastId });
    } catch (error) {
      toast.error("Export failed. Check S3 CORS settings.", { id: toastId });
    } finally {
      // 3. Always clean up watermark
      if (watermark) {
        canvas.remove(watermark);
        canvas.renderAll();
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 shadow-xl">
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleExport("png")}>
          Download PNG (Best for images)
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleExport("jpg")}>
          Download JPG (Small file size)
        </DropdownMenuItem>
        <Separator className="my-1" />
        <DropdownMenuItem 
          className="text-primary font-bold cursor-pointer flex justify-between" 
          onClick={() => handleExport("pdf")}
        >
          <span>✨ Export to PDF</span>
          <Sparkles className="h-3 w-3" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
