import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import type { SessionDetailHeader, SessionListRow, SessionTurn } from '~/lib/agentguard/types';

export interface SessionFilters {
  agentId?: string;
  status?: 'healthy' | 'degraded' | 'risky';
  timeRange?: '24h' | '7d' | '30d';
}

const TIME_RANGE_INTERVALS: Record<string, string> = {
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
};

/**
 * Load paginated session list for an organization with optional filters.
 */
export const loadSessionList = cache(
  async (orgId: string, filters?: SessionFilters): Promise<SessionListRow[]> => {
    const pool = getAgentGuardPool();

    const conditions: string[] = ['e.org_id = $1', 'e.session_id IS NOT NULL'];
    const params: unknown[] = [orgId];
    let paramIndex = 2;

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

    const whereClause = conditions.join(' AND ');

    let statusFilter = '';

    if (filters?.status === 'risky') {
      statusFilter = 'HAVING BOOL_OR(e.action = \'block\') = TRUE';
    } else if (filters?.status === 'degraded') {
      statusFilter =
        'HAVING BOOL_OR(e.action = \'block\') = FALSE AND BOOL_OR(e.action = \'flag\') = TRUE';
    } else if (filters?.status === 'healthy') {
      statusFilter =
        'HAVING BOOL_OR(e.action = \'block\') = FALSE AND BOOL_OR(e.action = \'flag\') = FALSE';
    }

    const result = await pool.query<{
      session_id: string;
      agent_id: string;
      agent_name: string;
      turn_count: string;
      avg_confidence: number | null;
      first_timestamp: string;
      last_timestamp: string;
      has_block: boolean;
      has_flag: boolean;
    }>(
      `
      SELECT
        e.session_id,
        e.agent_id,
        a.name AS agent_name,
        COUNT(*) AS turn_count,
        AVG(e.confidence) AS avg_confidence,
        MIN(e.timestamp) AS first_timestamp,
        MAX(e.timestamp) AS last_timestamp,
        BOOL_OR(e.action = 'block') AS has_block,
        BOOL_OR(e.action = 'flag') AS has_flag
      FROM executions e
      JOIN agents a ON e.agent_id = a.agent_id AND e.org_id = a.org_id
      WHERE ${whereClause}
      GROUP BY e.session_id, e.agent_id, a.name
      ${statusFilter}
      ORDER BY MAX(e.timestamp) DESC
      LIMIT 50
      `,
      params,
    );

    return result.rows.map((row) => ({
      session_id: row.session_id,
      agent_id: row.agent_id,
      agent_name: row.agent_name,
      turn_count: parseInt(row.turn_count, 10),
      avg_confidence: row.avg_confidence,
      first_timestamp: row.first_timestamp,
      last_timestamp: row.last_timestamp,
      has_block: row.has_block,
      has_flag: row.has_flag,
    }));
  },
);

/**
 * Load session detail header (aggregates).
 */
export const loadSessionDetail = cache(
  async (
    sessionId: string,
    orgId: string,
  ): Promise<SessionDetailHeader | null> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      session_id: string;
      agent_id: string;
      agent_name: string;
      turn_count: string;
      avg_confidence: number | null;
      first_timestamp: string;
      last_timestamp: string;
      total_tokens: string | null;
      total_cost: number | null;
    }>(
      `
      SELECT
        e.session_id,
        e.agent_id,
        a.name AS agent_name,
        COUNT(*) AS turn_count,
        AVG(e.confidence) AS avg_confidence,
        MIN(e.timestamp) AS first_timestamp,
        MAX(e.timestamp) AS last_timestamp,
        SUM(e.token_count) AS total_tokens,
        SUM(e.cost_estimate) AS total_cost
      FROM executions e
      JOIN agents a ON e.agent_id = a.agent_id AND e.org_id = a.org_id
      WHERE e.session_id = $1 AND e.org_id = $2
      GROUP BY e.session_id, e.agent_id, a.name
      `,
      [sessionId, orgId],
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0]!;

    return {
      session_id: row.session_id,
      agent_id: row.agent_id,
      agent_name: row.agent_name,
      turn_count: parseInt(row.turn_count, 10),
      avg_confidence: row.avg_confidence,
      first_timestamp: row.first_timestamp,
      last_timestamp: row.last_timestamp,
      total_tokens: row.total_tokens ? parseInt(row.total_tokens, 10) : null,
      total_cost: row.total_cost,
    };
  },
);

/**
 * Load all turns (executions) for a session, ordered by sequence.
 */
export const loadSessionTurns = cache(
  async (sessionId: string, orgId: string): Promise<SessionTurn[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<SessionTurn>(
      `
      SELECT
        e.execution_id,
        e.sequence_number,
        e.task,
        e.confidence,
        e.action,
        e.latency_ms,
        e.timestamp,
        e.corrected,
        e.token_count,
        e.cost_estimate,
        e.metadata
      FROM executions e
      WHERE e.session_id = $1 AND e.org_id = $2
      ORDER BY e.sequence_number ASC, e.timestamp ASC
      `,
      [sessionId, orgId],
    );

    return result.rows;
  },
);
