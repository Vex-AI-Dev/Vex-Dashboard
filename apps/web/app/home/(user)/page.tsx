import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

// local imports
import { HomeLayoutPageHeader } from './_components/home-page-header';
import { loadUserWorkspace } from './_lib/server/load-user-workspace';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('account:homePage');

  return {
    title,
  };
};

async function UserHomePage() {
  const [cookieStore, workspace] = await Promise.all([
    cookies(),
    loadUserWorkspace(),
  ]);

  // No team accounts exist — send user to create one
  if (workspace.accounts.length === 0) {
    redirect('/home/addworkspace');
  }

  // Redirect to last-visited account
  const lastAccount = cookieStore.get('last-account')?.value;

  if (lastAccount) {
    redirect(pathsConfig.app.accountHome.replace('[account]', lastAccount));
  }

  return (
    <>
      <HomeLayoutPageHeader
        title={<Trans i18nKey={'common:routes.home'} />}
        description={<Trans i18nKey={'common:homeTabDescription'} />}
      />

      <PageBody></PageBody>
    </>
  );
}

export default withI18n(UserHomePage);
