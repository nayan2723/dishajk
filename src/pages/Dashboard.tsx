import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  GraduationCap,
  Building2,
  MapPin,
  TrendingUp,
  BookOpen,
  Search,
  Filter,
  Download,
  RefreshCcw,
  Clock,
  Calendar,
  School,
  Globe,
  Award,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  totalStudents: number;
  totalColleges: number;
  streamDistribution: { stream: string; count: number; percentage: number }[];
  districtData: { district: string; count: number }[];
  collegeDistrictData: { district: string; count: number; government: number; private: number }[];
  collegeTypeDistribution: { type: string; count: number; percentage: number }[];
  urbanRuralDistribution: { status: string; count: number; percentage: number }[];
  courseDistribution: { course: string; count: number }[];
  recentQuizzes: Array<{
    id: string;
    student_name: string;
    location: string;
    district: string;
    stream: string;
    completed_at: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quizSessions, setQuizSessions] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Color scheme
  const COLORS: Record<string, string> = {
    Science: 'hsl(210, 85%, 55%)',
    Commerce: 'hsl(160, 75%, 50%)',
    Arts: 'hsl(25, 85%, 60%)',
    Vocational: 'hsl(280, 75%, 60%)',
    Government: 'hsl(120, 60%, 50%)',
    Private: 'hsl(200, 75%, 55%)',
    Urban: 'hsl(240, 60%, 60%)',
    Rural: 'hsl(30, 80%, 55%)',
    Unknown: 'hsl(var(--muted))'
  };

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quiz sessions
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_sessions')
          .select('*')
          .order('completed_at', { ascending: false });

        if (quizError) {
          console.error('Error fetching quiz sessions:', quizError);
        } else {
          setQuizSessions(quizData || []);
        }

        // Fetch colleges data
        const { data: collegeData, error: collegeError } = await supabase
          .from('colleges')
          .select('*');

        if (collegeError) {
          console.error('Error fetching colleges:', collegeError);
        } else {
          setColleges(collegeData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard statistics
  const dashboardStats = useMemo((): DashboardData => {
    if (loading) {
      return {
        totalStudents: 0,
        totalColleges: 0,
        streamDistribution: [],
        districtData: [],
        collegeDistrictData: [],
        collegeTypeDistribution: [],
        urbanRuralDistribution: [],
        courseDistribution: [],
        recentQuizzes: []
      };
    }

    const totalStudents = quizSessions.length;
    const totalColleges = colleges.length;

    // Student stream distribution
    const streamCounts: Record<string, number> = {};
    quizSessions.forEach(session => {
      const stream = session.stream || 'Unknown';
      streamCounts[stream] = (streamCounts[stream] || 0) + 1;
    });

    const streamDistribution = Object.entries(streamCounts).map(([stream, count]) => ({
      stream,
      count: Number(count),
      percentage: totalStudents > 0 ? Math.round((Number(count) / totalStudents) * 100) : 0
    }));

    // Student district data
    const districtCounts: Record<string, number> = {};
    quizSessions.forEach(session => {
      const district = session.district || 'Unknown';
      districtCounts[district] = (districtCounts[district] || 0) + 1;
    });

    const districtData = Object.entries(districtCounts).map(([district, count]) => ({
      district,
      count: Number(count)
    }));

    // College analytics
    const collegeDistrictCounts: Record<string, { total: number; government: number; private: number }> = {};
    colleges.forEach(college => {
      const district = college.District || 'Unknown';
      const type = college.Type || 'Unknown';
      
      if (!collegeDistrictCounts[district]) {
        collegeDistrictCounts[district] = { total: 0, government: 0, private: 0 };
      }
      
      collegeDistrictCounts[district].total += 1;
      
      if (type.toLowerCase().includes('government') || type.toLowerCase().includes('govt')) {
        collegeDistrictCounts[district].government += 1;
      } else if (type.toLowerCase().includes('private')) {
        collegeDistrictCounts[district].private += 1;
      }
    });

    const collegeDistrictData = Object.entries(collegeDistrictCounts)
      .map(([district, counts]) => ({
        district,
        count: counts.total,
        government: counts.government,
        private: counts.private
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // College type distribution
    const collegeTypeCounts: Record<string, number> = {};
    colleges.forEach(college => {
      const type = college.Type || 'Unknown';
      const normalizedType = type.toLowerCase().includes('government') || type.toLowerCase().includes('govt') 
        ? 'Government' 
        : type.toLowerCase().includes('private')
        ? 'Private'
        : 'Other';
      
      collegeTypeCounts[normalizedType] = (collegeTypeCounts[normalizedType] || 0) + 1;
    });

    const collegeTypeDistribution = Object.entries(collegeTypeCounts).map(([type, count]) => ({
      type,
      count: Number(count),
      percentage: totalColleges > 0 ? Math.round((Number(count) / totalColleges) * 100) : 0
    }));

    // Urban/Rural distribution
    const urbanRuralCounts: Record<string, number> = {};
    colleges.forEach(college => {
      const status = college['Urban/Rural Status'] || 'Unknown';
      urbanRuralCounts[status] = (urbanRuralCounts[status] || 0) + 1;
    });

    const urbanRuralDistribution = Object.entries(urbanRuralCounts).map(([status, count]) => ({
      status,
      count: Number(count),
      percentage: totalColleges > 0 ? Math.round((Number(count) / totalColleges) * 100) : 0
    }));

    // Course distribution
    const courseCounts: Record<string, number> = {};
    colleges.forEach(college => {
      const courses = college['Courses Offered (Categorized Streams)'] || '';
      if (courses) {
        // Split courses by common delimiters and count each
        const courseList = courses.split(/[,;|&]+/).map((c: string) => c.trim()).filter((c: string) => c);
        courseList.forEach((course: string) => {
          courseCounts[course] = (courseCounts[course] || 0) + 1;
        });
      }
    });

    const courseDistribution = Object.entries(courseCounts)
      .map(([course, count]) => ({ course, count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent quizzes (last 8)
    const recentQuizzes = quizSessions.slice(0, 8).map(session => ({
      id: session.id,
      student_name: session.student_name,
      location: session.location,
      district: session.district,
      stream: session.stream,
      completed_at: session.completed_at
    }));

    return {
      totalStudents,
      totalColleges,
      streamDistribution,
      districtData: districtData.slice(0, 10),
      collegeDistrictData,
      collegeTypeDistribution,
      urbanRuralDistribution,
      courseDistribution,
      recentQuizzes
    };
  }, [quizSessions, colleges, loading]);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">J&K Higher Education Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into colleges and student career guidance in Jammu & Kashmir
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-medium border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Colleges</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.totalColleges)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Government Colleges</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.collegeTypeDistribution.find(t => t.type === 'Government')?.count || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-success/10 text-success">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Private Colleges</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.collegeTypeDistribution.find(t => t.type === 'Private')?.count || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-info/10 text-info">
                  <School className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Assessments</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.totalStudents)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-warning/10 text-warning">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* College Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* College Distribution by District */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Colleges by District
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.collegeDistrictData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="district" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="government" stackId="a" fill={COLORS.Government} name="Government" />
                    <Bar dataKey="private" stackId="a" fill={COLORS.Private} name="Private" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* College Type Distribution */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                College Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.collegeTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {dashboardStats.collegeTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.type] || 'hsl(var(--muted))'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any, props: any) => [value, props.payload.type]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {dashboardStats.collegeTypeDistribution.map((item) => (
                  <div key={item.type} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.type] || 'hsl(var(--muted))' }}
                    />
                    <span className="text-sm">{item.type}: {String(item.count)} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Urban vs Rural Distribution */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Urban vs Rural Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.urbanRuralDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {dashboardStats.urbanRuralDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.status] || 'hsl(var(--muted))'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any, props: any) => [value, props.payload.status]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {dashboardStats.urbanRuralDistribution.map((item) => (
                  <div key={item.status} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.status] || 'hsl(var(--muted))' }}
                    />
                    <span className="text-sm">{item.status}: {String(item.count)} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Course Offerings */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Popular Course Offerings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.courseDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="course" 
                      type="category" 
                      tick={{ fontSize: 10 }}
                      width={80}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Stream Preferences */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Student Stream Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.streamDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {dashboardStats.streamDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.stream] || 'hsl(var(--muted))'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any, props: any) => [value, props.payload.stream]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {dashboardStats.streamDistribution.map((item) => (
                  <div key={item.stream} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.stream] || 'hsl(var(--muted))' }}
                    />
                    <span className="text-sm">{item.stream}: {String(item.count)} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Districts by Student Participation */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Student Participation by District
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardStats.districtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="district" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Student Activity */}
        <Card className="card-gradient shadow-medium border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Student Career Assessments
            </CardTitle>
            <p className="text-muted-foreground">
              Latest career guidance assessments from students across J&K
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading recent assessments...</p>
              </div>
            ) : dashboardStats.recentQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assessments found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {dashboardStats.recentQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{quiz.student_name}</h3>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {quiz.stream}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{quiz.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building2 className="h-4 w-4 text-secondary" />
                              <span>{quiz.district} District</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(quiz.completed_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;