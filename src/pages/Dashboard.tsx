import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  GraduationCap, 
  MapPin, 
  BarChart3,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react';
import { mockStudentData } from '../data/jkData';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  // Calculate dashboard statistics
  const dashboardStats = useMemo((): DashboardStats => {
    const filteredData = mockStudentData.filter(student => {
      const matchesStream = streamFilter === 'all' || student.stream === streamFilter;
      const matchesDistrict = districtFilter === 'all' || student.district === districtFilter;
      return matchesStream && matchesDistrict;
    });

    const totalStudents = filteredData.length;
    
    // Stream distribution
    const streamCounts = filteredData.reduce((acc, student) => {
      acc[student.stream] = (acc[student.stream] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const streamDistribution = Object.entries(streamCounts).map(([stream, count]) => ({
      stream,
      count,
      percentage: Math.round((count / totalStudents) * 100)
    }));

    // District data
    const districtCounts = filteredData.reduce((acc, student) => {
      acc[student.district] = (acc[student.district] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const districtData = Object.entries(districtCounts).map(([district, count]) => ({
      district,
      count
    }));

    return {
      totalStudents,
      streamDistribution,
      districtData
    };
  }, [streamFilter, districtFilter]);

  // Chart colors
  const COLORS: Record<string, string> = {
    Science: 'hsl(195, 85%, 45%)',
    Commerce: 'hsl(35, 85%, 55%)', 
    Arts: 'hsl(145, 65%, 45%)',
    Vocational: 'hsl(270, 65%, 55%)'
  };

  // Get unique districts and streams for filters
  const uniqueDistricts = [...new Set(mockStudentData.map(s => s.district))];
  const uniqueStreams = [...new Set(mockStudentData.map(s => s.stream))];

  // Performance trends (mock data)
  const performanceTrends = [
    { month: 'Jan', Science: 85, Commerce: 78, Arts: 72 },
    { month: 'Feb', Science: 87, Commerce: 80, Arts: 74 },
    { month: 'Mar', Science: 86, Commerce: 82, Arts: 76 },
    { month: 'Apr', Science: 89, Commerce: 81, Arts: 75 },
    { month: 'May', Science: 88, Commerce: 83, Arts: 77 },
    { month: 'Jun', Science: 90, Commerce: 84, Arts: 78 }
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Student assessment analytics and insights
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Select value={streamFilter} onValueChange={setStreamFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                {uniqueStreams.map(stream => (
                  <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {uniqueDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalStudents}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">
                    {Math.round(mockStudentData.reduce((sum, s) => sum + s.score, 0) / mockStudentData.length)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-success/10 text-success">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Popular Stream</p>
                  <p className="text-2xl font-bold">
                    {dashboardStats.streamDistribution.reduce((max, current) => 
                      current.count > max.count ? current : max, 
                      dashboardStats.streamDistribution[0]
                    )?.stream || 'N/A'}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Districts</p>
                  <p className="text-2xl font-bold">{dashboardStats.districtData.length}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Stream Distribution Pie Chart */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Interest by Stream
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
                      outerRadius={100}
                      dataKey="count"
                      label={({stream, percentage}) => `${stream} (${percentage}%)`}
                    >
                      {dashboardStats.streamDistribution.map((entry) => (
                        <Cell key={entry.stream} fill={COLORS[entry.stream] || 'hsl(var(--muted))'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Students']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {dashboardStats.streamDistribution.map(item => (
                  <div key={item.stream} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.stream] || 'hsl(var(--muted))' }}
                    />
                    <span className="text-sm">{item.stream}: {item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* District Distribution Bar Chart */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Students by District
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.districtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="district" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(195, 85%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card className="card-gradient shadow-medium border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Average Score Trends by Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="Science" 
                    stroke={COLORS.Science}
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Commerce" 
                    stroke={COLORS.Commerce}
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Arts" 
                    stroke={COLORS.Arts}
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card className="card-gradient shadow-medium border-0">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Stream</th>
                    <th className="text-left py-2">District</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudentData.slice(0, 8).map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="py-3">{student.name}</td>
                      <td className="py-3">
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: COLORS[student.stream] || 'hsl(var(--muted))', 
                            color: COLORS[student.stream] || 'hsl(var(--muted-foreground))' 
                          }}
                        >
                          {student.stream}
                        </Badge>
                      </td>
                      <td className="py-3">{student.district}</td>
                      <td className="py-3 font-medium">{student.score}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(student.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;