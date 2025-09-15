'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Property } from '@/lib/graphql/types';
import BookingModal from './booking-modal';

interface BookingCardProps {
  property: Property;
  pricePerNight: number;
}

export default function BookingCard({ property, pricePerNight }: BookingCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [guests, setGuests] = useState(1);

  const serviceFee = Math.round(pricePerNight * 0.14);
  const cleaningFee = 62;
  const nights = 5; // This would be calculated from selected dates
  const subtotal = pricePerNight * nights;
  const totalBeforeTaxes = subtotal + serviceFee + cleaningFee;
  const taxes = Math.round(totalBeforeTaxes * 0.12);
  const total = totalBeforeTaxes + taxes;

  const handleBookingClick = () => {
    setShowBookingModal(true);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in booking "${property.title}" in ${property.address?.city}, ${property.address?.country}. 
      
Property details:
- Location: ${property.address?.street}, ${property.address?.city}
- Price: $${pricePerNight}/night
- Property link: ${window.location.href}

I'd like to schedule a viewing or get more information. Thank you!`
    );
    
    const whatsappUrl = `https://wa.me/${property.contactInfo?.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="border border-gray-300 rounded-xl p-6 shadow-lg">
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-semibold">${pricePerNight}</span>
            <span className="text-gray-600">night</span>
          </div>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-gray-900" />
            <span className="font-medium">4.94</span>
            <span className="text-gray-500">·</span>
            <button className="text-gray-500 underline hover:no-underline text-sm">
              23 reviews
            </button>
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-2 border border-gray-300 rounded-lg mb-4">
          <button className="p-3 text-left border-r border-gray-300 hover:bg-gray-50 rounded-l-lg">
            <div className="text-xs font-medium text-gray-900 uppercase">Check-in</div>
            <div className="text-sm text-gray-600">Add date</div>
          </button>
          <button className="p-3 text-left hover:bg-gray-50 rounded-r-lg">
            <div className="text-xs font-medium text-gray-900 uppercase">Checkout</div>
            <div className="text-sm text-gray-600">Add date</div>
          </button>
        </div>

        {/* Guests */}
        <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 mb-6">
          <div className="text-xs font-medium text-gray-900 uppercase">Guests</div>
          <div className="text-sm text-gray-600">{guests} guest{guests !== 1 ? 's' : ''}</div>
        </button>

        {/* Reserve Button */}
        <button
          onClick={handleBookingClick}
          className="w-full bg-[#FF385C] text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-[#E31C5F] transition-colors mb-4"
        >
          Reserve
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppContact}
          className="w-full bg-[#25D366] text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-[#128C7E] transition-colors mb-4 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <span>Contact via WhatsApp</span>
        </button>

        <p className="text-center text-gray-500 text-sm mb-4">You won't be charged yet</p>

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="underline">${pricePerNight} x {nights} nights</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Taxes</span>
            <span>${taxes}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
        pricePerNight={pricePerNight}
      />
    </>
  );
}