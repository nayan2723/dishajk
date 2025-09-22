import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { IndianRupee, TrendingUp, Clock, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ROIData {
  course: string;
  courseFees: number;
  expectedSalary: number;
  paybackMonths: number;
  roiPercentage: number;
  timeToBreakeven: string;
}

const roiData: ROIData[] = [
  {
    course: 'Engineering',
    courseFees: 400000,
    expectedSalary: 600000,
    paybackMonths: 8,
    roiPercentage: 150,
    timeToBreakeven: '8 months'
  },
  {
    course: 'Medical',
    courseFees: 1500000,
    expectedSalary: 1200000,
    paybackMonths: 15,
    roiPercentage: 300,
    timeToBreakeven: '1.2 years'
  },
  {
    course: 'Commerce/MBA',
    courseFees: 300000,
    expectedSalary: 500000,
    paybackMonths: 7,
    roiPercentage: 167,
    timeToBreakeven: '7 months'
  },
  {
    course: 'Computer Science',
    courseFees: 250000,
    expectedSalary: 800000,
    paybackMonths: 4,
    roiPercentage: 320,
    timeToBreakeven: '4 months'
  },
  {
    course: 'Law',
    courseFees: 350000,
    expectedSalary: 450000,
    paybackMonths: 9,
    roiPercentage: 129,
    timeToBreakeven: '9 months'
  },
  {
    course: 'Arts/Design',
    courseFees: 200000,
    expectedSalary: 350000,
    paybackMonths: 7,
    roiPercentage: 175,
    timeToBreakeven: '7 months'
  },
  {
    course: 'Pharmacy',
    courseFees: 300000,
    expectedSalary: 400000,
    paybackMonths: 9,
    roiPercentage: 133,
    timeToBreakeven: '9 months'
  },
  {
    course: 'Nursing',
    courseFees: 250000,
    expectedSalary: 350000,
    paybackMonths: 9,
    roiPercentage: 140,
    timeToBreakeven: '9 months'
  }
];

const formatCurrency = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${(amount / 1000).toFixed(0)}K`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-card-foreground">{label}</p>
        <p className="text-primary">
          <span className="font-medium">Course Fees:</span> {formatCurrency(data.courseFees)}
        </p>
        <p className="text-success">
          <span className="font-medium">Expected Salary:</span> {formatCurrency(data.expectedSalary)}
        </p>
        <p className="text-warning">
          <span className="font-medium">ROI:</span> {data.roiPercentage}%
        </p>
        <p className="text-info">
          <span className="font-medium">Payback Time:</span> {data.timeToBreakeven}
        </p>
      </div>
    );
  }
  return null;
};

export const ROIVisualization: React.FC = () => {
  const { t } = useTranslation();

  const bestROI = roiData.reduce((best, current) => 
    current.roiPercentage > best.roiPercentage ? current : best
  );

  const fastestPayback = roiData.reduce((fastest, current) => 
    current.paybackMonths < fastest.paybackMonths ? current : fastest
  );

  return (
    <div className="space-y-6">
      {/* ROI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-gradient shadow-soft border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best ROI</p>
                <p className="text-xl font-bold text-success">{bestROI.course}</p>
                <p className="text-sm text-muted-foreground">{bestROI.roiPercentage}% return</p>
              </div>
              <div className="p-2 rounded-full bg-success/10 text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-soft border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fastest Payback</p>
                <p className="text-xl font-bold text-info">{fastestPayback.course}</p>
                <p className="text-sm text-muted-foreground">{fastestPayback.timeToBreakeven}</p>
              </div>
              <div className="p-2 rounded-full bg-info/10 text-info">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-soft border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Course Fee</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(roiData.reduce((sum, item) => sum + item.courseFees, 0) / roiData.length)}
                </p>
                <p className="text-sm text-muted-foreground">Across all streams</p>
              </div>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fees vs Salary Comparison */}
      <Card className="card-gradient shadow-medium border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Course Fees vs Expected Salary Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="course" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="courseFees" 
                  fill="hsl(var(--warning))"
                  name="Course Fees"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="expectedSalary" 
                  fill="hsl(var(--success))" 
                  name="Expected Salary"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ROI Percentage Chart */}
      <Card className="card-gradient shadow-medium border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Return on Investment (ROI) by Career Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="course" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'ROI']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="roiPercentage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed ROI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roiData.map((item) => (
          <Card key={item.course} className="card-gradient shadow-soft border-0">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{item.course}</h3>
                  <Badge 
                    variant={item.roiPercentage > 200 ? "default" : item.roiPercentage > 150 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {item.roiPercentage}% ROI
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Fees:</span>
                    <span className="font-medium text-warning">{formatCurrency(item.courseFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Salary:</span>
                    <span className="font-medium text-success">{formatCurrency(item.expectedSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payback Time:</span>
                    <span className="font-medium text-info">{item.timeToBreakeven}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};