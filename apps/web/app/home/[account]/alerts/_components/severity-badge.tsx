'use client';

import { Badge } from '@kit/ui/badge';

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

interface SeverityBadgeProps {
  severity: string;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const style = SEVERITY_STYLES[severity] ?? '';

  return (
    <Badge variant="outline" className={style}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
}
