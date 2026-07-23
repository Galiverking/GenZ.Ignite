import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'NOT SET';
  const prefix = serviceKey.substring(0, 20);
  return NextResponse.json({
    supabase_url: url,
    service_key_prefix: prefix + '...',
    has_access_token: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
    has_secret: !!process.env.LINE_CHANNEL_SECRET,
  });
}
