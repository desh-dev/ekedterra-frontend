"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apollo/client";
import { GET_LISTINGS } from "@/lib/graphql/queries";
import { useAuth } from "@/providers/auth-provider";
import { Property } from "@/lib/graphql/types";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, Plus } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import EditPropertySheet from "./edit-property-sheet";
import CreatePropertySheet from "./create-property-sheet";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Loading from "../loading";

type ViewMode = "list" | "grid";

const ListingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["listings", user?.userId],
    queryFn: async () => {
      if (!user) return { properties: [], total: 0 };

      const { data } = await apolloClient.query({
        query: GET_LISTINGS,
        variables: {
          pagination: { page: 0, limit: 100 },
          property: {
            userId: user.userId,
          },
        },
        fetchPolicy: "network-only",
      });

      return {
        //@ts-ignore
        properties: data?.properties?.data || [],
        //@ts-ignore
        total: data?.properties?.total || 0,
      };
    },
    enabled: !!user,
  });

  const properties = data?.properties || [];

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsEditSheetOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateSheetOpen(true);
  };

  const getPendingBookingsCount = (property: Property) => {
    return property.bookings?.filter((b) => b.status === "pending").length || 0;
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
            <h1 className="text-3xl font-bold">Your listings</h1>
            <p className="text-muted-foreground mt-1">
              {properties.length}{" "}
              {properties.length === 1 ? "property" : "properties"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow">
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            <span>Filters</span>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
            {/* Create Button */}
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create listing
            </Button>
          </div>
        </div>

        {/* Listings Content */}
        {properties.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">No listings yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first property listing to start accepting bookings
              </p>
              <Button onClick={handleCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first listing
              </Button>
            </div>
          </Card>
        ) : viewMode === "list" ? (
          // List View
          <div className="space-y-2">
            {properties.map((property: Property) => (
              <Card
                key={property.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handlePropertyClick(property)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    {property.buildingName && (
                      <p className="text-sm text-muted-foreground">
                        {property.buildingName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {getPendingBookingsCount(property)} pending{" "}
                      {getPendingBookingsCount(property) === 1
                        ? "booking"
                        : "bookings"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property: Property) => (
              <Card
                key={property.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => handlePropertyClick(property)}
              >
                <div className="aspect-square relative bg-muted">
                  {property.mainImage ? (
                    <Image
                      src={property.mainImage}
                      alt={property.title}
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
                  <h3 className="font-semibold text-lg truncate">
                    {property.title}
                  </h3>
                  {property.buildingName && (
                    <p className="text-sm text-muted-foreground truncate">
                      {property.buildingName}
                    </p>
                  )}
                  <p className="text-sm font-medium mt-2">
                    {getPendingBookingsCount(property)} pending{" "}
                    {getPendingBookingsCount(property) === 1
                      ? "booking"
                      : "bookings"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Property Sheet */}
      {selectedProperty && (
        <EditPropertySheet
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          property={selectedProperty}
          onSuccess={() => {
            refetch();
            setIsEditSheetOpen(false);
          }}
        />
      )}

      {/* Create Property Sheet */}
      <CreatePropertySheet
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

export default ListingsPage;
