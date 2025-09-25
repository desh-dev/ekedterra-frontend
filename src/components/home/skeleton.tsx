import React from "react";
import PropertyCardSkeleton from "../property/property-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import BottomNav from "../layout/bottom-nav";
import Image from "next/image";
import LanguageSwitcher from "../language-switcher";
import { Button } from "../ui/button";
import { Bars3Icon } from "@heroicons/react/24/outline";

const HomeSkeleton = () => {
  return (
    <div>
      {/* Mobile Skeleton */}
      <div className="mx-6 my-4 flex md:hidden items-center justify-center h-16 bg-card border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex gap-2 w-full flex justify-center items-center">
          <Search size={16} />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex md:hidden mb-4 justify-center items-center mb-2 gap-16">
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

      {/* Desktop Skeleton */}
      <div className="hidden md:flex flex-col border-b max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div>
            <div className="flex place-self-center hidden lg:block">
              <Image src="/logo-lg.png" alt="Logo" width={140} height={80} />
            </div>
            <div className="flex place-self-center hidden md:block lg:hidden">
              <Image src="/logo.png" alt="Logo" width={120} height={60} />
            </div>
          </div>
          <div className="flex mb-4 justify-center items-center mb-2 gap-6">
            <div className="flex justify-center items-center gap-2">
              <Skeleton className="aspect-circle rounded-full w-20 h-10" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex justify-center items-center gap-2">
              <Skeleton className="aspect-circle rounded-full w-20 h-10" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex justify-center items-center gap-2">
              <Skeleton className="aspect-circle rounded-full w-20 h-10" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
          <div className="space-x-2 flex items-center">
            <div className="flex space-x-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow">
              Shop
            </div>
            <LanguageSwitcher />
            <button className="flex items-center space-x-2 border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow">
              <Bars3Icon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="mx-6 my-4 flex items-center justify-between h-16 bg-card border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-full flex gap-2 flex justify-between items-center">
            <div className="w-full flex flex-col pl-6 py-2 gap-2 border-r">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="w-full flex flex-col pl-6 py-2 gap-2 border-r">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="w-full flex flex-col pl-6 py-2 gap-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="pr-4">
              <Button
                size="icon"
                className="rounded-full w-8 h-8 bg-primary hover:bg-primary/90"
              >
                <Search className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </div>
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
