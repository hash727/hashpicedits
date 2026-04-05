"use server";

export async function getTrendingStickers(searchQuery: string = "") {
  const API_KEY = process.env.GIPHY_API_KEY;

  console.log("Search Query:", searchQuery);
  if (!API_KEY) {
    console.error("❌ GIPHY_API_KEY is missing in your .env file.");
    return [];
  }

  // FIXED: Corrected the endpoint path and added '?' for query parameters
  // const endpoint = searchQuery
  //   ? `https://api.giphy.com{API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=20`
  //   : `https://api.giphy.com{API_KEY}&limit=20`;

  const endpoint = searchQuery
    ? `https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${searchQuery}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    : `https://api.giphy.com/v2/emoji?api_key=${API_KEY}&limit=25&offset=0`;
  // `https://api.giphy.com/v1/gifs/categories?api_key=${API_KEY}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Giphy API Error: ${response.statusText}`);
    }

    const result = await response.json();

    return result.data
      .map((item: any) => {
        // 1. Use optional chaining (?.) to prevent "Cannot read propoerties of unndefined"
        // Proved a fallback order: fixed_height -> orignal -> empty string
        const url =
          item.images?.fixed_height?.url || item.images?.original?.url || "";
        return {
          id: item.id,
          url: url,
          title: item.title || "Giphy Sticker",
        };
      })
      .filter((sticker: any) => sticker.url !== "");
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}
