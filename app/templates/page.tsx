'use client'
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getPublicTemplates } from "../actions/templates";

export default function TemplatesGallery() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // 1. EXTRACT CATEGORIES [24, 35]
  const categories = useMemo(() => 
    ["All", ...new Set(templates.map(t => t.category))], 
    [templates]
  );

  // 2. FILTERED TEMPLATE LOGIC [30, 31]
  const filteredTemplates = useMemo(() => 
    activeCategory === "All" 
      ? templates 
      : templates.filter(t => t.category === activeCategory),
    [templates, activeCategory]
  );

  useEffect(() => { getPublicTemplates().then(setTemplates); }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Design Templates</h1>
        
        {/* CATEGORY FILTER BAR [24, 27] */}
        <div className="flex flex-wrap gap-2 pb-4">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-6 transition-all hover:scale-105"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="group relative border-0 rounded-2xl overflow-hidden bg-slate-50 transition-shadow hover:shadow-2xl">
            <div className="aspect-[3/4] relative overflow-hidden">
              {template.thumbnail ? (
                <Image 
                  src={template.thumbnail} 
                  alt={template.name} 
                  fill 
                  // Skip server-side processing for Base64 data [51]
                  unoptimized={template.thumbnail.startsWith("data:")}
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">Empty</div>
              )}
            </div>

            <div className="p-5 bg-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 truncate">{template.name}</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{template.category}</p>
                </div>
                {template.isPro && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded">PRO</span>
                )}
              </div>
              <Button onClick={() => setSelectedTemplate(template)} className="w-full mt-6 font-semibold shadow-md">
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
