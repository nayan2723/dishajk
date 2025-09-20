import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Download, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  collegeData?: any[];
  hasCollegeData?: boolean;
}

interface CollegeResult {
  'College Name': string;
  'Type': string;
  'District': string;
  'Urban/Rural Status': string;
  'Courses Offered (Categorized Streams)': string;
  'Working College Link'?: string;
}

export const Chatbot: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm DISHA Mentor, your career guidance companion. I'm here to help you explore colleges, courses, and career paths in Jammu & Kashmir. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoaded && !user) {
      setIsOpen(false);
    }
  }, [isLoaded, user]);

  const quickSuggestions = [
    { text: "Show me engineering colleges", icon: <GraduationCap className="h-4 w-4" /> },
    { text: "Career after 12th Commerce", icon: <Briefcase className="h-4 w-4" /> },
    { text: "Government colleges in Srinagar", icon: <BookOpen className="h-4 w-4" /> },
  ];

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: text,
          conversationHistory: messages.slice(-5),
          userProfile: user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddresses[0]?.emailAddress
          } : null
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        collegeData: data.collegeData || [],
        hasCollegeData: data.hasCollegeData || false
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderCollegeCard = (college: CollegeResult, index: number) => (
    <Card key={index} className="mb-2 border border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {college['College Name']}
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {college['Type']}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {college['District']}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {college['Urban/Rural Status']}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs mb-2">
          <strong>Courses:</strong> {college['Courses Offered (Categorized Streams)']}
        </CardDescription>
        {college['Working College Link'] && (
          <Button
            size="sm"
            variant="link"
            className="h-auto p-0 text-xs"
            onClick={() => window.open(college['Working College Link'], '_blank')}
          >
            Visit College Website
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (!isLoaded) return null;

  if (!user) {
    return (
      <Button
        onClick={() => toast({
          title: "Please Sign In",
          description: "You need to be signed in to use the chatbot.",
        })}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background border border-border rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">DISHA Mentor</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[280px] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* College Data Cards */}
                    {message.hasCollegeData && message.collegeData && message.collegeData.length > 0 && (
                      <div className="mt-3 space-y-2 max-w-none">
                        <div className="text-xs font-medium mb-2">Found {message.collegeData.length} colleges:</div>
                        {message.collegeData.slice(0, 3).map((college, index) => 
                          renderCollegeCard(college, index)
                        )}
                        {message.collegeData.length > 3 && (
                          <div className="text-xs text-center opacity-75">
                            +{message.collegeData.length - 3} more colleges found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      DISHA Mentor is thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Quick suggestions:</div>
              <div className="space-y-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => handleSendMessage(suggestion.text)}
                  >
                    {suggestion.icon}
                    <span className="ml-2">{suggestion.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about colleges or careers..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};