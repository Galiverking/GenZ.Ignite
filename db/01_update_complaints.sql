-- Update complaints table to support Tracking and Replies
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS track_id uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS admin_reply text,
ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone;

-- Update status constraint if not already 'pending' or 'resolved'
-- For PostgreSQL, modifying constraints requires DROP and ADD:
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check CHECK (status IN ('pending', 'resolved'));

-- Setup track_id for existing complaints if any
UPDATE complaints SET track_id = gen_random_uuid() WHERE track_id IS NULL;
