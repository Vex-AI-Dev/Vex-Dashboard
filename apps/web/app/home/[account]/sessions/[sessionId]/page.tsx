import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import {
  loadSessionDetail,
  loadSessionTracePayloads,
  loadSessionTurns,
} from '../_lib/server/sessions.loader';
import { SessionDetailDashboard } from './_components/session-detail-dashboard';

interface SessionDetailPageProps {
  params: Promise<{ account: string; sessionId: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:sessions.detailTitle');

  return {
    title,
  };
};

async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { account, sessionId } = await params;
  const orgId = await resolveOrgId(account);

  const [header, turns] = await Promise.all([
    loadSessionDetail(sessionId, orgId),
    loadSessionTurns(sessionId, orgId),
  ]);

  const tracePayloads = turns.length > 0
    ? await loadSessionTracePayloads(turns)
    : {};

  if (!header) {
    return (
      <>
        <TeamAccountLayoutPageHeader
          account={account}
          title={<Trans i18nKey={'agentguard:sessions.detailTitle'} />}
          description={<AppBreadcrumbs />}
        />

        <PageBody>
          <p className="text-muted-foreground text-sm">
            <Trans i18nKey="agentguard:sessions.sessionNotFound" />
          </p>
        </PageBody>
      </>
    );
  }

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:sessions.detailTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <SessionDetailDashboard
          header={header}
          turns={turns}
          tracePayloads={tracePayloads}
          accountSlug={account}
        />
      </PageBody>
    </>
  );
}

export default withI18n(SessionDetailPage);
