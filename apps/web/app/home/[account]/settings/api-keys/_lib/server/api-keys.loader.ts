import 'server-only';

import { cache } from 'react';

import { listKeys } from '~/lib/agentguard/api-keys';
import type { ApiKeyDisplay } from '~/lib/agentguard/types';

/**
 * Load all API keys for an organization (display-safe — no hashes).
 *
 * Memoised per request via React's `cache()`.
 */
export const loadApiKeys = cache(
  async (orgId: string): Promise<ApiKeyDisplay[]> => {
    return listKeys(orgId);
  },
);
