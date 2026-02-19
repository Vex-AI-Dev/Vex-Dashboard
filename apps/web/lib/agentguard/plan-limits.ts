/**
 * TypeScript mirror of services/shared/shared/plan_limits.py
 *
 * These constants define the quotas, rate limits, and feature flags
 * for each Vex pricing plan. Keep in sync with the Python backend.
 */

export interface PlanLimits {
  /** Monthly observation quota */
  observationsPerMonth: number;
  /** Monthly verification quota */
  verificationsPerMonth: number;
  /** Maximum requests per minute (overrides per-key RPM if lower) */
  maxRpm: number;
  /** Maximum number of registered agents (-1 = unlimited) */
  maxAgents: number;
  /** Maximum number of team seats */
  maxSeats: number;
  /** Whether correction layers are enabled */
  correctionsEnabled: boolean;
  /** Whether webhook alert delivery is enabled */
  webhookAlerts: boolean;
  /** Whether Slack alert delivery is enabled */
  slackAlerts: boolean;
  /** Data retention in days */
  retentionDays: number;
  /** If true, requests beyond quota are allowed (billed). If false, rejected (429). */
  overageAllowed: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    observationsPerMonth: 10_000,
    verificationsPerMonth: 500,
    maxRpm: 100,
    maxAgents: 3,
    maxSeats: 1,
    correctionsEnabled: false,
    webhookAlerts: false,
    slackAlerts: false,
    retentionDays: 7,
    overageAllowed: false,
  },
  pro: {
    observationsPerMonth: 100_000,
    verificationsPerMonth: 10_000,
    maxRpm: 1_000,
    maxAgents: 15,
    maxSeats: 5,
    correctionsEnabled: true,
    webhookAlerts: true,
    slackAlerts: false,
    retentionDays: 30,
    overageAllowed: true,
  },
  team: {
    observationsPerMonth: 1_000_000,
    verificationsPerMonth: 100_000,
    maxRpm: 5_000,
    maxAgents: -1, // unlimited
    maxSeats: 15,
    correctionsEnabled: true,
    webhookAlerts: true,
    slackAlerts: true,
    retentionDays: 90,
    overageAllowed: true,
  },
};

/**
 * Return the PlanLimits for the given plan name.
 * Falls back to "free" for unknown plan values.
 */
export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free!;
}

/**
 * Check whether a seat can be added given the current member count and plan.
 * Returns `{ allowed: true }` or `{ allowed: false, reason: string }`.
 */
export function canAddSeat(
  plan: string,
  currentMemberCount: number,
  seatsToAdd = 1,
): { allowed: true } | { allowed: false; reason: string } {
  const limits = getPlanLimits(plan);

  if (currentMemberCount + seatsToAdd > limits.maxSeats) {
    return {
      allowed: false,
      reason: `Your ${plan} plan allows up to ${limits.maxSeats} seat${limits.maxSeats === 1 ? '' : 's'}. You currently have ${currentMemberCount} member${currentMemberCount === 1 ? '' : 's'}.`,
    };
  }

  return { allowed: true };
}

/**
 * Check whether an agent can be added given the current agent count and plan.
 * Returns `{ allowed: true }` or `{ allowed: false, reason: string }`.
 */
export function canAddAgent(
  plan: string,
  currentAgentCount: number,
  agentsToAdd = 1,
): { allowed: true } | { allowed: false; reason: string } {
  const limits = getPlanLimits(plan);

  // -1 means unlimited
  if (limits.maxAgents === -1) {
    return { allowed: true };
  }

  if (currentAgentCount + agentsToAdd > limits.maxAgents) {
    return {
      allowed: false,
      reason: `Your ${plan} plan allows up to ${limits.maxAgents} agent${limits.maxAgents === 1 ? '' : 's'}. You currently have ${currentAgentCount} agent${currentAgentCount === 1 ? '' : 's'}.`,
    };
  }

  return { allowed: true };
}
