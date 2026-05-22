import { NextResponse } from 'next/server';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "@supabase/supabase-js";

// แอดมิน client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// MCP Server Setup (Simplified for Next.js Route)
export async function POST(req: Request) {
  const body = await req.json();
  
  if (body.method === 'list_policies') {
    const { data, error } = await supabase.from('policies').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ policies: data });
  }

  return NextResponse.json({ message: "MCP Server Active - use 'list_policies' method" });
}
