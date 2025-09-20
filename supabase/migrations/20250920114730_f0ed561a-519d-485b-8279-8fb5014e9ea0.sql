-- Create interested_students table for contact form submissions
CREATE TABLE public.interested_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interested_students ENABLE ROW LEVEL SECURITY;

-- Create policies for interested_students
CREATE POLICY "Anyone can insert interested students" 
ON public.interested_students 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view interested students" 
ON public.interested_students 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_interested_students_updated_at
BEFORE UPDATE ON public.interested_students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();