import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import CreateGuardrailDialog from './_components/create-guardrail-dialog';
import GuardrailsTable from './_components/guardrails-table';
import { loadGuardrails } from './_lib/server/guardrails.loader';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:guardrails.pageTitle');

  return { title };
};

interface GuardrailsPageProps {
  params: Promise<{ account: string }>;
}

async function GuardrailsPage(props: GuardrailsPageProps) {
  const { account } = await props.params;
  const orgId = await resolveOrgId(account);
  const guardrails = await loadGuardrails(orgId);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:guardrails.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-4">
          {guardrails.length > 0 && (
            <div className="flex items-center justify-end">
              <CreateGuardrailDialog accountSlug={account} />
            </div>
          )}

          <GuardrailsTable guardrails={guardrails} accountSlug={account} />
        </div>
      </PageBody>
    </>
  );
}

export default withI18n(GuardrailsPage);
