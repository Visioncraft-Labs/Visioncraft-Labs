// client/src/components/ui/tooltip.tsx
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ sideOffset = 6, style, ...props }, ref) => {
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      style={{
        padding: "6px 8px",
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(0,0,0,0.85)",
        color: "white",
        fontSize: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        ...style,
      }}
      {...props}
    />
  );
});
TooltipContent.displayName = "TooltipContent";
