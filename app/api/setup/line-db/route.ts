import { NextRequest, NextResponse } from 'next/server';

const TABLE_DEF = `
CREATE TABLE IF NOT EXISTS line_messages (
  id BIGSERIAL PRIMARY KEY,
  group_id TEXT NOT NULL DEFAULT 'dm',
  group_name TEXT NOT NULL DEFAULT 'Direct Message',
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL DEFAULT 'Unknown',
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_event JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  analyzed BOOLEAN NOT NULL DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium'
);

CREATE INDEX IF NOT EXISTS idx_line_messages_timestamp ON line_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_line_messages_group_id ON line_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_line_messages_analyzed ON line_messages(analyzed);
`;

const INDEX_DEF = `
CREATE INDEX IF NOT EXISTS idx_line_messages_timestamp ON line_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_line_messages_group_id ON line_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_line_messages_analyzed ON line_messages(analyzed);
`;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const results: any = { steps: [] };

  // Step 1: Check if table exists by querying it
  try {
    const checkResp = await fetch(
      `${supabaseUrl}/rest/v1/line_messages?select=count&limit=0`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Accept': 'application/json',
          'Prefer': 'count=exact',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (checkResp.ok) {
      const count = checkResp.headers.get('content-range') || '0';
      results.steps.push({ step: 'check_table', exists: true, count: count });
      return NextResponse.json(results, { status: 200 });
    }

    const errorText = await checkResp.text();
    results.steps.push({ step: 'check_table', exists: false, status: checkResp.status, detail: errorText.substring(0, 200) });

    // Step 2: Table doesn't exist - try to create via Supabase Management API
    const supabaseRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    
    // Use the Supabase SQL API directly with service key
    // Try creating via the pg_dump REST endpoint
    const createResp = await fetch(
      `${supabaseUrl}/rest/v1/`,
      {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(5000),
      }
    );
    results.steps.push({ step: 'rest_api_test', status: createResp.status });

    // Step 3: Try executing SQL via Supabase's built-in rpc endpoint
    // First, create the exec_sql function
    const funcResp = await fetch(
      `${supabaseUrl}/rest/v1/rpc/`,
      {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "sql": `CREATE OR REPLACE FUNCTION exec_sql(sql TEXT) RETURNS VOID AS $$ BEGIN EXECUTE sql; END; $$ LANGUAGE plpgsql SECURITY DEFINER;`
        }),
        signal: AbortSignal.timeout(10000),
      }
    );
    
    const funcText = await funcResp.text();
    results.steps.push({ step: 'create_function', status: funcResp.status, detail: funcText.substring(0, 200) });

  } catch (e: any) {
    results.steps.push({ step: 'error', message: e.message, cause: e.cause?.toString() || 'none' });
  }

  return NextResponse.json(results, { status: 200 });
}
