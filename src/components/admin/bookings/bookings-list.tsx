"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apollo/client";
import { GET_BOOKINGS, GET_PROPERTY, GET_USER } from "@/lib/graphql/queries";
import {
  Booking,
  Property,
  User,
  BookingFilterInput,
} from "@/lib/graphql/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import BookingDetailModal from "./booking-detail-modal";
import Loading from "@/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingWithDetails {
  id: string;
  userId: string;
  propertyId: string;
  bookingDate: string;
  checkoutDate?: string;
  status: string;
  user?: User;
  property?: Property & { owner?: User };
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function BookingsList() {
  const [page, setPage] = useState(0);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-bookings", page, statusFilter],
    queryFn: async () => {
      // First, get bookings with pagination
      const bookingFilterInput: BookingFilterInput = {
        page,
        limit: ITEMS_PER_PAGE,
      };

      const { data: bookingsData } = await apolloClient.query({
        query: GET_BOOKINGS,
        variables: {
          bookingFilterInput,
        },
        fetchPolicy: "network-only",
      });

      //@ts-expect-error Object is possibly 'null'.
      const bookings: Booking[] = bookingsData?.bookings || [];

      // Fetch property and user details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking: Booking) => {
          try {
            // Fetch property
            const { data: propertyData } = await apolloClient.query({
              query: GET_PROPERTY,
              variables: { id: booking.propertyId },
              fetchPolicy: "network-only",
            });

            //@ts-expect-error Object is possibly 'null'.
            const property: Property | null = propertyData?.property || null;

            // Fetch booking user (customer)
            let bookingUser: User | null = null;
            try {
              const { data: userData } = await apolloClient.query({
                query: GET_USER,
                variables: { id: booking.userId },
                fetchPolicy: "network-only",
              });
              //@ts-expect-error Object is possibly 'null'.
              bookingUser = userData?.user || null;
            } catch (err) {
              console.error(`Error fetching user ${booking.userId}:`, err);
            }

            // Fetch property owner/agent
            let propertyOwner: User | null = null;
            if (property?.userId) {
              try {
                const { data: ownerData } = await apolloClient.query({
                  query: GET_USER,
                  variables: { id: property.userId },
                  fetchPolicy: "network-only",
                });
                //@ts-expect-error Object is possibly 'null'.
                propertyOwner = ownerData?.user || null;
              } catch (err) {
                console.error(
                  `Error fetching property owner ${property.userId}:`,
                  err
                );
              }
            }

            return {
              id: booking.id,
              userId: booking.userId,
              propertyId: booking.propertyId,
              bookingDate: booking.bookingDate,
              checkoutDate: booking.checkoutDate,
              status: booking.status,
              user: bookingUser || undefined,
              property: property
                ? {
                    ...property,
                    owner: propertyOwner || undefined,
                  }
                : undefined,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
            } as BookingWithDetails;
          } catch (err) {
            console.error(
              `Error fetching details for booking ${booking.id}:`,
              err
            );
            return {
              id: booking.id,
              userId: booking.userId,
              propertyId: booking.propertyId,
              bookingDate: booking.bookingDate,
              checkoutDate: booking.checkoutDate,
              status: booking.status,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
            } as BookingWithDetails;
          }
        })
      );

      // Filter by status if needed
      const filtered =
        statusFilter === "all"
          ? bookingsWithDetails
          : bookingsWithDetails.filter((b) => b.status === statusFilter);

      return filtered;
    },
  });

  const bookings: BookingWithDetails[] = data || [];

  const filteredBookings = bookings.filter((booking: BookingWithDetails) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.user?.fullName?.toLowerCase().includes(query) ||
      booking.user?.email?.toLowerCase().includes(query) ||
      booking.property?.title?.toLowerCase().includes(query) ||
      booking.property?.owner?.fullName?.toLowerCase().includes(query) ||
      booking.id.toLowerCase().includes(query)
    );
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "successful":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleViewBooking = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
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
          Error loading bookings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bookings Management</h2>
          <p className="text-muted-foreground">
            View and manage all bookings on the platform
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by booking ID, user name, email, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="successful">Successful</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No bookings found</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filteredBookings.map((booking: BookingWithDetails) => (
              <Card key={booking.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        Booking #{booking.id.slice(0, 8)}
                      </h3>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">
                          {booking.user?.fullName || "N/A"}
                        </p>
                        {booking.user?.email && (
                          <p className="text-muted-foreground text-xs">
                            {booking.user.email}
                          </p>
                        )}
                        {booking.user?.phone && (
                          <p className="text-muted-foreground text-xs">
                            {booking.user.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-muted-foreground">Property</p>
                        <p className="font-medium">
                          {booking.property?.title || "N/A"}
                        </p>
                        {booking.property?.address && (
                          <p className="text-muted-foreground text-xs">
                            {booking.property.address.city},{" "}
                            {booking.property.address.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          Property Owner/Agent
                        </p>
                        <p className="font-medium">
                          {booking.property?.owner?.fullName || "N/A"}
                        </p>
                        {booking.property?.owner?.email && (
                          <p className="text-muted-foreground text-xs">
                            {booking.property.owner.email}
                          </p>
                        )}
                        {booking.property?.owner?.phone && (
                          <p className="text-muted-foreground text-xs">
                            {booking.property.owner.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-muted-foreground">Booking Date</p>
                        <p className="font-medium">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>

                      {booking.checkoutDate && (
                        <div>
                          <p className="text-muted-foreground">Checkout Date</p>
                          <p className="font-medium">
                            {new Date(
                              booking.checkoutDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleViewBooking(booking)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBookings.length} booking(s)
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
                disabled={filteredBookings.length < ITEMS_PER_PAGE}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}
