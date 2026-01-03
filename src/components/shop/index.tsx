"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Check, Link2, Search, SlidersHorizontal } from "lucide-react";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

const DEFAULT_LIMIT = 12;

const CATEGORY_OPTIONS: ProductCategory[] = [
  "transport",
  "electronics",
  "furniture",
  "home",
  "health",
  "food",
  "travel",
  "education",
  "clothing",
  "toys",
  "fashion",
  "beauty",
  "sports",
  "service",
  "music",
  "gaming",
  "other",
];

type SortKey = "name" | "price_low" | "price_high";

type LinkPreviewData = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

function isAllowedAmazonLink(raw: string) {
  const url = raw.trim();
  return (
    url.startsWith("https://amazon.com") ||
    url.startsWith("https://a.co") ||
    url.startsWith("https://www.amazon.com") ||
    url.startsWith("https://www.a.co")
  );
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
  const tShop = useTranslations("shopPage");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navigation");
  const [activeTab, setActiveTabState] = useState<"eshop" | "amazon">("eshop");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Update URL when tab changes
  const setActiveTab = useCallback(
    (tab: "eshop" | "amazon") => {
      setActiveTabState(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Initialize tab from URL on mount
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "amazon" && activeTab !== "amazon") {
      setActiveTabState("amazon");
    } else if (tab === "eshop" && activeTab !== "eshop") {
      setActiveTabState("eshop");
    }
  }, [searchParams, activeTab]);

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

  const [linkDraft, setLinkDraft] = useState("");
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [linkPreviewLoading, setLinkPreviewLoading] = useState(false);
  const [linkPreviewError, setLinkPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!linkDraft.trim()) {
      setLinkPreview(null);
      setLinkPreviewError(null);
    }
  }, [linkDraft]);

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
    enabled: activeTab === "eshop",
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

  const products = useMemo(() => data?.products || [], [data]);
  const total = useMemo(() => data?.total || 0, [data]);

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

  const agentPhone = "237672336436";
  const whatsappCheckoutMessage = useMemo(() => {
    const link = linkDraft.trim();
    const lines: string[] = [tShop("amazon.whatsapp.intro"), ""];
    if (linkPreview?.title) {
      lines.push(
        tShop("amazon.whatsapp.productLine", { title: linkPreview.title })
      );
    }
    if (link) {
      lines.push(tShop("amazon.whatsapp.linkLine", { link }));
    }
    return lines.join("\n");
  }, [linkDraft, linkPreview?.title, tShop]);

  const whatsappCheckoutUrl = useMemo(() => {
    return `https://wa.me/${String(agentPhone).replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(whatsappCheckoutMessage)}`;
  }, [agentPhone, whatsappCheckoutMessage]);

  const isValidAmazonLink = useMemo(
    () => (linkDraft.trim() ? isAllowedAmazonLink(linkDraft) : false),
    [linkDraft]
  );

  const handleFetchLinkPreview = async () => {
    const q = linkDraft.trim();
    setLinkPreviewError(null);
    setLinkPreview(null);

    if (!q) {
      return;
    }

    if (!isAllowedAmazonLink(q)) {
      setLinkPreviewError(
        tShop("amazon.invalidLinkPlain", {
          amazon1: "https://amazon.com",
          amazon2: "https://a.co",
        })
      );
      return;
    }

    setLinkPreviewLoading(true);
    try {
      const res = await fetch(`/api/linkpreview?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as any;

      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : tShop("amazon.errors.failedToFetchPreview")
        );
      }

      setLinkPreview(data as LinkPreviewData);
    } catch (e) {
      setLinkPreviewError(
        e instanceof Error
          ? e.message
          : tShop("amazon.errors.failedToFetchPreview")
      );
    } finally {
      setLinkPreviewLoading(false);
    }
  };

  const preview = linkPreview;

  return (
    <div className="flex flex-col safe-area-top">
      <Header />
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8 md:py-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "eshop" | "amazon")}
          >
            <TabsList className="w-[30vw] h-[5vh] md:h-[3rem] md:w-[10rem] place-self-center">
              <TabsTrigger value="eshop" className="flex-1 relative">
                <Image
                  src="https://files.edgestore.dev/7muc2z5blt7yqz78/assets/_public/e_shop.webp"
                  alt={tNav("shop")}
                  fill
                  className="object-contain scale-150"
                />
              </TabsTrigger>
              <TabsTrigger value="amazon" className="flex-1 relative">
                <Image
                  src="https://files.edgestore.dev/7muc2z5blt7yqz78/assets/_public/amazon_logo.webp"
                  alt={tShop("amazon.logoAlt")}
                  fill
                  className="object-contain scale-150 mt-1"
                />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="eshop" className="mt-4">
              <div className="space-y-3 md:mx-0 md:px-0 md:max-w-5xl md:place-self-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    placeholder={tShop("searchProductsPlaceholder")}
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
                        <SelectValue placeholder={tShop("sort.label")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">
                          {tShop("sort.name")}
                        </SelectItem>
                        <SelectItem value="price_low">
                          {tShop("sort.priceLowToHigh")}
                        </SelectItem>
                        <SelectItem value="price_high">
                          {tShop("sort.priceHighToLow")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 w-full md:w-auto"
                      >
                        <SlidersHorizontal className="mr-2 size-4" />
                        {tCommon("filters")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{tCommon("filters")}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          {tShop("filterDialog.category")}
                        </div>
                        <Select
                          value={categoryDraft}
                          onValueChange={(v) =>
                            setCategoryDraft(v as ProductCategory | "all")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={tShop("filterDialog.allCategories")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {tCommon("all")}
                            </SelectItem>
                            {CATEGORY_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c}>
                                {tCommon(c)}
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
                          {tCommon("clear")}
                        </Button>
                        <Button
                          onClick={() => {
                            setCategory(categoryDraft);
                            setFiltersOpen(false);
                          }}
                        >
                          {tCommon("apply")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-muted-foreground">
                    {tShop("results.showing", { endCount, total })}
                    {isFetching && !isLoading
                      ? ` ${tShop("results.updating")}`
                      : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {tShop("results.show")}
                    </div>
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
                    <div className="text-sm text-muted-foreground">
                      {tShop("results.perPage")}
                    </div>
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
                                {tShop("product.saleBadge")}
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
                                {tShop("product.noImage")}
                              </div>
                            )}
                          </div>

                          <div className="p-3">
                            <div className="text-xs text-muted-foreground mb-1">
                              {product.category
                                ? tCommon(product.category)
                                : ""}
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
                                    XAF {salePrice.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground line-through">
                                    {price.toLocaleString()}
                                  </div>
                                </>
                              ) : (
                                <div className="font-semibold">
                                  XAF {price.toLocaleString()}
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
                  {tCommon("prev")}
                </Button>
                <div className="text-sm text-muted-foreground px-2">
                  {tShop("pagination.pageOf", {
                    current: Math.min(page + 1, totalPages),
                    total: totalPages,
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={page >= totalPages - 1 || isLoading}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                >
                  {tCommon("next")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="amazon" className="mt-4">
              <div className="flex min-h-[60vh] flex-col gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {tShop("amazon.label")}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={linkDraft}
                      onChange={(e) => {
                        setLinkDraft(e.target.value);
                        setLinkPreview(null);
                        setLinkPreviewError(null);
                      }}
                      placeholder={tShop("amazon.inputPlaceholder")}
                      className="h-11"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFetchLinkPreview();
                        }
                      }}
                    />
                    <Button
                      className="h-11"
                      onClick={handleFetchLinkPreview}
                      disabled={
                        linkPreviewLoading ||
                        !linkDraft.trim() ||
                        !isValidAmazonLink
                      }
                    >
                      {tShop("amazon.previewButton")}
                    </Button>
                  </div>
                  {linkDraft.trim() && !isValidAmazonLink ? (
                    <div className="text-sm text-red-600">
                      {tShop.rich("amazon.invalidLink", {
                        amazon1: (chunks) => (
                          <span className="font-medium">{chunks}</span>
                        ),
                        amazon2: (chunks) => (
                          <span className="font-medium">{chunks}</span>
                        ),
                      })}
                    </div>
                  ) : null}
                  {linkPreviewError ? (
                    <div className="text-sm text-red-600">
                      {linkPreviewError}
                    </div>
                  ) : null}
                </div>

                <div className="flex-1">
                  {!linkDraft.trim() && !linkPreviewLoading ? (
                    <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Link2 className="size-6 text-muted-foreground" />
                      </div>
                      <div className="max-w-md">
                        <div className="font-semibold">
                          {tShop("amazon.empty.title")}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {tShop("amazon.empty.description")}
                        </div>
                      </div>
                    </div>
                  ) : linkPreviewLoading ? (
                    <div className="rounded-xl border bg-white overflow-hidden">
                      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[160px_1fr]">
                        <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-100 md:h-36">
                          <Skeleton className="h-full w-full" />
                        </div>
                        <div className="min-w-0 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <div className="pt-1">
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : preview ? (
                    <div className="rounded-xl border bg-white overflow-hidden">
                      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[160px_1fr]">
                        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 md:h-36">
                          {preview.image ? (
                            <Image
                              src={preview.image}
                              alt={
                                preview.title ||
                                tShop("amazon.preview.fallbackTitle")
                              }
                              className="h-full w-full object-cover"
                              loading="lazy"
                              fill
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                              {tShop("amazon.preview.noImage")}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg font-semibold leading-snug">
                            {preview.title ||
                              tShop("amazon.preview.fallbackTitle")}
                          </div>
                          {preview.description ? (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {preview.description}
                            </div>
                          ) : null}
                          <div className="mt-3 text-sm">
                            <a
                              href={linkDraft.trim()}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {preview.url || linkDraft.trim()}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Link2 className="size-6 text-muted-foreground" />
                      </div>
                      <div className="max-w-md">
                        <div className="font-semibold">
                          {tShop("amazon.ready.title")}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {tShop("amazon.ready.description")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto md:max-w-[400px]">
                  <div className="mb-4 rounded-xl border bg-white p-4">
                    <div className="text-sm font-medium">
                      {tShop("amazon.benefits.title")}
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 text-emerald-600" />
                        <div>{tShop("amazon.benefits.doorstepDelivery")}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 text-emerald-600" />
                        <div>{tShop("amazon.benefits.fractionShipping")}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 text-emerald-600" />
                        <div>{tShop("amazon.benefits.fragileCare")}</div>
                      </div>
                    </div>
                  </div>

                  {linkDraft.trim() && isValidAmazonLink ? (
                    <Button
                      asChild
                      className="w-full bg-[#25D366] hover:bg-[#128C7E]"
                    >
                      <a
                        href={whatsappCheckoutUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {tShop("amazon.checkoutButton")}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-[#25D366] hover:bg-[#128C7E]"
                    >
                      {tShop("amazon.checkoutButton")}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ShopPage;
