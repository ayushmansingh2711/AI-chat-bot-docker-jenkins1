import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Zap, Brain, Code, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentId?: string;
  toolCalls?: ToolCall[];
  thinking?: string;
}

interface ToolCall {
  id: string;
  name: string;
  description: string;
  result: string;
  status: 'calling' | 'success' | 'error';
}

interface ChatInterfaceProps {
  selectedAgent: {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
  } | null;
  onSendMessage?: (message: string) => void;
}

const toolIcons = {
  web_search: Search,
  code_execution: Code,
  file_analysis: FileText,
  reasoning: Brain,
  default: Zap,
};

export const ChatInterface = ({ selectedAgent, onSendMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isTyping]);

  // Welcome message when agent is selected
  useEffect(() => {
    if (selectedAgent && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm ${selectedAgent.name}, your ${selectedAgent.specialty} specialist. I'm here to help you with advanced AI tasks. What can I assist you with today?`,
        timestamp: new Date(),
        agentId: selectedAgent.id,
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedAgent]);

  const typeMessage = async (text: string): Promise<void> => {
    setIsTyping(true);
    setCurrentTypingText('');
    
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 10));
      setCurrentTypingText(text.slice(0, i));
    }
    
    setIsTyping(false);
    setCurrentTypingText('');
  };

  const simulateAgentResponse = async (userMessage: string) => {
    if (!selectedAgent) return;

    setIsLoading(true);
    setIsThinking(true);

    // Enhanced thinking time based on message complexity
    const thinkingTime = userMessage.length > 100 ? 2000 : 1000;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    setIsThinking(false);

    // Smart tool calls based on message content and agent specialty
    const toolCalls: ToolCall[] = [];
    
    if (userMessage.toLowerCase().includes('search') || userMessage.toLowerCase().includes('find') || userMessage.toLowerCase().includes('lookup')) {
      toolCalls.push({
        id: '1',
        name: 'web_search',
        description: 'Searching the web for current information',
        result: `Found ${Math.floor(Math.random() * 50) + 10} relevant results`,
        status: 'success'
      });
    }

    if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('program') || userMessage.toLowerCase().includes('function')) {
      toolCalls.push({
        id: '2',
        name: 'code_execution',
        description: 'Analyzing and executing code logic',
        result: 'Code analysis completed successfully',
        status: 'success'
      });
    }

    if (userMessage.toLowerCase().includes('analyze') || userMessage.toLowerCase().includes('data') || selectedAgent.specialty === 'analytical') {
      toolCalls.push({
        id: '3',
        name: 'file_analysis',
        description: 'Processing and analyzing data patterns',
        result: 'Data analysis complete - insights generated',
        status: 'success'
      });
    }

    if (selectedAgent.specialty === 'reasoning' || userMessage.toLowerCase().includes('think') || userMessage.toLowerCase().includes('reason')) {
      toolCalls.push({
        id: '4',
        name: 'reasoning',
        description: 'Applying advanced reasoning capabilities',
        result: 'Complex multi-step analysis completed',
        status: 'success'
      });
    }

    // Simulate tool execution time
    if (toolCalls.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Generate contextual responses based on agent specialty and message content
    let responses: string[] = [];
    
    switch (selectedAgent.specialty) {
      case 'reasoning':
        responses = [
          "I've analyzed your request through multiple reasoning frameworks. Here's my systematic breakdown of the problem and potential solutions.",
          "After applying logical reasoning and evaluating various approaches, I can provide you with a comprehensive analysis.",
          "Let me walk you through my reasoning process step by step, considering all relevant factors and their implications.",
        ];
        break;
      case 'creative':
        responses = [
          "I've channeled my creative capabilities to generate some innovative ideas for your request. Let me share some exciting possibilities.",
          "Drawing from diverse creative approaches, I've developed several unique perspectives on your challenge.",
          "My creative analysis has uncovered some fascinating angles and fresh approaches to consider.",
        ];
        break;
      case 'analytical':
        responses = [
          "I've performed a thorough analytical review of the data patterns and identified key insights for your consideration.",
          "My analysis reveals several important trends and correlations that directly address your inquiry.",
          "After processing the data through various analytical frameworks, here are the significant findings.",
        ];
        break;
      default:
        responses = [
          "I've processed your request and have some helpful insights to share based on my general knowledge and capabilities.",
          "Let me provide you with a comprehensive response that addresses the key aspects of your question.",
          "I've analyzed your request and can offer several useful perspectives and recommendations.",
        ];
    }

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add contextual details based on message content
    let finalResponse = selectedResponse;
    if (userMessage.toLowerCase().includes('urgent') || userMessage.toLowerCase().includes('quick')) {
      finalResponse += " I've prioritized this request for immediate attention.";
    }
    if (userMessage.toLowerCase().includes('detailed') || userMessage.toLowerCase().includes('thorough')) {
      finalResponse += " I'll provide a comprehensive breakdown with all relevant details.";
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: finalResponse,
      timestamp: new Date(),
      agentId: selectedAgent.id,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      thinking: `Analyzing request context... Determining optimal approach for ${selectedAgent.specialty} processing... Activating specialized capabilities...`
    };

    // Type the message with realistic delay
    await typeMessage(finalResponse);
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    // Show success notification for tool usage
    if (toolCalls.length > 0) {
      toast({
        title: "Tools Executed",
        description: `${toolCalls.length} tool${toolCalls.length > 1 ? 's' : ''} executed successfully`,
        duration: 3000,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    onSendMessage?.(inputMessage);
    await simulateAgentResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ToolCallCard = ({ toolCall }: { toolCall: ToolCall }) => {
    const IconComponent = toolIcons[toolCall.name as keyof typeof toolIcons] || toolIcons.default;
    
    return (
      <Card className="p-3 bg-muted/30 border-l-4 border-l-neural">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-neural/20 rounded-lg flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-neural" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">
                {toolCall.name.replace('_', ' ').toUpperCase()}
              </span>
              <Badge 
                variant={toolCall.status === 'success' ? 'default' : 'destructive'}
                className="text-xs px-2 py-0.5"
              >
                {toolCall.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {toolCall.description}
            </p>
            <p className="text-xs text-accent font-medium">
              {toolCall.result}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  if (!selectedAgent) {
    return (
      <Card className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Agent Selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose an AI agent to start a conversation
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-primary text-white">
            {selectedAgent.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{selectedAgent.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {selectedAgent.specialty} Agent • Online
          </p>
        </div>
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-primary text-white text-sm">
                    {selectedAgent.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] space-y-2 ${
                message.role === 'user' ? 'order-1' : 'order-2'
              }`}>
                {/* Thinking indicator */}
                {message.thinking && message.role === 'assistant' && (
                  <Card className="p-3 bg-muted/20 border-dashed">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Brain className="w-3 h-3 ai-pulse" />
                      <span className="italic">{message.thinking}</span>
                    </div>
                  </Card>
                )}

                {/* Tool calls */}
                {message.toolCalls && (
                  <div className="space-y-2">
                    {message.toolCalls.map((toolCall) => (
                      <ToolCallCard key={toolCall.id} toolCall={toolCall} />
                    ))}
                  </div>
                )}

                {/* Message content */}
                <Card className={`p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground shadow-ai' 
                    : 'bg-card'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && currentTypingText && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {selectedAgent.avatar}
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-card max-w-[70%]">
                <p className="text-sm leading-relaxed">{currentTypingText}<span className="animate-pulse">|</span></p>
              </Card>
            </div>
          )}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {selectedAgent.avatar}
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-muted/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4 ai-pulse" />
                  <span className="italic">Thinking...</span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${selectedAgent.name}...`}
            disabled={isLoading}
            className="flex-1 transition-all focus:ring-2 focus:ring-primary bg-background/80 backdrop-blur-sm"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-primary hover:shadow-ai transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Press Enter to send • Shift+Enter for new line
          </p>
          {selectedAgent && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>{selectedAgent.name} is online</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};