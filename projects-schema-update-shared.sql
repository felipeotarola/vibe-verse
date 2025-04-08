-- Add is_shared column to projects table if it doesn't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false;
