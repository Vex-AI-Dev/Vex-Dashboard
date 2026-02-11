'use client';

import { Badge } from '@kit/ui/badge';

const ACTION_STYLES: Record<string, string> = {
  pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  flag: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  block: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

interface ActionBadgeProps {
  action: string;
}

export function ActionBadge({ action }: ActionBadgeProps) {
  const style = ACTION_STYLES[action] ?? '';

  return (
    <Badge variant="outline" className={style}>
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </Badge>
  );
}
