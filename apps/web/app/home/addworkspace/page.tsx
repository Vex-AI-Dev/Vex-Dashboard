import { redirect } from 'next/navigation';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { withI18n } from '~/lib/i18n/with-i18n';

import { CreateWorkspaceForm } from './_components/create-workspace-form';

async function AddWorkspacePage() {
  const client = getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}

export default withI18n(AddWorkspacePage);
