'use client';

import Link from 'next/link';

import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Zap,
} from 'lucide-react';
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
import { Trans } from '@kit/ui/trans';

import { formatConfidence } from '~/lib/agentguard/formatters';
import type {
  AgentHealthTile,
  AlertSeveritySummary,
  HomepageKpis,
  HomepageTrendBucket,
} from '~/lib/agentguard/types';
import { useAgentGuardUpdates } from '~/lib/agentguard/use-agentguard-updates';

interface HomepageChartsProps {
  kpis: HomepageKpis;
  agentHealth: AgentHealthTile[];
  alertSummary: AlertSeveritySummary;
  trend: HomepageTrendBucket[];
  accountSlug: string;
}

const trendChartConfig = {
  pass: { label: 'Pass', color: 'var(--chart-1)' },
  flag: { label: 'Flag', color: 'var(--chart-3)' },
  block: { label: 'Block', color: 'var(--chart-5)' },
} satisfies ChartConfig;

export default function HomepageCharts({
  kpis,
  agentHealth,
  alertSummary,
  trend,
  accountSlug,
}: HomepageChartsProps) {
  useAgentGuardUpdates();

  const chartData = trend.map((row) => ({
    bucket: format(new Date(row.bucket), 'HH:mm'),
    pass: row.pass_count,
    flag: row.flag_count,
    block: row.block_count,
  }));

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-6 pb-36 duration-500'
      }
    >
      {/* Row 1: Hero Reliability Gauge + KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReliabilityGaugeCard confidence={kpis.avg_confidence} />
        <KpiCard
          titleKey="agentguard:homepage.verifications"
          subtitleKey="agentguard:homepage.verificationsSubtitle"
          value={kpis.total_verifications.toLocaleString()}
          icon={<Zap className="h-4 w-4 text-blue-500" />}
          accentClass="border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
        />
        <KpiCard
          titleKey="agentguard:homepage.issuesCaught"
          subtitleKey="agentguard:homepage.issuesCaughtSubtitle"
          value={kpis.issues_caught.toLocaleString()}
          icon={<ShieldAlert className="h-4 w-4 text-amber-500" />}
          accentClass="border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
          valueClass={
            kpis.issues_caught > 0
              ? 'text-amber-600 dark:text-amber-400'
              : undefined
          }
        />
        <KpiCard
          titleKey="agentguard:homepage.autoCorrected"
          subtitleKey="agentguard:homepage.autoCorrectedSubtitle"
          value={kpis.auto_corrected.toLocaleString()}
          icon={<Wrench className="h-4 w-4 text-emerald-500" />}
          accentClass="border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
          valueClass={
            kpis.auto_corrected > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : undefined
          }
        />
      </div>

      {/* Row 2: 24h Activity Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <Trans i18nKey="agentguard:homepage.activityChart" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:homepage.activityChartDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-48 w-full" config={trendChartConfig}>
              <AreaChart accessibilityLayer data={chartData}>
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
                  allowDecimals={false}
                />
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

      {/* Row 3: Agent Health + Right Column (Alerts + Activity) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Agent Health — 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <Trans i18nKey="agentguard:homepage.agentHealth" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:homepage.agentHealthDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agentHealth.length === 0 ? (
              <p className="text-muted-foreground py-4 text-sm">
                <Trans i18nKey="agentguard:homepage.noAgents" />
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {agentHealth.map((agent) => (
                  <AgentTile
                    key={agent.agent_id}
                    agent={agent}
                    accountSlug={accountSlug}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts — 1/3 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              <Trans i18nKey="agentguard:homepage.alertSummary" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:homepage.alertSummaryDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertSummaryPanel
              summary={alertSummary}
              accountSlug={accountSlug}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reliability Gauge Card                                              */
/* ------------------------------------------------------------------ */

function ReliabilityGaugeCard({ confidence }: { confidence: number | null }) {
  const value = confidence ?? 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;

  let strokeColor = '#9ca3af'; // gray
  let bgGradient =
    'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30';

  if (confidence != null) {
    if (confidence >= 0.8) {
      strokeColor = '#22c55e';
      bgGradient =
        'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30';
    } else if (confidence >= 0.5) {
      strokeColor = '#eab308';
      bgGradient =
        'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30';
    } else {
      strokeColor = '#ef4444';
      bgGradient =
        'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30';
    }
  }

  return (
    <Card
      className={`border-l-4 border-l-transparent bg-gradient-to-br ${bgGradient}`}
    >
      <CardContent className="flex items-center gap-4 pt-6">
        {/* SVG Gauge */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="h-20 w-20"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck
              className="h-6 w-6"
              style={{ color: strokeColor, transform: 'rotate(90deg)' }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <p className="text-muted-foreground text-xs font-medium">
            <Trans i18nKey="agentguard:homepage.reliabilityScore" />
          </p>
          <span
            className="text-3xl font-bold tracking-tight"
            style={{ color: strokeColor }}
          >
            {formatConfidence(confidence)}
          </span>
          <p className="text-muted-foreground text-xs">
            <Trans i18nKey="agentguard:homepage.reliabilityScoreSubtitle" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* KPI Card                                                            */
/* ------------------------------------------------------------------ */

function KpiCard({
  titleKey,
  subtitleKey,
  value,
  icon,
  accentClass,
  valueClass,
}: {
  titleKey: string;
  subtitleKey: string;
  value: string;
  icon: React.ReactNode;
  accentClass: string;
  valueClass?: string;
}) {
  return (
    <Card className={`border-l-4 ${accentClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="font-medium">
          <Trans i18nKey={titleKey} />
        </CardDescription>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClass ?? ''}`}>{value}</div>
        <p className="text-muted-foreground text-xs">
          <Trans i18nKey={subtitleKey} />
        </p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Agent Health Tiles                                                   */
/* ------------------------------------------------------------------ */

function AgentTile({
  agent,
  accountSlug,
}: {
  agent: AgentHealthTile;
  accountSlug: string;
}) {
  const hasData = agent.executions_24h > 0;
  const confidence = agent.avg_confidence ?? 0;

  let barColor = 'bg-gray-300 dark:bg-gray-600';
  let dotColor = 'bg-gray-400';

  if (hasData && agent.avg_confidence != null) {
    if (agent.avg_confidence >= 0.8) {
      barColor = 'bg-green-500';
      dotColor = 'bg-green-500';
    } else if (agent.avg_confidence >= 0.5) {
      barColor = 'bg-yellow-500';
      dotColor = 'bg-yellow-500';
    } else {
      barColor = 'bg-red-500';
      dotColor = 'bg-red-500';
    }
  }

  return (
    <Link
      href={`/home/${accountSlug}/agents/${agent.agent_id}`}
      className="hover:bg-accent border-border group flex flex-col gap-2 rounded-lg border p-3 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`}
        />
        <p className="truncate text-sm font-medium">{agent.name}</p>
      </div>

      {hasData ? (
        <>
          {/* Confidence bar */}
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {formatConfidence(agent.avg_confidence)}
            </span>
            <span className="text-muted-foreground">
              {agent.executions_24h.toLocaleString()}{' '}
              <Trans i18nKey="agentguard:homepage.runs" />
            </span>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-xs">
          <Trans i18nKey="agentguard:homepage.noData" />
        </p>
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Alert Summary Panel                                                 */
/* ------------------------------------------------------------------ */

function AlertSummaryPanel({
  summary,
  accountSlug,
}: {
  summary: AlertSeveritySummary;
  accountSlug: string;
}) {
  const total = summary.critical + summary.high + summary.medium + summary.low;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="agentguard:homepage.allClear" />
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <span className="text-sm font-medium">
          {total} <Trans i18nKey="agentguard:homepage.activeAlerts" />
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <SeverityPill
          label="Critical"
          count={summary.critical}
          variant="critical"
        />
        <SeverityPill label="High" count={summary.high} variant="high" />
        <SeverityPill label="Medium" count={summary.medium} variant="medium" />
        <SeverityPill label="Low" count={summary.low} variant="low" />
      </div>

      <Link
        href={`/home/${accountSlug}/alerts`}
        className="text-primary text-sm hover:underline"
      >
        <Trans i18nKey="agentguard:homepage.viewAllAlerts" />
      </Link>
    </div>
  );
}

const severityStyles = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
} as const;

function SeverityPill({
  label,
  count,
  variant,
}: {
  label: string;
  count: number;
  variant: keyof typeof severityStyles;
}) {
  const dimmed = count === 0;

  return (
    <Badge
      variant="outline"
      className={`${dimmed ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600' : severityStyles[variant]}`}
    >
      {count} {label}
    </Badge>
  );
}
