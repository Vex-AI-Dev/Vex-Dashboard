'use client';

import Link from 'next/link';

import { format } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@kit/ui/chart';
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
  formatCost,
  formatLatency,
  formatTimestamp,
  formatTokens,
  truncateId,
} from '~/lib/agentguard/formatters';
import type {
  ActionDistribution,
  AgentKpis,
  ConfidenceOverTime,
  Execution,
} from '~/lib/agentguard/types';
import { useAgentGuardUpdates } from '~/lib/agentguard/use-agentguard-updates';

import { ActionBadge } from '../../_components/action-badge';

interface AgentDetailChartsProps {
  kpis: AgentKpis;
  confidenceOverTime: ConfidenceOverTime[];
  actionDistribution: ActionDistribution[];
  recentExecutions: Execution[];
  accountSlug: string;
  agentId: string;
}

const confidenceChartConfig = {
  confidence: {
    label: 'Confidence',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const actionChartConfig = {
  count: {
    label: 'Count',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const ACTION_COLORS: Record<string, string> = {
  pass: 'var(--chart-1)',
  flag: 'var(--chart-3)',
  block: 'var(--chart-5)',
};

export default function AgentDetailCharts({
  kpis,
  confidenceOverTime,
  actionDistribution,
  recentExecutions,
  accountSlug,
  agentId,
}: AgentDetailChartsProps) {
  useAgentGuardUpdates({ agentId });

  const confidenceData = confidenceOverTime.map((row) => ({
    bucket: format(new Date(row.bucket), 'MMM d HH:mm'),
    confidence:
      row.avg_confidence != null
        ? parseFloat((row.avg_confidence * 100).toFixed(1))
        : null,
  }));

  const actionData = actionDistribution.map((row) => ({
    action: row.action.charAt(0).toUpperCase() + row.action.slice(1),
    count: row.count,
    fill: ACTION_COLORS[row.action] ?? 'var(--chart-2)',
  }));

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      {/* KPI Cards */}
      <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5'}>
        <KpiCard
          titleKey="agentguard:agent.totalExecutions"
          value={kpis.total_executions.toLocaleString()}
        />
        <KpiCard
          titleKey="agentguard:agent.avgConfidence"
          value={formatConfidence(kpis.avg_confidence)}
        />
        <KpiCard
          titleKey="agentguard:agent.avgLatency"
          value={formatLatency(kpis.avg_latency)}
        />
        <KpiCard
          titleKey="agentguard:agent.totalTokens"
          value={formatTokens(kpis.total_tokens)}
        />
        <KpiCard
          titleKey="agentguard:agent.totalCost"
          value={formatCost(kpis.total_cost)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Confidence Over Time */}
        {confidenceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Trans i18nKey="agentguard:agent.confidenceOverTime" />
              </CardTitle>
              <CardDescription>
                <Trans i18nKey="agentguard:agent.confidenceOverTimeDescription" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className={'h-64 w-full'}
                config={confidenceChartConfig}
              >
                <LineChart accessibilityLayer data={confidenceData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Line
                    dataKey="confidence"
                    type="monotone"
                    stroke="var(--color-confidence)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Action Distribution */}
        {actionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Trans i18nKey="agentguard:agent.actionDistribution" />
              </CardTitle>
              <CardDescription>
                <Trans i18nKey="agentguard:agent.actionDistributionDescription" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className={'h-64 w-full'}
                config={actionChartConfig}
              >
                <BarChart accessibilityLayer data={actionData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="action"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Executions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:agent.recentExecutions" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:agent.recentExecutionsDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentExecutions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="agentguard:agent.noExecutions" />
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Trans i18nKey="agentguard:agent.executionId" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:agent.session" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:agent.action" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:agent.confidence" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:agent.latency" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:agent.timestamp" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExecutions.map((exec) => (
                  <TableRow key={exec.execution_id}>
                    <TableCell>
                      <Link
                        href={`/home/${accountSlug}/executions/${exec.execution_id}`}
                        className="text-primary font-mono text-sm hover:underline"
                      >
                        {truncateId(exec.execution_id)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {exec.session_id ? (
                        <span className="text-muted-foreground font-mono text-xs">
                          {truncateId(exec.session_id)}
                          {exec.sequence_number != null && (
                            <span className="text-muted-foreground/60 ml-1">
                              #{exec.sequence_number}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">&mdash;</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ActionBadge action={exec.action} />
                    </TableCell>
                    <TableCell>{formatConfidence(exec.confidence)}</TableCell>
                    <TableCell>{formatLatency(exec.latency_ms)}</TableCell>
                    <TableCell>{formatTimestamp(exec.timestamp)}</TableCell>
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

function KpiCard({ titleKey, value }: { titleKey: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>
          <Trans i18nKey={titleKey} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
