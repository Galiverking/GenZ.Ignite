-- Create table for Announcements / ประชาสัมพันธ์
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('ข่าวด่วน', 'กิจกรรม', 'ประกาศทั่วไป', 'ผลงานสภา')),
  image_url text,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public announcements are viewable by everyone"
  ON announcements FOR SELECT
  USING (true);
