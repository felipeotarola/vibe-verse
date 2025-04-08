-- Add is_published column to track resume publication status
ALTER TABLE public.resume_education ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.resume_experience ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.resume_skills ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.resume_certifications ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.resume_projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Add a new table to track overall resume publication status
CREATE TABLE IF NOT EXISTS public.resume_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  public_url_slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.resume_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for resume_settings
CREATE POLICY "Users can view their own resume settings" 
  ON public.resume_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume settings" 
  ON public.resume_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume settings" 
  ON public.resume_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume settings" 
  ON public.resume_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policy to allow public access to published resumes
CREATE POLICY "Anyone can view published resumes" 
  ON public.resume_settings 
  FOR SELECT 
  USING (is_published = true);
