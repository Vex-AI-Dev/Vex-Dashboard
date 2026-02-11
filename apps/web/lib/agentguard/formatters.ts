/**
 * Display formatting utilities for AgentGuard dashboard values.
 */

/**
 * Format a confidence score (0-1) as a percentage string.
 * Returns '—' for null/undefined values.
 */
export function formatConfidence(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format latency in milliseconds to a human-readable string.
 * Values >= 1000ms are shown in seconds.
 */
export function formatLatency(ms: number | null | undefined): string {
  if (ms == null) return '—';
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms.toFixed(0)}ms`;
}

/**
 * Format a cost estimate as USD.
 */
export function formatCost(value: number | null | undefined): string {
  if (value == null) return '—';
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}

/**
 * Format token count with thousands separator.
 */
export function formatTokens(value: number | null | undefined): string {
  if (value == null) return '—';
  return value.toLocaleString('en-US');
}

/**
 * Format an ISO timestamp to a locale-aware short date/time string.
 */
export function formatTimestamp(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate a UUID or long ID to the first 8 characters for display.
 */
export function truncateId(id: string, length = 8): string {
  if (id.length <= length) return id;
  return `${id.slice(0, length)}…`;
}
