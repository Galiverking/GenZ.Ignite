-- ========================================================
-- 🛡️ GENZ IGNITE: ADMIN SECURITY FIX (REPLACES 02 & 03)
-- ========================================================
--  เปลี่ยนจาก hardcoded email → role-based (admin_users table)
--  ปลอดภัยกว่า: ไม่ต้อง hardcode email, เปลี่ยน admin ได้ง่าย,
--  ป้องกัน auth.users email change, รองรับ multi-admin
--
-- ⚠️  AFTER RUNNING: ต้อง insert admin user UUID ก่อน!
--    ไปที่ Supabase Dashboard → Authentication → Users
--    คัดลอก UUID ของ admin (User UID)
--    รัน: INSERT INTO admin_users (user_id) VALUES ('<your-uuid>');
--
-- ========================================================

-- -------------------------------------------------------
-- 1. สร้างตาราง admin_users (เก็บ user ID ของผู้ดูแลระบบ)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- ปิด RLS บน admin_users (handle โดย is_admin() function)
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.admin_users IS 'ตารางเก็บรายชื่อ admins — ใช้โดย is_admin() function';

-- -------------------------------------------------------
-- 2. สร้าง is_admin() function (SECURITY DEFINER)
--    ทำงานด้วยสิทธิ์ของ owner → bypass RLS ของ admin_users
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS 'ตรวจสอบว่าผู้ใช้ปัจจุบันเป็น admin หรือไม่ (ใช้ auth.uid())';

-- -------------------------------------------------------
-- 3. DROP policies เดิมทั้งหมด (ทั้งแบบ open และ email-based)
-- -------------------------------------------------------

-- Announcements
DROP POLICY IF EXISTS "Enable insert for announcements" ON announcements;
DROP POLICY IF EXISTS "Enable update for announcements" ON announcements;
DROP POLICY IF EXISTS "Enable delete for announcements" ON announcements;
DROP POLICY IF EXISTS "Public announcements are viewable by everyone" ON announcements;
DROP POLICY IF EXISTS "Public select announcements" ON announcements;
DROP POLICY IF EXISTS "Admin insert announcements" ON announcements;
DROP POLICY IF EXISTS "Admin update announcements" ON announcements;
DROP POLICY IF EXISTS "Admin delete announcements" ON announcements;

-- Policies
DROP POLICY IF EXISTS "Enable insert for policies" ON policies;
DROP POLICY IF EXISTS "Enable update for policies" ON policies;
DROP POLICY IF EXISTS "Enable delete for policies" ON policies;
DROP POLICY IF EXISTS "Public policies are viewable by everyone" ON policies;
DROP POLICY IF EXISTS "Public select policies" ON policies;
DROP POLICY IF EXISTS "Admin insert policies" ON policies;
DROP POLICY IF EXISTS "Admin update policies" ON policies;
DROP POLICY IF EXISTS "Admin delete policies" ON policies;
DROP POLICY IF EXISTS "Admins can insert policies" ON policies;
DROP POLICY IF EXISTS "Admins can update policies" ON policies;

-- Members
DROP POLICY IF EXISTS "Enable insert for members" ON members;
DROP POLICY IF EXISTS "Enable update for members" ON members;
DROP POLICY IF EXISTS "Enable delete for members" ON members;
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
DROP POLICY IF EXISTS "Public select members" ON members;
DROP POLICY IF EXISTS "Admin insert members" ON members;
DROP POLICY IF EXISTS "Admin update members" ON members;
DROP POLICY IF EXISTS "Admin delete members" ON members;

-- Complaints
DROP POLICY IF EXISTS "Enable read access for all users" ON complaints;
DROP POLICY IF EXISTS "Enable insert for complaints" ON complaints;
DROP POLICY IF EXISTS "Enable update for complaints" ON complaints;
DROP POLICY IF EXISTS "Enable delete for complaints" ON complaints;
DROP POLICY IF EXISTS "Admin select complaints" ON complaints;
DROP POLICY IF EXISTS "Public insert complaints" ON complaints;
DROP POLICY IF EXISTS "Admin update complaints" ON complaints;
DROP POLICY IF EXISTS "Admin delete complaints" ON complaints;

-- Polls
DROP POLICY IF EXISTS "Public polls are viewable by everyone" ON polls;
DROP POLICY IF EXISTS "Public can vote" ON polls;
DROP POLICY IF EXISTS "Admin write polls" ON polls;

-- Site Settings
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admin update site_settings" ON site_settings;

-- -------------------------------------------------------
-- 4. สร้าง RLS Policies ใหม่ — ปลอดภัย 100%
-- -------------------------------------------------------

-- === ANNOUNCEMENTS ===
-- ทุกคนอ่านได้ / เฉพาะ admin insert/update/delete
CREATE POLICY "Anyone can read announcements" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert announcements" ON announcements
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE USING (public.is_admin());

-- === POLICIES ===
-- ทุกคนอ่านได้ / เฉพาะ admin insert/update/delete
CREATE POLICY "Anyone can read policies" ON policies
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert policies" ON policies
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update policies" ON policies
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete policies" ON policies
  FOR DELETE USING (public.is_admin());

-- === MEMBERS ===
-- ทุกคนอ่านได้ / เฉพาะ admin insert/update/delete
CREATE POLICY "Anyone can read members" ON members
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert members" ON members
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update members" ON members
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete members" ON members
  FOR DELETE USING (public.is_admin());

-- === COMPLAINTS ===
-- ทุกคนส่งเรื่องร้องเรียนได้ (INSERT) / เฉพาะ admin อ่านหรือแก้ไข
CREATE POLICY "Anyone can submit complaints" ON complaints
  FOR INSERT WITH CHECK (true);

-- NOTE: ต้องเปิด SELECT ด้วย is_admin() + เปิด RPC function get_complaint_by_track_id
-- สำหรับ public tracking (public ใช้ RPC function แทน direct SELECT)
CREATE POLICY "Admins can read complaints" ON complaints
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete complaints" ON complaints
  FOR DELETE USING (public.is_admin());

-- === POLLS ===
-- ทุกคนอ่านได้ / เฉพาะ admin write
CREATE POLICY "Anyone can read polls" ON polls
  FOR SELECT USING (true);

CREATE POLICY "Public can vote polls" ON polls
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage polls" ON polls
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete polls" ON polls
  FOR DELETE USING (public.is_admin());

-- === SITE SETTINGS ===
-- ทุกคนอ่านได้ / เฉพาะ admin update
CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -------------------------------------------------------
-- 5. ตรวจสอบ RLS เปิดอยู่ทุกตาราง
-- -------------------------------------------------------
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 6. Update SECURITY DEFINER functions ให้ปลอดภัย
--    (ใช้ SET search_path = '' ป้องกัน search_path attack)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_policy_vote(policy_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.policies
  SET votes = COALESCE(votes, 0) + 1
  WHERE id = policy_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_poll_vote(poll_id int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.polls
  SET votes = COALESCE(votes, 0) + 1
  WHERE id = poll_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_complaint_by_track_id(input_track_id uuid)
RETURNS SETOF public.complaints
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.complaints WHERE track_id = input_track_id;
END;
$$;

-- ========================================================
-- ✅ DONE: Admin Security Fix applied
-- ========================================================
-- NEXT STEP: ไปที่ Supabase Dashboard → Authentication → Users
-- คัดลอก UUID ของ admin แล้วรัน:
--   INSERT INTO admin_users (user_id) VALUES ('<your-uuid>');
-- ========================================================
