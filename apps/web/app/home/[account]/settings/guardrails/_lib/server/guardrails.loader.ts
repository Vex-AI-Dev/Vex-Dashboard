import 'server-only';

import { cache } from 'react';

import { listGuardrails } from '~/lib/agentguard/guardrails';
import type { GuardrailRow } from '~/lib/agentguard/guardrails';

export type { GuardrailRow };

export const loadGuardrails = cache(
  async (orgId: string): Promise<GuardrailRow[]> => {
    return listGuardrails(orgId);
  },
);
