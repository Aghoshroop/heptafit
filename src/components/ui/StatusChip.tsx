import React from "react";
import { cn } from "@/lib/utils";

interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "success" | "warning" | "danger" | "info" | "neutral" | "active";
  size?: "sm" | "md";
  dot?: boolean;
  pulsing?: boolean;
}

export const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(
  ({ className, status, size = "sm", dot = true, pulsing = false, children, ...props }, ref) => {
    
    const variants = {
      success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      danger: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      info: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      active: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };

    const dotColors = {
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-rose-500",
      info: "bg-cyan-500",
      active: "bg-indigo-500",
      neutral: "bg-slate-500",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-0.5",
      md: "text-sm px-3 py-1",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm",
          variants[status],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2 w-2">
            {pulsing && (
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[status])}></span>
            )}
            <span className={cn("relative inline-flex rounded-full h-2 w-2", dotColors[status])}></span>
          </span>
        )}
        {children}
      </span>
    );
  }
);
StatusChip.displayName = "StatusChip";
