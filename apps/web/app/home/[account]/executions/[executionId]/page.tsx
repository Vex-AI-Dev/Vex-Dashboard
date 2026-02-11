import { notFound } from 'next/navigation';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { ExecutionTraceViewer } from './_components/execution-trace-viewer';
import {
  loadCheckResults,
  loadCorrectionMetadata,
  loadExecution,
  loadHumanReviews,
} from './_lib/server/execution-detail.loader';

interface ExecutionDetailPageProps {
  params: Promise<{ account: string; executionId: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:execution.pageTitle');

  return {
    title,
  };
};

async function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const { account, executionId } = await params;

  const execution = await loadExecution(executionId);

  if (!execution) {
    notFound();
  }

  const [checkResults, humanReviews, correctionMetadata] = await Promise.all([
    loadCheckResults(executionId),
    loadHumanReviews(executionId),
    loadCorrectionMetadata(executionId),
  ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:execution.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <ExecutionTraceViewer
          execution={execution}
          checkResults={checkResults}
          humanReviews={humanReviews}
          correctionMetadata={correctionMetadata}
        />
      </PageBody>
    </>
  );
}

export default withI18n(ExecutionDetailPage);
