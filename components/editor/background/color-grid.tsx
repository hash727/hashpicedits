export function ColorGrid({ colors, onSelect }: any) {
  const defaultColors = ["#ffffff", "#000000", "#f3f4f6", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
  const palette = colors || defaultColors;

  return (
    <div className="grid grid-cols-4 gap-2">
      {palette.map((c: string) => (
        <button key={c} onClick={() => onSelect(c)} 
          className="aspect-square rounded-md border hover:scale-105 transition shadow-sm"
          style={{ backgroundColor: c }} 
        />
      ))}
    </div>
  );
}
