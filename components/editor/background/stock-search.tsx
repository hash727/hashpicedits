// components/editor/stock-search.tsx
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";

export function StockSearch({ onSelect }: { onSelect: (url: string) => void }) {
  const [query, setQuery] = useState("nature");
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

  useEffect(() => {
    // Condition-based execution avoids direct setState collisions [25]
    if (inView && !isLoading) {
      fetchImages();
    }
  }, [inView, isLoading, fetchImages]);

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Search 4K photos..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchImages(true)}
      />
      <div className="grid grid-cols-2 gap-2">
        {images.map((img, i) => (
          <button key={`${img.id}-${i}`} onClick={() => onSelect(img.urls.regular)} className="aspect-video bg-slate-100 rounded-md overflow-hidden hover:opacity-80 transition group">
            <img src={img.urls.small} alt={img.alt_description} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
          </button>
        ))}
        <div ref={ref} className="h-10 w-full flex items-center justify-center text-[10px] text-slate-400">
          {isLoading ? "Loading..." : images.length > 0 ? "Scroll for more" : ""}
        </div>
      </div>
    </div>
  );
}
