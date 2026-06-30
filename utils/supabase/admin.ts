/**
 * Admin Supabase client (Service Role).
 *
 * 🔐 SECURITY NOTE:
 *   SUPABASE_SERVICE_ROLE_KEY bypasses RLS — ห้ามใช้ใน client code!
 *   ตัวแปรนี้ถูกย้ายไป Vercel Environment Variables (production only)
 *   แล้วตั้งแต่วันที่ 2026-07-01
 *
 *   ✅ ตั้งค่าใน Vercel Dashboard → Project Settings → Environment Variables
 *      Name: SUPABASE_SERVICE_ROLE_KEY
 *      Value: <service_role_key>
 *      Environment: Production (NOT Preview, NOT Development)
 *
 *   ใช้งานได้เฉพาะ server-side เท่านั้น (API routes, Server Actions)
 *
 * ⚠️  ถ้าต้องการรัน local: ใช้ .env.local แต่ .gitignore ปิดไว้แล้ว
 *     (.env*.local อยู่ใน .gitignore)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
