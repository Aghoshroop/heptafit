import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "primary" | "destructive" | "danger" | "outline" | "secondary" | "ghost" | "link" | "glass"
  size?: "default" | "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
        case "default": 
          return "bg-gradient-to-r from-accent to-[#6366f1] hover:from-[#6366f1] hover:to-[#4f46e5] text-white shadow-lg shadow-accent/25 focus:ring-accent/50 border border-white/10 group overflow-hidden"
        case "destructive":
        case "danger": 
          return "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground focus:ring-destructive/50 border border-destructive/20"
        case "outline": 
          return "border-2 border-border text-foreground hover:border-primary hover:text-primary focus:ring-primary/50 bg-transparent"
        case "secondary": 
          return "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50"
        case "ghost": 
          return "text-foreground hover:bg-secondary/50 focus:ring-secondary/50 bg-transparent"
        case "link": 
          return "text-primary underline-offset-4 hover:underline"
        case "glass": 
          return "glass hover:bg-white/20 dark:hover:bg-black/50 text-foreground transition-all duration-300"
        default: 
          return "bg-primary text-primary-foreground hover:bg-primary/90"
      }
    }
    
    const getSizeClasses = () => {
      switch (size) {
        case "sm": return "text-xs px-3 py-1.5 h-8 gap-1.5 rounded-lg"
        case "md": 
        case "default": return "text-sm px-4 py-2 h-10 gap-2 rounded-xl"
        case "lg": return "text-base px-6 py-3 h-12 gap-2.5 rounded-xl"
        case "icon": return "p-2 h-10 w-10 rounded-xl"
        default: return "h-10 px-4 py-2 rounded-xl"
      }
    }

    const isDisabled = disabled || isLoading

    return (
      <Comp
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg active:scale-95",
          getVariantClasses(),
          getSizeClasses(),
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {(variant === "primary" || variant === "default") && !asChild && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
        )}
        
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0 mr-2">{leftIcon}</span>}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0 ml-2">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
