import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-[0_8px_40px_hsl(0_0%_0%/0.15),inset_0_1px_1px_hsl(0_0%_100%/0.1)] group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full group-[.toast]:shadow-[0_4px_15px_hsl(248_98%_60%/0.35)]",
          cancelButton: "group-[.toast]:bg-muted/60 group-[.toast]:backdrop-blur-xl group-[.toast]:text-muted-foreground group-[.toast]:rounded-full group-[.toast]:border group-[.toast]:border-border/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
