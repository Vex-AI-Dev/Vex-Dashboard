export type TimeRange = '1h' | '24h' | '7d' | '30d';

export const TIME_RANGE_INTERVALS: Record<TimeRange, string> = {
  '1h': '1 hour',
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
};

export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

export function parseTimeRange(raw: string | undefined): TimeRange | undefined {
  if (raw === '1h' || raw === '24h' || raw === '7d' || raw === '30d')
    return raw;
  return undefined;
}
