"use client";

import { Property } from "@/lib/graphql/types";
import PropertyCard from "./property-card";
import PropertyCardSkeleton from "./property-card-skeleton";

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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">🏠</div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
