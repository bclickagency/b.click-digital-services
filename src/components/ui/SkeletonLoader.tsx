import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <motion.div
    className={cn(
      "bg-muted/50 rounded-lg animate-pulse",
      className
    )}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

export const CardSkeleton = () => (
  <div className="glass-card space-y-4">
    <Skeleton className="h-48 w-full rounded-2xl" />
    <div className="space-y-3 pt-4">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="section-padding">
    <div className="container mx-auto text-center space-y-6">
      <Skeleton className="h-16 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="flex justify-center gap-4 pt-4">
        <Skeleton className="h-12 w-32 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
      />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen">
    <HeroSkeleton />
    <div className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <GridSkeleton count={6} />
      </div>
    </div>
  </div>
);

export default Skeleton;
