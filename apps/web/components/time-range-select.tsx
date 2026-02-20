'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { TIME_RANGE_OPTIONS } from '~/lib/agentguard/time-range';

export function TimeRangeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('timeRange') ?? '';

  const onChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('timeRange', value);
      } else {
        params.delete('timeRange');
      }

      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="border-input bg-background text-foreground rounded-md border px-3 py-1.5 text-sm"
    >
      <option value="">All Time</option>
      {TIME_RANGE_OPTIONS.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
