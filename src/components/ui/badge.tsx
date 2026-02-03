import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-[0_2px_8px_hsl(248_98%_60%/0.3)] hover:shadow-[0_4px_12px_hsl(248_98%_60%/0.4)]",
        secondary: "border-border/50 bg-secondary/60 text-secondary-foreground shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-[0_2px_8px_hsl(0_84%_60%/0.3)]",
        outline: "text-foreground border-border/50 bg-background/60 backdrop-blur-xl",
        glass: "border-border/30 bg-background/50 backdrop-blur-xl text-foreground shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
