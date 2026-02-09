-- Add votes column to policies table
ALTER TABLE IF EXISTS policies 
ADD COLUMN IF NOT EXISTS votes INTEGER DEFAULT 0;

-- Optional: Update existing dummy data with random votes
UPDATE policies SET votes = FLOOR(RANDOM() * 50) + 10 WHERE votes = 0;
