/**
 * Authentication utilities for GenZ Ignite.
 *
 * 🔐 SECURITY ARCHITECTURE:
 *   Layer 1: Middleware (server-side) → protects /admin routes
 *            เรียก supabase.auth.getUser() ถ้าไม่มี → redirect /login
 *            ไม่สามารถ bypass ด้วยการ disable JS
 *   Layer 2: RLS Policies (database-level) → public.is_admin() function
 *            ใช้ auth.uid() ตรวจสอบ admin_users table
 *            ป้องกัน unauthorized data access แม้ bypass frontend
 *   Layer 3: Client-side check (UX only) → ใน Admin Layout
 *            ถ้า session expire ระหว่างใช้งาน → redirect
 *
 * ⚠️ client-side isAdmin() นี้ใช้สำหรับ UX convenience เท่านั้น
 *    อย่าใช้เป็น security boundary
 */

import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const isAdmin = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return false;

  // NOTE: ตัวตรวจสอบ admin จริงอยู่ที่ RLS policy (database-level)
  // ใช้ public.is_admin() function + admin_users table
  // Client-side check นี้เป็นแค่ UX layer — middleware + RLS
  // เป็น security boundary ตัวจริง

  return true;
};
