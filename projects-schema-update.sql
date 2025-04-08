-- Add tech_stack column to projects table if it doesn't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS tech_stack TEXT;

-- If the languages column exists, migrate data to tech_stack
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'languages'
  ) THEN
    -- Copy data from languages to tech_stack if tech_stack is null
    UPDATE public.projects
    SET tech_stack = languages
    WHERE tech_stack IS NULL AND languages IS NOT NULL;
  END IF;
END $$;
