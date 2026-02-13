import { redirect } from 'next/navigation';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export default async function RootPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client, { verifyMfa: false });

  if (user.data) {
    redirect('/home');
  }

  redirect('/auth/sign-in');
}
