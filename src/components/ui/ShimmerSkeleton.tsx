import { cn } from '@/lib/utils';

interface ShimmerSkeletonProps {
  className?: string;
}

export const ShimmerSkeleton = ({ className }: ShimmerSkeletonProps) => (
  <div className={cn(
    "relative overflow-hidden bg-muted/50 rounded-lg",
    className
  )}>
    <div className="shimmer-effect absolute inset-0" />
  </div>
);

export const CardShimmer = () => (
  <div className="glass-card space-y-4">
    <ShimmerSkeleton className="h-48 w-full rounded-2xl" />
    <div className="space-y-3 pt-4">
      <div className="flex gap-4">
        <ShimmerSkeleton className="h-4 w-24" />
        <ShimmerSkeleton className="h-4 w-20" />
      </div>
      <ShimmerSkeleton className="h-6 w-3/4" />
      <ShimmerSkeleton className="h-4 w-full" />
      <ShimmerSkeleton className="h-4 w-2/3" />
      <ShimmerSkeleton className="h-4 w-24" />
    </div>
  </div>
);

export const HeroShimmer = () => (
  <div className="section-padding">
    <div className="container mx-auto text-center space-y-6">
      <ShimmerSkeleton className="h-16 w-3/4 mx-auto" />
      <ShimmerSkeleton className="h-6 w-1/2 mx-auto" />
      <div className="flex justify-center gap-4 pt-4">
        <ShimmerSkeleton className="h-12 w-32 rounded-xl" />
        <ShimmerSkeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  </div>
);

export const GridShimmer = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CardShimmer key={i} />
    ))}
  </div>
);

export const TextShimmer = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <ShimmerSkeleton
        key={i}
        className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
      />
    ))}
  </div>
);

export const PageShimmer = () => (
  <div className="min-h-screen">
    <HeroShimmer />
    <div className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <ShimmerSkeleton className="h-10 w-48 mx-auto mb-4" />
          <ShimmerSkeleton className="h-4 w-96 mx-auto" />
        </div>
        <GridShimmer count={6} />
      </div>
    </div>
  </div>
);

export default ShimmerSkeleton;
