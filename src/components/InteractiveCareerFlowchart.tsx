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
import { Loader2, TrendingUp, Download, Sparkles, X, Clock, Target, MapPin, BookOpen, Briefcase, GraduationCap, Building } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QuizResult } from '@/types';

interface FlowchartNode {
  id: string;
  label: string;
  type: string;
  description?: string;
  timeline?: string;
  resources?: string[];
  skills?: string[];
  prerequisites?: string[];
  options?: Array<{
    name: string;
    duration?: string;
    sector?: string;
    description: string;
    salary_range?: string;
    skills_required?: string[];
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

// Custom node component
const CustomNode = ({ data, id }: { data: any; id: string }) => {
  const { setSelectedNode } = data;
  
  const nodeColors = {
    start: 'from-primary/20 to-primary/10 border-primary/30 text-primary',
    course: 'from-success/20 to-success/10 border-success/30 text-success',
    skill: 'from-warning/20 to-warning/10 border-warning/30 text-warning',
    career: 'from-accent/20 to-accent/10 border-accent/30 text-accent',
    education: 'from-secondary/20 to-secondary/10 border-secondary/30 text-secondary',
  };

  const icons = {
    start: Target,
    course: BookOpen,
    skill: Briefcase,
    career: TrendingUp,
    education: GraduationCap,
  };

  const IconComponent = icons[data.nodeType as keyof typeof icons] || Target;
  const colorClass = nodeColors[data.nodeType as keyof typeof nodeColors] || nodeColors.start;

  return (
    <div 
      className={`
        relative px-4 py-3 rounded-lg border-2 min-w-[180px] max-w-[220px] 
        bg-gradient-to-br ${colorClass}
        hover:scale-105 hover:shadow-lg transform transition-all duration-300 cursor-pointer
        backdrop-blur-sm shadow-soft
      `}
      onClick={() => setSelectedNode({ id, ...data })}
    >
      <div className="flex items-center gap-2 mb-2">
        <IconComponent className="w-4 h-4 flex-shrink-0" />
        <h3 className="font-semibold text-sm leading-tight">{data.label}</h3>
      </div>
      {data.subtitle && (
        <p className="text-xs opacity-80 leading-tight">{data.subtitle}</p>
      )}
      {data.duration && (
        <div className="flex items-center gap-1 mt-2">
          <Clock className="w-3 h-3" />
          <span className="text-xs opacity-80">{data.duration}</span>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const InteractiveCareerFlowchart: React.FC<CareerFlowchartProps> = ({ 
  quizResult, 
  studentName 
}) => {
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate flowchart data
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

  // Convert flowchart data to React Flow nodes and edges
  const processFlowchartData = useCallback(() => {
    if (!flowchartData) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let yPosition = 0;
    const xSpacing = 300;
    const ySpacing = 150;

    // Process each node type
    flowchartData.nodes.forEach((node, nodeIndex) => {
      if (node.type === 'start') {
        newNodes.push({
          id: node.id,
          type: 'custom',
          position: { x: 400, y: yPosition },
          data: { 
            label: node.label,
            description: node.description,
            nodeType: 'start',
            setSelectedNode,
            timeline: node.timeline,
            resources: node.resources,
            skills: node.skills,
          },
        });
        yPosition += ySpacing;
      } else if (node.options) {
        // Create a title node for this section
        const titleNodeId = `${node.type}-title`;
        newNodes.push({
          id: titleNodeId,
          type: 'custom',
          position: { x: 400, y: yPosition },
          data: { 
            label: node.label,
            description: node.description,
            nodeType: node.type,
            setSelectedNode,
          },
        });

        yPosition += ySpacing;
        const currentY = yPosition;

        // Create nodes for each option
        node.options.forEach((option, optionIndex) => {
          const optionId = `${node.type}-${optionIndex}`;
          const xPos = 150 + (optionIndex % 3) * xSpacing;
          const yPos = currentY + Math.floor(optionIndex / 3) * ySpacing;

          newNodes.push({
            id: optionId,
            type: 'custom',
            position: { x: xPos, y: yPos },
            data: { 
              label: option.name,
              subtitle: option.duration || option.sector,
              description: option.description,
              nodeType: node.type,
              duration: option.duration,
              sector: option.sector,
              salary_range: option.salary_range,
              skills_required: option.skills_required,
              setSelectedNode,
            },
          });

          // Connect from title to options
          newEdges.push({
            id: `${titleNodeId}-${optionId}`,
            source: titleNodeId,
            target: optionId,
            animated: true,
            style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
          });
        });

        yPosition = currentY + Math.ceil(node.options.length / 3) * ySpacing;
      }
    });

    // Connect between different sections
    flowchartData.connections.forEach((connection, index) => {
      newEdges.push({
        id: `connection-${index}`,
        source: connection.from,
        target: connection.to,
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [flowchartData, setNodes, setEdges]);

  useEffect(() => {
    if (flowchartData) {
      processFlowchartData();
    }
  }, [flowchartData, processFlowchartData]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Download functionality
  const downloadFlowchart = async () => {
    // Implementation for downloading the flowchart as PDF
    toast.success('Flowchart download feature coming soon!');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-primary" />
        Interactive Career Pathway
      </h2>
      
      <Card className="card-gradient shadow-medium border-0">
        <CardContent className="p-0">
          {isGenerating ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating your personalized career flowchart...</p>
            </div>
          ) : !isGenerated ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Generate an AI-powered interactive career flowchart tailored to your assessment results
              </p>
              <Button onClick={generateFlowchart} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Interactive Flowchart
              </Button>
            </div>
          ) : (
            <div className="h-[600px] w-full rounded-lg overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                className="bg-gradient-to-br from-background/50 to-muted/30"
              >
                <Background color="hsl(var(--muted-foreground))" gap={20} />
                <Controls className="bg-background/80 backdrop-blur-sm" />
                <MiniMap 
                  className="bg-background/80 backdrop-blur-sm" 
                  nodeColor="hsl(var(--primary))"
                />
                <Panel position="top-left" className="bg-background/80 backdrop-blur-sm rounded-lg p-3 m-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Your Career Journey</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Click nodes to explore details</p>
                </Panel>
                <Panel position="top-right" className="m-2">
                  <Button onClick={downloadFlowchart} variant="outline" size="sm" className="gap-2 bg-background/80 backdrop-blur-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </Panel>
              </ReactFlow>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Node Details Sheet */}
      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedNode && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedNode.nodeType === 'start' && <Target className="w-5 h-5 text-primary" />}
                  {selectedNode.nodeType === 'course' && <BookOpen className="w-5 h-5 text-success" />}
                  {selectedNode.nodeType === 'skill' && <Briefcase className="w-5 h-5 text-warning" />}
                  {selectedNode.nodeType === 'career' && <TrendingUp className="w-5 h-5 text-accent" />}
                  {selectedNode.nodeType === 'education' && <GraduationCap className="w-5 h-5 text-secondary" />}
                  {selectedNode.label}
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {selectedNode.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedNode.description}</p>
                  </div>
                )}

                {selectedNode.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">Duration:</span>
                    <span className="text-muted-foreground">{selectedNode.duration}</span>
                  </div>
                )}

                {selectedNode.sector && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="font-medium">Sector:</span>
                    <span className="text-muted-foreground">{selectedNode.sector}</span>
                  </div>
                )}

                {selectedNode.salary_range && (
                  <div>
                    <h4 className="font-semibold mb-2">Expected Salary Range</h4>
                    <Badge variant="outline" className="text-success">
                      {selectedNode.salary_range}
                    </Badge>
                  </div>
                )}

                {selectedNode.skills_required && selectedNode.skills_required.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Skills Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.skills_required.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.skills && selectedNode.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.resources && selectedNode.resources.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Resources</h4>
                    <ul className="space-y-2">
                      {selectedNode.resources.map((resource: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNode.timeline && (
                  <div>
                    <h4 className="font-semibold mb-2">Timeline</h4>
                    <p className="text-muted-foreground">{selectedNode.timeline}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};