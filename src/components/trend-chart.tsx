/**
 * Recent game scores as a simple line. Labelled as game performance only —
 * never as a medical or cognitive measure.
 */
export function TrendChart({
  points,
  label,
}: {
  points: { score: number; played_at: string }[];
  label: string;
}) {
  const width = 320;
  const height = 110;
  const padding = 10;

  if (points.length === 0) {
    return (
      <div className="grid h-28 place-items-center rounded-xl border border-border bg-card/50 text-sm text-muted-foreground">
        {label}
      </div>
    );
  }

  const scores = points.map((p) => p.score);
  const max = Math.max(100, ...scores);
  const min = Math.min(0, ...scores);
  const span = Math.max(1, max - min);
  const stepX =
    points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const coords = points.map((p, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((p.score - min) / span) * (height - padding * 2);
    return `${x} ${y}`;
  });
  const line = `M${coords.join(" L")}`;
  const area = `${line} L${padding + (points.length - 1) * stepX} ${height} L${padding} ${height} Z`;
  const lastCoord = coords[coords.length - 1]!.split(" ");

  return (
    <svg
      className="h-28 w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      {[25, 55, 85].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2={width}
          y2={y}
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />
      ))}
      <path d={area} className="fill-primary/10" />
      <path
        d={line}
        className="stroke-primary"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastCoord[0]} cy={lastCoord[1]} r="4" className="fill-primary" />
    </svg>
  );
}
