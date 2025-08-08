import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from './AgentCard';
import { ChatInterface } from './ChatInterface';
import { AgentMetrics } from './AgentMetrics';
import { Brain, MessageSquare, BarChart3, Settings, Zap } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: "online" | "offline" | "busy";
  avatar: string;
  specialty: "reasoning" | "creative" | "analytical" | "general";
}

const agents: Agent[] = [
  {
    id: "gpt4-reasoning",
    name: "GPT-4 Reasoning",
    description: "Advanced reasoning and problem-solving capabilities with deep analytical thinking.",
    capabilities: ["Complex Reasoning", "Mathematical Analysis", "Logical Deduction", "Strategic Planning", "Research Synthesis"],
    status: "online",
    avatar: "G4",
    specialty: "reasoning"
  },
  {
    id: "claude-creative",
    name: "Claude Creative",
    description: "Creative content generation and artistic collaboration with human-like understanding.",
    capabilities: ["Creative Writing", "Content Strategy", "Visual Concepts", "Storytelling", "Brand Messaging"],
    status: "online", 
    avatar: "CC",
    specialty: "creative"
  },
  {
    id: "gemini-analyst",
    name: "Gemini Analyst",
    description: "Data analysis and pattern recognition specialist for complex datasets.",
    capabilities: ["Data Analysis", "Pattern Recognition", "Statistical Modeling", "Trend Forecasting", "Report Generation"],
    status: "busy",
    avatar: "GA", 
    specialty: "analytical"
  },
  {
    id: "universal-assistant",
    name: "Universal Assistant",
    description: "General-purpose AI assistant for everyday tasks and general inquiries.",
    capabilities: ["General Knowledge", "Task Automation", "Information Retrieval", "Basic Analysis", "Conversation"],
    status: "online",
    avatar: "UA",
    specialty: "general"
  }
];

export const AdvancedAgenticAI = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState("chat");

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    setSelectedAgent(agent || null);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-ai animate-floating">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-neural to-accent bg-clip-text text-transparent">
              Advanced Agentic AI
            </h1>
            <div className="w-12 h-12 bg-gradient-neural rounded-xl flex items-center justify-center shadow-neural animate-floating" style={{ animationDelay: '1s' }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the future of AI interaction with specialized agents, advanced reasoning, and seamless tool integration.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors">
              <Zap className="w-3 h-3 mr-1" />
              Multi-Agent System
            </Badge>
            <Badge variant="outline" className="bg-neural/10 text-neural border-neural/20 hover:bg-neural/20 transition-colors">
              <Brain className="w-3 h-3 mr-1" />
              Advanced Reasoning
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
              <Settings className="w-3 h-3 mr-1" />
              Tool Integration
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Brain className="w-4 h-4 mr-2" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Agent Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    Available Agents
                  </h3>
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        onClick={() => handleAgentSelect(agent.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-ai ${
                          selectedAgent?.id === agent.id
                            ? 'bg-primary/10 border-primary shadow-glow'
                            : 'bg-card hover:bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                            {agent.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{agent.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{agent.specialty}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'online' ? 'bg-accent' :
                            agent.status === 'busy' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <ChatInterface selectedAgent={selectedAgent} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  {...agent}
                  onSelect={handleAgentSelect}
                  isSelected={selectedAgent?.id === agent.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <AgentMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};