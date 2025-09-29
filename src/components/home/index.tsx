"use client";

import BottomNav from "../layout/bottom-nav";
import Footer from "../layout/footer";
import PropertyGrid from "../property/property-grid";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Header from "./header";
import { PropertyInput } from "@/lib/graphql/types";
import HomeSkeleton from "./skeleton";
import { apolloClient } from "@/lib/apollo/client";
import { GET_PROPERTIES } from "@/lib/graphql/queries";
import PropertyCardSkeleton from "../property/property-card-skeleton";
import { useAppStore } from "@/providers/category-store-provider";
import { useAuth } from "@/providers/auth-provider";

const LIMIT = 10;

const HomePage = () => {
  const [total, setTotal] = useState(0);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const { ref, inView } = useInView();
  const { category } = useAppStore((state) => state);
  const { loading, user } = useAuth();
  const getProperties = async ({
    pageParam,
  }: {
    pageParam: number;
    property?: PropertyInput;
  }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PROPERTIES,
        variables: {
          pagination: { page: pageParam, limit: LIMIT },
          property: { category },
        },
      });

      //@ts-ignore
      const properties = data?.properties?.data;
      //@ts-ignore
      const total = data?.properties?.total;

      return { properties, total };
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, status, fetchNextPage, refetch, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["properties"],
      queryFn: getProperties,
      initialPageParam: 0,
      // Remove setTotal from select!
      select: (data) => data,
      getNextPageParam: (lastPage, allPages) => {
        const totalPropertiesLoaded = allPages.reduce(
          (acc, page) => acc + page?.properties?.length,
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
    if (data?.pages?.length === 1 && data.pages[0]?.total) {
      setTotal(data.pages[0].total);
    }
  }, [data]);

  const properties = data?.pages.flatMap((page) => page?.properties) || [];
  const isPending = status === "pending";
  const isError = status === "error";

  useEffect(() => {
    setIsCategoryLoading(true);
    refetch().finally(() => setIsCategoryLoading(false));
  }, [category]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return isPending || loading ? (
    <HomeSkeleton />
  ) : isError ? (
    <div>Error: {(error as Error).message}</div>
  ) : (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:pb-0">
        {isCategoryLoading ? (
          <div className="md:mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <PropertyGrid
            properties={properties}
            endRef={ref}
            //@ts-ignore
            favorites={user?.favorites?.map((favorite) => favorite?.id) || []}
          />
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default HomePage;
