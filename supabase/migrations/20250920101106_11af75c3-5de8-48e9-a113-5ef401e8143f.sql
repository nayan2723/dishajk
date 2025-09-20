-- Create career_paths table for job titles
CREATE TABLE public.career_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  job_titles TEXT[] NOT NULL,
  stream TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view career paths" 
ON public.career_paths 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert career paths" 
ON public.career_paths 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update career paths" 
ON public.career_paths 
FOR UPDATE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_career_paths_updated_at
BEFORE UPDATE ON public.career_paths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for common courses
INSERT INTO public.career_paths (course_name, job_titles, stream) VALUES
('Computer Science Engineering', ARRAY['Software Developer', 'Data Scientist', 'System Administrator', 'Cybersecurity Specialist', 'AI/ML Engineer'], 'Science'),
('Mechanical Engineering', ARRAY['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Project Manager', 'Quality Control Engineer'], 'Science'),
('Bachelor of Commerce (B.Com)', ARRAY['Accountant', 'Financial Analyst', 'Tax Consultant', 'Banking Officer', 'Business Analyst'], 'Commerce'),
('Bachelor of Business Administration (BBA)', ARRAY['Business Manager', 'Marketing Executive', 'HR Specialist', 'Operations Manager', 'Sales Manager'], 'Commerce'),
('Bachelor of Arts (BA) English', ARRAY['Content Writer', 'Journalist', 'Teacher', 'Editor', 'Communications Specialist'], 'Arts'),
('Bachelor of Arts (BA) Psychology', ARRAY['Counselor', 'HR Specialist', 'Social Worker', 'Researcher', 'Therapist'], 'Arts'),
('Diploma in Information Technology', ARRAY['IT Support Specialist', 'Web Developer', 'Database Administrator', 'Network Technician'], 'Vocational'),
('Diploma in Hotel Management', ARRAY['Hotel Manager', 'Event Coordinator', 'Restaurant Manager', 'Tourism Officer'], 'Vocational');