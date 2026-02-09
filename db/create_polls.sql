-- Create polls table for Real-time Problem Checking
CREATE TABLE IF NOT EXISTS polls (
  id SERIAL PRIMARY KEY,
  option_name TEXT NOT NULL,
  votes INTEGER DEFAULT 0
);

-- Insert initial options
INSERT INTO polls (option_name, votes) VALUES 
('วิชาการ/การเรียน', 12),
('สถานที่/สิ่งอำนวยความสะดวก', 25),
('กิจกรรม/กีฬา', 18),
('ความโปร่งใส/งบประมาณ', 40);

-- Enable Realtime for this table
-- (Note: This usually needs to be done via Supabase Dashboard, but writing here as a reminder)
-- ALTER PUBLICATION supabase_realtime ADD TABLE polls;
