import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { QuizResult } from '@/types';

interface FlowchartNode {
  id: string;
  label: string;
  type: string;
  description?: string;
  options?: Array<{
    name: string;
    duration?: string;
    sector?: string;
    description: string;
  }>;
}

interface FlowchartData {
  title: string;
  nodes: FlowchartNode[];
  connections: Array<{ from: string; to: string }>;
}

interface CareerFlowchartProps {
  quizResult: QuizResult;
  studentName: string;
}

export const CareerFlowchart: React.FC<CareerFlowchartProps> = ({ quizResult, studentName }) => {
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const flowchartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark
        ? {
            primaryColor: '#ef4444',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#f87171',
            lineColor: '#9ca3af',
            sectionBkgColor: '#111827',
            altSectionBkgColor: '#1f2937',
            gridColor: '#374151',
            secondaryColor: '#10b981',
            tertiaryColor: '#f59e0b',
          }
        : {
            primaryColor: '#ef4444',
            primaryTextColor: '#111827',
            primaryBorderColor: '#b91c1c',
            lineColor: '#6b7280',
            sectionBkgColor: '#ffffff',
            altSectionBkgColor: '#f3f4f6',
            gridColor: '#d1d5db',
            secondaryColor: '#10b981',
            tertiaryColor: '#f59e0b',
          },
    });
  }, []);

  const generateFlowchart = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-career-flowchart', {
        body: {
          quizData: quizResult,
          userProfile: quizResult.userProfile
        }
      });

      if (error) throw error;

      setFlowchartData(data.flowchartData);
      setIsGenerated(true);
      toast.success('Career flowchart generated successfully!');
    } catch (error) {
      console.error('Error generating flowchart:', error);
      toast.error('Failed to generate flowchart. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFlowchart = async () => {
    if (!mermaidRef.current || !flowchartData) return;

    try {
      const canvas = await html2canvas(mermaidRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add header
      pdf.setFontSize(20);
      pdf.text('Career Pathway Flowchart', pdfWidth / 2, 20, { align: 'center' });
      
      // Add student name
      pdf.setFontSize(14);
      pdf.text(`Student: ${studentName}`, 20, imgY + imgHeight * ratio + 20);
      
      pdf.save(`${studentName.replace(/\s+/g, '_')}_Career_Flowchart.pdf`);
      toast.success('Flowchart downloaded successfully!');
    } catch (error) {
      console.error('Error downloading flowchart:', error);
      toast.error('Failed to download flowchart. Please try again.');
    }
  };

  const renderMermaidDiagram = async () => {
    if (!flowchartData || !mermaidRef.current) return;

    // Create Mermaid flowchart syntax
    let mermaidSyntax = 'flowchart TD\n';
    
    // Base nodes
    mermaidSyntax += `    courses["Stream Courses"]\n`;
    mermaidSyntax += `    higher_studies["Higher Education Options"]\n`;
    mermaidSyntax += `    careers["Career Opportunities"]\n`;
    
    // Add nodes and links from data
    flowchartData.nodes.forEach(node => {
      if (node.type === 'start') {
        mermaidSyntax += `    ${node.id}["${node.label}"] --> courses\n`;
      } else if (node.type === 'courses' && node.options) {
        node.options.forEach((option, index) => {
          const courseId = `course${index}`;
          mermaidSyntax += `    ${courseId}["${option.name}<br/>${option.duration}"] --> higher_studies\n`;
        });
      } else if (node.type === 'education' && node.options) {
        node.options.forEach((option, index) => {
          const eduId = `edu${index}`;
          mermaidSyntax += `    higher_studies --> ${eduId}["${option.name}<br/>${option.duration}"]\n`;
          mermaidSyntax += `    ${eduId} --> careers\n`;
        });
      } else if (node.type === 'careers' && node.options) {
        node.options.forEach((option, index) => {
          const careerId = `career${index}`;
          mermaidSyntax += `    careers --> ${careerId}["${option.name}<br/>${option.sector}"]\n`;
        });
      }
    });

    // Style the nodes
    mermaidSyntax += `
    classDef startNode fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#fff
    classDef courseNode fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef eduNode fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#111827
    classDef careerNode fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff
    
    class courses courseNode
    class higher_studies eduNode
    class careers careerNode
    `;

    try {
      const { svg } = await mermaid.render('flowchart', mermaidSyntax);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
      }
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
    }
  };

  useEffect(() => {
    if (flowchartData) {
      renderMermaidDiagram();
    }
  }, [flowchartData]);


  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-primary" />
        Your Career Pathway
      </h2>
      
      <Card className="card-gradient shadow-medium border-0">
        <CardContent className="p-6">
          {isGenerating ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating your personalized career flowchart...</p>
            </div>
          ) : !isGenerated ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Generate an AI-powered career flowchart tailored to your quiz results</p>
              <Button onClick={generateFlowchart} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Career Flowchart
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Your personalized career flowchart is ready!</p>
              <Button onClick={downloadFlowchart} className="gap-2">
                <Download className="h-4 w-4" />
                Download Flowchart
              </Button>
            </div>
          )}
          
          {/* Off-screen mermaid container used for rendering and PDF capture (must not be display:none) */}
          <div 
            ref={mermaidRef}
            style={{ position: 'absolute', left: '-10000px', top: 0, backgroundColor: '#ffffff', padding: '20px', width: '1400px' }}
          />
        </CardContent>
      </Card>
    </div>
  );
};