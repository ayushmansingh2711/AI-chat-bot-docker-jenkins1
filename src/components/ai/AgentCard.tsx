import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Zap, Shield, Globe } from "lucide-react";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: "online" | "offline" | "busy";
  avatar: string;
  specialty: "reasoning" | "creative" | "analytical" | "general";
  onSelect: (agentId: string) => void;
  isSelected?: boolean;
}

const specialtyIcons = {
  reasoning: Brain,
  creative: Zap,
  analytical: Shield,
  general: Globe,
};

const specialtyColors = {
  reasoning: "bg-gradient-primary",
  creative: "bg-gradient-neural", 
  analytical: "bg-gradient-accent",
  general: "bg-primary",
};

export const AgentCard = ({ 
  id, 
  name, 
  description, 
  capabilities, 
  status, 
  avatar, 
  specialty,
  onSelect,
  isSelected = false
}: AgentCardProps) => {
  const SpecialtyIcon = specialtyIcons[specialty];

  return (
    <Card className={`relative p-6 transition-all duration-300 hover:shadow-ai cursor-pointer group ${
      isSelected 
        ? 'ring-2 ring-primary shadow-glow' 
        : 'hover:ring-1 hover:ring-primary/50'
    }`}
    onClick={() => onSelect(id)}>
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${
          status === 'online' ? 'bg-accent animate-pulse' :
          status === 'busy' ? 'bg-yellow-500' :
          'bg-gray-500'
        }`} />
      </div>

      {/* Agent Avatar & Icon */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarFallback className={`${specialtyColors[specialty]} text-white font-semibold`}>
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full flex items-center justify-center border-2 border-card">
            <SpecialtyIcon className="w-3 h-3 text-primary" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground capitalize">
            {specialty} Agent
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-2 mb-4">
        {capabilities.slice(0, 3).map((capability, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted transition-colors"
          >
            {capability}
          </Badge>
        ))}
        {capabilities.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-1">
            +{capabilities.length - 3} more
          </Badge>
        )}
      </div>

      {/* Select Button */}
      <Button 
        variant={isSelected ? "default" : "outline"} 
        size="sm" 
        className={`w-full transition-all ${
          isSelected 
            ? 'bg-gradient-primary border-0 shadow-ai' 
            : 'hover:bg-primary/10 hover:border-primary'
        }`}
      >
        {isSelected ? 'Active Agent' : 'Select Agent'}
      </Button>

      {/* Neural flow animation for selected agent */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent neural-flow" />
        </div>
      )}
    </Card>
  );
};