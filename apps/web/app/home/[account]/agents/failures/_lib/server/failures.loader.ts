import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';

export interface FailureRow {
  execution_id: string;
  agent_id: string;
  agent_name: string | null;
  task: string | null;
  action: string;
  confidence: number | null;
  failure_types: string[];
  corrected: boolean;
  timestamp: string;
}

export interface FailureFilters {
  agentId?: string;
  action?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d';
  corrected?: 'true' | 'false';
}

const TIME_RANGE_INTERVALS: Record<string, string> = {
  '1h': '1 hour',
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
};

/**
 * Load flagged and blocked executions for an organization with optional filters.
 * Joins with agents table for names and check_results for failure types.
 */
export const loadFailures = cache(
  async (orgId: string, filters?: FailureFilters): Promise<FailureRow[]> => {
    const pool = getAgentGuardPool();

    const conditions: string[] = [
      'e.org_id = $1',
      "(e.action IN ('flag', 'block') OR e.corrected = TRUE)",
    ];
    const params: unknown[] = [orgId];
    let paramIndex = 2;

    if (filters?.action) {
      conditions.push(`e.action = $${paramIndex}`);
      params.push(filters.action);
      paramIndex++;
    }

    if (filters?.agentId) {
      conditions.push(`e.agent_id = $${paramIndex}`);
      params.push(filters.agentId);
      paramIndex++;
    }

    if (filters?.timeRange) {
      const interval = TIME_RANGE_INTERVALS[filters.timeRange];

      if (interval) {
        conditions.push(`e.timestamp >= NOW() - INTERVAL '${interval}'`);
      }
    }

    if (filters?.corrected === 'true') {
      conditions.push('e.corrected = TRUE');
    } else if (filters?.corrected === 'false') {
      conditions.push('(e.corrected = FALSE OR e.corrected IS NULL)');
    }

    const whereClause = conditions.join(' AND ');

    const result = await pool.query<{
      execution_id: string;
      agent_id: string;
      agent_name: string | null;
      task: string | null;
      action: string;
      confidence: number | null;
      failure_types: string[] | null;
      corrected: boolean | null;
      timestamp: string;
    }>(
      `
      SELECT
        e.execution_id,
        e.agent_id,
        ag.name AS agent_name,
        e.task,
        e.action,
        e.confidence,
        COALESCE(e.corrected, FALSE) AS corrected,
        ARRAY(
          SELECT cr.check_type
          FROM check_results cr
          WHERE cr.execution_id = e.execution_id
            AND cr.passed = FALSE
        ) AS failure_types,
        e.timestamp
      FROM executions e
      LEFT JOIN agents ag ON e.agent_id = ag.agent_id
      WHERE ${whereClause}
      ORDER BY e.timestamp DESC
      LIMIT 200
      `,
      params,
    );

    return result.rows.map((row) => ({
      execution_id: row.execution_id,
      agent_id: row.agent_id,
      agent_name: row.agent_name,
      task: row.task,
      action: row.action,
      confidence: row.confidence,
      failure_types: row.failure_types ?? [],
      corrected: row.corrected ?? false,
      timestamp: row.timestamp,
    }));
  },
);
