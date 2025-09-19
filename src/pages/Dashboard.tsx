import React, { useState, useMemo, useEffect } from 'react';
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
  ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  GraduationCap, 
  MapPin, 
  BarChart3,
  PieChart as PieChartIcon,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  totalColleges: number;
  typeDistribution: { type: string; count: number; percentage: number }[];
  districtData: { district: string; count: number }[];
  streamData: { stream: string; count: number }[];
}

const Dashboard: React.FC = () => {
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch colleges from Supabase
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`https://iaenrgkstxjthwiecwli.supabase.co/rest/v1/colleges?select=*`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZW5yZ2tzdHhqdGh3aWVjd2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDQwMTIsImV4cCI6MjA3Mzg4MDAxMn0.U3hNv5emyHwxB2e7s4Juu1chE_pzV5On15lm0wwouwg',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZW5yZ2tzdHhqdGh3aWVjd2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDQwMTIsImV4cCI6MjA3Mzg4MDAxMn0.U3hNv5emyHwxB2e7s4Juu1chE_pzV5On15lm0wwouwg'
          }
        });
        const data = await response.json();
        const error = !response.ok ? { message: 'Failed to fetch' } : null;
        
        if (error) {
          console.error('Error fetching colleges:', error);
        } else {
          setColleges(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Calculate dashboard statistics
  const dashboardStats = useMemo((): DashboardData => {
    if (loading || colleges.length === 0) {
      return {
        totalColleges: 0,
        typeDistribution: [],
        districtData: [],
        streamData: []
      };
    }

    let filteredData = colleges.filter(college => college['College Name']); // Filter out null entries
    
    // Apply filters
    if (streamFilter !== 'all') {
      filteredData = filteredData.filter(college => {
        const courses = college['Courses Offered (Categorized Streams)'] || '';
        return courses.toLowerCase().includes(streamFilter.toLowerCase());
      });
    }
    
    if (districtFilter !== 'all') {
      filteredData = filteredData.filter(college => 
        college['District'] === districtFilter
      );
    }

    const totalColleges = filteredData.length;
    
    // Type distribution (Government vs Private)
    const typeCounts = filteredData.reduce((acc: Record<string, number>, college) => {
      const type = college['Type'] || 'Unknown';
      const category = type.toLowerCase().includes('govt') || type.toLowerCase().includes('government') 
        ? 'Government' 
        : type.toLowerCase().includes('private') || type.toLowerCase().includes('pvt')
        ? 'Private'
        : 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count: Number(count),
      percentage: Math.round((Number(count) / totalColleges) * 100)
    }));

    // District data
    const districtCounts = filteredData.reduce((acc: Record<string, number>, college) => {
      const district = college['District'] || 'Unknown';
      acc[district] = (acc[district] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const districtData = Object.entries(districtCounts).map(([district, count]) => ({
      district,
      count: Number(count)
    }));

    // Stream data
    const streamCounts = filteredData.reduce((acc: Record<string, number>, college) => {
      const courses = college['Courses Offered (Categorized Streams)'] || '';
      const coursesLower = courses.toLowerCase();
      
      if (coursesLower.includes('science') || coursesLower.includes('tech')) {
        acc['Science'] = (acc['Science'] || 0) + 1;
      }
      if (coursesLower.includes('commerce') || coursesLower.includes('mgt') || coursesLower.includes('comm')) {
        acc['Commerce'] = (acc['Commerce'] || 0) + 1;
      }
      if (coursesLower.includes('arts') || coursesLower.includes('law')) {
        acc['Arts'] = (acc['Arts'] || 0) + 1;
      }
      
      return acc;
    }, {} as Record<string, number>);

    const streamData = Object.entries(streamCounts).map(([stream, count]) => ({
      stream,
      count: Number(count)
    }));

    return {
      totalColleges,
      typeDistribution,
      districtData,
      streamData
    };
  }, [colleges, streamFilter, districtFilter, loading]);

  // Chart colors
  const COLORS: Record<string, string> = {
    Science: 'hsl(195, 85%, 45%)',
    Commerce: 'hsl(35, 85%, 55%)', 
    Arts: 'hsl(145, 65%, 45%)',
    Government: 'hsl(195, 85%, 45%)',
    Private: 'hsl(35, 85%, 55%)',
    Other: 'hsl(145, 65%, 45%)'
  };

  // Get unique districts and streams for filters
  const uniqueDistricts = [...new Set(colleges.map(college => college['District']).filter(Boolean))];
  const uniqueStreams = ['science', 'commerce', 'arts'];

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">College Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              J&K colleges analytics and insights
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
                  <SelectItem key={stream} value={stream} className="capitalize">{stream}</SelectItem>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Colleges</p>
                  <p className="text-2xl font-bold">{loading ? 'Loading...' : dashboardStats.totalColleges}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Building className="h-6 w-6" />
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
                     {loading ? 'Loading...' : String(dashboardStats.typeDistribution.find(t => t.type === 'Government')?.count || 0)}
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
                  <p className="text-sm font-medium text-muted-foreground">Most Common Stream</p>
                  <p className="text-2xl font-bold">
                    {loading ? 'Loading...' : (dashboardStats.streamData.length > 0 ? (dashboardStats.streamData.reduce((max, current) => 
                      current.count > max.count ? current : max, 
                      dashboardStats.streamData[0]
                    )?.stream || 'N/A') : 'N/A')}
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
                  <p className="text-sm font-medium text-muted-foreground">Districts Covered</p>
                  <p className="text-2xl font-bold">{loading ? 'Loading...' : dashboardStats.districtData.length}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* College Type Distribution Pie Chart */}
          <Card className="card-gradient shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Colleges by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardStats.typeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={(entry: any) => `${entry.type} (${entry.percentage}%)`}
                      >
                        {dashboardStats.typeDistribution.map((entry) => (
                          <Cell key={entry.type} fill={COLORS[entry.type] || 'hsl(var(--muted))'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any) => [value, 'Colleges']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                {dashboardStats.typeDistribution.map(item => (
                  <div key={item.type} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.type] || 'hsl(var(--muted))' }}
                    />
                    <span className="text-sm">{item.type}: {String(item.count)}</span>
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
                Colleges by District
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardStats.districtData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="district" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                  <Tooltip formatter={(value: any, name: any) => [value, 'Colleges']} />
                      <Bar dataKey="count" fill="hsl(195, 85%, 45%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stream Distribution Bar Chart */}
        <Card className="card-gradient shadow-medium border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Colleges Offering Different Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.streamData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stream" />
                    <YAxis />
                    <Tooltip formatter={(value: any, name: any) => [value, 'Colleges']} />
                    <Bar dataKey="count" fill="hsl(195, 85%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Colleges */}
        <Card className="card-gradient shadow-medium border-0">
          <CardHeader>
            <CardTitle>College Database</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center">
                <p>Loading colleges...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">College Name</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">District</th>
                      <th className="text-left py-2">Area</th>
                      <th className="text-left py-2">Courses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colleges.slice(0, 10).filter(college => college['College Name']).map((college, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{college['College Name'] || 'Unknown'}</td>
                        <td className="py-3">
                          <Badge 
                            variant={(college['Type'] && college['Type'].toLowerCase().includes('govt')) ? 'default' : 'secondary'}
                          >
                            {(college['Type'] && college['Type'].includes('Govt')) ? 'Government' : 'Private'}
                          </Badge>
                        </td>
                        <td className="py-3">{college['District'] || 'Unknown'}</td>
                        <td className="py-3">{college['Urban/Rural Status'] || 'Unknown'}</td>
                        <td className="py-3 text-muted-foreground max-w-xs truncate">
                          {college['Courses Offered (Categorized Streams)'] || 'No courses listed'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;