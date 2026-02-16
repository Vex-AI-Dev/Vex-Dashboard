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

import { PaginationBar } from '~/components/pagination-bar';
import { formatTimestamp, truncateId } from '~/lib/agentguard/formatters';
import type { Alert } from '~/lib/agentguard/types';

import { SeverityBadge } from './severity-badge';

interface AlertsChartsProps {
  alerts: Alert[];
  accountSlug: string;
  agents: Array<{ agent_id: string; name: string }>;
  page: number;
  pageCount: number;
}

const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low'];
const TIME_RANGE_OPTIONS = [
  { value: '1h', labelKey: 'agentguard:alerts.last1h' },
  { value: '24h', labelKey: 'agentguard:alerts.last24h' },
  { value: '7d', labelKey: 'agentguard:alerts.last7d' },
  { value: '30d', labelKey: 'agentguard:alerts.last30d' },
];

export default function AlertsCharts({
  alerts,
  accountSlug,
  agents,
  page,
  pageCount,
}: AlertsChartsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSeverity = searchParams.get('severity') ?? '';
  const currentAgent = searchParams.get('agent') ?? '';
  const currentTimeRange = searchParams.get('timeRange') ?? '';

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      params.delete('page');
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
            <Trans i18nKey="agentguard:alerts.filters" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Severity Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs">
                <Trans i18nKey="agentguard:alerts.severity" />
              </label>
              <select
                value={currentSeverity}
                onChange={(e) => updateFilter('severity', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
              >
                <option value="">All Severities</option>
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Agent Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-xs">
                <Trans i18nKey="agentguard:alerts.agent" />
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
                <Trans i18nKey="agentguard:alerts.timeRange" />
              </label>
              <select
                value={currentTimeRange}
                onChange={(e) => updateFilter('timeRange', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
              >
                <option value="">All Time</option>
                {TIME_RANGE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.value === '1h'
                      ? 'Last 1 hour'
                      : t.value === '24h'
                        ? 'Last 24 hours'
                        : t.value === '7d'
                          ? 'Last 7 days'
                          : 'Last 30 days'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:alerts.pageTitle" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:alerts.pageDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="agentguard:alerts.noAlerts" />
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Trans i18nKey="agentguard:alerts.alertType" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:alerts.severity" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:alerts.agent" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:alerts.execution" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:alerts.delivered" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:alerts.timestamp" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.alert_id}>
                    <TableCell className="font-medium">
                      {alert.alert_type}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={alert.severity} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/home/${accountSlug}/agents/${alert.agent_id}`}
                        className="text-primary hover:underline"
                      >
                        {alert.agent_name ?? truncateId(alert.agent_id)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/home/${accountSlug}/executions/${alert.execution_id}`}
                        className="text-primary font-mono text-sm hover:underline"
                      >
                        {truncateId(alert.execution_id)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          alert.delivered
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }
                      >
                        {alert.delivered ? (
                          <Trans i18nKey="agentguard:alerts.yes" />
                        ) : (
                          <Trans i18nKey="agentguard:alerts.no" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTimestamp(alert.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <PaginationBar page={page} pageCount={pageCount} />
        </CardContent>
      </Card>
    </div>
  );
}
