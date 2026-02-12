'use client';

import { useCallback, useEffect, useState } from 'react';

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
  formatCost,
  formatLatency,
  formatTimestamp,
  formatTokens,
} from '~/lib/agentguard/formatters';
import type {
  CheckResult,
  CorrectionMetadata,
  Execution,
  HumanReview,
} from '~/lib/agentguard/types';

import { ActionBadge } from '../../../agents/_components/action-badge';
import { CorrectionTimeline } from './correction-timeline';
import { OutputDiff } from './output-diff';

interface ExecutionTraceChartsProps {
  execution: Execution;
  checkResults: CheckResult[];
  humanReviews: HumanReview[];
  correctionMetadata: CorrectionMetadata | null;
}

interface TraceStep {
  step_type: string;
  name: string;
  input?: unknown;
  output?: unknown;
  duration_ms?: number;
  timestamp?: string;
}

export default function ExecutionTraceCharts({
  execution,
  checkResults,
  humanReviews,
  correctionMetadata,
}: ExecutionTraceChartsProps) {
  const [traceSteps, setTraceSteps] = useState<TraceStep[] | null>(null);
  const [traceLoading, setTraceLoading] = useState(false);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const fetchTrace = useCallback(async () => {
    if (!execution.trace_payload_ref) return;

    setTraceLoading(true);
    setTraceError(null);

    try {
      const response = await fetch(
        `/api/agentguard/traces/${execution.execution_id}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch trace: ${response.statusText}`);
      }

      const payload = await response.json();

      setTraceSteps(payload.steps ?? payload);
    } catch (error) {
      setTraceError(
        error instanceof Error ? error.message : 'Failed to fetch trace',
      );
    } finally {
      setTraceLoading(false);
    }
  }, [execution.execution_id, execution.trace_payload_ref]);

  useEffect(() => {
    void fetchTrace();
  }, [fetchTrace]);

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>
              <Trans i18nKey="agentguard:execution.metadata" />
            </CardTitle>
            {execution.confidence != null && (
              <ConfidenceBadge confidence={execution.confidence} />
            )}
            <ActionBadge action={execution.action} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MetadataItem
              label="agentguard:execution.agent"
              value={execution.agent_id}
            />
            <MetadataItem
              label="agentguard:execution.timestamp"
              value={formatTimestamp(execution.timestamp)}
            />
            <MetadataItem label="agentguard:execution.status">
              <Badge variant="outline">{execution.status}</Badge>
            </MetadataItem>
            <MetadataItem
              label="agentguard:execution.confidence"
              value={formatConfidence(execution.confidence)}
            />
            <MetadataItem label="agentguard:execution.action">
              <ActionBadge action={execution.action} />
            </MetadataItem>
            <MetadataItem
              label="agentguard:execution.latency"
              value={formatLatency(execution.latency_ms)}
            />
            <MetadataItem
              label="agentguard:execution.tokens"
              value={formatTokens(execution.token_count)}
            />
            <MetadataItem
              label="agentguard:execution.cost"
              value={formatCost(execution.cost_estimate)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Trace Steps */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:execution.traceSteps" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:execution.traceStepsDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {traceLoading && (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="agentguard:execution.loadingTrace" />
            </p>
          )}
          {traceError && (
            <p className="text-destructive text-sm">{traceError}</p>
          )}
          {!execution.trace_payload_ref && !traceLoading && (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="agentguard:execution.noTraceAvailable" />
            </p>
          )}
          {traceSteps && traceSteps.length > 0 && (
            <div className="space-y-3">
              {traceSteps.map((step, index) => (
                <div
                  key={index}
                  className="border-border rounded-lg border p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{step.step_type}</Badge>
                    <span className="font-medium">{step.name}</span>
                    {step.duration_ms != null && (
                      <span className="text-muted-foreground text-sm">
                        {formatLatency(step.duration_ms)}
                      </span>
                    )}
                  </div>
                  {step.input != null && (
                    <details className="mt-2">
                      <summary className="text-muted-foreground cursor-pointer text-xs">
                        Input
                      </summary>
                      <pre className="bg-muted mt-1 max-h-40 overflow-auto rounded p-2 text-xs">
                        {JSON.stringify(step.input, null, 2)}
                      </pre>
                    </details>
                  )}
                  {step.output != null && (
                    <details className="mt-2">
                      <summary className="text-muted-foreground cursor-pointer text-xs">
                        Output
                      </summary>
                      <pre className="bg-muted mt-1 max-h-40 overflow-auto rounded p-2 text-xs">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check Results */}
      {checkResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey="agentguard:execution.checkResults" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="agentguard:execution.checkResultsDescription" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.checkType" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.score" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.status" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.details" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkResults.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">
                      {check.check_type}
                    </TableCell>
                    <TableCell>
                      {check.score != null ? (
                        <div className="flex items-center gap-2">
                          <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                            <div
                              className={`h-full rounded-full ${
                                check.passed ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.round(check.score * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {(check.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          check.passed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }
                      >
                        {check.passed ? (
                          <Trans i18nKey="agentguard:execution.passed" />
                        ) : (
                          <Trans i18nKey="agentguard:execution.failed" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {Object.keys(check.details).length > 0 && (
                        <details>
                          <summary className="text-muted-foreground cursor-pointer text-xs">
                            <Trans i18nKey="agentguard:execution.details" />
                          </summary>
                          <pre className="bg-muted mt-1 max-h-32 overflow-auto rounded p-2 text-xs">
                            {JSON.stringify(check.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Correction Timeline */}
      {correctionMetadata && (
        <CorrectionTimeline attempts={correctionMetadata.correction_attempts} />
      )}

      {/* Output Diff */}
      {correctionMetadata?.corrected &&
        correctionMetadata.original_output != null &&
        correctionMetadata.corrected_output != null &&
        correctionMetadata.original_output !==
          correctionMetadata.corrected_output && (
          <OutputDiff
            originalOutput={correctionMetadata.original_output}
            correctedOutput={correctionMetadata.corrected_output}
          />
        )}

      {/* Human Reviews */}
      {humanReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey="agentguard:execution.humanReviews" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.reviewer" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.verdict" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.notes" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="agentguard:execution.timestamp" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {humanReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.reviewer}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{review.verdict}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.notes ?? '—'}
                    </TableCell>
                    <TableCell>{formatTimestamp(review.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON Viewer */}
      <Card>
        <CardHeader>
          <CardTitle
            className="cursor-pointer"
            onClick={() => setShowRawJson(!showRawJson)}
          >
            <Trans i18nKey="agentguard:execution.rawJson" />
            <span className="text-muted-foreground ml-2 text-sm">
              {showRawJson ? '▼' : '▶'}
            </span>
          </CardTitle>
        </CardHeader>
        {showRawJson && (
          <CardContent>
            <pre className="bg-muted max-h-96 overflow-auto rounded-lg p-4 text-xs">
              {JSON.stringify(execution, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function MetadataItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">
        <Trans i18nKey={label} />
      </p>
      {children ?? <p className="font-medium">{value}</p>}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = (confidence * 100).toFixed(0);

  let colorClass: string;
  if (confidence >= 0.8) {
    colorClass =
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  } else if (confidence >= 0.5) {
    colorClass =
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  } else {
    colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }

  return (
    <Badge variant="outline" className={colorClass}>
      {pct}%
    </Badge>
  );
}
