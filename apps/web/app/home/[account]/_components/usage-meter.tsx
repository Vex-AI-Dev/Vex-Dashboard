'use client';

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export function UsageMeter({
  label,
  current,
  limit,
  unit = '',
}: UsageMeterProps) {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const isWarning = percentage >= 80;
  const isExceeded = percentage >= 100;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {current.toLocaleString()} / {limit.toLocaleString()} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${
            isExceeded
              ? 'bg-destructive'
              : isWarning
                ? 'bg-yellow-500'
                : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isExceeded && (
        <p className="mt-2 text-xs text-destructive">
          Quota exceeded. Upgrade your plan for uninterrupted service.
        </p>
      )}
      {isWarning && !isExceeded && (
        <p className="mt-2 text-xs text-yellow-500">
          Approaching limit ({Math.round(percentage)}% used).
        </p>
      )}
    </div>
  );
}
