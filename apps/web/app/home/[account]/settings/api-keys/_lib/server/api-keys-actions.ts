'use server';

import { enhanceAction } from '@kit/next/actions';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { createKey, revokeKey } from '~/lib/agentguard/api-keys';
import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';

import {
  CreateApiKeySchema,
  RevokeApiKeySchema,
} from '../schema/api-key.schema';

/**
 * Create a new API key for the team account.
 *
 * Returns the full plaintext key (shown once to the user) and the
 * display-safe entry for the key table.
 */
export const createApiKeyAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient();
    const { data: user } = await requireUser(client);

    if (!user) {
      throw new Error('Authentication required');
    }

    const orgId = await resolveOrgId(data.accountSlug);

    const result = await createKey({
      orgId,
      name: data.name,
      scopes: data.scopes,
      rateLimitRpm: data.rateLimitRpm,
      expiresAt: data.expiresAt,
      createdBy: user.id,
    });

    return {
      key: result.key,
      entry: result.entry,
    };
  },
  {
    schema: CreateApiKeySchema,
  },
);

/**
 * Revoke an API key for the team account.
 *
 * Sets `revoked: true` on the key entry in the JSONB array.
 * The key remains visible in the dashboard for audit purposes.
 */
export const revokeApiKeyAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient();
    const { data: user } = await requireUser(client);

    if (!user) {
      throw new Error('Authentication required');
    }

    const orgId = await resolveOrgId(data.accountSlug);
    const success = await revokeKey(orgId, data.keyId);

    if (!success) {
      throw new Error('API key not found');
    }

    return { success: true };
  },
  {
    schema: RevokeApiKeySchema,
  },
);
