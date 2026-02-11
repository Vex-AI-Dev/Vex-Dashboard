'use client';

import Link from 'next/link';

import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Badge } from '@kit/ui/badge';
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
  formatTimestamp,
} from '~/lib/agentguard/formatters';
import { useAgentGuardUpdates } from '~/lib/agentguard/use-agentguard-updates';
import type {
  AgentFleetRow,
  ExecutionsOverTime,
  FleetKpis,
} from '~/lib/agentguard/types';

import { ActionBadge } from './action-badge';

interface FleetHealthChartsProps {
  kpis: FleetKpis;
  agents: AgentFleetRow[];
  executionsOverTime: ExecutionsOverTime[];
  accountSlug: string;
}

const executionsChartConfig = {
  pass: {
    label: 'Pass',
    color: 'var(--chart-1)',
  },
  flag: {
    label: 'Flag',
    color: 'var(--chart-3)',
  },
  block: {
    label: 'Block',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export default function FleetHealthCharts({
  kpis,
  agents,
  executionsOverTime,
  accountSlug,
}: FleetHealthChartsProps) {
  useAgentGuardUpdates();

  const chartData = executionsOverTime.map((row) => ({
    bucket: format(new Date(row.bucket), 'MMM d HH:mm'),
    pass: row.pass_count,
    flag: row.flag_count,
    block: row.block_count,
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
          titleKey="agentguard:fleet.totalAgents"
          value={kpis.total_agents.toString()}
        />
        <KpiCard
          titleKey="agentguard:fleet.executions24h"
          value={kpis.executions_24h.toLocaleString()}
        />
        <KpiCard
          titleKey="agentguard:fleet.avgConfidence"
          value={formatConfidence(kpis.avg_confidence)}
        />
        <KpiCard
          titleKey="agentguard:fleet.passRate"
          value={formatConfidence(kpis.pass_rate)}
        />
        <CorrectionRateCard rate={kpis.correction_rate} />
      </div>

      {/* Executions Over Time Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey="agentguard:fleet.executionsOverTime" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:fleet.executionsOverTimeDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className={'h-64 w-full'}
              config={executionsChartConfig}
            >
              <AreaChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="bucket"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="pass"
                  type="monotone"
                  fill="var(--color-pass)"
                  stroke="var(--color-pass)"
                  fillOpacity={0.4}
                  stackId="a"
                />
                <Area
                  dataKey="flag"
                  type="monotone"
                  fill="var(--color-flag)"
                  stroke="var(--color-flag)"
                  fillOpacity={0.4}
                  stackId="a"
                />
                <Area
                  dataKey="block"
                  type="monotone"
                  fill="var(--color-block)"
                  stroke="var(--color-block)"
                  fillOpacity={0.4}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:fleet.agentsTable" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:fleet.agentsTableDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="agentguard:fleet.noAgents" />
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Trans i18nKey="agentguard:fleet.agentName" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:fleet.status" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:fleet.executions" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:fleet.confidence" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:fleet.passRate" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:fleet.lastActive" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.agent_id}>
                    <TableCell>
                      <Link
                        href={`/home/${accountSlug}/agents/${agent.agent_id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {agent.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <AgentStatusBadge
                        avgConfidence={agent.avg_confidence}
                        hasExecutions={agent.executions_24h > 0}
                      />
                    </TableCell>
                    <TableCell>{agent.executions_24h}</TableCell>
                    <TableCell>
                      {formatConfidence(agent.avg_confidence)}
                    </TableCell>
                    <TableCell>
                      {agent.pass_rate != null ? (
                        <ActionBadge
                          action={agent.pass_rate >= 0.9 ? 'pass' : agent.pass_rate >= 0.7 ? 'flag' : 'block'}
                        />
                      ) : (
                        '—'
                      )}
                      {' '}
                      {formatConfidence(agent.pass_rate)}
                    </TableCell>
                    <TableCell>
                      {formatTimestamp(agent.last_active)}
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

function AgentStatusBadge({
  avgConfidence,
  hasExecutions,
}: {
  avgConfidence: number | null;
  hasExecutions: boolean;
}) {
  if (!hasExecutions || avgConfidence == null) {
    return (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      >
        <Trans i18nKey="agentguard:fleet.statusNoData" />
      </Badge>
    );
  }

  if (avgConfidence < 0.5) {
    return (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      >
        <Trans i18nKey="agentguard:fleet.statusDegraded" />
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    >
      <Trans i18nKey="agentguard:fleet.statusHealthy" />
    </Badge>
  );
}

function KpiCard({
  titleKey,
  value,
}: {
  titleKey: string;
  value: string;
}) {
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

function CorrectionRateCard({ rate }: { rate: number | null }) {
  if (rate == null) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            <Trans i18nKey="agentguard:fleet.correctionRate" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-2xl font-bold">N/A</div>
        </CardContent>
      </Card>
    );
  }

  const pct = (rate * 100).toFixed(1);

  let colorClass: string;
  if (rate >= 0.8) {
    colorClass = 'text-green-600 dark:text-green-400';
  } else if (rate >= 0.5) {
    colorClass = 'text-yellow-600 dark:text-yellow-400';
  } else {
    colorClass = 'text-red-600 dark:text-red-400';
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>
          <Trans i18nKey="agentguard:fleet.correctionRate" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>{pct}%</div>
        <p className="text-muted-foreground mt-1 text-xs">
          <Trans i18nKey="agentguard:fleet.correctionRateDesc" />
        </p>
      </CardContent>
    </Card>
  );
}
