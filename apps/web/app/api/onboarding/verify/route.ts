import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { getAgentGuardPool } from '~/lib/agentguard/db';
import { resolveOrgId } from '~/lib/agentguard/resolve-org-id';

export async function GET(request: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountSlug = request.nextUrl.searchParams.get('account');

  if (!accountSlug) {
    return NextResponse.json(
      { error: 'Missing account parameter' },
      { status: 400 },
    );
  }

  try {
    const orgId = await resolveOrgId(accountSlug);
    const pool = getAgentGuardPool();

    const result = await pool.query<{
      agent_id: string;
      execution_count: number;
    }>(
      `SELECT agent_id, COUNT(*)::int AS execution_count
       FROM executions
       WHERE org_id = $1
       GROUP BY agent_id
       ORDER BY MAX("timestamp") DESC
       LIMIT 1`,
      [orgId],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      agent_id: result.rows[0]!.agent_id,
      execution_count: result.rows[0]!.execution_count,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
