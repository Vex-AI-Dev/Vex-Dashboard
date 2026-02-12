import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import ApiKeysTable from './_components/api-keys-table';
import CreateKeyDialog from './_components/create-key-dialog';
import { loadApiKeys } from './_lib/server/api-keys.loader';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:apiKeys.pageTitle');

  return { title };
};

interface ApiKeysPageProps {
  params: Promise<{ account: string }>;
}

const MAX_KEYS = 10;

async function ApiKeysPage(props: ApiKeysPageProps) {
  const { account } = await props.params;
  const orgId = await resolveOrgId(account);
  const keys = await loadApiKeys(orgId);

  const activeKeyCount = keys.filter((k) => !k.revoked).length;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:apiKeys.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <div className="flex max-w-4xl flex-1 flex-col space-y-4">
          <div className="flex items-center justify-end">
            <CreateKeyDialog
              accountSlug={account}
              disabled={activeKeyCount >= MAX_KEYS}
            />
          </div>

          <ApiKeysTable keys={keys} accountSlug={account} />
        </div>
      </PageBody>
    </>
  );
}

export default withI18n(ApiKeysPage);
