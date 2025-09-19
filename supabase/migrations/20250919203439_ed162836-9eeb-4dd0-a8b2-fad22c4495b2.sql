-- Create quiz sessions table to track student quiz attempts
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  stream TEXT NOT NULL,
  score INTEGER NOT NULL,
  quiz_answers JSONB NOT NULL,
  user_profile JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz sessions
CREATE POLICY "Anyone can insert quiz sessions" 
ON public.quiz_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view quiz sessions" 
ON public.quiz_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update quiz sessions" 
ON public.quiz_sessions 
FOR UPDATE 
USING (true);

-- Create index for better performance
CREATE INDEX idx_quiz_sessions_completed_at ON public.quiz_sessions(completed_at DESC);
CREATE INDEX idx_quiz_sessions_district ON public.quiz_sessions(district);