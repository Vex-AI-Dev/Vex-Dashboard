'use client';

import Link from 'next/link';

import { formatDistanceStrict } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import {
  formatConfidence,
  formatCost,
  formatLatency,
  formatTimestamp,
  formatTokens,
} from '~/lib/agentguard/formatters';
import type { SessionDetailHeader, SessionTurn } from '~/lib/agentguard/types';

interface SessionTimelineProps {
  header: SessionDetailHeader;
  turns: SessionTurn[];
  accountSlug: string;
}

function ActionIcon({ action }: { action: string }) {
  if (action === 'pass') {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  }

  if (action === 'flag') {
    return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  }

  return <XCircle className="h-5 w-5 text-red-500" />;
}

function ActionBadge({ action }: { action: string }) {
  const styles: Record<string, string> = {
    pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    flag: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    block: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Badge variant="outline" className={styles[action] ?? ''}>
      <Trans i18nKey={`agentguard:common.${action}`} />
    </Badge>
  );
}

function StatPill({
  label,
  value,
}: {
  label: React.ReactNode;
  value: string;
}) {
  return (
    <div className="bg-muted/50 flex flex-col gap-1 rounded-md px-3 py-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default function SessionTimeline({
  header,
  turns,
  accountSlug,
}: SessionTimelineProps) {
  const duration = formatDistanceStrict(
    new Date(header.first_timestamp),
    new Date(header.last_timestamp),
  );

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-mono text-base">
                {header.session_id}
              </CardTitle>
              <CardDescription>
                <Link
                  href={`/home/${accountSlug}/agents/${header.agent_id}`}
                  className="text-primary hover:underline"
                >
                  {header.agent_name}
                </Link>
                {' · '}
                {duration}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatPill
              label={<Trans i18nKey="agentguard:sessions.turns" />}
              value={header.turn_count.toString()}
            />
            <StatPill
              label={<Trans i18nKey="agentguard:sessions.avgConfidence" />}
              value={formatConfidence(header.avg_confidence)}
            />
            <StatPill
              label={<Trans i18nKey="agentguard:sessions.duration" />}
              value={duration}
            />
            <StatPill
              label={<Trans i18nKey="agentguard:sessions.totalTokens" />}
              value={formatTokens(header.total_tokens)}
            />
            <StatPill
              label={<Trans i18nKey="agentguard:sessions.totalCost" />}
              value={formatCost(header.total_cost)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Turn Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:sessions.turnTimeline" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:sessions.detailDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {turns.map((turn, index) => (
              <div key={turn.execution_id} className="relative flex gap-4">
                {/* Timeline line */}
                {index < turns.length - 1 && (
                  <div className="bg-border absolute top-10 left-[11px] h-[calc(100%-16px)] w-px" />
                )}

                {/* Icon */}
                <div className="z-10 mt-1 shrink-0">
                  <ActionIcon action={turn.action} />
                </div>

                {/* Content */}
                <div className="mb-6 flex-1 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/home/${accountSlug}/executions/${turn.execution_id}`}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Turn {turn.sequence_number ?? index}
                        </Link>
                        <ActionBadge action={turn.action} />
                        {turn.corrected && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            <Wrench className="mr-1 h-3 w-3" />
                            <Trans i18nKey="agentguard:sessions.corrected" />
                          </Badge>
                        )}
                      </div>
                      {turn.task && (
                        <p className="text-muted-foreground text-sm">
                          {turn.task}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        turn.confidence != null
                          ? turn.confidence >= 0.8
                            ? 'text-green-600 dark:text-green-400'
                            : turn.confidence >= 0.5
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatConfidence(turn.confidence)}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatLatency(turn.latency_ms)}
                    </span>
                    {turn.token_count != null && (
                      <span>{formatTokens(turn.token_count)} tokens</span>
                    )}
                    {turn.cost_estimate != null && (
                      <span>{formatCost(turn.cost_estimate)}</span>
                    )}
                    <span>{formatTimestamp(turn.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
