import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import type {
  ActionDistribution,
  Agent,
  AgentKpis,
  ConfidenceOverTime,
  Execution,
  SessionSummary,
} from '~/lib/agentguard/types';

/**
 * Load a single agent by ID.
 */
export const loadAgent = cache(
  async (agentId: string): Promise<Agent | null> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<Agent>(
      `SELECT * FROM agents WHERE agent_id = $1`,
      [agentId],
    );

    return result.rows[0] ?? null;
  },
);

/**
 * Load KPI aggregates for a specific agent (last 24 hours).
 */
export const loadAgentKpis = cache(
  async (agentId: string): Promise<AgentKpis> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      total_executions: string;
      avg_confidence: number | null;
      avg_latency: number | null;
      total_tokens: string | null;
      total_cost: number | null;
    }>(
      `
      SELECT
        COUNT(*) AS total_executions,
        AVG(confidence) AS avg_confidence,
        AVG(latency_ms) AS avg_latency,
        SUM(token_count) AS total_tokens,
        SUM(cost_estimate) AS total_cost
      FROM executions
      WHERE agent_id = $1
        AND timestamp >= NOW() - INTERVAL '24 hours'
      `,
      [agentId],
    );

    const row = result.rows[0];

    return {
      total_executions: parseInt(row?.total_executions ?? '0', 10),
      avg_confidence: row?.avg_confidence ?? null,
      avg_latency: row?.avg_latency ?? null,
      total_tokens: row?.total_tokens ? parseInt(row.total_tokens, 10) : null,
      total_cost: row?.total_cost ?? null,
    };
  },
);

/**
 * Load confidence over time for a specific agent (7 days, hourly buckets).
 */
export const loadAgentConfidenceOverTime = cache(
  async (agentId: string): Promise<ConfidenceOverTime[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      bucket: string;
      avg_confidence: number | null;
    }>(
      `
      SELECT
        bucket,
        avg_confidence
      FROM agent_health_hourly
      WHERE agent_id = $1
        AND bucket >= NOW() - INTERVAL '7 days'
      ORDER BY bucket ASC
      `,
      [agentId],
    );

    return result.rows;
  },
);

/**
 * Load action distribution for a specific agent (last 24 hours).
 */
export const loadAgentActionDistribution = cache(
  async (agentId: string): Promise<ActionDistribution[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      action: string;
      count: string;
    }>(
      `
      SELECT
        action,
        COUNT(*) AS count
      FROM executions
      WHERE agent_id = $1
        AND timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY action
      ORDER BY count DESC
      `,
      [agentId],
    );

    return result.rows.map((row) => ({
      action: row.action,
      count: parseInt(row.count, 10),
    }));
  },
);

/**
 * Load recent executions for a specific agent (most recent 50).
 */
export const loadRecentExecutions = cache(
  async (agentId: string): Promise<Execution[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<Execution>(
      `
      SELECT *
      FROM executions
      WHERE agent_id = $1
      ORDER BY timestamp DESC
      LIMIT 50
      `,
      [agentId],
    );

    return result.rows;
  },
);

/**
 * Load recent sessions (multi-turn conversations) for a specific agent.
 */
export const loadRecentSessions = cache(
  async (agentId: string): Promise<SessionSummary[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      session_id: string;
      agent_id: string;
      turn_count: string;
      first_timestamp: string;
      last_timestamp: string;
      total_tokens: string | null;
      total_cost: number | null;
    }>(
      `
      SELECT
        session_id,
        agent_id,
        COUNT(*) AS turn_count,
        MIN(timestamp) AS first_timestamp,
        MAX(timestamp) AS last_timestamp,
        SUM(token_count) AS total_tokens,
        SUM(cost_estimate) AS total_cost
      FROM executions
      WHERE agent_id = $1
        AND session_id IS NOT NULL
      GROUP BY session_id, agent_id
      ORDER BY MAX(timestamp) DESC
      LIMIT 20
      `,
      [agentId],
    );

    return result.rows.map((row) => ({
      session_id: row.session_id,
      agent_id: row.agent_id,
      turn_count: parseInt(row.turn_count, 10),
      first_timestamp: row.first_timestamp,
      last_timestamp: row.last_timestamp,
      total_tokens: row.total_tokens ? parseInt(row.total_tokens, 10) : null,
      total_cost: row.total_cost,
    }));
  },
);
