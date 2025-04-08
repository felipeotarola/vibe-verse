-- Add a foreign key relationship between resume_settings and profiles
ALTER TABLE resume_settings
ADD CONSTRAINT fk_resume_settings_profiles
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Make sure the profiles table has a name column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS name TEXT;
