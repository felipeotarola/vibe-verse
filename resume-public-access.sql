-- Add policies to allow public access to the owner's resume data

-- For resume_education table
CREATE POLICY IF NOT EXISTS "Allow public access to owner's education" 
ON public.resume_education 
FOR SELECT 
USING (user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e');

-- For resume_experience table
CREATE POLICY IF NOT EXISTS "Allow public access to owner's experience" 
ON public.resume_experience 
FOR SELECT 
USING (user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e');

-- For resume_skills table
CREATE POLICY IF NOT EXISTS "Allow public access to owner's skills" 
ON public.resume_skills 
FOR SELECT 
USING (user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e');

-- For resume_certifications table
CREATE POLICY IF NOT EXISTS "Allow public access to owner's certifications" 
ON public.resume_certifications 
FOR SELECT 
USING (user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e');

-- For resume_projects table
CREATE POLICY IF NOT EXISTS "Allow public access to owner's projects" 
ON public.resume_projects 
FOR SELECT 
USING (user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e');

