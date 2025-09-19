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
    if (!state.isComplete && state.answers.length < 8) {
      navigate('/quiz');
      return;
    }

    const calculatedResult = calculateResult();
    setResult(calculatedResult);
  }, [state, calculateResult, navigate]);

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
    <div className="min-h-screen py-8 px-4 animated-mesh">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Personalized Recommendations</h1>
          <p className="text-lg text-muted-foreground">
            Based on your assessment, here's your ideal career path
          </p>
        </div>

        {/* Results Summary */}
        <Card className="card-dynamic shadow-glow border-0 mb-8 animate-fade-in pulse-glow">
          <CardHeader className="text-center relative">
            <div className="flex justify-center mb-4">
              <div className="p-6 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
                <Award className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
              Recommended Stream: {result.stream}
            </CardTitle>
            <p className="text-muted-foreground text-lg">Assessment Score: {result.score}/100</p>
            <p className="text-sm text-accent mt-2 font-medium">
              📍 Showing colleges near {result.userProfile.district}, J&K
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="text-lg px-6 py-3 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
              {result.stream} Stream
            </Badge>
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <p className="text-foreground font-medium"><strong>Future Goal:</strong> {
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
            
            <div className="space-y-6">
              {result.recommendations.map((course, index) => (
                <Card key={course.id} className="card-dynamic shadow-medium hover:shadow-glow border-0 group">
                  <Collapsible
                    open={expandedCourse === course.id}
                    onOpenChange={() => toggleCourseExpansion(course.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 rounded-t-lg transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-lg shadow-glow group-hover:scale-110 transition-transform duration-300">
                              {index + 1}
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{course.name}</CardTitle>
                          </div>
                          <div className="p-2 rounded-full bg-muted/20 group-hover:bg-primary/20 transition-colors duration-300">
                            {expandedCourse === course.id ? (
                              <ChevronUp className="h-5 w-5 text-primary group-hover:text-accent transition-colors duration-300" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            )}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                          
                          <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20 hover:border-success/40 transition-colors duration-300">
                            <p className="text-sm font-medium text-success mb-2 flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Why this suits you:
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{course.rationale}</p>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                            <p className="text-sm font-medium text-primary mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Career Scope:
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{course.scope}</p>
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
            
            <div className="space-y-6">
              {result.colleges.slice(0, 8).map((college) => (
                <Card key={college.id} className="card-dynamic shadow-medium hover:shadow-glow border-0 group overflow-hidden">
                  <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-300">{college.name}</h3>
                        <div className="flex items-center space-x-2 text-muted-foreground mb-3">
                          <div className="p-1 rounded-full bg-primary/10">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{college.location}, {college.district}</span>
                        </div>
                        <Badge 
                          variant={college.type === 'Government' ? 'default' : 'secondary'} 
                          className={`${college.type === 'Government' 
                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' 
                            : 'bg-gradient-to-r from-secondary to-muted text-secondary-foreground'
                          } font-medium px-3 py-1`}
                        >
                          {college.type} • J&K
                        </Badge>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {college.website && (
                          <Button variant="outline" size="sm" asChild className="group-hover:border-primary group-hover:text-primary transition-colors duration-300">
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
          <Card className="card-dynamic shadow-glow border-0 group">
            <CardHeader>
              <CardTitle className="flex items-center text-xl group-hover:text-primary transition-colors duration-300">
                <div className="p-2 rounded-full bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors duration-300">
                  <Download className="h-6 w-6 text-primary" />
                </div>
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

          <Card className="card-dynamic shadow-glow border-0 group">
            <CardHeader>
              <CardTitle className="flex items-center text-xl group-hover:text-primary transition-colors duration-300">
                <div className="p-2 rounded-full bg-accent/10 mr-3 group-hover:bg-accent/20 transition-colors duration-300">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
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
        <Card className="mt-8 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground border-0 shadow-glow overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-accent/80 to-primary/80 animate-pulse opacity-20"></div>
          <CardContent className="p-8 text-center relative z-10">
            <h3 className="text-2xl font-bold mb-4">What's Next?</h3>
            <p className="mb-8 opacity-90 text-lg">
              Ready to take the next step in your career journey? Explore more options and connect with counselors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/quiz')}
                className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300 shadow-glow"
              >
                Retake Assessment
              </Button>
              <Button 
                variant="outline" 
                className="border-white/50 text-white hover:bg-white/20 hover:border-white transition-all duration-300"
              >
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