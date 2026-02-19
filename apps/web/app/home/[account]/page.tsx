import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { HomepageDashboard } from './_components/homepage-dashboard';
import { TeamAccountLayoutPageHeader } from './_components/team-account-layout-page-header';
import {
  loadAgentHealth,
  loadAlertSummary,
  loadHomepageKpis,
  loadHomepageTrend,
  loadPlanUsage,
} from './_lib/server/homepage.loader';

interface TeamAccountHomePageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:homepage.pageTitle');

  return {
    title,
  };
};

async function TeamAccountHomePage({ params }: TeamAccountHomePageProps) {
  const { account } = await params;
  const orgId = await resolveOrgId(account);

  const [kpis, agentHealth, alertSummary, trend, planUsage] = await Promise.all([
    loadHomepageKpis(orgId),
    loadAgentHealth(orgId),
    loadAlertSummary(orgId),
    loadHomepageTrend(orgId),
    loadPlanUsage(orgId, account),
  ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:homepage.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <HomepageDashboard
          kpis={kpis}
          agentHealth={agentHealth}
          alertSummary={alertSummary}
          trend={trend}
          accountSlug={account}
          planUsage={planUsage}
        />
      </PageBody>
    </>
  );
}

export default withI18n(TeamAccountHomePage);
