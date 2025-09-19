import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const flowchartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#1e40af',
        lineColor: '#6b7280',
        sectionBkgColor: '#f3f4f6',
        altSectionBkgColor: '#e5e7eb',
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
      toast.success('Career flowchart generated successfully!');
    } catch (error) {
      console.error('Error generating flowchart:', error);
      toast.error('Failed to generate flowchart. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMermaidDiagram = async () => {
    if (!flowchartData || !mermaidRef.current) return;

    // Create Mermaid flowchart syntax
    let mermaidSyntax = 'flowchart TD\n';
    
    // Add nodes
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
    classDef startNode fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef courseNode fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef eduNode fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef careerNode fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    
    class stream startNode
    class courses,higher_studies courseNode
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

  const downloadFlowchart = async () => {
    if (!flowchartRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(flowchartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: flowchartRef.current.scrollWidth,
        height: flowchartRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${studentName}_Career_Flowchart.pdf`);
      toast.success('Flowchart downloaded successfully!');
    } catch (error) {
      console.error('Error downloading flowchart:', error);
      toast.error('Failed to download flowchart. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI-Generated Career Flowchart</span>
          <div className="flex gap-2">
            {!flowchartData && (
              <Button onClick={generateFlowchart} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate My Flowchart'
                )}
              </Button>
            )}
            {flowchartData && (
              <Button onClick={downloadFlowchart} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Flowchart
                  </>
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!flowchartData ? (
          <div className="text-center py-8 text-muted-foreground">
            Click "Generate My Flowchart" to create a personalized career guidance flowchart based on your quiz responses using AI.
          </div>
        ) : (
          <div ref={flowchartRef} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{flowchartData.title}</h3>
              <p className="text-muted-foreground">Generated for {studentName}</p>
            </div>
            
            <div 
              ref={mermaidRef} 
              className="flex justify-center items-center min-h-[400px] bg-background rounded-lg border p-4"
            />
            
            {/* Detailed breakdown */}
            <div className="grid gap-4 mt-8">
              {flowchartData.nodes.map((node) => (
                node.options && (
                  <div key={node.id} className="space-y-2">
                    <h4 className="font-semibold text-lg">{node.label}</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {node.options.map((option, index) => (
                        <Card key={index} className="p-3">
                          <h5 className="font-medium">{option.name}</h5>
                          {option.duration && (
                            <p className="text-sm text-muted-foreground">Duration: {option.duration}</p>
                          )}
                          {option.sector && (
                            <p className="text-sm text-muted-foreground">Sector: {option.sector}</p>
                          )}
                          <p className="text-sm mt-1">{option.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};