'use server';

import { enhanceAction } from '@kit/next/actions';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  createGuardrail,
  deleteGuardrail,
  toggleGuardrail,
} from '~/lib/agentguard/guardrails';
import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';

import {
  CreateGuardrailSchema,
  DeleteGuardrailSchema,
  ToggleGuardrailSchema,
} from '../schema/guardrail.schema';

export const createGuardrailAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient();
    const { data: user } = await requireUser(client);

    if (!user) {
      throw new Error('Authentication required');
    }

    const orgId = await resolveOrgId(data.accountSlug);

    const guardrail = await createGuardrail({
      orgId,
      agentId: data.agentId,
      name: data.name,
      ruleType: data.ruleType,
      condition: data.condition as Record<string, unknown>,
      action: data.action,
    });

    return { guardrail };
  },
  {
    schema: CreateGuardrailSchema,
  },
);

export const deleteGuardrailAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient();
    const { data: user } = await requireUser(client);

    if (!user) {
      throw new Error('Authentication required');
    }

    const orgId = await resolveOrgId(data.accountSlug);
    const success = await deleteGuardrail(orgId, data.guardrailId);

    if (!success) {
      throw new Error('Guardrail not found');
    }

    return { success: true };
  },
  {
    schema: DeleteGuardrailSchema,
  },
);

export const toggleGuardrailAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient();
    const { data: user } = await requireUser(client);

    if (!user) {
      throw new Error('Authentication required');
    }

    const orgId = await resolveOrgId(data.accountSlug);
    const success = await toggleGuardrail(
      orgId,
      data.guardrailId,
      data.enabled,
    );

    if (!success) {
      throw new Error('Guardrail not found');
    }

    return { success: true };
  },
  {
    schema: ToggleGuardrailSchema,
  },
);
