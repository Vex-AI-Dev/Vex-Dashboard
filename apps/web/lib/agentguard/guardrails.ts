import 'server-only';

import { getAgentGuardPool } from '~/lib/agentguard/db';

export interface GuardrailRow {
  id: string;
  org_id: string;
  agent_id: string | null;
  name: string;
  rule_type: 'regex' | 'keyword' | 'threshold' | 'llm' | 'tool_policy';
  condition: Record<string, unknown>;
  action: 'flag' | 'block';
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGuardrailParams {
  orgId: string;
  agentId: string | null;
  name: string;
  ruleType: 'regex' | 'keyword' | 'threshold' | 'llm' | 'tool_policy';
  condition: Record<string, unknown>;
  action: 'flag' | 'block';
}

export async function listGuardrails(orgId: string): Promise<GuardrailRow[]> {
  const pool = getAgentGuardPool();
  const result = await pool.query<GuardrailRow>(
    `SELECT id, org_id, agent_id, name, rule_type, condition, action, enabled, created_at, updated_at
     FROM guardrails
     WHERE org_id = $1
     ORDER BY created_at DESC`,
    [orgId],
  );
  return result.rows;
}

export async function createGuardrail(
  params: CreateGuardrailParams,
): Promise<GuardrailRow> {
  const pool = getAgentGuardPool();
  const id = crypto.randomUUID();
  const result = await pool.query<GuardrailRow>(
    `INSERT INTO guardrails (id, org_id, agent_id, name, rule_type, condition, action, enabled)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, true)
     RETURNING id, org_id, agent_id, name, rule_type, condition, action, enabled, created_at, updated_at`,
    [
      id,
      params.orgId,
      params.agentId,
      params.name,
      params.ruleType,
      JSON.stringify(params.condition),
      params.action,
    ],
  );
  return result.rows[0]!;
}

export async function deleteGuardrail(
  orgId: string,
  guardrailId: string,
): Promise<boolean> {
  const pool = getAgentGuardPool();
  const result = await pool.query(
    `DELETE FROM guardrails WHERE id = $1 AND org_id = $2`,
    [guardrailId, orgId],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function toggleGuardrail(
  orgId: string,
  guardrailId: string,
  enabled: boolean,
): Promise<boolean> {
  const pool = getAgentGuardPool();
  const result = await pool.query(
    `UPDATE guardrails SET enabled = $3, updated_at = now() WHERE id = $1 AND org_id = $2`,
    [guardrailId, orgId, enabled],
  );
  return (result.rowCount ?? 0) > 0;
}
