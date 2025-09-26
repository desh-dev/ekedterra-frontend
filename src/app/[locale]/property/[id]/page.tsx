import { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetail from "@/components/property/property-detail";
import { apolloClient } from "@/lib/apollo/client";
import { GET_PROPERTY } from "@/lib/graphql/queries";
import { getProperty } from "@/lib/data/server";

interface PropertyPageProps {
  params: {
    id: string;
    locale: string;
  };
}

// This enables SSR for SEO
export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  try {
    const { locale, id } = await params;
    const { data } = await apolloClient.query({
      query: GET_PROPERTY,
      variables: { id },
    });
    //@ts-ignore
    const property = data?.property;

    if (!property) {
      return {
        title: locale === "en" ? "Property not found" : "Propriété introuvable",
      };
    }

    return {
      title: `${property.title} - ${property.address?.city}, ${property.address?.country}`,
      description: property.description,
      openGraph: {
        title: property.title,
        description: property.description,
        siteName: "Ekedterra",
        images: property.mainImage
          ? [
              {
                url: property.mainImage,
                width: 800,
                height: 600,
                alt: property.title,
              },
            ]
          : [],
        locale,
      },
    };
  } catch (error) {
    const { locale } = await params;

    return {
      title: locale === "en" ? "Property Details" : "Détails de la propriété",
    };
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}
