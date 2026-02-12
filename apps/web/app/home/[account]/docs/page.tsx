import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { DocsContent } from './_components/docs-content';

interface DocsPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('agentguard:docs.pageTitle');

  return { title };
};

async function DocsPage(props: DocsPageProps) {
  const { account } = await props.params;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'agentguard:docs.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <DocsContent accountSlug={account} />
      </PageBody>
    </>
  );
}

export default withI18n(DocsPage);
