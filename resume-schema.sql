-- Resume Schema

-- Education table
CREATE TABLE IF NOT EXISTS public.resume_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  period TEXT NOT NULL,
  description TEXT,
  skills TEXT[],
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Experience table
CREATE TABLE IF NOT EXISTS public.resume_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  period TEXT NOT NULL,
  description TEXT,
  achievements TEXT[],
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  items JSONB NOT NULL, -- Array of {name: string, level: number}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS public.resume_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  date TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.resume_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[],
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for resume_education
CREATE POLICY "Users can view their own education" 
  ON public.resume_education 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education" 
  ON public.resume_education 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education" 
  ON public.resume_education 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education" 
  ON public.resume_education 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for resume_experience
CREATE POLICY "Users can view their own experience" 
  ON public.resume_experience 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experience" 
  ON public.resume_experience 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experience" 
  ON public.resume_experience 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experience" 
  ON public.resume_experience 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for resume_skills
CREATE POLICY "Users can view their own skills" 
  ON public.resume_skills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" 
  ON public.resume_skills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" 
  ON public.resume_skills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" 
  ON public.resume_skills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for resume_certifications
CREATE POLICY "Users can view their own certifications" 
  ON public.resume_certifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certifications" 
  ON public.resume_certifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certifications" 
  ON public.resume_certifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certifications" 
  ON public.resume_certifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for resume_projects
CREATE POLICY "Users can view their own resume projects" 
  ON public.resume_projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume projects" 
  ON public.resume_projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume projects" 
  ON public.resume_projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume projects" 
  ON public.resume_projects 
  FOR DELETE 
  USING (auth.uid() = user_id);
