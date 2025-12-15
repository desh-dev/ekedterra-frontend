"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import BookingStatusUpdate from "./booking-status-update";

interface BookingWithDetails {
  id: string;
  userId: string;
  propertyId: string;
  bookingDate: string;
  checkoutDate?: string;
  status: string;
  user?: {
    userId: string;
    email: string;
    fullName: string;
    phone?: string;
  };
  property?: {
    id: string;
    title: string;
    buildingName?: string;
    address?: {
      city: string;
      country: string;
      region?: string;
      street?: string;
    };
    userId: string;
    owner?: {
      userId: string;
      email: string;
      fullName: string;
      phone?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface BookingDetailModalProps {
  booking: BookingWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function BookingDetailModal({
  booking,
  open,
  onOpenChange,
  onUpdate,
}: BookingDetailModalProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Booking Details: #{booking.id.slice(0, 8)}
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Information */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Booking ID</p>
                <p className="font-medium">{booking.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant={getStatusVariant(booking.status)}
                  className="mt-1"
                >
                  {booking.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Booking Date</p>
                <p className="font-medium">
                  {new Date(booking.bookingDate).toLocaleString()}
                </p>
              </div>
              {booking.checkoutDate && (
                <div>
                  <p className="text-muted-foreground">Checkout Date</p>
                  <p className="font-medium">
                    {new Date(booking.checkoutDate).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(booking.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          {booking.user && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{booking.user.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium">{booking.user.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{booking.user.email}</p>
                </div>
                {booking.user.phone && (
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{booking.user.phone}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Property Information */}
          {booking.property && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                Property Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Property ID</p>
                    <p className="font-medium">{booking.property.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Title</p>
                    <p className="font-medium">{booking.property.title}</p>
                  </div>
                  {booking.property.buildingName && (
                    <div>
                      <p className="text-muted-foreground">Building Name</p>
                      <p className="font-medium">
                        {booking.property.buildingName}
                      </p>
                    </div>
                  )}
                </div>
                {booking.property.address && (
                  <div>
                    <p className="text-muted-foreground mb-2">Address</p>
                    <p className="font-medium">
                      {booking.property.address.street && (
                        <>{booking.property.address.street}, </>
                      )}
                      {booking.property.address.city},{" "}
                      {booking.property.address.region && (
                        <>{booking.property.address.region}, </>
                      )}
                      {booking.property.address.country}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Property Owner/Agent Information */}
          {booking.property?.owner && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                Property Owner/Agent
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {booking.property.owner.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium">{booking.property.owner.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{booking.property.owner.email}</p>
                </div>
                {booking.property.owner.phone && (
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {booking.property.owner.phone}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <div className="border-t my-4" />

          {/* Status Update */}
          <BookingStatusUpdate booking={booking} onUpdate={onUpdate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
