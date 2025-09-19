-- Create colleges table to store college data from CSV
CREATE TABLE public.colleges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_no integer NOT NULL,
  college_name text NOT NULL,
  ownership text NOT NULL, -- Government/Private/Aided
  district text NOT NULL,
  area_type text NOT NULL, -- Urban/Rural
  streams_offered text[] NOT NULL, -- Array of streams like Science, Commerce, Arts
  fee_range_ug text, -- Fee range text like "Rs. 10,000-25,000"
  website text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (colleges are publicly viewable)
CREATE POLICY "Anyone can view colleges" 
ON public.colleges 
FOR SELECT 
USING (true);

-- Create policy for insert (admin only for now)
CREATE POLICY "Anyone can insert colleges" 
ON public.colleges 
FOR INSERT 
WITH CHECK (true);

-- Create policy for update (admin only for now)
CREATE POLICY "Anyone can update colleges" 
ON public.colleges 
FOR UPDATE 
USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_colleges_district ON public.colleges(district);
CREATE INDEX idx_colleges_ownership ON public.colleges(ownership);
CREATE INDEX idx_colleges_area_type ON public.colleges(area_type);
CREATE INDEX idx_colleges_streams ON public.colleges USING GIN(streams_offered);

-- Add trigger for updated_at
CREATE TRIGGER update_colleges_updated_at
BEFORE UPDATE ON public.colleges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.colleges (serial_no, college_name, ownership, district, area_type, streams_offered, fee_range_ug, website) VALUES
(1, 'Government Degree College Srinagar', 'Government', 'Srinagar', 'Urban', ARRAY['Science', 'Commerce', 'Arts'], 'Rs. 5,000-15,000', 'https://gdcsrinagar.edu.in'),
(2, 'Amar Singh College', 'Government', 'Srinagar', 'Urban', ARRAY['Science', 'Commerce', 'Arts'], 'Rs. 8,000-20,000', 'https://amarsinghcollege.ac.in'),
(3, 'Government Degree College Baramulla', 'Government', 'Baramulla', 'Urban', ARRAY['Science', 'Commerce', 'Arts'], 'Rs. 5,000-12,000', NULL),
(4, 'Government Degree College Ganderbal', 'Government', 'Ganderbal', 'Rural', ARRAY['Science', 'Arts'], 'Rs. 4,000-10,000', NULL),
(5, 'Islamic University of Science and Technology', 'Private', 'Pulwama', 'Rural', ARRAY['Science', 'Engineering', 'Management'], 'Rs. 50,000-1,50,000', 'https://iust.ac.in'),
(6, 'Kashmir University', 'Government', 'Srinagar', 'Urban', ARRAY['Science', 'Commerce', 'Arts', 'Law', 'Engineering'], 'Rs. 10,000-30,000', 'https://kashmiruniversity.net'),
(7, 'Government Degree College Kupwara', 'Government', 'Kupwara', 'Rural', ARRAY['Arts', 'Commerce'], 'Rs. 3,000-8,000', NULL),
(8, 'Government Degree College Handwara', 'Government', 'Kupwara', 'Rural', ARRAY['Science', 'Arts'], 'Rs. 3,500-9,000', NULL),
(9, 'Government College for Women M.A Road', 'Government', 'Srinagar', 'Urban', ARRAY['Science', 'Commerce', 'Arts'], 'Rs. 6,000-16,000', NULL),
(10, 'Cluster University Srinagar', 'Government', 'Srinagar', 'Urban', ARRAY['Science', 'Commerce', 'Arts', 'Management'], 'Rs. 8,000-22,000', 'https://cusrinagar.edu.in');