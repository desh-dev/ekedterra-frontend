import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square rounded-xl" />
      
      {/* Content Skeleton */}
      <div className="space-y-2">
        {/* Title and Rating */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Type */}
        <Skeleton className="h-3 w-2/3" />
        
        {/* Dates */}
        <Skeleton className="h-3 w-1/2" />
        
        {/* Price */}
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}