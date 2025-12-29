"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import BottomNav from "../layout/bottom-nav";
import Footer from "../layout/footer";
import { apolloClient } from "@/lib/apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import type {
  PaginationInput,
  Product,
  ProductCategory,
  ProductInput,
} from "@/lib/graphql/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import Header from "../favorites/header";

const DEFAULT_LIMIT = 12;

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "transport", label: "Transport" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "home", label: "Home" },
  { value: "health", label: "Health" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "education", label: "Education" },
  { value: "clothing", label: "Clothing" },
  { value: "toys", label: "Toys" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty" },
  { value: "sports", label: "Sports" },
  { value: "service", label: "Service" },
  { value: "music", label: "Music" },
  { value: "gaming", label: "Gaming" },
  { value: "other", label: "Other" },
];

type SortKey = "name" | "price_low" | "price_high";

function formatCategory(category?: ProductCategory) {
  if (!category) return "";
  const found = CATEGORY_OPTIONS.find((c) => c.value === category);
  return found?.label ?? category;
}

function getDisplayPrice(product: Product) {
  const hasSale =
    typeof product.salePrice === "number" &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  return {
    hasSale,
    price: product.price,
    salePrice: hasSale ? product.salePrice : undefined,
  };
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

const ShopPage = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [sort, setSort] = useState<SortKey>("name");

  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");

  const [categoryDraft, setCategoryDraft] = useState<ProductCategory | "all">(
    "all"
  );
  const [category, setCategory] = useState<ProductCategory | "all">("all");

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (filtersOpen) {
      setCategoryDraft(category);
    }
  }, [filtersOpen, category]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchDraft.trim());
    }, 350);
    return () => window.clearTimeout(handle);
  }, [searchDraft]);

  useEffect(() => {
    setPage(0);
  }, [search, category, limit]);

  const productInput: ProductInput = useMemo(() => {
    const input: ProductInput = {};
    if (search) input.name = search;
    if (category !== "all") input.category = category;
    return input;
  }, [search, category]);

  const paginationInput: PaginationInput = useMemo(
    () => ({ page, limit }),
    [page, limit]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["shop-products", productInput, paginationInput],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: {
          product: productInput,
          paginationInput,
        },
        fetchPolicy: "network-only",
      });

      return {
        //@ts-expect-error Object is possibly 'null'.
        products: (data?.products?.data || []) as Product[],
        //@ts-expect-error Object is possibly 'null'.
        total: (data?.products?.total || 0) as number,
      };
    },
  });

  const products = data?.products || [];
  const total = data?.total ?? 0;

  const showSkeletons = isLoading || isFetching;

  const sortedProducts = useMemo(() => {
    const items = [...products];
    if (sort === "name") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price_low") {
      items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === "price_high") {
      items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    }
    return items;
  }, [products, sort]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const endCount = Math.min((page + 1) * limit, total);

  return (
    <div className="flex flex-col safe-area-top">
      <Header />
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8 md:py-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                placeholder="Search products..."
                className="h-11 pl-9"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="w-full">
                <Select
                  value={sort}
                  onValueChange={(v) => setSort(v as SortKey)}
                >
                  <SelectTrigger className="h-11 w-full justify-between">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-11 w-full md:w-auto">
                    <SlidersHorizontal className="mr-2 size-4" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Category</div>
                    <Select
                      value={categoryDraft}
                      onValueChange={(v) =>
                        setCategoryDraft(v as ProductCategory | "all")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {CATEGORY_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCategoryDraft("all");
                        setCategory("all");
                        setFiltersOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={() => {
                        setCategory(categoryDraft);
                        setFiltersOpen(false);
                      }}
                    >
                      Apply
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {endCount} of {total} products
                {isFetching && !isLoading ? " (updating...)" : ""}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Show:</div>
                <Select
                  value={String(limit)}
                  onValueChange={(v) => setLimit(Number(v))}
                >
                  <SelectTrigger className="h-9 w-[90px] justify-between">
                    <SelectValue placeholder={String(DEFAULT_LIMIT)} />
                  </SelectTrigger>
                  <SelectContent>
                    {[6, 12, 24, 48].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">per page</div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {showSkeletons
              ? Array.from({ length: limit }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))
              : sortedProducts.map((product) => {
                  const { hasSale, price, salePrice } =
                    getDisplayPrice(product);
                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}`}
                      className="group rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-44 w-full bg-gray-100">
                        {hasSale && (
                          <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">
                            SALE
                          </div>
                        )}
                        {product.mainImage ? (
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover group-hover:scale-[1.02] transition-transform"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">
                          {formatCategory(product.category)}
                        </div>
                        <div className="font-semibold leading-tight line-clamp-1">
                          {product.name}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </div>

                        <div className="mt-3 flex items-baseline gap-2">
                          {salePrice ? (
                            <>
                              <div className="font-semibold">
                                {salePrice.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground line-through">
                                {price.toLocaleString()}
                              </div>
                            </>
                          ) : (
                            <div className="font-semibold">
                              {price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={page <= 0 || isLoading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </Button>
            <div className="text-sm text-muted-foreground px-2">
              Page {Math.min(page + 1, totalPages)} of {totalPages}
            </div>
            <Button
              variant="outline"
              disabled={page >= totalPages - 1 || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ShopPage;
