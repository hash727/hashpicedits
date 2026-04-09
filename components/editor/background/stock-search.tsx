// components/editor/stock-search.tsx
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, Monitor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StockSearchProps {
  onSelect: (url: string) => void;
  onAddImage?: (url: string) => void;
}

export function StockSearch({ 
  onSelect,
  onAddImage,
}: StockSearchProps ) {
  const [query, setQuery] = useState("abstract");
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Guard to satisfy linter [1]
  const { ref, inView } = useInView({ threshold: 0.5 });

  const fetchImages = useCallback(async (isNewSearch = false) => {
    if (isLoading) return; // Prevent concurrent requests [39]
    
    setIsLoading(true);

    const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if(!ACCESS_KEY){
      console.error("Missing Unsplash Access Key in .env.local");
      setIsLoading(false);
      return;
    }
    const currentPage = isNewSearch ? 1 : page;
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${isNewSearch ? 1 : page}&query=${query}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}` // Use header instead of URL param for security [1, 13]
          }
        }
      );

      // 1. Check for API success (Status 200) [9, 6]
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0] || "API Limit reached or invalid key");
      }

      const data = await response.json();

      // 2. Add safety fallback for the results array [45, 53]
      const newResults = data.results || [];
      
      setImages(prev => (isNewSearch ? newResults : [...prev, ...newResults]));
      setPage(prev => (isNewSearch ? 2 : prev + 1));
    } catch (error) {
      console.warn("Using Mock Data Fallback due to API Error");
      // 2. MOCK DATA FALLBACK: Prevents UI from breaking [77]
      const mock = Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-${i}`,
        urls: { small: `https://picsum.photos/seed/${i}/400/300`, regular: `https://picsum.photos/seed/${i}/1200/800` },
        alt_description: "Fallback Image"
      }));
      setImages(prev => (isNewSearch ? mock : [...prev, ...mock]));
    } finally {
      setIsLoading(false); // Safe state update after async task [34]
    }
  }, [query, page, isLoading]);

  // Trigger Search on Enter
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchImages(true);
  };

  useEffect(() => {
    // Condition-based execution avoids direct setState collisions [25]
    if (inView && !isLoading && images.length > 0) {
      fetchImages();
    }
  }, [inView, isLoading, fetchImages, images.length]);

  // Initial Load
  useEffect(() => {
    if (images.length === 0) fetchImages(true);
  }, []);

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Search 4K photos..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="bg-slate-50 border-slate-200"
      />
      <div className="grid grid-cols-2 gap-2">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="group relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm"
          >
            {/* Image Thumbnail */}
            <img 
              src={img.urls.small} 
              alt={img.alt_description} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />

            {/* --- HOVER OVERLAY (THE ACTION MENU) --- */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              
              {/* Option 1: Set as Background */}
              <Button 
                size="sm" 
                variant="secondary"
                className="w-full h-8 text-[10px] font-semibold gap-2 bg-white/90 hover:bg-white"
                onClick={() => onSelect(img.urls.regular)}
              >
                <Monitor className="w-3 h-3" />
                Set BG
              </Button>

              {/* Option 2: Add as Image Layer */}
              {onAddImage && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="w-full h-8 text-[10px] font-semibold gap-2 bg-white/90 hover:bg-white"
                  onClick={() => onAddImage(img.urls.regular)}
                >
                  <ImagePlus className="w-3 h-3" />
                  Add Img
                </Button>
              )}

            </div>
          </div>
        ))}
        {/* <div ref={ref} className="h-10 w-full flex items-center justify-center text-[10px] text-slate-400">
          {isLoading ? "Loading..." : images.length > 0 ? "Scroll for more" : ""}
        </div> */}

        {/* Loading Skeletons */}
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-lg bg-slate-200" />
        ))}

        {/* Infinite Scroll Sentinel */}
        <div ref={ref} className="h-4 w-full" />
      </div>
    </div>
  );
}
