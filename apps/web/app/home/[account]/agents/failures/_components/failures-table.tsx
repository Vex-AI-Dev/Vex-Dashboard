'use client';

import { useCallback } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

import {
  formatConfidence,
  formatTimestamp,
  truncateId,
} from '~/lib/agentguard/formatters';

import { ActionBadge } from '../../_components/action-badge';
import type { FailureRow } from '../_lib/server/failures.loader';

interface FailuresTableProps {
  failures: FailureRow[];
  accountSlug: string;
  agents: Array<{ agent_id: string; name: string }>;
}

const TIME_RANGE_OPTIONS = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const ACTION_OPTIONS = [
  { value: 'flag', label: 'Flag' },
  { value: 'block', label: 'Block' },
];

const CORRECTION_STATUS_OPTIONS = [
  { value: 'true', labelKey: 'agentguard:failures.correctedOnly' },
  { value: 'false', labelKey: 'agentguard:failures.uncorrectedOnly' },
];

export default function FailuresTable({
  failures,
  accountSlug,
  agents,
}: FailuresTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentAction = searchParams.get('action') ?? '';
  const currentAgent = searchParams.get('agent') ?? '';
  const currentTimeRange = searchParams.get('timeRange') ?? '';
  const currentCorrected = searchParams.get('corrected') ?? '';

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      {/* Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:failures.filters" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Action Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs">
                <Trans i18nKey="agentguard:failures.action" />
              </label>
              <select
                value={currentAction}
                onChange={(e) => updateFilter('action', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
              >
                <option value="">All Actions</option>
                {ACTION_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Agent Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs">
                <Trans i18nKey="agentguard:failures.agent" />
              </label>
              <select
                value={currentAgent}
                onChange={(e) => updateFilter('agent', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
              >
                <option value="">All Agents</option>
                {agents.map((a) => (
                  <option key={a.agent_id} value={a.agent_id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs">
                <Trans i18nKey="agentguard:failures.timeRange" />
              </label>
              <select
                value={currentTimeRange}
                onChange={(e) => updateFilter('timeRange', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
              >
                <option value="">All Time</option>
                {TIME_RANGE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Correction Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs">
                <Trans i18nKey="agentguard:failures.correctedFilter" />
              </label>
              <select
                value={currentCorrected}
                onChange={(e) => updateFilter('corrected', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
              >
                <option value="">All</option>
                {CORRECTION_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value === 'true' ? 'Corrected' : 'Uncorrected'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failures Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:failures.pageTitle" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:failures.pageDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {failures.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="agentguard:failures.noFailures" />
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.timestamp" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.agent" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.task" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.action" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.confidence" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.corrected" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:failures.failureTypes" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failures.map((row) => (
                  <TableRow key={row.execution_id}>
                    <TableCell>
                      <Link
                        href={`/home/${accountSlug}/executions/${row.execution_id}`}
                        className="text-primary hover:underline"
                      >
                        {formatTimestamp(row.timestamp)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/home/${accountSlug}/agents/${row.agent_id}`}
                        className="text-primary hover:underline"
                      >
                        {row.agent_name ?? truncateId(row.agent_id)}
                      </Link>
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={row.task ?? undefined}
                    >
                      {row.task ?? '—'}
                    </TableCell>
                    <TableCell>
                      <ActionBadge action={row.action} />
                    </TableCell>
                    <TableCell>{formatConfidence(row.confidence)}</TableCell>
                    <TableCell>
                      <CorrectionBadge corrected={row.corrected} />
                    </TableCell>
                    <TableCell>
                      {row.failure_types.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.failure_types.map((ft) => (
                            <span
                              key={ft}
                              className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                            >
                              {ft}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CorrectionBadge({ corrected }: { corrected: boolean }) {
  if (corrected) {
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      >
        <Trans i18nKey="agentguard:failures.correctedOnly" />
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    >
      <Trans i18nKey="agentguard:failures.uncorrectedOnly" />
    </Badge>
  );
}
