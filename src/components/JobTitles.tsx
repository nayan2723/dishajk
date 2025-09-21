import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JobTitlesProps {
  courseName: string;
  stream: string;
}

export const JobTitles: React.FC<JobTitlesProps> = ({ courseName, stream }) => {
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobTitles();
  }, [courseName, stream]);

  const fetchJobTitles = async () => {
    setLoading(true);
    try {
      // First try to find exact match
      let { data, error } = await supabase
        .from('career_paths')
        .select('job_titles')
        .ilike('course_name', `%${courseName}%`)
        .eq('stream', stream)
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        // If no exact match, try a broader search
        ({ data, error } = await supabase
          .from('career_paths')
          .select('job_titles')
          .eq('stream', stream)
          .limit(1));
      }

      if (data && data.length > 0) {
        setJobTitles(data[0].job_titles || []);
      } else {
        // Fallback to AI-generated job titles
        await generateAIJobTitles();
      }
    } catch (error) {
      console.error('Error fetching job titles:', error);
      await generateAIJobTitles();
    } finally {
      setLoading(false);
    }
  };

  const generateAIJobTitles = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: `List 5 realistic job titles for someone who completes ${courseName}. Return only a simple comma-separated list without numbering or formatting.`,
          userProfile: undefined
        }
      });

      if (error) throw error;

      if (data?.response && !data.response.includes("I'm")) {
        // Only process if response looks like job titles, not error messages
        const titles = data.response
          .split(',')
          .map((title: string) => title.trim())
          .filter((title: string) => title.length > 0 && title.length < 50)
          .slice(0, 5);
        
        if (titles.length > 0) {
          setJobTitles(titles);
          return;
        }
      }
      
      // Use predefined fallbacks based on course/stream
      setJobTitles(getStaticJobTitles(courseName, stream));
    } catch (error) {
      console.error('Error generating AI job titles:', error);
      setJobTitles(getStaticJobTitles(courseName, stream));
    }
  };

  const getStaticJobTitles = (course: string, stream: string): string[] => {
    const courseKey = course.toLowerCase();
    const streamKey = stream.toLowerCase();

    if (courseKey.includes('engineering') || courseKey.includes('b.tech')) {
      return ['Software Engineer', 'Systems Engineer', 'Technical Consultant', 'Project Manager', 'Research Engineer'];
    }
    if (courseKey.includes('medical') || courseKey.includes('mbbs')) {
      return ['Doctor', 'Medical Officer', 'Specialist', 'Healthcare Consultant', 'Medical Researcher'];
    }
    if (courseKey.includes('commerce') || courseKey.includes('b.com')) {
      return ['Accountant', 'Financial Analyst', 'Business Analyst', 'Tax Consultant', 'Auditor'];
    }
    if (courseKey.includes('bca') || courseKey.includes('computer')) {
      return ['Software Developer', 'Web Developer', 'System Administrator', 'IT Consultant', 'Database Administrator'];
    }
    if (courseKey.includes('mba') || courseKey.includes('business')) {
      return ['Business Manager', 'Operations Manager', 'Marketing Manager', 'HR Manager', 'Strategy Consultant'];
    }
    if (streamKey.includes('arts')) {
      return ['Content Writer', 'Social Worker', 'Teacher', 'Journalist', 'Government Officer'];
    }
    if (streamKey.includes('science')) {
      return ['Research Scientist', 'Lab Technician', 'Quality Analyst', 'Science Teacher', 'Environmental Consultant'];
    }
    
    return ['Professional', 'Specialist', 'Consultant', 'Analyst', 'Manager'];
  };

  if (loading) {
    return (
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Briefcase className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Possible Job Titles</p>
        </div>
        <p className="text-sm text-muted-foreground">Loading job opportunities...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 bg-primary/5 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Briefcase className="h-4 w-4 text-primary" />
        <p className="font-medium text-sm">Possible Job Titles</p>
      </div>
      <div className="space-y-2">
        {jobTitles.map((title, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            <span className="text-sm text-foreground">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};