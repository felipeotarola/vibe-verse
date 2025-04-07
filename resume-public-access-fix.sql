-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow public access to owner's education" ON public.resume_education;
DROP POLICY IF EXISTS "Allow public access to owner's experience" ON public.resume_experience;
DROP POLICY IF EXISTS "Allow public access to owner's skills" ON public.resume_skills;
DROP POLICY IF EXISTS "Allow public access to owner's certifications" ON public.resume_certifications;
DROP POLICY IF EXISTS "Allow public access to owner's projects" ON public.resume_projects;

-- Create new policies with OR conditions to allow both authenticated users and public access to owner's data
CREATE POLICY "Public and authenticated access to resume_education" 
ON public.resume_education 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e'
);

CREATE POLICY "Public and authenticated access to resume_experience" 
ON public.resume_experience 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e'
);

CREATE POLICY "Public and authenticated access to resume_skills" 
ON public.resume_skills 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e'
);

CREATE POLICY "Public and authenticated access to resume_certifications" 
ON public.resume_certifications 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e'
);

CREATE POLICY "Public and authenticated access to resume_projects" 
ON public.resume_projects 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  user_id = '5b2b648d-99aa-45f2-a525-8ed5a02bcf4e'
);

