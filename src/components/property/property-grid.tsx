"use client";

import { Property } from "@/lib/graphql/types";
import PropertyCard from "./property-card";
import PropertyCardSkeleton from "./property-card-skeleton";
import Image from "next/image";

interface PropertyGridProps {
  properties: Property[];
  favorites?: string[];
  endRef: (node?: Element | null | undefined) => void;
  onToggleFavorite?: (propertyId: string) => void;
}

export default function PropertyGrid({
  properties,
  favorites = [],
  endRef,
  onToggleFavorite,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-0">
        <div className="relative mb-4 w-48 h-48">
          <Image
            src="/properties-not-found.png"
            alt="properties not found"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Try adjusting your search criteria or browse all available properties.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      <div ref={endRef}></div>
    </div>
  );
}
