'use client';

import { useState } from 'react';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { formatConfidence, formatLatency } from '~/lib/agentguard/formatters';
import type { CorrectionAttempt } from '~/lib/agentguard/types';

interface CorrectionTimelineProps {
  attempts: CorrectionAttempt[];
}

const ACTION_LABELS: Record<string, string> = {
  repair: 'agentguard:correction.repair',
  constrained_regen: 'agentguard:correction.constrainedRegen',
  full_reprompt: 'agentguard:correction.fullReprompt',
};

export function CorrectionTimeline({ attempts }: CorrectionTimelineProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (attempts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:correction.timeline" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            <Trans i18nKey="agentguard:correction.noCorrection" />
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans i18nKey="agentguard:correction.timeline" />
        </CardTitle>
        <CardDescription>
          {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Vertical timeline line */}
          <div className="border-border absolute top-0 bottom-0 left-4 border-l-2" />

          {attempts.map((attempt, index) => {
            const isExpanded = expandedIndex === index;
            const actionKey =
              ACTION_LABELS[attempt.action] ?? attempt.action;

            return (
              <div key={index} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-[9px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${
                    attempt.success ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />

                <div className="border-border rounded-lg border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Attempt number */}
                    <span className="text-sm font-semibold">
                      <Trans
                        i18nKey="agentguard:correction.attempt"
                        values={{ number: index + 1 }}
                      />
                    </span>

                    {/* Layer badge */}
                    <Badge variant="secondary">{attempt.layer}</Badge>

                    {/* Action badge */}
                    <Badge variant="outline">
                      <Trans i18nKey={actionKey} />
                    </Badge>

                    {/* Success/Failed indicator */}
                    <Badge
                      variant="outline"
                      className={
                        attempt.success
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }
                    >
                      {attempt.success ? (
                        <Trans i18nKey="agentguard:correction.success" />
                      ) : (
                        <Trans i18nKey="agentguard:correction.failed" />
                      )}
                    </Badge>
                  </div>

                  {/* Metrics row */}
                  <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
                    <span>
                      <Trans i18nKey="agentguard:correction.confidence" />
                      {': '}
                      {formatConfidence(attempt.confidence_before)}
                      {' -> '}
                      {formatConfidence(attempt.confidence_after)}
                    </span>
                    <span>
                      <Trans i18nKey="agentguard:correction.latency" />
                      {': '}
                      {formatLatency(attempt.latency_ms)}
                    </span>
                  </div>

                  {/* Expandable corrected output */}
                  {attempt.corrected_output != null && (
                    <details
                      className="mt-2"
                      open={isExpanded}
                      onToggle={(e) => {
                        const target = e.target as HTMLDetailsElement;
                        setExpandedIndex(target.open ? index : null);
                      }}
                    >
                      <summary className="text-muted-foreground cursor-pointer text-xs">
                        <Trans i18nKey="agentguard:correction.corrected" />
                      </summary>
                      <pre className="bg-muted mt-1 max-h-40 overflow-auto rounded p-2 text-xs">
                        {formatOutput(attempt.corrected_output)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Pretty-print JSON strings; return other strings as-is.
 */
function formatOutput(value: string): string {
  try {
    const parsed: unknown = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
}
