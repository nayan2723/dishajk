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
  FileText
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { generatePDFReport } from '../utils/pdfGenerator';
import { generateFlowchartPDF } from '../utils/flowchartGenerator';
import { useToast } from '@/hooks/use-toast';

const Recommendations: React.FC = () => {
  const { state, calculateResult } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentName, setStudentName] = useState('');
  const [result, setResult] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  useEffect(() => {
    if (state.isComplete && state.answers.length >= 5) {
      const fetchResult = async () => {
        const calculatedResult = await calculateResult();
        setResult(calculatedResult);
      };
      fetchResult();
    }
  }, [state, calculateResult]);

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

  const handleDownloadFlowchart = () => {
    if (!result) return;
    
    if (!studentName.trim()) {
      toast({
        title: "Please enter your name",
        description: "Your name is required to generate the flowchart.",
        variant: "destructive",
      });
      return;
    }

    generateFlowchartPDF(result, studentName);
    toast({
      title: "Flowchart downloaded!",
      description: "Your career pathway flowchart has been downloaded successfully.",
    });
  };

  const toggleCourseExpansion = (courseId: number) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
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
            <p className="text-muted-foreground">Assessment Score: {result.score}/100</p>
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
                        <Badge variant={college.type === 'Government' ? 'default' : 'secondary'}>
                          {college.type} • J&K
                        </Badge>
                        {college.feeRange && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs bg-primary/5">
                              {college.feeRange}
                            </Badge>
                          </div>
                        )}
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
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="card-gradient shadow-medium border-0">
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

          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Download Career Flowchart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get a visual flowchart showing your career pathway from stream selection to future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter your name for the flowchart"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleDownloadFlowchart} variant="outline" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Download Flowchart</span>
                </Button>
              </div>
            </CardContent>
          </Card>
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
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Find More Colleges
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;