'use server';

import { z } from 'zod';

import { isSuperAdmin } from '@kit/admin';
import { getLogger } from '@kit/shared/logger';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

const UpdatePlanSchema = z.object({
  accountId: z.string().uuid(),
  plan: z.enum(['free', 'pro', 'team', 'enterprise']),
  overrides: z
    .object({
      observations_per_month: z.number().optional(),
      verifications_per_month: z.number().optional(),
      max_rpm: z.number().optional(),
      max_agents: z.number().optional(),
      retention_days: z.number().optional(),
    })
    .nullable(),
});

export async function updateAccountPlan(
  input: z.infer<typeof UpdatePlanSchema>,
) {
  const data = UpdatePlanSchema.parse(input);

  const auth = await requireUser();

  if (!(await isSuperAdmin(auth.data))) {
    throw new Error('Unauthorized');
  }

  const logger = await getLogger();
  const adminClient = getSupabaseServerAdminClient();

  const { error } = await adminClient
    .from('accounts')
    .update({
      vex_plan: data.plan,
      vex_plan_overrides: data.overrides,
    })
    .eq('id', data.accountId);

  if (error) {
    throw new Error(`Failed to update plan: ${error.message}`);
  }

  logger.info(
    {
      name: 'admin-audit',
      action: 'update-account-plan',
      adminId: auth.data?.id,
      accountId: data.accountId,
      plan: data.plan,
      overrides: data.overrides,
    },
    'Admin updated account plan',
  );

  return { success: true };
}
