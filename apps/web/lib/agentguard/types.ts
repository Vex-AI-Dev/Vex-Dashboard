/**
 * TypeScript interfaces for AgentGuard dashboard data.
 * These map to the TimescaleDB schema defined in the AgentGuard migrations.
 */

export interface Agent {
  agent_id: string;
  org_id: string;
  name: string;
  task: string | null;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  execution_id: string;
  agent_id: string;
  org_id: string;
  session_id: string | null;
  parent_execution_id: string | null;
  sequence_number: number | null;
  timestamp: string;
  confidence: number | null;
  action: 'pass' | 'flag' | 'block';
  latency_ms: number | null;
  token_count: number | null;
  cost_estimate: number | null;
  corrected: boolean;
  correction_layers_used: unknown[] | null;
  trace_payload_ref: string | null;
  status: string;
  task: string | null;
  metadata: Record<string, unknown>;
}

export interface CheckResult {
  id: number;
  execution_id: string;
  check_type: string;
  score: number | null;
  passed: boolean;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface Alert {
  alert_id: string;
  execution_id: string;
  agent_id: string;
  org_id: string;
  alert_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  delivered: boolean;
  webhook_response: Record<string, unknown> | null;
  webhook_url: string | null;
  delivery_attempts: number;
  last_attempt_at: string | null;
  response_status: number | null;
  created_at: string;
  /** Joined from agents table */
  agent_name?: string;
}

export interface HumanReview {
  id: number;
  execution_id: string;
  reviewer: string;
  verdict: string;
  notes: string | null;
  created_at: string;
}

export interface AgentHealthHourly {
  agent_id: string;
  bucket: string;
  execution_count: number;
  avg_confidence: number | null;
  pass_count: number;
  flag_count: number;
  block_count: number;
  total_tokens: number | null;
  total_cost: number | null;
  avg_latency: number | null;
}

export interface FleetKpis {
  total_agents: number;
  executions_24h: number;
  avg_confidence: number | null;
  pass_rate: number | null;
  correction_rate: number | null;
}

export interface AgentFleetRow {
  agent_id: string;
  name: string;
  executions_24h: number;
  avg_confidence: number | null;
  pass_rate: number | null;
  last_active: string | null;
}

export interface ExecutionsOverTime {
  bucket: string;
  pass_count: number;
  flag_count: number;
  block_count: number;
}

export interface AgentKpis {
  total_executions: number;
  avg_confidence: number | null;
  avg_latency: number | null;
  total_tokens: number | null;
  total_cost: number | null;
}

export interface ConfidenceOverTime {
  bucket: string;
  avg_confidence: number | null;
}

export interface ActionDistribution {
  action: string;
  count: number;
}

export interface SessionSummary {
  session_id: string;
  agent_id: string;
  turn_count: number;
  first_timestamp: string;
  last_timestamp: string;
  total_tokens: number | null;
  total_cost: number | null;
}

/**
 * A single correction attempt recorded during verification.
 */
export interface CorrectionAttempt {
  layer: number;
  layer_name: 'repair' | 'constrained_regen' | 'full_reprompt';
  confidence: number | null;
  action: string;
  success: boolean;
  latency_ms: number;
  corrected_output: string | null;
}

/**
 * Correction metadata stored on an execution.
 */
export interface CorrectionMetadata {
  corrected: boolean;
  original_output: string | null;
  corrected_output: string | null;
  correction_attempts: CorrectionAttempt[];
}

/**
 * A single API key entry stored in organizations.api_keys JSONB.
 * The full plaintext key is never stored — only the SHA-256 hash.
 */
export interface ApiKeyEntry {
  id: string;
  prefix: string;
  key_hash: string;
  name: string;
  scopes: string[];
  rate_limit_rpm: number;
  expires_at: string | null;
  created_at: string;
  created_by: string;
  last_used_at: string | null;
  revoked: boolean;
}

/**
 * Per-agent recent session summary for the fleet page agent cards.
 */
export interface FleetSessionSummary {
  session_id: string;
  agent_id: string;
  turn_count: number;
  avg_confidence: number | null;
  last_timestamp: string;
}

/**
 * Homepage KPIs — value-oriented metrics for the dashboard overview.
 */
export interface HomepageKpis {
  total_verifications: number;
  avg_confidence: number | null;
  issues_caught: number;
  auto_corrected: number;
}

/**
 * Per-agent health summary for homepage tiles.
 */
export interface AgentHealthTile {
  agent_id: string;
  name: string;
  avg_confidence: number | null;
  executions_24h: number;
  last_active: string | null;
}

/**
 * Alert severity counts for homepage summary pills.
 */
export interface AlertSeveritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/**
 * Hourly execution bucket for homepage 24h mini chart.
 */
export interface HomepageTrendBucket {
  bucket: string;
  pass_count: number;
  flag_count: number;
  block_count: number;
}

/**
 * Recent execution for homepage activity feed.
 */
export interface RecentActivityItem {
  execution_id: string;
  agent_id: string;
  agent_name: string;
  action: 'pass' | 'flag' | 'block';
  confidence: number | null;
  task: string | null;
  timestamp: string;
}

/**
 * API key as displayed in the dashboard (no hash).
 */
export interface ApiKeyDisplay {
  id: string;
  prefix: string;
  name: string;
  scopes: string[];
  rate_limit_rpm: number;
  expires_at: string | null;
  created_at: string;
  last_used_at: string | null;
  revoked: boolean;
}

/**
 * A session row for the sessions list page.
 */
export interface SessionListRow {
  session_id: string;
  agent_id: string;
  agent_name: string;
  turn_count: number;
  avg_confidence: number | null;
  first_timestamp: string;
  last_timestamp: string;
  has_block: boolean;
  has_flag: boolean;
}

/**
 * A single turn (execution) in a session detail view.
 */
export interface SessionTurn {
  execution_id: string;
  sequence_number: number | null;
  task: string | null;
  confidence: number | null;
  action: 'pass' | 'flag' | 'block';
  latency_ms: number | null;
  timestamp: string;
  corrected: boolean;
  token_count: number | null;
  cost_estimate: number | null;
  metadata: Record<string, unknown>;
}

/**
 * Session detail header aggregates.
 */
export interface SessionDetailHeader {
  session_id: string;
  agent_id: string;
  agent_name: string;
  turn_count: number;
  avg_confidence: number | null;
  first_timestamp: string;
  last_timestamp: string;
  total_tokens: number | null;
  total_cost: number | null;
}
