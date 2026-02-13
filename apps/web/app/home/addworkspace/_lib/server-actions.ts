'use server';

import 'server-only';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { enhanceAction } from '@kit/next/actions';
import { getLogger } from '@kit/shared/logger';
import { createAccountCreationPolicyEvaluator } from '@kit/team-accounts/policies';
import { TeamNameSchema } from '@kit/team-accounts/schema';
import { createCreateTeamAccountService } from '@kit/team-accounts/services/create-team-account';

const CreateWorkspaceSchema = z
  .object({
    name: TeamNameSchema,
  })
  .refine(
    (data) => {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return slug.length >= 2;
    },
    {
      message:
        'Workspace name must contain at least 2 Latin alphanumeric characters',
      path: ['name'],
    },
  );

/**
 * Generate a URL-friendly slug from a workspace name.
 *
 * - Converts to lowercase
 * - Replaces non-alphanumeric characters with hyphens
 * - Collapses consecutive hyphens
 * - Strips leading and trailing hyphens
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const createWorkspaceAction = enhanceAction(
  async ({ name }, user) => {
    const logger = await getLogger();
    const service = createCreateTeamAccountService();

    const ctx = {
      name: 'workspace.create',
      userId: user.id,
      workspaceName: name,
    };

    logger.info(ctx, `Creating workspace...`);

    // Check policies before creating
    const evaluator = createAccountCreationPolicyEvaluator();

    if (await evaluator.hasPoliciesForStage('submission')) {
      const policyContext = {
        timestamp: new Date().toISOString(),
        userId: user.id,
        accountName: name,
      };

      const result = await evaluator.canCreateAccount(
        policyContext,
        'submission',
      );

      if (!result.allowed) {
        logger.warn(
          { ...ctx, reasons: result.reasons },
          `Policy denied workspace creation`,
        );

        return {
          error: true,
          message: result.reasons[0] ?? 'Policy denied account creation',
        };
      }
    }

    const slug = generateSlug(name);

    const { data, error } = await service.createNewOrganizationAccount({
      name,
      userId: user.id,
      slug,
    });

    if (error === 'duplicate_slug') {
      return {
        error: true,
        message: 'agentguard:addWorkspace.errorDuplicate',
      };
    }

    logger.info(ctx, `Workspace created`);

    redirect('/onboarding?account=' + data.slug);
  },
  {
    schema: CreateWorkspaceSchema,
  },
);
