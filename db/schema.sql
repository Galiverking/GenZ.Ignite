-- Create table for Policy Tracker
CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL, -- e.g., 'Infrastructure', 'Academic', 'Activity'
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  progress int DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  description text,
  image_url text, -- Link to Before/After images
  last_updated timestamp with time zone DEFAULT now()
);

-- Example RLS policies (Row Level Security)
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public policies are viewable by everyone"
  ON policies FOR SELECT
  USING (true);

-- Allow write access only to authenticated admins (placeholder)
-- CREATE POLICY "Admins can insert policies"
--   ON policies FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.role() = 'admin');
