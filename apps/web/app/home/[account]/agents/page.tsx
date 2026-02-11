import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { FleetHealthDashboard } from './_components/fleet-health-dashboard';
import {
  loadAgentFleetTable,
  loadExecutionsOverTime,
  loadFleetKpis,
} from './_lib/server/fleet-health.loader';

interface FleetHealthPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:fleet.pageTitle');

  return {
    title,
  };
};

async function FleetHealthPage({ params }: FleetHealthPageProps) {
  const { account } = await params;
  const orgId = await resolveOrgId(account);

  const [kpis, agents, executionsOverTime] = await Promise.all([
    loadFleetKpis(orgId),
    loadAgentFleetTable(orgId),
    loadExecutionsOverTime(orgId),
  ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:fleet.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <FleetHealthDashboard
          kpis={kpis}
          agents={agents}
          executionsOverTime={executionsOverTime}
          accountSlug={account}
        />
      </PageBody>
    </>
  );
}

export default withI18n(FleetHealthPage);
