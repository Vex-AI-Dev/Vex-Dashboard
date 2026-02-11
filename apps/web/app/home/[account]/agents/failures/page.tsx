import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { FailuresDashboard } from './_components/failures-dashboard';
import { loadFailures } from './_lib/server/failures.loader';

interface FailuresPageProps {
  params: Promise<{ account: string }>;
  searchParams: Promise<{
    action?: string;
    agent?: string;
    timeRange?: string;
    corrected?: string;
  }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:failures.pageTitle');

  return {
    title,
  };
};

async function FailuresPage({ params, searchParams }: FailuresPageProps) {
  const { account } = await params;
  const filters = await searchParams;
  const orgId = await resolveOrgId(account);

  const [failures, agentsResult] = await Promise.all([
    loadFailures(orgId, {
      action: filters.action,
      agentId: filters.agent,
      timeRange: filters.timeRange as '1h' | '24h' | '7d' | '30d' | undefined,
      corrected: filters.corrected as 'true' | 'false' | undefined,
    }),
    getAgentGuardPool().query<{ agent_id: string; name: string }>(
      'SELECT agent_id, name FROM agents WHERE org_id = $1 ORDER BY name',
      [orgId],
    ),
  ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:failures.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <FailuresDashboard
          failures={failures}
          accountSlug={account}
          agents={agentsResult.rows}
        />
      </PageBody>
    </>
  );
}

export default withI18n(FailuresPage);
