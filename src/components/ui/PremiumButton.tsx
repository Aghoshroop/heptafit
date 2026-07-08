import React from "react";
import { Button, ButtonProps } from "@/components/ui/Button";

// PremiumButton is now a unified alias for Button in Design System V2
export const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button ref={ref} {...props} />;
  }
);
PremiumButton.displayName = "PremiumButton";
