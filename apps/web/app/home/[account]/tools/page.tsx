import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { ToolUsageDashboard } from './_components/tool-usage-dashboard';
import {
  loadToolAnomalies,
  loadToolRiskMatrix,
  loadToolUsage,
  loadToolUsageKpis,
  loadToolUsageTimeSeries,
} from './_lib/server/tool-usage.loader';

interface ToolUsagePageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:tools.pageTitle');
  return { title };
};

async function ToolUsagePage({ params }: ToolUsagePageProps) {
  const { account } = await params;
  const orgId = await resolveOrgId(account);

  const [tools, kpis, timeSeries, riskMatrix, anomalies] = await Promise.all([
    loadToolUsage(orgId),
    loadToolUsageKpis(orgId),
    loadToolUsageTimeSeries(orgId),
    loadToolRiskMatrix(orgId),
    loadToolAnomalies(orgId),
  ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey="agentguard:tools.pageTitle" />}
        description={<AppBreadcrumbs />}
      />
      <PageBody>
        <ToolUsageDashboard
          tools={tools}
          kpis={kpis}
          timeSeries={timeSeries}
          riskMatrix={riskMatrix}
          anomalies={anomalies}
          accountSlug={account}
        />
      </PageBody>
    </>
  );
}

export default withI18n(ToolUsagePage);
