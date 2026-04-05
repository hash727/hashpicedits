export function GradientGrid({ onSelect }: any) {
  const gradients = [
    { name: "Sunset", stops: [{ offset: 0, color: "#f97316" }, { offset: 1, color: "#ef4444" }] },
    { name: "Ocean", stops: [{ offset: 0, color: "#3b82f6" }, { offset: 1, color: "#2dd4bf" }] },
    { name: "Lush", stops: [{ offset: 0, color: "#10b981" }, { offset: 1, color: "#3b82f6" }] },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {gradients.map((g) => (
        <button key={g.name} onClick={() => onSelect(g.stops)}
          className="h-12 rounded-lg border hover:opacity-80 transition"
          style={{ background: `linear-gradient(to bottom right, ${g.stops[0].color}, ${g.stops[1].color})` }}
        />
      ))}
    </div>
  );
}
