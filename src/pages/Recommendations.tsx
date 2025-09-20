import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Award, 
  Download, 
  ExternalLink, 
  MapPin, 
  Clock, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Building,
  FileText,
  Search,
  Briefcase
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { generatePDFReport } from '../utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { College } from '../types';
import { CareerFlowchart } from '@/components/CareerFlowchart';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Recommendations: React.FC = () => {
  const { state, calculateResult } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentName, setStudentName] = useState('');
  const [result, setResult] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [nearbyColleges, setNearbyColleges] = useState<College[]>([]);
  const [showNearbyColleges, setShowNearbyColleges] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [courseJobTitles, setCourseJobTitles] = useState<{[key: string]: string[]}>({});
  const [showGovtCollegeAlert, setShowGovtCollegeAlert] = useState(false);

  useEffect(() => {
    if (state.isComplete && state.answers.length >= 5) {
      const fetchResult = async () => {
        const calculatedResult = await calculateResult();
        setResult(calculatedResult);
        
        // Check if government colleges were requested but not found
        if (calculatedResult && state.answers.find(a => a.questionId === 2 && a.selectedOption === 0)) {
          const hasGovtColleges = calculatedResult.colleges.some(college => 
            college.type?.toLowerCase().includes('govt')
          );
          if (!hasGovtColleges) {
            setShowGovtCollegeAlert(true);
          }
        }
      };
      fetchResult();
    }
  }, [state, calculateResult]);

  // Fetch job titles for courses
  useEffect(() => {
    if (result) {
      fetchJobTitles();
    }
  }, [result]);

  const fetchJobTitles = async () => {
    if (!result) return;
    
    const jobTitlesMap: {[key: string]: string[]} = {};
    
    for (const course of result.recommendations) {
      try {
        // First try to find job titles in the database
        const { data: careerPath, error } = await supabase
          .from('career_paths')
          .select('job_titles')
          .ilike('course_name', `%${course.name}%`)
          .single();

        if (careerPath && !error) {
          jobTitlesMap[course.name] = careerPath.job_titles;
        } else {
          // Fallback to Gemini AI if not found in database
          const { data: aiResponse, error: aiError } = await supabase.functions.invoke('chatbot', {
            body: {
              message: `List 5 realistic job titles for someone who completes ${course.name}. Return only a simple comma-separated list without numbering or formatting.`,
              sessionId: 'job-fetch-' + Date.now()
            }
          });

          if (aiResponse && !aiError) {
            const jobTitles = aiResponse.response
              .split(',')
              .map((title: string) => title.trim())
              .filter((title: string) => title.length > 0)
              .slice(0, 5);
            jobTitlesMap[course.name] = jobTitles;
          } else {
            // Default fallback
            jobTitlesMap[course.name] = ['Specialist', 'Analyst', 'Consultant', 'Manager', 'Executive'];
          }
        }
      } catch (error) {
        console.error('Error fetching job titles for', course.name, error);
        jobTitlesMap[course.name] = ['Specialist', 'Analyst', 'Consultant', 'Manager', 'Executive'];
      }
    }
    
    setCourseJobTitles(jobTitlesMap);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    
    if (!studentName.trim()) {
      toast({
        title: "Please enter your name",
        description: "Your name is required to generate the PDF report.",
        variant: "destructive",
      });
      return;
    }

    generatePDFReport(result, studentName);
    toast({
      title: "Report downloaded!",
      description: "Your personalized career report has been downloaded successfully.",
    });
  };


  const toggleCourseExpansion = (courseId: number) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleFindMoreColleges = async () => {
    if (!result) return;
    
    setLoadingNearby(true);
    try {
      const { data: colleges, error } = await supabase
        .from('colleges')
        .select('*')
        .ilike('District', `%${result.userProfile.district}%`)
        .limit(10);

      if (error) {
        console.error('Error fetching nearby colleges:', error);
        toast({
          title: "Error",
          description: "Failed to fetch nearby colleges. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match College interface
      const transformedColleges: College[] = (colleges || []).map((college, index) => ({
        id: index + 1000, // Use offset to avoid conflicts
        name: college['College Name'] || 'Unknown College',
        location: 'Unknown',
        district: college['District'] || 'Unknown',
        type: college['Type'] || 'Unknown',
        courses: college['Courses Offered (Categorized Streams)'] 
          ? college['Courses Offered (Categorized Streams)'].split(',').map((c: string) => c.trim())
          : [],
        contact: 'Contact information not available',
        website: college['Working College Link'] || null,
        areaType: college['Urban/Rural Status'] || 'Unknown'
      }));

      setNearbyColleges(transformedColleges);
      setShowNearbyColleges(true);
      
      toast({
        title: "Colleges Found!",
        description: `Found ${transformedColleges.length} colleges in your area.`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingNearby(false);
    }
  };

  // Show message if quiz not completed
  if (!state.isComplete || state.answers.length < 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <Card className="w-full max-w-md card-gradient shadow-medium border-0">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Take Quiz First</h2>
            <p className="text-muted-foreground mb-6">
              You need to complete the career assessment quiz to see your personalized recommendations.
            </p>
            <Button onClick={() => navigate('/quiz')} className="w-full">
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Loading your recommendations...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Personalized Recommendations</h1>
          <p className="text-lg text-muted-foreground">
            Based on your assessment, here's your ideal career path
          </p>
        </div>

        {/* Results Summary */}
        <Card className="card-gradient shadow-medium border-0 mb-8 animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-success/10 text-success">
                <Award className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">Recommended Stream: {result.stream}</CardTitle>
            <p className="text-muted-foreground">Based on your assessment responses</p>
            <p className="text-sm text-muted-foreground mt-2">
              📍 Showing colleges near {result.userProfile.district}, J&K
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {result.stream} Stream
            </Badge>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Future Goal:</strong> {
                result.userProfile.futureGoals === 'higher_studies' ? 'Higher Studies' :
                result.userProfile.futureGoals === 'government_jobs' ? 'Government Jobs' :
                result.userProfile.futureGoals === 'private_sector' ? 'Private Sector' :
                'Skill-based Career'
              }</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Recommendations */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary" />
              Recommended Courses
            </h2>
            
            <div className="space-y-4">
              {result.recommendations.map((course, index) => (
                <Card key={course.id} className="card-gradient shadow-soft hover:shadow-medium transition-smooth border-0">
                  <Collapsible
                    open={expandedCourse === course.id}
                    onOpenChange={() => toggleCourseExpansion(course.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/30 rounded-t-lg transition-smooth">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                          </div>
                          {expandedCourse === course.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <p className="text-muted-foreground">{course.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-success/10 rounded-lg">
                            <p className="text-sm font-medium text-success-foreground mb-1">Why this suits you:</p>
                            <p className="text-sm text-muted-foreground">{course.rationale}</p>
                          </div>
                          
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm font-medium text-primary mb-1">Career Scope:</p>
                            <p className="text-sm text-muted-foreground">{course.scope}</p>
                          </div>
                          
                          {/* Job Titles Section */}
                          {courseJobTitles[course.name] && (
                            <div className="p-3 bg-accent/10 rounded-lg">
                              <p className="text-sm font-medium text-accent-foreground mb-2 flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                Possible Job Titles:
                              </p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {courseJobTitles[course.name].map((jobTitle, jobIndex) => (
                                  <li key={jobIndex} className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                                    {jobTitle}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>

          {/* College Recommendations */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Building className="h-6 w-6 mr-2 text-primary" />
              Recommended Colleges
            </h2>
            
            <div className="space-y-4">
              {result.colleges.slice(0, 8).map((college) => (
                <Card key={college.id} className="card-gradient shadow-soft hover:shadow-medium transition-smooth border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{college.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{college.location}, {college.district}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={college.type?.toLowerCase().includes('govt') ? 'default' : 'secondary'}>
                            {college.type?.toLowerCase().includes('govt') ? 'Government' : 'Private'}
                          </Badge>
                          <Badge variant="outline">
                            {college.areaType || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {college.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={college.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Contact:</strong> {college.contact}
                      </p>
                      <div>
                        <p className="text-sm font-medium mb-1">Available Courses:</p>
                        <div className="flex flex-wrap gap-1">
                          {college.courses.slice(0, 4).map((course) => (
                            <Badge key={course} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Download Section */}
        <Card className="mt-8 card-gradient shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-6 w-6 mr-2" />
              Download Detailed Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Generate a comprehensive PDF report with your recommendations to share with parents and counselors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter your name for the report"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleDownloadReport} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI-Generated Career Flowchart */}
        <div className="mt-8">
          <CareerFlowchart quizResult={result} studentName={studentName || "Student"} />
        </div>

        {/* Next Steps */}
        <Card className="mt-8 bg-primary text-primary-foreground border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">What's Next?</h3>
            <p className="mb-6 opacity-90">
              Ready to take the next step in your career journey? Explore more options and connect with counselors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" onClick={() => navigate('/quiz')}>
                Retake Assessment
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={handleFindMoreColleges}
                disabled={loadingNearby}
              >
                <Search className="h-4 w-4 mr-2" />
                {loadingNearby ? 'Finding...' : 'Find More Colleges'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Colleges Section */}
        {showNearbyColleges && nearbyColleges.length > 0 && (
          <Card className="mt-8 card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-6 w-6 mr-2" />
                More Colleges in {result?.userProfile.district}
              </CardTitle>
              <p className="text-muted-foreground">
                Additional colleges in your area that might interest you
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {nearbyColleges.map((college) => (
                  <Card key={college.id} className="card-gradient shadow-soft hover:shadow-medium transition-smooth border-0">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-base mb-1">{college.name}</h3>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{college.district}</span>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant={college.type?.toLowerCase().includes('govt') ? 'default' : 'secondary'} className="text-xs">
                              {college.type?.toLowerCase().includes('govt') ? 'Government' : 'Private'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {college.areaType}
                            </Badge>
                          </div>
                        </div>
                        {college.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={college.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          <strong>Contact:</strong> {college.contact}
                        </p>
                        {college.courses.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">Courses:</p>
                            <div className="flex flex-wrap gap-1">
                              {college.courses.slice(0, 3).map((course) => (
                                <Badge key={course} variant="outline" className="text-xs">
                                  {course}
                                </Badge>
                              ))}
                              {college.courses.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{college.courses.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Government College Alert Dialog */}
        <AlertDialog open={showGovtCollegeAlert} onOpenChange={setShowGovtCollegeAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Government Colleges Not Available</AlertDialogTitle>
              <AlertDialogDescription>
                No government colleges found for your location. We're showing private colleges instead to provide you with the best available options.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowGovtCollegeAlert(false)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Recommendations;