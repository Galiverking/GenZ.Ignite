import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const results: any = [];

  // Simple connectivity test
  for (const test of [
    { name: 'supabase_url', url: supabaseUrl },
    { name: 'health', url: `${supabaseUrl}/rest/v1/` },
    { name: 'line_messages', url: `${supabaseUrl}/rest/v1/line_messages?limit=1` },
  ]) {
    try {
      const resp = await fetch(test.url, {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });
      const text = await resp.text();
      results.push({ name: test.name, status: resp.status, body: text.substring(0, 150) });
    } catch (e: any) {
      results.push({ name: test.name, error: e.message, code: e.cause?.code || 'unknown' });
    }
  }

  return NextResponse.json({ results, url_prefix: supabaseUrl.substring(0, 40) + '...' });
}
