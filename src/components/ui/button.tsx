import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_15px_hsl(248_98%_60%/0.35),inset_0_1px_1px_hsl(0_0%_100%/0.2)] hover:shadow-[0_8px_25px_hsl(248_98%_60%/0.45),inset_0_1px_1px_hsl(0_0%_100%/0.2)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_4px_15px_hsl(0_84%_60%/0.35)] hover:shadow-[0_8px_25px_hsl(0_84%_60%/0.45)] hover:-translate-y-0.5",
        outline: "border border-border/50 bg-background/60 backdrop-blur-xl hover:bg-accent/50 hover:border-primary/30 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]",
        secondary: "bg-secondary/60 text-secondary-foreground backdrop-blur-xl border border-border/30 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1),inset_0_0_20px_hsl(248_98%_60%/0.05)] hover:bg-secondary/80 hover:-translate-y-0.5",
        ghost: "hover:bg-accent/50 hover:backdrop-blur-xl",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-background/60 backdrop-blur-xl border border-border/30 text-foreground shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.2),0_4px_20px_hsl(0_0%_0%/0.08)] hover:bg-background/80 hover:shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.2),0_8px_30px_hsl(0_0%_0%/0.12)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
