import React from "react";
import PropertyCardSkeleton from "../property/property-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import BottomNav from "../layout/bottom-nav";

const HomeSkeleton = () => {
  return (
    <div>
      {/* Mobile Skeleton */}
      <div className="mx-6 my-4 flex items-center justify-center h-16 bg-card border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex gap-2 w-full flex justify-center items-center">
          <Search size={16} />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex mb-4 justify-center items-center mb-2 gap-16">
        <div className="flex flex-col justify-center gap-2">
          <Skeleton className="aspect-circle rounded-full w-12 h-12" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Skeleton className="aspect-circle rounded-full w-12 h-12" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Skeleton className="aspect-circle rounded-full w-12 h-12" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="m-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default HomeSkeleton;
