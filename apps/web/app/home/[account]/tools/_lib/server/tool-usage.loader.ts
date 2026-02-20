import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import {
  TIME_RANGE_INTERVALS,
  type TimeRange,
} from '~/lib/agentguard/time-range';
import type {
  ToolAnomaly,
  ToolCallDailyBucket,
  ToolRiskCell,
  ToolUsageKpis,
  ToolUsageRow,
} from '~/lib/agentguard/types';

/**
 * Load tool usage analytics for an org (last 7 days).
 */
export const loadToolUsage = cache(
  async (orgId: string, timeRange?: TimeRange): Promise<ToolUsageRow[]> => {
    try {
      const pool = getAgentGuardPool();

      const result = await pool.query<{
        tool_name: string;
        call_count: string;
        avg_duration_ms: number | null;
        agents_using: string;
        flag_rate: number | null;
        block_rate: number | null;
      }>(
        `
        SELECT
          tc.tool_name,
          COUNT(*) AS call_count,
          AVG(tc.duration_ms) AS avg_duration_ms,
          COUNT(DISTINCT tc.agent_id) AS agents_using,
          AVG(CASE WHEN e.action = 'flag' THEN 1.0 ELSE 0.0 END) AS flag_rate,
          AVG(CASE WHEN e.action = 'block' THEN 1.0 ELSE 0.0 END) AS block_rate
        FROM tool_calls tc
        JOIN executions e ON tc.execution_id = e.execution_id
        WHERE tc.org_id = $1
          AND tc.timestamp >= NOW() - INTERVAL '${TIME_RANGE_INTERVALS[timeRange ?? '7d']}'
        GROUP BY tc.tool_name
        ORDER BY call_count DESC
        LIMIT 50
        `,
        [orgId],
      );

      return result.rows.map((row) => ({
        tool_name: row.tool_name,
        call_count: parseInt(row.call_count, 10),
        avg_duration_ms: row.avg_duration_ms,
        agents_using: parseInt(row.agents_using, 10),
        flag_rate: row.flag_rate,
        block_rate: row.block_rate,
      }));
    } catch {
      return [];
    }
  },
);

/**
 * Load KPI aggregates for the tool usage dashboard.
 */
export const loadToolUsageKpis = cache(
  async (orgId: string, timeRange?: TimeRange): Promise<ToolUsageKpis> => {
    try {
      const pool = getAgentGuardPool();

      const result = await pool.query<{
        total_calls: string;
        unique_tools: string;
      }>(
        `
        SELECT
          COUNT(*) AS total_calls,
          COUNT(DISTINCT tool_name) AS unique_tools
        FROM tool_calls
        WHERE org_id = $1
          AND timestamp >= NOW() - INTERVAL '${TIME_RANGE_INTERVALS[timeRange ?? '7d']}'
        `,
        [orgId],
      );

      const policyResult = await pool.query<{ count: string }>(
        `
        SELECT COUNT(*) AS count
        FROM guardrails
        WHERE org_id = $1
          AND rule_type = 'tool_policy'
          AND enabled = true
        `,
        [orgId],
      );

      const row = result.rows[0];

      return {
        total_calls: parseInt(row?.total_calls ?? '0', 10),
        unique_tools: parseInt(row?.unique_tools ?? '0', 10),
        anomaly_count: 0,
        active_policies: parseInt(policyResult.rows[0]?.count ?? '0', 10),
      };
    } catch {
      return {
        total_calls: 0,
        unique_tools: 0,
        anomaly_count: 0,
        active_policies: 0,
      };
    }
  },
);

/**
 * Load daily time-series for the stacked area chart (7 days).
 */
export const loadToolUsageTimeSeries = cache(
  async (
    orgId: string,
    timeRange?: TimeRange,
  ): Promise<ToolCallDailyBucket[]> => {
    try {
      const pool = getAgentGuardPool();

      const result = await pool.query<{
        bucket: string;
        tool_name: string;
        call_count: string;
      }>(
        `
        SELECT
          bucket,
          tool_name,
          SUM(call_count)::text AS call_count
        FROM tool_usage_daily
        WHERE org_id = $1
          AND bucket >= NOW() - INTERVAL '${TIME_RANGE_INTERVALS[timeRange ?? '7d']}'
        GROUP BY bucket, tool_name
        ORDER BY bucket ASC, tool_name ASC
        `,
        [orgId],
      );

      return result.rows.map((row) => ({
        bucket: row.bucket,
        tool_name: row.tool_name,
        call_count: parseInt(row.call_count, 10),
      }));
    } catch {
      return [];
    }
  },
);

/**
 * Load tool x agent risk matrix for heatmap (7 days).
 */
