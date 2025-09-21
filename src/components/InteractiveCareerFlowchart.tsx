import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Controls,
  Background,
  MiniMap,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Loader2, TrendingUp, Download, Sparkles, X, Clock, Target, MapPin, BookOpen, Briefcase, GraduationCap, Building, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QuizResult } from '@/types';

// Import flowchart images
import commerceRoadmap from '@/assets/flowcharts/commerce-roadmap.png';
import artsEducationRoadmap from '@/assets/flowcharts/arts-education-roadmap.png';
import lawRoadmap from '@/assets/flowcharts/law-roadmap.png';
import pharmacyRoadmap from '@/assets/flowcharts/pharmacy-roadmap.png';
import ayurvedaRoadmap from '@/assets/flowcharts/ayurveda-roadmap.png';
import nursingRoadmap from '@/assets/flowcharts/nursing-roadmap.png';
import dentalRoadmap from '@/assets/flowcharts/dental-roadmap.png';
import medicalRoadmap from '@/assets/flowcharts/medical-roadmap.png';
import computerRoadmap from '@/assets/flowcharts/computer-roadmap.png';
import engineeringRoadmap from '@/assets/flowcharts/engineering-roadmap.png';

// Flowchart mapping based on course recommendations
const flowchartMap = {
  // Commerce stream
  'B.Com/BBA': commerceRoadmap,
  'CA/CS/CMA': commerceRoadmap,
  'BCA/IT': computerRoadmap,
  
  // Science stream
  'B.Tech/Engineering': engineeringRoadmap,
  'MBBS/Medical': medicalRoadmap,
  'B.Sc (Physics/Chemistry/Biology)': medicalRoadmap,
  'B.Pharm': pharmacyRoadmap,
  'BAMS/BUMS': ayurvedaRoadmap,
  'BDS': dentalRoadmap,
  'B.Sc Nursing': nursingRoadmap,
  
  // Arts stream  
  'B.A (English/History/Psychology)': artsEducationRoadmap,
  'Mass Communication/Journalism': artsEducationRoadmap,
  'Social Work/NGO Management': artsEducationRoadmap,
  'LLB/Law': lawRoadmap,
};

interface CareerFlowchartProps {
  quizResult: QuizResult;
  studentName: string;
}

export const InteractiveCareerFlowchart: React.FC<CareerFlowchartProps> = ({ 
  quizResult, 
  studentName 
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Get available flowcharts based on recommendations
  const availableFlowcharts = useMemo(() => {
    return quizResult.recommendations.map(rec => ({
      name: rec.name,
      description: rec.description,
      duration: rec.duration,
      scope: rec.scope,
      flowchart: flowchartMap[rec.name as keyof typeof flowchartMap]
    })).filter(item => item.flowchart);
  }, [quizResult.recommendations]);

  // Set default selected course to first available
  useEffect(() => {
    if (availableFlowcharts.length > 0 && !selectedCourse) {
      setSelectedCourse(availableFlowcharts[0].name);
    }
  }, [availableFlowcharts, selectedCourse]);

  // Download functionality
  const downloadFlowchart = async () => {
    toast.success('Flowchart download feature coming soon!');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-primary" />
        Career Roadmap
      </h2>
      
      {availableFlowcharts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Your Career Path:</h3>
          <div className="flex flex-wrap gap-3">
            {availableFlowcharts.map((flowchart) => (
              <Button
                key={flowchart.name}
                variant={selectedCourse === flowchart.name ? "default" : "outline"}
                onClick={() => setSelectedCourse(flowchart.name)}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {flowchart.name}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      )}

      <Card className="card-gradient shadow-medium border-0">
        <CardContent className="p-6">
          {selectedCourse && availableFlowcharts.find(f => f.name === selectedCourse)?.flowchart ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{selectedCourse} Career Roadmap</h3>
                <p className="text-muted-foreground mb-4">
                  {availableFlowcharts.find(f => f.name === selectedCourse)?.description}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-white p-4">
                <img 
                  src={availableFlowcharts.find(f => f.name === selectedCourse)?.flowchart} 
                  alt={`${selectedCourse} Career Roadmap`}
                  className="w-full h-auto max-w-4xl mx-auto"
                />
              </div>
              <div className="text-center">
                <Button onClick={downloadFlowchart} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Roadmap
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No specific roadmap available for your selected courses.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};