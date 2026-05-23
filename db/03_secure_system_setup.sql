-- ========================================================
-- 🛡️ GENZ IGNITE: SECURE SYSTEM SETUP & MIGRATION SCRIPT
-- ========================================================
-- คัดลอกโค้ดทั้งหมดในหน้านี้ แล้วนำไปวางและรัน (Run) ใน SQL Editor ของ Supabase
-- เพื่อสร้างตารางตั้งค่าระบบ, ฟังก์ชัน RPC ปลอดภัย และอัปเดตสิทธิ์ RLS ให้รัดกุม 100%

-- --------------------------------------------------------
-- 1. สร้างตาราง Site Settings (ตารางตั้งค่าระบบ)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  party_name text DEFAULT 'GenZ Ignite',
  election_date timestamp with time zone DEFAULT '2026-02-18T08:00:00+07:00',
  slogan text DEFAULT 'สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์',
  slogan_accent text DEFAULT 'เสียงของคุณ คือภารกิจของเรา',
  candidate_number text DEFAULT '03',
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT one_row CHECK (id = 1)
);

-- ใส่ข้อมูลตั้งค่าเริ่มต้นหากยังไม่มี
INSERT INTO site_settings (id, party_name, election_date, slogan, slogan_accent, candidate_number)
VALUES (1, 'GenZ Ignite', '2026-02-18T08:00:00+07:00', 'สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์', 'เสียงของคุณ คือภารกิจของเรา', '03')
ON CONFLICT (id) DO NOTHING;

-- เปิดใช้งาน RLS สำหรับตาราง site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ลบ Policy เดิมถ้ามี
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admin update site_settings" ON site_settings;

-- ทุกคนสามารถอ่านการตั้งค่าได้
CREATE POLICY "Public read site_settings" ON site_settings 
  FOR SELECT USING (true);

-- เฉพาะแอดมินที่ตรงเงื่อนไขเท่านั้นจึงจะสามารถอัปเดตได้
CREATE POLICY "Admin update site_settings" ON site_settings 
  FOR UPDATE TO authenticated 
  USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');


-- --------------------------------------------------------
-- 2. สร้างฟังก์ชัน RPC สำหรับการทำธุรกรรมแบบปลอดภัย (Security Definer)
-- --------------------------------------------------------

-- 2.1 ฟังก์ชันเพิ่มคะแนนโหวตนโยบายอย่างปลอดภัย (ไม่มีการเปิดสิทธิ์ UPDATE ให้กับบุคคลทั่วไปโดยตรง)
CREATE OR REPLACE FUNCTION increment_policy_vote(policy_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE policies
  SET votes = COALESCE(votes, 0) + 1
  WHERE id = policy_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2.2 ฟังก์ชันโหวตโพลล์อย่างปลอดภัย
CREATE OR REPLACE FUNCTION increment_poll_vote(poll_id int)
RETURNS void AS $$
BEGIN
  UPDATE polls
  SET votes = COALESCE(votes, 0) + 1
  WHERE id = poll_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2.3 ฟังก์ชันเรียกดูเรื่องร้องเรียนเดี่ยวผ่าน Track ID โดยตรง (ป้องกันการรั่วไหลของข้อมูล)
CREATE OR REPLACE FUNCTION get_complaint_by_track_id(input_track_id uuid)
RETURNS SETOF complaints AS $$
BEGIN
  RETURN QUERY SELECT * FROM complaints WHERE track_id = input_track_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- --------------------------------------------------------
-- 3. อัปเดตสิทธิ์ RLS ของตารางที่มีอยู่ให้ปลอดภัย (Lockdown Policies)
-- --------------------------------------------------------

-- 3.1 ตาราง Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public announcements are viewable by everyone" ON announcements;
DROP POLICY IF EXISTS "Enable insert for announcements" ON announcements;
DROP POLICY IF EXISTS "Enable update for announcements" ON announcements;
DROP POLICY IF EXISTS "Enable delete for announcements" ON announcements;
DROP POLICY IF EXISTS "Enable insert for admins only" ON announcements;

CREATE POLICY "Public select announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin update announcements" ON announcements FOR UPDATE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin delete announcements" ON announcements FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');

-- 3.2 ตาราง Policies
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public policies are viewable by everyone" ON policies;
DROP POLICY IF EXISTS "Enable insert for policies" ON policies;
DROP POLICY IF EXISTS "Enable update for policies" ON policies;
DROP POLICY IF EXISTS "Enable delete for policies" ON policies;

CREATE POLICY "Public select policies" ON policies FOR SELECT USING (true);
CREATE POLICY "Admin insert policies" ON policies FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin update policies" ON policies FOR UPDATE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin delete policies" ON policies FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');

-- 3.3 ตาราง Members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
DROP POLICY IF EXISTS "Enable insert for members" ON members;
DROP POLICY IF EXISTS "Enable update for members" ON members;
DROP POLICY IF EXISTS "Enable delete for members" ON members;

CREATE POLICY "Public select members" ON members FOR SELECT USING (true);
CREATE POLICY "Admin insert members" ON members FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin update members" ON members FOR UPDATE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin delete members" ON members FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');

-- 3.4 ตาราง Complaints
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON complaints;
DROP POLICY IF EXISTS "Enable insert for complaints" ON complaints;
DROP POLICY IF EXISTS "Enable update for complaints" ON complaints;
DROP POLICY IF EXISTS "Enable delete for complaints" ON complaints;

-- ป้องกันคนทั่วไปค้นหาลิสต์เรื่องร้องเรียนทั้งหมดโดยตรง (เฉพาะแอดมินเท่านั้นที่ดูทั้งหมดได้ ส่วนผู้ใช้ทั่วไปเข้าถึงผ่าน RPC get_complaint_by_track_id)
CREATE POLICY "Admin select complaints" ON complaints FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
-- บุคคลทั่วไปส่งเรื่องร้องเรียนได้เท่านั้น
CREATE POLICY "Public insert complaints" ON complaints FOR INSERT WITH CHECK (true);
-- เฉพาะแอดมินแก้ไขหรือลบได้
CREATE POLICY "Admin update complaints" ON complaints FOR UPDATE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
CREATE POLICY "Admin delete complaints" ON complaints FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');

-- 3.5 ตาราง Polls
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public polls are viewable by everyone" ON polls;
DROP POLICY IF EXISTS "Public can vote" ON polls;

CREATE POLICY "Public select polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Admin write polls" ON polls FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@genz-ignite.com');
