"use client";

import { useEffect, useState } from "react";
import PropertyGrid from "../property/property-grid";
import PropertyCardSkeleton from "../property/property-card-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { getProperty } from "@/lib/data/client";
import Image from "next/image";

const PAGE_SIZE = 10;

const FavoritesPage = () => {
  const { loading, user } = useAuth();
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get current page's favorite IDs
  const favoriteIds = user?.favorites?.map((fav) => fav?.id) || [];
  const totalPages = Math.ceil(favoriteIds.length / PAGE_SIZE);
  const pagedFavoriteIds = favoriteIds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (!pagedFavoriteIds.length) {
      setProperties([]);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    Promise.all(pagedFavoriteIds.map((id) => getProperty(id as string)))
      .then((results) => setProperties(results))
      .catch((err) => {
        setIsError(true);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [user, page]);

  if (loading || isLoading) {
    return (
      <div className="m-4 md:m-0 flex flex-col">
        <h3 className="text-3xl font-semibold my-4">Favorites</h3>
        <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!user?.favorites?.length) {
    return (
      <div className="min-h-screen m-4 min-w-[70vw] max-w-7xl">
        <h3 className="text-3xl font-semibold my-8 place-self-start">
          Favorites
        </h3>
        <div className="h-full w-full flex flex-col items-center justify-center mt-20">
          <div className="relative mb-4 w-48 h-48">
            <Image
              src="/favorites-not-found.png"
              alt="favorites not found"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            You don&apos;t have any favorites
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Start adding properties to your favorites to view them here.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="m-4 min-h-screen">
      <h3 className="text-3xl font-semibold my-8">Favorites</h3>
      <PropertyGrid properties={properties} />
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