export const loadToolRiskMatrix = cache(
  async (orgId: string, timeRange?: TimeRange): Promise<ToolRiskCell[]> => {
    try {
      const pool = getAgentGuardPool();

      const result = await pool.query<{
        tool_name: string;
        agent_id: string;
        call_count: string;
        block_rate: number | null;
      }>(
        `
        SELECT
          tool_name,
          agent_id,
          SUM(call_count)::text AS call_count,
          AVG(block_rate) AS block_rate
        FROM tool_usage_daily
        WHERE org_id = $1
          AND bucket >= NOW() - INTERVAL '${TIME_RANGE_INTERVALS[timeRange ?? '7d']}'
        GROUP BY tool_name, agent_id
        ORDER BY tool_name, agent_id
        `,
        [orgId],
      );

      return result.rows.map((row) => ({
        tool_name: row.tool_name,
        agent_id: row.agent_id,
        call_count: parseInt(row.call_count, 10),
        block_rate: row.block_rate ?? 0,
      }));
    } catch {
      return [];
    }
  },
);

/**
 * Detect tool usage anomalies by comparing current vs 7-day averages.
 */
export const loadToolAnomalies = cache(
  async (orgId: string, timeRange?: TimeRange): Promise<ToolAnomaly[]> => {
    try {
      const pool = getAgentGuardPool();

      const result = await pool.query<{
        tool_name: string;
        agent_id: string;
        today_count: string;
        avg_7d_count: string;
        today_block_rate: number | null;
        today_avg_duration: number | null;
        avg_7d_duration: number | null;
      }>(
        `
        WITH daily AS (
          SELECT
            tool_name,
            agent_id,
            bucket,
            SUM(call_count) AS call_count,
            AVG(avg_duration_ms) AS avg_duration_ms,
            AVG(block_rate) AS block_rate
          FROM tool_usage_daily
          WHERE org_id = $1
            AND bucket >= NOW() - INTERVAL '${TIME_RANGE_INTERVALS[timeRange ?? '7d']}'
          GROUP BY tool_name, agent_id, bucket
        ),
        today AS (
          SELECT
            tool_name,
            agent_id,
            SUM(call_count) AS today_count,
            AVG(block_rate) AS today_block_rate,
            AVG(avg_duration_ms) AS today_avg_duration
          FROM daily
          WHERE bucket >= date_trunc('day', NOW())
          GROUP BY tool_name, agent_id
        ),
        avg7 AS (
          SELECT
            tool_name,
            agent_id,
            AVG(call_count) AS avg_7d_count,
            AVG(avg_duration_ms) AS avg_7d_duration
          FROM daily
          WHERE bucket < date_trunc('day', NOW())
          GROUP BY tool_name, agent_id
        )
        SELECT
          t.tool_name,
          t.agent_id,
          t.today_count::text,
          COALESCE(a.avg_7d_count, 0)::text AS avg_7d_count,
          t.today_block_rate,
          t.today_avg_duration,
          a.avg_7d_duration
        FROM today t
        LEFT JOIN avg7 a ON t.tool_name = a.tool_name AND t.agent_id = a.agent_id
        `,
        [orgId],
      );

      const anomalies: ToolAnomaly[] = [];

      for (const row of result.rows) {
        const todayCount = parseInt(row.today_count, 10);
        const avg7dCount = parseFloat(row.avg_7d_count);
        const blockRate = row.today_block_rate ?? 0;
        const todayDuration = row.today_avg_duration;
        const avg7dDuration = row.avg_7d_duration;

        if (avg7dCount > 0 && todayCount > 2 * avg7dCount) {
          anomalies.push({
            severity: 'medium',
            tool_name: row.tool_name,
            agent_id: row.agent_id,
            anomaly_type: 'volume_spike',
            description: `${row.tool_name} called ${todayCount}x today by ${row.agent_id} (avg: ${Math.round(avg7dCount)}/day)`,
            current_value: todayCount,
            baseline_value: avg7dCount,
          });
        }

        if (blockRate > 0.2) {
          anomalies.push({
            severity: 'high',
            tool_name: row.tool_name,
            agent_id: row.agent_id,
            anomaly_type: 'high_block_rate',
            description: `${row.tool_name} block rate ${(blockRate * 100).toFixed(0)}% for ${row.agent_id}`,
            current_value: blockRate,
            baseline_value: 0.2,
          });
        }

        if (
          todayDuration != null &&
          avg7dDuration != null &&
          avg7dDuration > 0 &&
          todayDuration > 3 * avg7dDuration
        ) {
          anomalies.push({
            severity: 'medium',
            tool_name: row.tool_name,
            agent_id: row.agent_id,
            anomaly_type: 'latency_spike',
            description: `${row.tool_name} avg ${Math.round(todayDuration)}ms today for ${row.agent_id} (avg: ${Math.round(avg7dDuration)}ms)`,
            current_value: todayDuration,
            baseline_value: avg7dDuration,
          });
        }
      }

      const severityOrder = { critical: 0, high: 1, medium: 2 };
      anomalies.sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
      );

      return anomalies;
    } catch {
      return [];
    }
  },
);
