'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface OutputDiffProps {
  originalOutput: string;
  correctedOutput: string;
}

export function OutputDiff({
  originalOutput,
  correctedOutput,
}: OutputDiffProps) {
  const formattedOriginal = formatOutput(originalOutput);
  const formattedCorrected = formatOutput(correctedOutput);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans i18nKey="agentguard:correction.outputDiff" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Original Output */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-red-700 dark:text-red-400">
              <Trans i18nKey="agentguard:correction.original" />
            </h4>
            <pre className="max-h-96 overflow-auto rounded-lg border border-red-200 bg-red-50 p-4 text-xs dark:border-red-900 dark:bg-red-950">
              {formattedOriginal}
            </pre>
          </div>

          {/* Corrected Output */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-green-700 dark:text-green-400">
              <Trans i18nKey="agentguard:correction.corrected" />
            </h4>
            <pre className="max-h-96 overflow-auto rounded-lg border border-green-200 bg-green-50 p-4 text-xs dark:border-green-900 dark:bg-green-950">
              {formattedCorrected}
            </pre>
          </div>
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
