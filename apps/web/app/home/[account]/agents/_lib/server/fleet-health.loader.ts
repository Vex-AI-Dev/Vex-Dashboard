import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import type {
  AgentFleetRow,
  ExecutionsOverTime,
  FleetKpis,
} from '~/lib/agentguard/types';

/**
 * Load fleet-level KPI aggregates for the last 24 hours.
 */
export const loadFleetKpis = cache(async (orgId: string): Promise<FleetKpis> => {
  const pool = getAgentGuardPool();

  const result = await pool.query<{
    total_agents: string;
    executions_24h: string;
    avg_confidence: number | null;
    pass_rate: number | null;
    correction_rate: number | null;
  }>(
    `
    SELECT
      (SELECT COUNT(DISTINCT agent_id) FROM agents WHERE org_id = $1) AS total_agents,
      COUNT(*) AS executions_24h,
      AVG(confidence) AS avg_confidence,
      CASE
        WHEN COUNT(*) > 0
        THEN COUNT(*) FILTER (WHERE action = 'pass')::float / COUNT(*)
        ELSE NULL
      END AS pass_rate,
      CASE
        WHEN COUNT(*) FILTER (WHERE action IN ('flag', 'block')) > 0
        THEN COUNT(*) FILTER (WHERE corrected = TRUE)::float
             / COUNT(*) FILTER (WHERE action IN ('flag', 'block'))
        ELSE NULL
      END AS correction_rate
    FROM executions
    WHERE org_id = $1
      AND timestamp >= NOW() - INTERVAL '24 hours'
    `,
    [orgId],
  );

  const row = result.rows[0];

  return {
    total_agents: parseInt(row?.total_agents ?? '0', 10),
    executions_24h: parseInt(row?.executions_24h ?? '0', 10),
    avg_confidence: row?.avg_confidence ?? null,
    pass_rate: row?.pass_rate ?? null,
    correction_rate: row?.correction_rate ?? null,
  };
});

/**
 * Load per-agent stats for the fleet table (last 24 hours).
 */
export const loadAgentFleetTable = cache(
  async (orgId: string): Promise<AgentFleetRow[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      agent_id: string;
      name: string;
      executions_24h: string;
      avg_confidence: number | null;
      pass_rate: number | null;
      last_active: string | null;
    }>(
      `
      SELECT
        a.agent_id,
        a.name,
        COUNT(e.execution_id) AS executions_24h,
        AVG(e.confidence) AS avg_confidence,
        CASE
          WHEN COUNT(e.execution_id) > 0
          THEN COUNT(e.execution_id) FILTER (WHERE e.action = 'pass')::float / COUNT(e.execution_id)
          ELSE NULL
        END AS pass_rate,
        MAX(e.timestamp) AS last_active
      FROM agents a
      LEFT JOIN executions e
        ON a.agent_id = e.agent_id
        AND e.timestamp >= NOW() - INTERVAL '24 hours'
      WHERE a.org_id = $1
      GROUP BY a.agent_id, a.name
      ORDER BY COUNT(e.execution_id) DESC
      `,
      [orgId],
    );

    return result.rows.map((row) => ({
      agent_id: row.agent_id,
      name: row.name,
      executions_24h: parseInt(row.executions_24h, 10),
      avg_confidence: row.avg_confidence,
      pass_rate: row.pass_rate,
      last_active: row.last_active,
    }));
  },
);

/**
 * Load executions over time (7 days) from agent_health_hourly continuous aggregate.
 */
export const loadExecutionsOverTime = cache(
  async (orgId: string): Promise<ExecutionsOverTime[]> => {
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      bucket: string;
      pass_count: string;
      flag_count: string;
      block_count: string;
    }>(
      `
      WITH materialized AS (
        SELECT
          h.bucket,
          SUM(h.pass_count) AS pass_count,
          SUM(h.flag_count) AS flag_count,
          SUM(h.block_count) AS block_count
        FROM agent_health_hourly h
        INNER JOIN agents a ON h.agent_id = a.agent_id
        WHERE a.org_id = $1
          AND h.bucket >= NOW() - INTERVAL '7 days'
        GROUP BY h.bucket
      ),
      realtime AS (
        SELECT
          time_bucket('1 hour', e.timestamp) AS bucket,
          COUNT(*) FILTER (WHERE e.action = 'pass') AS pass_count,
          COUNT(*) FILTER (WHERE e.action = 'flag') AS flag_count,
          COUNT(*) FILTER (WHERE e.action = 'block') AS block_count
        FROM executions e
        INNER JOIN agents a ON e.agent_id = a.agent_id
        WHERE a.org_id = $1
          AND e.timestamp >= NOW() - INTERVAL '10 minutes'
        GROUP BY bucket
      )
      SELECT
        COALESCE(m.bucket, r.bucket) AS bucket,
        COALESCE(m.pass_count, 0) + COALESCE(r.pass_count, 0) AS pass_count,
        COALESCE(m.flag_count, 0) + COALESCE(r.flag_count, 0) AS flag_count,
        COALESCE(m.block_count, 0) + COALESCE(r.block_count, 0) AS block_count
      FROM materialized m
      FULL OUTER JOIN realtime r ON m.bucket = r.bucket
      ORDER BY bucket ASC
      `,
      [orgId],
    );

    return result.rows.map((row) => ({
      bucket: row.bucket,
      pass_count: parseInt(row.pass_count, 10),
      flag_count: parseInt(row.flag_count, 10),
      block_count: parseInt(row.block_count, 10),
    }));
  },
);
