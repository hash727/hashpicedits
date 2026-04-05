"use client";

import { useState } from "react";
import { fabric } from "fabric";
import { getUploadUrl } from "@/app/actions/s3";
import { saveAsset } from "@/app/actions/assets";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

interface SidebarUploadsProps {
  canvas: fabric.Canvas | null;
  onUploadSuccess?: () => void; 
}

export function SidebarUploads({ canvas, onUploadSuccess }: SidebarUploadsProps) {
  const [isUploading, setIsUploading] = useState(false);
//   const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    try {
      setIsUploading(true);

      // 1. Get Presigned URL from Server
      const { uploadUrl, publicUrl } = await getUploadUrl(file.name, file.type);

      // 2. Upload to S3 via Browser Fetch
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("S3 Upload Failed");

      // 3. Save to PostgreSQL (Prisma)
      await saveAsset(publicUrl, file.name);

      // 4. Add to Fabric.js Canvas
      fabric.Image.fromURL(publicUrl, (img) => {
        img.scaleToWidth(300);
        canvas.add(img).centerObject(img).setActiveObject(img);
        canvas.renderAll();
        canvas.fire("object:modified"); // Triggers auto-save
      }, { crossOrigin: "anonymous" }); // Crucial for PDF/PNG export

      if(onUploadSuccess){
        onUploadSuccess();
      }

      toast.success("Image uploaded successfully",{
         description: "Your asset is now available in the gallery" 
        });
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", {
         description: "Please check your AWS S3 permissions.",
        });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button asChild className="w-full cursor-pointer" disabled={isUploading}>
            <span>
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4">
        {/* Placeholder for Library - You can fetch user assets here */}
        <div className="aspect-square bg-slate-100 rounded border-2 border-dashed flex items-center justify-center">
          <ImageIcon className="text-slate-400 h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
