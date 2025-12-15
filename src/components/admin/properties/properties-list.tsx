"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apollo/client";
import { GET_LISTINGS } from "@/lib/graphql/queries";
import { Property } from "@/lib/graphql/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import CreatePropertySheet from "@/components/listings/create-property-sheet";
import EditPropertySheet from "@/components/listings/edit-property-sheet";
import PropertyDeleteDialog from "./property-delete-dialog";
import Loading from "@/components/loading";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 12;

export default function PropertiesList() {
  const [page, setPage] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vacantFilter, setVacantFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-properties", page, vacantFilter, categoryFilter],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_LISTINGS,
        variables: {
          pagination: {
            page,
            limit: ITEMS_PER_PAGE,
          },
          property: {
            vacant:
              vacantFilter === "all" ? undefined : vacantFilter === "vacant",
            category: categoryFilter === "all" ? undefined : categoryFilter,
          },
        },
        fetchPolicy: "network-only",
      });
      return {
        //@ts-expect-error Object is possibly 'null'.
        data: data?.properties?.data || [],
        //@ts-expect-error Object is possibly 'null'.
        total: data?.properties?.total || 0,
      };
    },
  });

  const properties = data?.data || [];
  const total = data?.total || 0;

  const filteredProperties = properties.filter((property: Property) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      property.title?.toLowerCase().includes(query) ||
      property.buildingName?.toLowerCase().includes(query) ||
      property.address?.city?.toLowerCase().includes(query) ||
      property.address?.country?.toLowerCase().includes(query)
    );
  });

  const handleCreate = () => {
    setSelectedProperty(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Error loading properties. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Properties Management</h2>
          <p className="text-muted-foreground">
            View and manage all properties on the platform
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties by title, building, city, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={vacantFilter} onValueChange={setVacantFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProperties.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No properties found</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property: Property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={property.mainImage || "/placeholder-property.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={property.vacant ? "default" : "secondary"}>
                      {property.vacant ? "Vacant" : "Occupied"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {property.title}
                  </h3>
                  {property.buildingName && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.buildingName}
                    </p>
                  )}
                  {property.address && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.address.city}, {property.address.country}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {property.rent ? (
                        <p className="font-semibold">
                          {property.rentDuration === "daily"
                            ? `${property.rent}/day`
                            : property.rentDuration === "monthly"
                            ? `${property.rent}/month`
                            : `${property.rent}/year`}
                        </p>
                      ) : (
                        property.price && (
                          <p className="font-semibold">{property.price}</p>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={`/property/${property.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(property)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(property)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProperties.length} of {total} properties
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page + 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={filteredProperties.length < ITEMS_PER_PAGE}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {isFormOpen && !isEditMode && (
        <CreatePropertySheet
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={handleSuccess}
        />
      )}

      {isFormOpen && isEditMode && selectedProperty && (
        <EditPropertySheet
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          property={selectedProperty}
          onSuccess={handleSuccess}
        />
      )}

      {selectedProperty && (
        <PropertyDeleteDialog
          property={selectedProperty}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
