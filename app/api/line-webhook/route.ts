import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify LINE webhook signature
function verifySignature(body: string, signature: string, channelSecret: string): boolean {
  const hmac = crypto.createHmac('sha256', channelSecret);
  hmac.update(body);
  const digest = hmac.digest('base64');
  return signature === digest;
}

// Get LINE profile (optional, might fail for privacy settings)
async function getLineProfile(userId: string, accessToken: string): Promise<string> {
  try {
    const response = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.displayName || 'Unknown';
    }
  } catch (e) {
    console.error('Failed to get LINE profile:', e);
  }
  return 'Unknown';
}

// Get group name (optional)
async function getGroupName(groupId: string, accessToken: string): Promise<string> {
  try {
    const response = await fetch(`https://api.line.me/v2/bot/group/${groupId}/summary`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.groupName || 'Unknown Group';
    }
  } catch (e) {
    console.error('Failed to get group name:', e);
  }
  return 'Unknown Group';
}

export async function POST(request: NextRequest) {
  try {
    // Get signature
    const signature = request.headers.get('x-line-signature');
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 });
    }

    // Get body as text for signature verification
    const body = await request.text();
    
    // Verify signature
    const channelSecret = process.env.LINE_CHANNEL_SECRET!;
    if (!verifySignature(body, signature, channelSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse body
    const data = JSON.parse(body);
    const events = data.events || [];

    // Process events
    for (const event of events) {
      // Only process message events
      if (event.type !== 'message') continue;
      
      // Only process text messages
      if (event.message.type !== 'text') continue;

      const text = event.message.text;
      const senderId = event.source.userId;
      const timestamp = new Date(event.timestamp).toISOString();

      // Get group info
      let groupName = 'Direct Message';
      let groupId = 'dm';

      if (event.source.type === 'group') {
        groupId = event.source.groupId;
        groupName = await getGroupName(groupId, process.env.LINE_CHANNEL_ACCESS_TOKEN!);
      } else if (event.source.type === 'room') {
        groupId = event.source.roomId;
        groupName = 'Room';
      }

      // Get sender name
      const senderName = await getLineProfile(senderId, process.env.LINE_CHANNEL_ACCESS_TOKEN!);

      // Store in Supabase
      const { error } = await supabase
        .from('line_messages')
        .insert({
          group_id: groupId,
          group_name: groupName,
          sender_id: senderId,
          sender_name: senderName,
          message: text,
          timestamp: timestamp,
          raw_event: event,
        });

      if (error) {
        console.error('Supabase insert error:', error);
      } else {
        console.log(`✓ Stored: [${groupName}] ${senderName}: ${text.substring(0, 50)}`);
      }
    }

    return NextResponse.json({ message: 'OK' });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle GET request (for testing)
export async function GET() {
  return NextResponse.json({ 
    status: 'running',
    message: 'LINE Webhook Server is running',
    timestamp: new Date().toISOString()
  });
}
