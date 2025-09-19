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
  Cell
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
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  totalStudents: number;
  streamDistribution: { stream: string; count: number; percentage: number }[];
  districtData: { district: string; count: number }[];
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
  const [loading, setLoading] = useState(true);

  // Color scheme
  const COLORS: Record<string, string> = {
    Science: 'hsl(210, 85%, 55%)',
    Commerce: 'hsl(160, 75%, 50%)',
    Arts: 'hsl(25, 85%, 60%)',
    Vocational: 'hsl(280, 75%, 60%)',
    Government: 'hsl(120, 60%, 50%)',
    Private: 'hsl(200, 75%, 55%)',
    Unknown: 'hsl(var(--muted))'
  };

  // Fetch quiz sessions data from Supabase
  useEffect(() => {
    const fetchQuizSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_sessions')
          .select('*')
          .order('completed_at', { ascending: false });

        if (error) {
          console.error('Error fetching quiz sessions:', error);
        } else {
          setQuizSessions(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSessions();
  }, []);

  // Calculate dashboard statistics
  const dashboardStats = useMemo((): DashboardData => {
    if (loading || quizSessions.length === 0) {
      return {
        totalStudents: 0,
        streamDistribution: [],
        districtData: [],
        recentQuizzes: []
      };
    }

    const totalStudents = quizSessions.length;

    // Filter sessions based on search and filters
    const filteredSessions = quizSessions.filter(session => {
      const matchesSearch = session.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.district.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStreamFilter = streamFilter === 'all' || 
                                 session.stream.toLowerCase() === streamFilter.toLowerCase();
      
      const matchesDistrictFilter = districtFilter === 'all' || 
                                   session.district.toLowerCase().includes(districtFilter.toLowerCase());

      return matchesSearch && matchesStreamFilter && matchesDistrictFilter;
    });

    // Stream distribution
    const streamCounts: Record<string, number> = {};
    quizSessions.forEach(session => {
      const stream = session.stream || 'Unknown';
      streamCounts[stream] = (streamCounts[stream] || 0) + 1;
    });

    const streamDistribution = Object.entries(streamCounts).map(([stream, count]) => ({
      stream,
      count: Number(count),
      percentage: Math.round((Number(count) / totalStudents) * 100)
    }));

    // District data
    const districtCounts: Record<string, number> = {};
    quizSessions.forEach(session => {
      const district = session.district || 'Unknown';
      districtCounts[district] = (districtCounts[district] || 0) + 1;
    });

    const districtData = Object.entries(districtCounts).map(([district, count]) => ({
      district,
      count: Number(count)
    }));

    // Recent quizzes (last 10)
    const recentQuizzes = quizSessions.slice(0, 10).map(session => ({
      id: session.id,
      student_name: session.student_name,
      location: session.location,
      district: session.district,
      stream: session.stream,
      completed_at: session.completed_at
    }));

    return {
      totalStudents,
      streamDistribution,
      districtData: districtData.slice(0, 10), // Top 10 districts
      recentQuizzes
    };
  }, [quizSessions, searchTerm, streamFilter, districtFilter, loading]);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Student Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Insights into quiz participation and student career preferences
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-medium border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.totalStudents)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Science Stream</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.streamDistribution.find(s => s.stream === 'Science')?.count || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-info/10 text-info">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Arts Stream</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.streamDistribution.find(s => s.stream === 'Arts')?.count || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-warning/10 text-warning">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commerce Stream</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : String(dashboardStats.streamDistribution.find(s => s.stream === 'Commerce')?.count || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Stream Distribution */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Student Stream Distribution
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
                    <span className="text-sm">{item.stream}: {String(item.count)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Districts by Student Count */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Districts by Student Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.districtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="district" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Quiz Sessions */}
        <Card className="card-gradient shadow-medium border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Student Assessments
            </CardTitle>
            <p className="text-muted-foreground">
              Latest quiz sessions from students across different districts
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
                <p className="text-muted-foreground">No quiz sessions found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardStats.recentQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{quiz.student_name}</h3>
                            <Badge variant="secondary">{quiz.stream}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{quiz.location}, {quiz.district}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(quiz.completed_at).toLocaleDateString()}</span>
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