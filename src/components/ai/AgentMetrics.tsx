import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Clock, Target, TrendingUp, Cpu, BarChart3 } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: "primary" | "accent" | "neural" | "destructive";
  isAnimating?: boolean;
}

const MetricCard = ({ title, value, change, icon, color, isAnimating = false }: MetricCardProps) => {
  const colorClasses = {
    primary: "border-primary/20 bg-primary/5",
    accent: "border-accent/20 bg-accent/5", 
    neural: "border-neural/20 bg-neural/5",
    destructive: "border-destructive/20 bg-destructive/5"
  };

  const iconClasses = {
    primary: "text-primary",
    accent: "text-accent",
    neural: "text-neural", 
    destructive: "text-destructive"
  };

  return (
    <Card className={`p-4 ${colorClasses[color]} border-2 hover:shadow-ai transition-all ${isAnimating ? 'animate-scale-in' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-background/50 ${iconClasses[color]} ${isAnimating ? 'animate-floating' : ''}`}>
          {icon}
        </div>
        <Badge variant="outline" className="text-xs">
          {change}
        </Badge>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Card>
  );
};

interface AgentStatus {
  id: string;
  name: string;
  avatar: string;
  status: "active" | "idle" | "training";
  performance: number;
  tasks: number;
  uptime: string;
}

export const AgentMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeAgents: 3,
    tasksCompleted: 255,
    avgResponseTime: 1.2,
    successRate: 96.7
  });

  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    {
      id: "1",
      name: "GPT-4 Reasoning",
      avatar: "G4",
      status: "active",
      performance: 94,
      tasks: 127,
      uptime: "99.9%"
    },
    {
      id: "2", 
      name: "Claude Creative",
      avatar: "CC",
      status: "active",
      performance: 89,
      tasks: 83,
      uptime: "99.7%"
    },
    {
      id: "3",
      name: "Gemini Analyst", 
      avatar: "GA",
      status: "training",
      performance: 76,
      tasks: 45,
      uptime: "98.2%"
    }
  ]);

  const [activities, setActivities] = useState([
    { time: "2 min ago", action: "GPT-4 completed reasoning task", type: "success" },
    { time: "5 min ago", action: "Claude generated creative content", type: "info" },
    { time: "8 min ago", action: "Gemini started data analysis", type: "active" },
    { time: "12 min ago", action: "System optimization completed", type: "success" },
    { time: "15 min ago", action: "New agent configuration deployed", type: "info" }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics occasionally
      if (Math.random() < 0.1) {
        setMetrics(prev => ({
          activeAgents: prev.activeAgents,
          tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 3) + 1,
          avgResponseTime: Math.max(0.5, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
          successRate: Math.min(99.9, prev.successRate + (Math.random() - 0.5) * 0.5)
        }));
      }

      // Update agent performance
      if (Math.random() < 0.05) {
        setAgentStatuses(prev => prev.map(agent => ({
          ...agent,
          performance: Math.max(70, Math.min(100, agent.performance + (Math.random() - 0.5) * 3)),
          tasks: agent.tasks + Math.floor(Math.random() * 2)
        })));
      }

      // Add new activity occasionally
      if (Math.random() < 0.02) {
        const newActivities = [
          "Agent completed complex analysis",
          "Tool execution finished successfully", 
          "New conversation started",
          "Performance optimization applied",
          "System checkpoint created"
        ];
        
        const newActivity = {
          time: "Just now",
          action: newActivities[Math.floor(Math.random() * newActivities.length)],
          type: Math.random() > 0.7 ? "success" : "info"
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Agents"
          value={metrics.activeAgents.toString()}
          change="+1 today"
          icon={<Activity className="w-5 h-5" />}
          color="primary"
          isAnimating={true}
        />
        <MetricCard
          title="Tasks Completed"
          value={metrics.tasksCompleted.toString()}
          change="+12% this week"
          icon={<Target className="w-5 h-5" />}
          color="accent"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime.toFixed(1)}s`}
          change="-0.3s faster"
          icon={<Clock className="w-5 h-5" />}
          color="neural"
        />
        <MetricCard
          title="Success Rate"
          value={`${metrics.successRate.toFixed(1)}%`}
          change="+2.1% improved"
          icon={<TrendingUp className="w-5 h-5" />}
          color="primary"
        />
      </div>

      {/* Agent Performance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Agent Performance</h3>
        </div>
        
        <div className="space-y-4">
          {agentStatuses.map((agent) => (
            <div key={agent.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{agent.name}</p>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : agent.status === 'training' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{agent.tasks} tasks</span>
                    <span>{agent.uptime} uptime</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {agent.performance}%
                  </p>
                  <p className="text-xs text-muted-foreground">Performance</p>
                </div>
                <div className="w-20">
                  <Progress 
                    value={agent.performance} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Real-time Activity */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-neural ai-pulse" />
          <h3 className="text-lg font-semibold">Real-time Activity</h3>
        </div>
        
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50 transition-all ${
              activity.time === "Just now" ? 'animate-fade-in' : ''
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-accent' :
                activity.type === 'info' ? 'bg-neural' :
                'bg-primary'
              } ${activity.type === 'active' ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};