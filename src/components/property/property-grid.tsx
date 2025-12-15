"use client";

import { Property } from "@/lib/graphql/types";
import PropertyCard from "./property-card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import PropertyCardSkeleton from "./property-card-skeleton";

interface PropertyGridProps {
  properties: Property[];
  favorites?: string[];
  endRef?: (node?: Element | null | undefined) => void;
  isFetchingNextPage?: boolean;
}

export default function PropertyGrid({
  properties,
  favorites = [],
  endRef,
  isFetchingNextPage = false,
}: PropertyGridProps) {
  const t = useTranslations("common");
  if (properties.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative mb-4 w-48 h-48">
          <Image
            src="/properties-not-found.webp"
            alt="properties not found"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {t("noPropertiesFound")}
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          {t("noPropertiesFoundDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 pb-4 lg:px-8 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
        />
      ))}
      <div ref={endRef}>{isFetchingNextPage && <PropertyCardSkeleton />}</div>
    </div>
  );
}
