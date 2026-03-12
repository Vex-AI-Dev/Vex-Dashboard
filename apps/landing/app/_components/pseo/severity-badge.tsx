const colors = {
  critical: 'bg-red-500/10 text-red-400',
  high: 'bg-orange-500/10 text-orange-400',
  medium: 'bg-yellow-500/10 text-yellow-400',
  low: 'bg-blue-500/10 text-blue-400',
} as const;

export function SeverityBadge({ level }: { level: keyof typeof colors }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${colors[level]}`}>
      {level}
    </span>
  );
}
