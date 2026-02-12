import { notFound } from 'next/navigation';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { AgentDetailDashboard } from './_components/agent-detail-dashboard';
import {
  loadAgent,
  loadAgentActionDistribution,
  loadAgentConfidenceOverTime,
  loadAgentKpis,
  loadRecentExecutions,
} from './_lib/server/agent-detail.loader';

interface AgentDetailPageProps {
  params: Promise<{ account: string; agentId: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:agent.pageTitle');

  return {
    title,
  };
};

async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { account, agentId } = await params;

  const agent = await loadAgent(agentId);

  if (!agent) {
    notFound();
  }

  const [kpis, confidenceOverTime, actionDistribution, recentExecutions] =
    await Promise.all([
      loadAgentKpis(agentId),
      loadAgentConfidenceOverTime(agentId),
      loadAgentActionDistribution(agentId),
      loadRecentExecutions(agentId),
    ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={agent.name}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <AgentDetailDashboard
          kpis={kpis}
          confidenceOverTime={confidenceOverTime}
          actionDistribution={actionDistribution}
          recentExecutions={recentExecutions}
          accountSlug={account}
          agentId={agentId}
        />
      </PageBody>
    </>
  );
}

export default withI18n(AgentDetailPage);
