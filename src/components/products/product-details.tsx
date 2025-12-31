"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Product } from "@/lib/graphql/types";
import { locale } from "dayjs";
import React from "react";
import ProductImageGallery from "../shop/product-image-gallery";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePreviousPath } from "@/hooks/usePreviousPath";
import { ShareIcon } from "@heroicons/react/24/outline";
import { ArrowLeft } from "lucide-react";
import Header from "../favorites/header";
import Footer from "../layout/footer";

interface ProductDetail {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetail) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const prevPath = usePreviousPath();

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

  const message = t("whatsappMessage", {
    name: product.name,
    category: product.category,
    price: hasSale
      ? `${salePrice} (${t("sale")}) - ${t("was")} ${price}`
      : String(price),
    link: productUrl,
  });

  const whatsappUrl = `https://wa.me/${String(agentPhone).replace(
    /[^0-9]/g,
    ""
  )}?text=${message}`;

  const galleryImages = product.images?.length
    ? [product.mainImage, ...product.images.map((i: any) => i.imageUrl)].filter(
        Boolean
      )
    : [product.mainImage].filter(Boolean);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };
  const handleBack = () => {
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-5 md:px-8 md:py-8">
        <div className="absolute top-0 left-0 w-full flex justify-between items-start px-4 pt-8 z-10">
          <button
            className="rounded-full p-2 bg-white border border-gray-200 shadow hover:bg-gray-100"
            onClick={handleBack}
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <button
              className="rounded-full p-2 bg-white border border-gray-200 shadow hover:bg-gray-100"
              onClick={handleShare}
              aria-label="Share"
            >
              <ShareIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mb-4 hidden md:block">
          <Link href="/shop" className="text-muted-foreground hover:underline">
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
                    XAF {salePrice?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground line-through">
                    XAF {price.toLocaleString()}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-semibold">
                  XAF {price.toLocaleString()}
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
      <Footer />
    </div>
  );
}
