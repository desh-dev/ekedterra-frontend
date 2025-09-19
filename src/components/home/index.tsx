"use client";

import BottomNav from "../layout/bottom-nav";
import Footer from "../layout/footer";
import PropertyGrid from "../property/property-grid";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProperties } from "@/lib/data/client";
import { useInView } from "react-intersection-observer";
import Header from "../layout/header";
import { PropertyInput } from "@/lib/graphql/types";
import HomeSkeleton from "./skeleton";

const HomePage = () => {
  const [total, setTotal] = useState(0);
  const { ref, inView } = useInView();
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["properties"],
      queryFn: getProperties,
      initialPageParam: 0,
      // Remove setTotal from select!
      select: (data) => data,
      getNextPageParam: (lastPage, allPages) => {
        const totalPropertiesLoaded = allPages.reduce(
          (acc, page) => acc + page?.properties.length,
          0
        );

        if (totalPropertiesLoaded >= total) {
          return undefined;
        }
        return allPages?.length;
      },
    });

  useEffect(() => {
    // Set total only once when data is loaded
    if (data?.pages.length === 1 && data.pages[0]?.total) {
      setTotal(data.pages[0].total);
    }
  }, [data]);

  const properties = data?.pages.flatMap((page) => page?.properties) || [];
  const isPending = status === "pending";
  const isError = status === "error";

  const [searchFilters, setSearchFilters] = useState<PropertyInput>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (filters: PropertyInput) => {
    setSearchFilters(filters);
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...searchFilters, category: category as any };
    setSearchFilters(newFilters);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return isPending ? (
    <HomeSkeleton />
  ) : isError ? (
    <div>Error: {(error as Error).message}</div>
  ) : (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:pb-0">
        <PropertyGrid
          properties={properties}
          endRef={ref}
          onToggleFavorite={(propertyId) => {
            // TODO: Implement favorite toggle with GraphQL mutation
            console.log("Toggle favorite:", propertyId);
          }}
        />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default HomePage;
