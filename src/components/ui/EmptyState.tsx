import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon, title, description, action, className, compact = false }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center rounded-2xl bg-white/5 border border-white/5 shadow-inner transition-all",
      compact ? "p-6 min-h-[150px]" : "p-10 min-h-[250px]",
      className
    )}>
      <div className={cn(
        "bg-white/5 rounded-full text-muted-foreground mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]",
        compact ? "p-3" : "p-5"
      )}>
        {icon || <FolderOpen size={compact ? 24 : 32} />}
      </div>
      <h3 className={cn("font-bold text-foreground mb-1", compact ? "text-base" : "text-lg")}>{title}</h3>
      <p className={cn("text-muted-foreground max-w-sm mb-6", compact ? "text-xs" : "text-sm")}>{description}</p>
      
      {action && (
        <Button onClick={action.onClick} variant="default" size={compact ? "sm" : "default"}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
