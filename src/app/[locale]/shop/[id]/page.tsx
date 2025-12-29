import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProduct } from "@/lib/data/server";
import ProductDetail from "@/components/products/product-details";

interface ProductPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { locale, id } = await params;
    const product = await getProduct(id);

    if (!product) {
      return {
        title: locale === "en" ? "Product not found" : "Produit introuvable",
      };
    }

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        siteName: "Ekedterra",
        images: product.mainImage
          ? [
              {
                url: product.mainImage,
                width: 800,
                height: 600,
                alt: product.name,
              },
            ]
          : [],
        locale,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.shop" });

    return {
      title: t("title"),
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
