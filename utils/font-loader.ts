// utils/font-loader.ts
export const loadGoogleFont = (fontFamily: string) => {
  if (!fontFamily) return;

  const fontId = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;

  // 1. Check if the link already exists in the document [40]
  if (document.getElementById(fontId)) return;

  // 2. Create the link element
  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";

  // 3. Request specific weights (400, 700) to keep the payload light [11]
  const familyParam = fontFamily.replace(/\s+/g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;700&display=swap`;

  document.head.appendChild(link);
};
