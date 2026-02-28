-- ⚠️ เนื่องจากปัจจุบันการสร้างประกาศ, นโยบาย, สมาชิก ไม่สามารถทำได้เพราะติด Row Level Security (RLS) 
-- ไฟล์นี้จะช่วยปลดล็อคให้คุณ (แอดมิน) สามารถเพิ่มข้อมูลเข้าไปใน Database ได้สำเร็จ

-- 1. ปลดล็อคตาราง Announcements (ประชาสัมพันธ์)
CREATE POLICY "Enable insert for announcements" ON "public"."announcements" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for announcements" ON "public"."announcements" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for announcements" ON "public"."announcements" FOR DELETE USING (true);

-- 2. ปลดล็อคตาราง Policies (นโยบาย)
CREATE POLICY "Enable insert for policies" ON "public"."policies" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for policies" ON "public"."policies" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for policies" ON "public"."policies" FOR DELETE USING (true);

-- 3. ปลดล็อคตาราง Members (ทีมงาน)
CREATE POLICY "Enable insert for members" ON "public"."members" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for members" ON "public"."members" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for members" ON "public"."members" FOR DELETE USING (true);

-- หมายเหตุ: สำหรับ production ให้แก้ไข USING (true) เป็นเช็คสิทธิ์แอดมินที่รัดกุมกว่านี้ เช่น (auth.uid() = 'admin-id')
