'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Property } from '@/lib/graphql/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  pricePerNight: number;
}

export default function BookingModal({ isOpen, onClose, property, pricePerNight }: BookingModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement GraphQL mutation for booking
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Show success and offer WhatsApp contact
      const confirmed = confirm('Booking request submitted! Would you like to contact the host via WhatsApp for confirmation?');
      
      if (confirmed) {
        handleWhatsAppContact();
      }
      
      onClose();
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const formatDate = (date: Date) => date.toLocaleDateString();
    
    const message = encodeURIComponent(
      `Hi! I'd like to book "${property.title}" in ${property.address?.city}, ${property.address?.country}.

Booking Details:
- Check-in: ${checkInDate ? formatDate(checkInDate) : 'TBD'}
- Check-out: ${checkOutDate ? formatDate(checkOutDate) : 'TBD'}
- Guests: ${guests}
- Property: ${window.location.href}

Please confirm availability and provide booking instructions. Thank you!`
    );
    
    const whatsappUrl = `https://wa.me/${property.contactInfo?.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.14);
  const cleaningFee = 62;
  const total = subtotal + serviceFee + cleaningFee;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Request to book
                  </Dialog.Title>
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
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {property.mainImage && (
                        <img 
                          src={property.mainImage} 
                          alt={property.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {property.address?.city}, {property.address?.country}
                      </p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="py-6 space-y-4">
                    <h4 className="font-medium text-gray-900">Your trip</h4>
                    
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

                    {/* Guests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>
                            {num} guest{num !== 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {nights > 0 && (
                    <div className="py-4 border-t border-gray-200 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>${pricePerNight} x {nights} nights</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>${cleaningFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>Total (USD)</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-6 space-y-3">
                    <button
                      onClick={handleBooking}
                      disabled={!checkInDate || !checkOutDate || isLoading}
                      className="w-full bg-[#FF385C] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#E31C5F] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Request to book'}
                    </button>
                    
                    <button
                      onClick={handleWhatsAppContact}
                      className="w-full bg-[#25D366] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span>Contact Host via WhatsApp</span>
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      You won't be charged until your request is accepted by the host.
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}