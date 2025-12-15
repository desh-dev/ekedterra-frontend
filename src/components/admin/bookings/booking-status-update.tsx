"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apolloClient } from "@/lib/apollo/client";
import { UPDATE_BOOKING } from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStatus } from "@/lib/graphql/types";

interface BookingWithDetails {
  id: string;
  status: string;
  property?: {
    userId: string;
    title: string;
  };
  user?: {
    email?: string;
    phone?: string;
  };
}

interface BookingStatusUpdateProps {
  booking: BookingWithDetails;
  onUpdate: () => void;
}

export default function BookingStatusUpdate({
  booking,
  onUpdate,
}: BookingStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(
    booking.status as BookingStatus
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    if (selectedStatus === booking.status) {
      toast("Status unchanged");
      return;
    }

    setIsUpdating(true);
    try {
      // Note: UPDATE_BOOKING requires bookingEventData, but for admin we might not need it
      // This is a simplified version - you may need to adjust based on your backend requirements
      await apolloClient.mutate({
        mutation: UPDATE_BOOKING,
        variables: {
          id: booking.id,
          booking: {
            status: selectedStatus,
          },
          bookingEventData: {
            bookingId: booking.id,
            userContact: booking.user?.email || booking.user?.phone || "",
            agentContact: booking.property?.userId || "",
            propertyInfo: {
              propertyId: booking.property?.userId || "",
              propertyTitle: booking.property?.title || "",
            },
          },
        },
      });

      toast.success("Booking status updated successfully");
      onUpdate();
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      toast.error(error?.message || "Failed to update booking status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Update Status</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Current status:{" "}
            <span className="font-medium">{booking.status}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={selectedStatus}
            onValueChange={(value: BookingStatus) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleUpdateStatus}
            disabled={isUpdating || selectedStatus === booking.status}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
