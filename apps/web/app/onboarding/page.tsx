import { redirect } from 'next/navigation';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { loadOnboardingState } from '~/lib/agentguard/onboarding.loader';
import { withI18n } from '~/lib/i18n/with-i18n';

import { OnboardingWizard } from './_components/onboarding-wizard';

interface OnboardingPageProps {
  searchParams: Promise<{ account?: string }>;
}

async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { account } = await searchParams;

  if (!account) {
    redirect('/home');
  }

  const client = getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  if (!user) {
    redirect('/auth/sign-in');
  }

  const onboarding = await loadOnboardingState(account);

  if (onboarding.completed) {
    redirect(`/home/${account}`);
  }

  return (
    <OnboardingWizard
      accountSlug={account}
      initialStep={onboarding.currentStep}
    />
  );
}

export default withI18n(OnboardingPage);
