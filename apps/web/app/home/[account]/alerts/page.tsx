import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { AlertsDashboard } from './_components/alerts-dashboard';
import { loadAlerts } from './_lib/server/alerts.loader';

interface AlertsPageProps {
  params: Promise<{ account: string }>;
  searchParams: Promise<{
    severity?: string;
    agent?: string;
    timeRange?: string;
  }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:alerts.pageTitle');

  return {
    title,
  };
};

async function AlertsPage({ params, searchParams }: AlertsPageProps) {
  const { account } = await params;
  const filters = await searchParams;
  const orgId = await resolveOrgId(account);

  const [alerts, agentsResult] = await Promise.all([
    loadAlerts(orgId, {
      severity: filters.severity,
      agentId: filters.agent,
      timeRange: filters.timeRange as '1h' | '24h' | '7d' | '30d' | undefined,
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
        title={<Trans i18nKey={'agentguard:alerts.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <AlertsDashboard
          alerts={alerts}
          accountSlug={account}
          agents={agentsResult.rows}
        />
      </PageBody>
    </>
  );
}

export default withI18n(AlertsPage);
