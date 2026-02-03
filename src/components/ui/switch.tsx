import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300",
      "bg-muted/60 backdrop-blur-sm shadow-[inset_0_2px_4px_hsl(0_0%_0%/0.1)]",
      "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_2px_10px_hsl(248_98%_60%/0.3),inset_0_2px_4px_hsl(0_0%_0%/0.1)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 transition-all duration-300",
        "shadow-[0_2px_8px_hsl(0_0%_0%/0.15),inset_0_1px_1px_hsl(0_0%_100%/0.5)]",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
