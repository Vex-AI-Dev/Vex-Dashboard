'use client';

import Link from 'next/link';

import { format } from 'date-fns';
import { AlertTriangle, BarChart3, Shield, Wrench } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
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
import { Trans } from '@kit/ui/trans';

import type {
  ToolAnomaly,
  ToolCallDailyBucket,
  ToolRiskCell,
  ToolUsageKpis,
  ToolUsageRow,
} from '~/lib/agentguard/types';

import { ToolUsageTable } from './tool-usage-table';

const TOOL_COLORS = [
  '#34C78E',
  '#F87171',
  '#60A5FA',
  '#FBBF24',
  '#A78BFA',
  '#F472B6',
  '#34D399',
  '#FB923C',
  '#818CF8',
  '#2DD4BF',
];

interface ToolUsageChartsProps {
  tools: ToolUsageRow[];
  kpis: ToolUsageKpis;
  timeSeries: ToolCallDailyBucket[];
  riskMatrix: ToolRiskCell[];
  anomalies: ToolAnomaly[];
  accountSlug: string;
}

export default function ToolUsageCharts({
  tools,
  kpis,
  timeSeries,
  riskMatrix,
  anomalies,
  accountSlug,
}: ToolUsageChartsProps) {
  // --- Stacked area chart data ---
  const allToolNames = Array.from(
    new Set(timeSeries.map((r) => r.tool_name)),
  ).slice(0, 10);

  const bucketMap = new Map<string, Record<string, number>>();
  for (const row of timeSeries) {
    if (!allToolNames.includes(row.tool_name)) continue;
    const key = String(row.bucket);
    const existing = bucketMap.get(key) ?? {};
    existing[row.tool_name] = row.call_count;
    bucketMap.set(key, existing);
  }
  const areaChartData = Array.from(bucketMap.entries())
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([bucket, counts]) => ({
      bucket: format(new Date(bucket), 'MMM d'),
      ...counts,
    }));

  const chartConfig = Object.fromEntries(
    allToolNames.map((name, i) => [
      name,
      { label: name, color: TOOL_COLORS[i % TOOL_COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  // --- Heatmap data ---
  const heatmapTools = Array.from(
    new Set(riskMatrix.map((r) => r.tool_name)),
  ).slice(0, 10);
  const heatmapAgents = Array.from(
    new Set(riskMatrix.map((r) => r.agent_id)),
  ).slice(0, 10);

  const cellMap = new Map<string, ToolRiskCell>();
  for (const cell of riskMatrix) {
    cellMap.set(`${cell.tool_name}:${cell.agent_id}`, cell);
  }

  function heatmapCellStyle(blockRate: number | undefined): string {
    if (blockRate === undefined) return 'bg-muted/20';
    if (blockRate === 0) return 'bg-[#34C78E]/30';
    if (blockRate <= 0.1) return 'bg-[#FBBF24]/20';
    if (blockRate <= 0.3) return 'bg-[#FBBF24]/40';
    return 'bg-[#F87171]/60';
  }

  // --- Anomaly badge ---
  function severityLabel(anomaly: ToolAnomaly): string {
    if (anomaly.anomaly_type === 'volume_spike') return 'Volume Spike';
    if (anomaly.anomaly_type === 'high_block_rate') return 'High Block Rate';
    if (anomaly.anomaly_type === 'latency_spike') return 'Latency Spike';
    return anomaly.anomaly_type;
  }

  function severityBorderClass(severity: ToolAnomaly['severity']): string {
    if (severity === 'critical') return 'border-red-500';
    if (severity === 'high') return 'border-orange-500';
    return 'border-yellow-500';
  }

  function severityBadgeClass(severity: ToolAnomaly['severity']): string {
    if (severity === 'critical')
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    if (severity === 'high')
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
  }

  // Tool name → has anomaly map for table
  const anomalyToolSet = new Set(anomalies.map((a) => a.tool_name));

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      {/* Section 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          titleKey="agentguard:tools.totalCalls"
          subtitleKey="agentguard:tools.totalCallsSubtitle"
          value={kpis.total_calls.toLocaleString()}
          icon={<BarChart3 className="h-4 w-4 text-[#8C8C8C]" />}
        />
        <KpiCard
          titleKey="agentguard:tools.uniqueTools"
          subtitleKey="agentguard:tools.uniqueToolsSubtitle"
          value={kpis.unique_tools.toLocaleString()}
          icon={<Wrench className="h-4 w-4 text-[#8C8C8C]" />}
        />
        <KpiCard
          titleKey="agentguard:tools.anomaliesDetected"
          subtitleKey="agentguard:tools.anomaliesDetectedSubtitle"
          value={anomalies.length.toLocaleString()}
          icon={<AlertTriangle className="h-4 w-4 text-[#8C8C8C]" />}
        />
        <KpiCard
          titleKey="agentguard:tools.activePolicies"
          subtitleKey="agentguard:tools.activePoliciesSubtitle"
          value={kpis.active_policies.toLocaleString()}
          icon={<Shield className="h-4 w-4 text-[#8C8C8C]" />}
        />
      </div>

      {/* Section 2: Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Stacked area chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <Trans i18nKey="agentguard:tools.callsOverTime" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:tools.callsOverTimeDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {areaChartData.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                <Trans i18nKey="agentguard:tools.noTools" />
              </p>
            ) : (
              <ChartContainer className="h-64 w-full" config={chartConfig}>
                <AreaChart accessibilityLayer data={areaChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11 }}
                    width={36}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {allToolNames.map((toolName, i) => (
                    <Area
                      key={toolName}
                      type="monotone"
                      dataKey={toolName}
                      stackId="stack"
                      stroke={TOOL_COLORS[i % TOOL_COLORS.length]}
                      fill={TOOL_COLORS[i % TOOL_COLORS.length]}
                      fillOpacity={0.4}
                    />
                  ))}
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Risk heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <Trans i18nKey="agentguard:tools.riskHeatmap" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:tools.riskHeatmapDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {heatmapTools.length === 0 || heatmapAgents.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                <Trans i18nKey="agentguard:tools.noTools" />
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-muted-foreground pr-2 pb-2 text-left font-normal">
                        Tool / Agent
                      </th>
                      {heatmapAgents.map((agentId) => (
                        <th
                          key={agentId}
                          className="text-muted-foreground max-w-[80px] overflow-hidden pb-2 text-center font-normal"
                          title={agentId}
                        >
                          <span className="block truncate px-1">
                            {agentId.length > 10
                              ? agentId.slice(0, 10) + '…'
                              : agentId}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapTools.map((toolName) => (
                      <tr key={toolName}>
                        <td
                          className="text-muted-foreground py-0.5 pr-2 font-mono"
                          title={toolName}
                        >
                          {toolName.length > 16
                            ? toolName.slice(0, 16) + '…'
                            : toolName}
                        </td>
                        {heatmapAgents.map((agentId) => {
                          const cell = cellMap.get(`${toolName}:${agentId}`);
                          const blockRate = cell?.block_rate;
                          return (
                            <td key={agentId} className="px-0.5 py-0.5">
                              <div
                                className={`flex h-7 items-center justify-center rounded text-center text-xs font-medium ${heatmapCellStyle(blockRate)}`}
                                title={
                                  blockRate !== undefined
                                    ? `${(blockRate * 100).toFixed(1)}% block rate`
                                    : 'No data'
                                }
                              >
                                {blockRate !== undefined
                                  ? `${(blockRate * 100).toFixed(0)}%`
                                  : '—'}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Anomaly cards */}
      <div>
        <div className="mb-3">
          <h2 className="text-base font-medium text-[#F0F0F0]">
            <Trans i18nKey="agentguard:tools.anomalies" />
          </h2>
          <p className="text-muted-foreground text-sm">
            <Trans i18nKey="agentguard:tools.anomaliesDescription" />
          </p>
        </div>
        {anomalies.length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm">
            <Trans i18nKey="agentguard:tools.noAnomalies" />
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {anomalies.map((anomaly, idx) => (
              <Card
                key={idx}
                className={`border-l-4 ${severityBorderClass(anomaly.severity)}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-mono text-sm">
                      {anomaly.tool_name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs ${severityBadgeClass(anomaly.severity)}`}
                    >
                      {severityLabel(anomaly)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    {anomaly.description}
                  </p>
                  {anomaly.agent_id && (
                    <p className="text-xs text-[#8C8C8C]">
                      Agent:{' '}
                      <span className="font-mono">{anomaly.agent_id}</span>
                    </p>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/home/${accountSlug}/settings/guardrails?prefill_tool=${encodeURIComponent(anomaly.tool_name)}&prefill_agent=${encodeURIComponent(anomaly.agent_id ?? '')}`}
                    >
                      <Trans i18nKey="agentguard:tools.createGuardrail" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Enriched tool table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Trans i18nKey="agentguard:tools.pageDescription" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ToolUsageTable
            tools={tools}
            anomalies={anomalies}
            anomalyToolSet={anomalyToolSet}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  titleKey,
  subtitleKey,
  value,
  icon,
}: {
  titleKey: string;
  subtitleKey: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-base font-medium text-[#F0F0F0]">
          <Trans i18nKey={titleKey} />
        </span>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-[#8C8C8C]">
          <Trans i18nKey={subtitleKey} />
        </div>
        <div className="mt-3 text-4xl font-semibold text-[#F0F0F0]">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
