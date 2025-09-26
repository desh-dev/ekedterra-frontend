'use client';

import { Property } from '@/lib/graphql/types';

interface BookingCardProps {
  property: Property;
  handleBookingClick: () => void;
  existingBooking?: {
    id: string;
    propertyId: string;
    bookingDate: string;
    checkoutDate?: string;
    status: string;
  };
}

export default function BookingCard({
  property,
  handleBookingClick,
  existingBooking,
}: BookingCardProps) {
  return (
    <>
      <div className="border border-gray-300 rounded-xl p-6 shadow-lg">
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-semibold uppercase">
              {property.currency || 'xaf'} {property.rent?.toLocaleString()}
            </span>
            <span className="text-gray-600">{property.rentDuration}</span>
          </div>
          {/* <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-gray-900" />
            <span className="font-medium">4.94</span>
            <span className="text-gray-500">·</span>
            <button className="text-gray-500 underline hover:no-underline text-sm">
              23 reviews
            </button>
          </div> */}
        </div>

        {/* Reserve Button */}
        <button
          onClick={handleBookingClick}
          className="w-full bg-[#FF385C] text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-[#E31C5F] transition-colors mb-4"
        >
          {existingBooking ? 'Reschedule' : 'Reserve'}
        </button>
        <p className="text-center text-gray-500 text-sm mb-4">
          You won&apos;t be charged yet
        </p>
      </div>

      {/* Booking Modal */}
    </>
  );
}
