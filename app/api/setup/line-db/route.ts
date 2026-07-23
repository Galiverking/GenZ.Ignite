import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Create the line_messages table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    // If exec_sql doesn't exist, try direct query
    if (createError && createError.message.includes('function "exec_sql" does not exist')) {
      // Create the function first
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
          RETURNS VOID AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      // Now try creating the table again
      const { error: retryError } = await supabase.rpc('exec_sql', {
        sql: `
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
        `
      });
      
      if (retryError) {
        return NextResponse.json({ 
          status: 'error', 
          step: 'retry_create', 
          error: retryError.message 
        }, { status: 500 });
      }
    } else if (createError) {
      return NextResponse.json({ 
        status: 'error', 
        step: 'create_table', 
        error: createError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'line_messages table created/verified successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      error: error.message 
    }, { status: 500 });
  }
}
