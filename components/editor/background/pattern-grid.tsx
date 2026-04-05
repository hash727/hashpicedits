export function PatternGrid({ onSelect }: any) {
  const patterns = [
    { name: "Paper", url: "https://www.transparenttextures.com/patterns/paper.png" },
    { name: "Fiber", url: "https://www.transparenttextures.com/patterns/carbon-fibre.png" },
    { name: "Grid", url: "https://www.transparenttextures.com/patterns/graphy.png" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {patterns.map((p) => (
        <button key={p.name} onClick={() => onSelect(p.url)}
          className="aspect-video rounded-lg border bg-slate-50 hover:bg-slate-100 transition flex items-center justify-center p-1"
        >
          <img src={p.url} alt={p.name} className="max-h-full rounded shadow-sm opacity-60" />
        </button>
      ))}
    </div>
  );
}