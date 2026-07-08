import React from "react";
import { Card } from "@/components/ui/Card";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "intense" | "minimal";
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hoverEffect = false, children, ...props }, ref) => {
    return (
      <Card 
        ref={ref} 
        glass={true} 
        hoverEffect={hoverEffect} 
        className={className} 
        {...props}
      >
        {children}
      </Card>
    );
  }
);
GlassCard.displayName = "GlassCard";
