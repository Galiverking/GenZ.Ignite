import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  // MCP protocol handling (simplified for HTTP transport)
  // In a production app, you'd use the SDK to handle the lifecycle
  return NextResponse.json({ message: "MCP Server Active", received: body });
}

export async function GET() {
  return NextResponse.json({ status: "MCP Server is running" });
}
