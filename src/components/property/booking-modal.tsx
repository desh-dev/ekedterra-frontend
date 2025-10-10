"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Property,
  BookingInput,
  BookingEventData,
  BookingUpdateInput,
  Booking,
} from "@/lib/graphql/types";

interface AgentData {
  id: string;
  email: string;
  phone: string;
}
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePropertyAgent } from "@/hooks/usePropertyAgent";
import { createBooking, updateBooking, deleteBooking } from "@/lib/data/client";
import { useAuth } from "@/providers/auth-provider";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Image from "next/image";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  existingBooking?: {
    id: string;
    propertyId: string;
    bookingDate: string;
    checkoutDate?: string;
    status: string;
  }; // Will be passed from parent if user has existing booking
  onBookingSuccess?: () => void; // Callback for successful booking operations
}

export default function BookingModal({
  isOpen,
  onClose,
  property,
  existingBooking,
  onBookingSuccess,
}: BookingModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth();

  // Determine if this is a hotel/guesthouse property
  const isHotelOrGuesthouse =
    property.type === "hotel" || property.type === "guesthouse";

  // Fetch agent contact info only when modal is opened
  const { data: agentData, isLoading: agentLoading } = usePropertyAgent(
    property.userId,
    isOpen
  );

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please log in to make a booking");
      return;
    }

    if (!checkInDate) {
      toast.error("Please select a booking date");
      return;
    }

    if (isHotelOrGuesthouse && !checkOutDate) {
      toast.error("Please select check-out date");
      return;
    }

    if (!(agentData as AgentData)?.phone && !(agentData as AgentData)?.email) {
      toast.error("Unable to get agent contact information");
      return;
    }

    setIsLoading(true);

    try {
      const bookingInput: BookingInput = {
        userId: user.userId,
        propertyId: property.id,
        bookingDate: dayjs(checkInDate).format("YYYY-MM-DDTHH:mm:ss"),
        checkoutDate: isHotelOrGuesthouse
          ? dayjs(checkOutDate).format("YYYY-MM-DDTHH:mm:ss")
          : undefined,
        status: "pending",
      };

      const bookingEventData: BookingEventData = {
        userContact: user.phone || user.email,
        agentContact:
          (agentData as AgentData).phone || (agentData as AgentData).email,
        propertyInfo: {
          propertyId: property.id,
          propertyTitle: property.title,
        },
      };

      let result;
      if (existingBooking) {
        const bookingUpdateInput: BookingUpdateInput = {
          status: "pending",
          bookingDate: dayjs(checkInDate).format("YYYY-MM-DDTHH:mm:ss"),
          checkoutDate: isHotelOrGuesthouse
            ? dayjs(checkOutDate).format("YYYY-MM-DDTHH:mm:ss")
            : undefined,
        };
        // Update existing booking
        result = await updateBooking(
          existingBooking.id,
          bookingUpdateInput,
          bookingEventData
        );
        toast.success("Booking updated successfully!");
      } else {
        // Create new booking
        result = await createBooking(bookingInput, bookingEventData);
        toast.success("Booking request submitted successfully!");
      }

      // Update user state with new booking
      if (result && setUser) {
        const updatedUser = { ...user };
        if (existingBooking) {
          // Update existing booking in user's bookings array
          updatedUser.bookings =
            updatedUser.bookings?.map((booking) =>
              booking.id === existingBooking.id
                ? { ...booking, ...result }
                : booking
            ) || [];
        } else {
          // Add new booking to user's bookings array
          updatedUser.bookings = [
            ...(updatedUser.bookings || []),
            {
              ...result,
              id: result.id || "", // Provide a default value for required fields
              userId: result.userId || "",
              propertyId: result.propertyId || "",
              bookingDate: result.bookingDate || new Date().toISOString(),
              status: result.status || "pending",
              createdAt: result.createdAt || new Date().toISOString(),
              updatedAt: result.updatedAt || new Date().toISOString(),
              checkoutDate: result.checkoutDate || "", // or provide a default checkout date
            } as Booking,
          ];
        }
        setUser(updatedUser);
      }

      // Show success and offer WhatsApp contact
      // const confirmed = confirm(
      //   "Booking request submitted! Would you like to verify with an agent on WhatsApp?"
      // );

      // if (confirmed) {
      //   handleWhatsAppContact();
      // }

      onBookingSuccess?.();
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!existingBooking || !user) return;

    // const confirmed = confirm("Are you sure you want to cancel this booking?");
    // if (!confirmed) return;

    setIsLoading(true);

    try {
      const bookingEventData: BookingEventData = {
        userContact: user.phone || user.email,
        agentContact:
          (agentData as AgentData)?.phone || (agentData as AgentData)?.email,
        propertyInfo: {
          propertyId: property.id,
          propertyTitle: property.title,
        },
      };

      await deleteBooking(existingBooking.id, bookingEventData);

      // Update user state to remove the booking
      if (setUser) {
        const updatedUser = { ...user };
        updatedUser.bookings =
          updatedUser.bookings?.filter(
            (booking) => booking.id !== existingBooking.id
          ) || [];
        setUser(updatedUser);
      }

      toast.success("Booking cancelled successfully!");
      onBookingSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const agentPhone = "237672336436";

    const message = encodeURIComponent(
      `Hi! I'm interested in "${property.title}" in ${
        property.address?.city
      }, ${property.address?.country}. 
      
Property details:
- Location: ${property.address?.street}, ${property.address?.city}
- Price: ${property.currency || "xaf"} ${property.rent || property.price}/night
- Property link: ${window.location.href}

I'd like to schedule a viewing or get more information. Thank you!`
    );

    const whatsappUrl = `https://wa.me/${String(agentPhone).replace(
      /[^0-9]/g,
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const total = property.rent && property.rent * nights;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0">
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    Request to book
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-6 pb-6">
                  {/* Property Info */}
                  <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
                    <div className="w-16 h-16 relative bg-gray-200 rounded-lg flex-shrink-0">
                      {property.mainImage && (
                        <Image
                          src={property.mainImage}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-lg"
                          fill
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {property.address?.city}, {property.address?.country}
                      </p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="py-6 space-y-4">
                    <h4 className="font-medium text-gray-900">
                      {existingBooking
                        ? "Reschedule your booking"
                        : "Your trip"}
                    </h4>

                    {isHotelOrGuesthouse ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-in
                          </label>
                          <DatePicker
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate || undefined}
                            endDate={checkOutDate || undefined}
                            minDate={new Date()}
                            placeholderText="Add date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out
                          </label>
                          <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsEnd
                            startDate={checkInDate || undefined}
                            endDate={checkOutDate || undefined}
                            minDate={checkInDate || undefined}
                            placeholderText="Add date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Booking Date
                        </label>
                        <DatePicker
                          selected={checkInDate}
                          onChange={(date) => setCheckInDate(date)}
                          minDate={new Date()}
                          placeholderText="Select booking date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  {nights > 0 && (
                    <div className="py-4 border-t border-gray-200 space-y-3 text-sm">
                      <div className="flex justify-between font-semibold">
                        <span>Total ({property.currency || "xaf"})</span>
                        <span className="uppercase">
                          {property.currency || "xaf"} {total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-6 space-y-3">
                    {agentLoading ? (
                      <div className="w-full bg-gray-200 text-gray-500 py-3 px-6 rounded-lg font-medium text-center">
                        Loading agent information...
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleBooking}
                          disabled={
                            !checkInDate ||
                            (isHotelOrGuesthouse && !checkOutDate) ||
                            isLoading ||
                            !agentData
                          }
                          className="w-full bg-[#FF385C] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#E31C5F] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {isLoading
                            ? "Processing..."
                            : existingBooking
                            ? "Update Booking"
                            : "Request to book"}
                        </button>

                        {existingBooking && (
                          <button
                            onClick={handleDeleteBooking}
                            disabled={isLoading}
                            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {isLoading ? "Processing..." : "Cancel Booking"}
                          </button>
                        )}

                        <button
                          onClick={handleWhatsAppContact}
                          disabled={!agentData}
                          className="w-full bg-[#25D366] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          <span>Book via WhatsApp</span>
                        </button>
                      </>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      You won&apos;t be charged until your booking has been
                      confirmed.
                    </p>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
