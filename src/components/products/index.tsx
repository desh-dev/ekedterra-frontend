"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apollo/client";
import { GET_PRODUCTS_LISTINGS } from "@/lib/graphql/queries";
import { useAuth } from "@/providers/auth-provider";
import { Product } from "@/lib/graphql/types";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, Plus } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Loading from "../loading";
import CreateProductSheet from "./create-product-sheet";
import EditProductSheet from "./edit-product-sheet";

type ViewMode = "list" | "grid";

const ProductsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", user?.userId],
    queryFn: async () => {
      if (!user) return { products: [], total: 0 };

      const { data } = await apolloClient.query({
        query: GET_PRODUCTS_LISTINGS,
        variables: {
          paginationInput: { page: 0, limit: 100 },
          product: {
            userId: user.userId,
          },
        },
        fetchPolicy: "network-only",
      });

      return {
        //@ts-expect-error Object is possibly 'null'.
        products: data?.products?.data || [],
        //@ts-expect-error Object is possibly 'null'.
        total: data?.products?.total || 0,
      };
    },
    enabled: !!user,
  });

  const products: Product[] = data?.products || [];

  const t = useTranslations("products");
  const tCommon = useTranslations("common");

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditSheetOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateSheetOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t("yourProducts")}</h1>
            <p className="text-muted-foreground mt-1">
              {products?.length}{" "}
              {products?.length === 1
                ? tCommon("product")
                : tCommon("products")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow">
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            <span>{tCommon("filters")}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
                aria-label={t("listView")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
                aria-label={t("gridView")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
            {/* Create Button */}
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              {t("createProduct")}
            </Button>
          </div>
        </div>

        {/* Products Content */}
        {products?.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">{t("noProducts")}</h3>
              <p className="text-muted-foreground mt-2">
                {t("noProductsDescription")}
              </p>
              <Button onClick={handleCreateClick} className="mt-4">
                {t("createProduct")}
              </Button>
            </div>
          </Card>
        ) : viewMode === "list" ? (
          // List View
          <div className="space-y-2">
            {products?.map((product: Product) => (
              <Card
                key={product.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg capitalize">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      XAF {product.price.toFixed(2)}
                    </p>
                    {product.salePrice > 0 && (
                      <p className="text-xs text-green-600">
                        Sale: XAF {product.salePrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product: Product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-square relative bg-muted">
                  {product.mainImage ? (
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate capitalize">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </p>
                  <div className="mt-2">
                    <p className="text-lg font-bold">
                      XAF {product.price.toFixed(2)}
                    </p>
                    {product.salePrice > 0 && (
                      <p className="text-sm text-green-600">
                        Sale: XAF {product.salePrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Product Sheet */}
      {selectedProduct && (
        <EditProductSheet
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          product={selectedProduct}
          onSuccess={() => {
            refetch();
            setIsEditSheetOpen(false);
          }}
        />
      )}

      {/* Create Product Sheet */}
      <CreateProductSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSuccess={() => {
          refetch();
          setIsCreateSheetOpen(false);
        }}
      />
    </div>
  );
};

export default ProductsPage;
