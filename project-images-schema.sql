-- Create project_images table to store multiple images per project
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view project images
CREATE POLICY "Users can view project images" 
ON public.project_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND (projects.user_id = auth.uid() OR projects.is_shared = true)
  )
);

-- Create policy to allow users to insert their own project images
CREATE POLICY "Users can insert their own project images" 
ON public.project_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Create policy to allow users to update their own project images
CREATE POLICY "Users can update their own project images" 
ON public.project_images 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Create policy to allow users to delete their own project images
CREATE POLICY "Users can delete their own project images" 
ON public.project_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND projects.user_id = auth.uid()
  )
);
