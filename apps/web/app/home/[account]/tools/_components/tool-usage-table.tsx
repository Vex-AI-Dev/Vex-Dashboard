'use client';

import { AlertTriangle } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

import { formatLatency } from '~/lib/agentguard/formatters';
import type { ToolAnomaly, ToolUsageRow } from '~/lib/agentguard/types';

interface ToolUsageTableProps {
  tools: ToolUsageRow[];
  anomalies?: ToolAnomaly[];
  anomalyToolSet?: Set<string>;
}

export function ToolUsageTable({
  tools,
  anomalies,
  anomalyToolSet,
}: ToolUsageTableProps) {
  // Build anomaly tool set from anomalies prop if not passed pre-built
  const effectiveAnomalySet =
    anomalyToolSet ??
    (anomalies ? new Set(anomalies.map((a) => a.tool_name)) : new Set<string>());

  if (tools.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        <Trans i18nKey="agentguard:tools.noTools" />
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Trans i18nKey="agentguard:tools.toolName" />
          </TableHead>
          <TableHead className="text-right">
            <Trans i18nKey="agentguard:tools.callCount" />
          </TableHead>
          <TableHead className="text-right">
            <Trans i18nKey="agentguard:tools.avgDuration" />
          </TableHead>
          <TableHead className="text-right">
            <Trans i18nKey="agentguard:tools.agentsUsing" />
          </TableHead>
          <TableHead className="text-right">
            <Trans i18nKey="agentguard:tools.flagRate" />
          </TableHead>
          <TableHead className="text-right">
            <Trans i18nKey="agentguard:tools.blockRate" />
          </TableHead>
          <TableHead className="text-center">
            <Trans i18nKey="agentguard:fleet.status" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map((tool) => (
          <TableRow key={tool.tool_name}>
            <TableCell className="font-mono text-sm">
              {tool.tool_name}
            </TableCell>
            <TableCell className="text-right">
              {tool.call_count.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {formatLatency(tool.avg_duration_ms)}
            </TableCell>
            <TableCell className="text-right">{tool.agents_using}</TableCell>
            <TableCell className="text-right">
              {tool.flag_rate != null ? (
                <RateBadge rate={tool.flag_rate} />
              ) : (
                <span className="text-muted-foreground">&mdash;</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {tool.block_rate != null ? (
                <RateBadge rate={tool.block_rate} variant="block" />
              ) : (
                <span className="text-muted-foreground">&mdash;</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {effectiveAnomalySet.has(tool.tool_name) ? (
                <AlertTriangle
                  className="inline-block h-4 w-4 text-orange-500"
                  aria-label="Anomaly detected"
                />
              ) : (
                <span className="text-muted-foreground">&mdash;</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function RateBadge({
  rate,
  variant = 'flag',
}: {
  rate: number;
  variant?: 'flag' | 'block';
}) {
  const pct = (rate * 100).toFixed(1);
  const isHigh = rate > 0.1;

  if (rate === 0) {
    return <span className="text-muted-foreground text-xs">0%</span>;
  }

  const style =
    variant === 'block'
      ? isHigh
        ? 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30'
        : 'bg-[#F87171]/5 text-[#F87171]/60 border-[#F87171]/15'
      : isHigh
        ? 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30'
        : 'bg-[#F97316]/5 text-[#F97316]/60 border-[#F97316]/15';

  return (
    <Badge variant="outline" className={style}>
      {pct}%
    </Badge>
  );
}
