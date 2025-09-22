import { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetail from "@/components/property/property-detail";
import { apolloClient } from "@/lib/apollo/client";
import { GET_PROPERTY } from "@/lib/graphql/queries";

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
  try {
    const { id } = await params;
    const { data } = await apolloClient.query({
      query: GET_PROPERTY,
      variables: { id },
      errorPolicy: "all",
    });

    const property = data?.property;

    if (!property) {
      notFound();
    }

    return <PropertyDetail property={property} />;
  } catch (error) {
    // Show mock data for development when GraphQL is not available
    const mockProperty = {
      id: params.id,
      title: "Beautiful Apartment in Downtown",
      buildingName: "Luxury Towers",
      type: "apartment" as any,
      rent: 120,
      rentDuration: "daily" as any,
      price: 120,
      vacant: true,
      mainImage:
        "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop&crop=center",
      contactInfo: "+1234567890",
      category: "housing" as any,
      description:
        "This stunning apartment offers breathtaking city views from every window. Located in the heart of downtown, you'll be steps away from the best restaurants, shops, and attractions the city has to offer. The space features modern amenities, high-end finishes, and a fully equipped kitchen perfect for preparing meals. Whether you're here for business or pleasure, this apartment provides the perfect home base for your stay.",
      userId: "user1",
      address: {
        id: "1",
        country: "United States",
        region: "California",
        city: "San Francisco",
        street: "123 Main St",
        zip: "94105",
        longitude: -122.4194,
        latitude: 37.7749,
      },
      images: [
        {
          id: "1",
          imageUrl:
            "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop&crop=center",
        },
        {
          id: "2",
          imageUrl:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center",
        },
        {
          id: "3",
          imageUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center",
        },
        {
          id: "4",
          imageUrl:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
        },
        {
          id: "5",
          imageUrl:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center",
        },
      ],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    return <PropertyDetail property={mockProperty} />;
  }
}
