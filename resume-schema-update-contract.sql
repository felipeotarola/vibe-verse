-- Add is_contract column to resume_experience table
ALTER TABLE resume_experience ADD COLUMN IF NOT EXISTS is_contract BOOLEAN DEFAULT FALSE;

