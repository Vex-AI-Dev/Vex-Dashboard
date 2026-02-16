import 'server-only';

import { cache } from 'react';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import type { Alert } from '~/lib/agentguard/types';

export const ALERTS_PAGE_SIZE = 25;

export interface AlertFilters {
  severity?: string;
  agentId?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d';
  page?: number;
}

const TIME_RANGE_INTERVALS: Record<string, string> = {
  '1h': '1 hour',
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
};

/**
 * Load alerts for an organization with optional filters.
 * Joins with agents table to include agent names.
 */
export interface AlertsResult {
  rows: Alert[];
  pageCount: number;
}

export const loadAlerts = cache(
  async (orgId: string, filters?: AlertFilters): Promise<AlertsResult> => {
    const pool = getAgentGuardPool();
    const page = Math.max(1, filters?.page ?? 1);
    const offset = (page - 1) * ALERTS_PAGE_SIZE;

    const conditions: string[] = ['al.org_id = $1'];
    const params: unknown[] = [orgId];
    let paramIndex = 2;

    if (filters?.severity) {
      conditions.push(`al.severity = $${paramIndex}`);
      params.push(filters.severity);
      paramIndex++;
    }

    if (filters?.agentId) {
      conditions.push(`al.agent_id = $${paramIndex}`);
      params.push(filters.agentId);
      paramIndex++;
    }

    if (filters?.timeRange) {
      const interval = TIME_RANGE_INTERVALS[filters.timeRange];

      if (interval) {
        conditions.push(`al.created_at >= NOW() - INTERVAL '${interval}'`);
      }
    }

    const whereClause = conditions.join(' AND ');

    const result = await pool.query<Alert & { total_count: string }>(
      `
      SELECT
        al.alert_id,
        al.execution_id,
        al.agent_id,
        al.org_id,
        al.alert_type,
        al.severity,
        al.delivered,
        al.webhook_response,
        al.webhook_url,
        al.delivery_attempts,
        al.last_attempt_at,
        al.response_status,
        al.created_at,
        ag.name AS agent_name,
        COUNT(*) OVER() AS total_count
      FROM alerts al
      LEFT JOIN agents ag ON al.agent_id = ag.agent_id
      WHERE ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      [...params, ALERTS_PAGE_SIZE, offset],
    );

    const totalCount = parseInt(result.rows[0]?.total_count ?? '0', 10);
    const pageCount =
      totalCount === 0 ? 0 : Math.ceil(totalCount / ALERTS_PAGE_SIZE);

    return {
      rows: result.rows,
      pageCount,
    };
  },
);
