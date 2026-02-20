import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import {
  TIME_RANGE_INTERVALS,
  type TimeRange,
} from '~/lib/agentguard/time-range';
import type {
  ActionDistribution,
  Agent,
  AgentKpis,
  AnomalyAlert,
  CheckScoreBucket,
  ConfidenceOverTime,
  CorrectionLayerUsage,
  CorrectionStatsBucket,
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
 * Load KPI aggregates for a specific agent.
 */
export const loadAgentKpis = cache(
  async (agentId: string, timeRange?: TimeRange): Promise<AgentKpis> => {
    const pool = getAgentGuardPool();
    const interval = TIME_RANGE_INTERVALS[timeRange ?? '24h'];

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
        AND timestamp >= NOW() - INTERVAL '${interval}'
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
 * Load confidence over time for a specific agent (hourly buckets).
 */
export const loadAgentConfidenceOverTime = cache(
  async (
    agentId: string,
    timeRange?: TimeRange,
  ): Promise<ConfidenceOverTime[]> => {
    const pool = getAgentGuardPool();
    const interval = TIME_RANGE_INTERVALS[timeRange ?? '7d'];

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
        AND bucket >= NOW() - INTERVAL '${interval}'
      ORDER BY bucket ASC
      `,
      [agentId],
    );

    return result.rows;
  },
);

/**
 * Load action distribution for a specific agent.
 */
export const loadAgentActionDistribution = cache(
  async (
    agentId: string,
    timeRange?: TimeRange,
  ): Promise<ActionDistribution[]> => {
    const pool = getAgentGuardPool();
    const interval = TIME_RANGE_INTERVALS[timeRange ?? '24h'];

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
        AND timestamp >= NOW() - INTERVAL '${interval}'
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

/**
 * Load per-check score trends for a specific agent (hourly buckets).
 */
export const loadCheckScoreTrends = cache(
  async (
    agentId: string,
    timeRange?: TimeRange,
  ): Promise<CheckScoreBucket[]> => {
    try {
      const pool = getAgentGuardPool();
      const interval = TIME_RANGE_INTERVALS[timeRange ?? '7d'];

      const result = await pool.query<{
        bucket: string;
        check_type: string;
        avg_score: number | null;
        check_count: string;
      }>(
        `
        SELECT
          bucket,
          check_type,
          avg_score,
          check_count
        FROM check_score_hourly
        WHERE agent_id = $1
          AND bucket >= NOW() - INTERVAL '${interval}'
        ORDER BY bucket ASC, check_type ASC
        `,
        [agentId],
      );

      return result.rows.map((row) => ({
        bucket: row.bucket,
        check_type: row.check_type,
        avg_score: row.avg_score,
        check_count: parseInt(row.check_count, 10),
      }));
    } catch {
      return [];
    }
  },
);

/**
 * Load correction stats trend for a specific agent (daily buckets).
 */
export const loadCorrectionStats = cache(
  async (
    agentId: string,
    timeRange?: TimeRange,
  ): Promise<CorrectionStatsBucket[]> => {
    try {
      const pool = getAgentGuardPool();
      const interval = TIME_RANGE_INTERVALS[timeRange ?? '30d'];

      const result = await pool.query<{
        bucket: string;
        corrected_count: string;
        failed_count: string;
        total_count: string;
      }>(
        `
        SELECT
          bucket,
          corrected_count,
          failed_count,
          total_count
        FROM correction_stats_daily
        WHERE agent_id = $1
          AND bucket >= NOW() - INTERVAL '${interval}'
        ORDER BY bucket ASC
        `,
        [agentId],
      );

      return result.rows.map((row) => ({
        bucket: row.bucket,
        corrected_count: parseInt(row.corrected_count, 10),
        failed_count: parseInt(row.failed_count, 10),
        total_count: parseInt(row.total_count, 10),
      }));
    } catch {
      return [];
    }
  },
);

/**
 * Load correction layer usage breakdown for a specific agent.
 */
export const loadCorrectionLayerUsage = cache(
  async (
    agentId: string,
    timeRange?: TimeRange,
  ): Promise<CorrectionLayerUsage[]> => {
    try {
      const pool = getAgentGuardPool();
      const interval = TIME_RANGE_INTERVALS[timeRange ?? '30d'];

      const result = await pool.query<{
        layer_name: string;
        count: string;
      }>(
        `
        SELECT
          elem->>'layer_name' AS layer_name,
          COUNT(*) AS count
        FROM executions,
             jsonb_array_elements(correction_layers_used) AS elem
        WHERE agent_id = $1
          AND corrected = true
          AND timestamp >= NOW() - INTERVAL '${interval}'
          AND correction_layers_used IS NOT NULL
        GROUP BY layer_name
        ORDER BY count DESC
        `,
        [agentId],
      );

      return result.rows.map((row) => ({
        layer_name: row.layer_name,
        count: parseInt(row.count, 10),
      }));
    } catch {
      return [];
    }
  },
);

/**
 * Load recent cost/latency anomaly alerts for this agent.
 */
export const loadAgentAnomalyAlerts = cache(
  async (agentId: string, timeRange?: TimeRange): Promise<AnomalyAlert[]> => {
    const pool = getAgentGuardPool();
    const interval = TIME_RANGE_INTERVALS[timeRange ?? '7d'];

    const result = await pool.query<AnomalyAlert>(
      `
      SELECT
        al.alert_id,
        al.agent_id,
        COALESCE(ag.name, al.agent_id) AS agent_name,
        al.alert_type,
        al.severity,
        al.execution_id,
        al.created_at
      FROM alerts al
      LEFT JOIN agents ag ON al.agent_id = ag.agent_id
      WHERE al.agent_id = $1
        AND al.alert_type IN ('cost_anomaly', 'latency_anomaly')
        AND al.created_at >= NOW() - INTERVAL '${interval}'
      ORDER BY al.created_at DESC
      LIMIT 10
      `,
      [agentId],
    );

    return result.rows;
  },
);
