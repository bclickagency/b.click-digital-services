import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-muted/60 backdrop-blur-sm shadow-[inset_0_1px_3px_hsl(0_0%_0%/0.1)]">
      <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full shadow-[0_0_8px_hsl(248_98%_60%/0.4)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-300 shadow-[0_2px_8px_hsl(0_0%_0%/0.15),inset_0_1px_1px_hsl(0_0%_100%/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-110 hover:shadow-[0_4px_12px_hsl(248_98%_60%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.5)] disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
