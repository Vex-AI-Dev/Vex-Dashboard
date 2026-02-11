import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import type {
  CheckResult,
  CorrectionAttempt,
  CorrectionMetadata,
  Execution,
  HumanReview,
} from '~/lib/agentguard/types';

/**
 * Load a single execution by ID.
 * Because executions uses a composite PK (execution_id, timestamp),
 * we match on execution_id alone (unique in practice) and take the first row.
 */
export const loadExecution = cache(
  async (executionId: string): Promise<Execution | null> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<Execution>(
      `
      SELECT *
      FROM executions
      WHERE execution_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
      `,
      [executionId],
    );

    return result.rows[0] ?? null;
  },
);

/**
 * Load all check results for an execution.
 */
export const loadCheckResults = cache(
  async (executionId: string): Promise<CheckResult[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<CheckResult>(
      `
      SELECT *
      FROM check_results
      WHERE execution_id = $1
      ORDER BY timestamp ASC
      `,
      [executionId],
    );

    return result.rows;
  },
);

/**
 * Load human reviews for an execution (v2 feature, may be empty).
 */
export const loadHumanReviews = cache(
  async (executionId: string): Promise<HumanReview[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<HumanReview>(
      `
      SELECT *
      FROM human_reviews
      WHERE execution_id = $1
      ORDER BY created_at ASC
      `,
      [executionId],
    );

    return result.rows;
  },
);

/**
 * Load correction metadata for an execution.
 * Reads the `corrected` boolean column and parses correction details from
 * the execution metadata JSONB field.
 */
export const loadCorrectionMetadata = cache(
  async (executionId: string): Promise<CorrectionMetadata | null> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      corrected: boolean | null;
      metadata: Record<string, unknown>;
    }>(
      `
      SELECT corrected, metadata
      FROM executions
      WHERE execution_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
      `,
      [executionId],
    );

    const row = result.rows[0];

    if (!row || row.corrected == null) {
      return null;
    }

    const meta = row.metadata ?? {};
    const attempts = (
      Array.isArray(meta.correction_attempts)
        ? meta.correction_attempts
        : []
    ) as CorrectionAttempt[];

    return {
      corrected: row.corrected,
      original_output: (meta.original_output as string) ?? null,
      corrected_output: (meta.corrected_output as string) ?? null,
      correction_attempts: attempts,
    };
  },
);
