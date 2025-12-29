"use client";

import { Link } from "@/i18n/routing";
import { Product } from "@/lib/graphql/types";
import { locale } from "dayjs";
import React from "react";
import ProductImageGallery from "../shop/product-image-gallery";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ProductDetail {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetail) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");

  const baseUrl = "https://ekedterra.com"; // Hardcoded base URL
  const productPath = `/${locale}/shop/${product.id}`;
  const productUrl = `${baseUrl}${productPath}`;

  const agentPhone = "237672336436";
  const getDisplayPrice = (price: number, salePrice: number) => {
    const hasSale =
      typeof salePrice === "number" && salePrice > 0 && salePrice < price;

    return {
      hasSale,
      price,
      salePrice: hasSale ? salePrice : undefined,
    };
  };
  const { hasSale, price, salePrice } = getDisplayPrice(
    product.price,
    product.salePrice
  );

  const message = encodeURIComponent(
    t("whatsappMessage", {
      name: product.name,
      category: product.category,
      price: hasSale
        ? `${salePrice} (${t("sale")}) - ${t("was")} ${price}`
        : String(price),
      link: productUrl,
    })
  );

  const whatsappUrl = `https://wa.me/${String(agentPhone).replace(
    /[^0-9]/g,
    ""
  )}?text=${message}`;

  const galleryImages = product.images?.length
    ? [product.mainImage, ...product.images.map((i: any) => i.imageUrl)].filter(
        Boolean
      )
    : [product.mainImage].filter(Boolean);

  return (
    <div className="min-h-screen bg-white my-8 md:my-0">
      <main className="mx-auto w-full max-w-6xl px-4 py-5 md:px-8 md:py-8">
        <div className="mb-4">
          <Link
            href="/shop"
            className="text-sm text-muted-foreground hover:underline"
          >
            {t("backToShop")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          <ProductImageGallery images={galleryImages} title={product.name} />

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">
                {product.name}
              </h1>
              <div className="mt-1 text-sm text-muted-foreground capitalize">
                {product.category}
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              {hasSale ? (
                <>
                  <div className="text-2xl font-semibold">
                    {salePrice?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground line-through">
                    {price.toLocaleString()}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-semibold">
                  {price.toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {tCommon("stock")}: {product.stock}
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-sm font-medium mb-2">
                {t("productDescription")}
              </div>
              <div className="text-sm text-muted-foreground">
                {product.description}
              </div>
            </div>

            <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E]">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                {t("contactOnWhatsApp")}
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
