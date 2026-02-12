import { NextResponse } from 'next/server';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getAgentGuardPool } from '~/lib/agentguard/db';

function getS3Client(): S3Client {
  return new S3Client({
    endpoint: process.env.AGENTGUARD_S3_ENDPOINT,
    region: process.env.AGENTGUARD_S3_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AGENTGUARD_S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AGENTGUARD_S3_SECRET_ACCESS_KEY ?? '',
    },
    forcePathStyle: true,
  });
}

/**
 * GET /api/agentguard/traces/[executionId]
 *
 * Fetches the trace payload JSON from S3/MinIO for a given execution.
 * Looks up the execution's trace_payload_ref in TimescaleDB, then
 * downloads the object from S3.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ executionId: string }> },
) {
  const { executionId } = await params;

  if (!executionId) {
    return NextResponse.json({ error: 'Missing executionId' }, { status: 400 });
  }

  const pool = getAgentGuardPool();

  const result = await pool.query<{ trace_payload_ref: string | null }>(
    `
    SELECT trace_payload_ref
    FROM executions
    WHERE execution_id = $1
    ORDER BY timestamp DESC
    LIMIT 1
    `,
    [executionId],
  );

  const row = result.rows[0];

  if (!row) {
    return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
  }

  if (!row.trace_payload_ref) {
    return NextResponse.json(
      { error: 'No trace payload available for this execution' },
      { status: 404 },
    );
  }

  const bucket = process.env.AGENTGUARD_S3_BUCKET ?? 'agentguard-traces';

  // trace_payload_ref is stored as "s3://bucket/key" or just the key
  let key = row.trace_payload_ref;

  if (key.startsWith('s3://')) {
    // Extract the key portion after "s3://bucket/"
    const withoutProtocol = key.slice(5);
    const slashIndex = withoutProtocol.indexOf('/');

    if (slashIndex !== -1) {
      key = withoutProtocol.slice(slashIndex + 1);
    }
  }

  try {
    const s3 = getS3Client();

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    const body = await response.Body?.transformToString();

    if (!body) {
      return NextResponse.json(
        { error: 'Empty trace payload' },
        { status: 404 },
      );
    }

    const payload = JSON.parse(body);

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Failed to fetch trace payload from S3:', error);

    return NextResponse.json(
      { error: 'Failed to fetch trace payload' },
      { status: 500 },
    );
  }
}
