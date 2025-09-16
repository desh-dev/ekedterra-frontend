'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HeartIcon, ShareIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Property } from '@/lib/graphql/types';
import BookingCard from './booking-card';
import PropertyGallery from './property-gallery';

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.imageUrl)
    : [property.mainImage];

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement GraphQL mutation to add/remove favorite
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-gray-900" />
              <span className="font-medium">4.94</span>
              <span className="text-gray-500">·</span>
              <button className="underline hover:no-underline">23 reviews</button>
            </div>
            <span className="text-gray-500">·</span>
            <span className="text-gray-900">
              {property.address?.city}, {property.address?.country}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShareIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isFavorite ? (
                <HeartIconSolid className="w-4 h-4 text-[#FF385C]" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2">
            <div className="relative aspect-square md:aspect-[4/3] cursor-pointer group">
              <Image
                src={images[0] || property.mainImage}
                alt={property.title}
                fill
                className="object-cover group-hover:brightness-90 transition-all"
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          </div>
          
          {/* Side Images */}
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative aspect-square cursor-pointer group">
              <Image
                src={image}
                alt={`${property.title} ${index + 2}`}
                fill
                className="object-cover group-hover:brightness-90 transition-all"
                onClick={() => setShowAllPhotos(true)}
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">+{images.length - 5} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setShowAllPhotos(true)}
          className="mt-4 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">Show all photos</span>
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host Info */}
          <div className="pb-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {property.type?.charAt(0).toUpperCase() + property.type?.slice(1)} hosted by Sarah
            </h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>2 guests</span>
              <span>·</span>
              <span>1 bedroom</span>
              <span>·</span>
              <span>1 bed</span>
              <span>·</span>
              <span>1 bathroom</span>
            </div>
          </div>

          {/* Features */}
          <div className="pb-8 border-b border-gray-200">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 mt-1">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293A1 1 0 018 12h2l1.5-1.5M15 7l-3-3L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Great check-in experience</h3>
                  <p className="text-gray-600 text-sm">100% of recent guests gave the check-in process a 5-star rating.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 mt-1">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Great location</h3>
                  <p className="text-gray-600 text-sm">90% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 mt-1">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Free cancellation before Feb 14</h3>
                  <p className="text-gray-600 text-sm">Get a full refund if you change your mind.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">About this place</h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '📶', label: 'Wifi' },
                { icon: '🍳', label: 'Kitchen' },
                { icon: '🅿️', label: 'Free parking on premises' },
                { icon: '❄️', label: 'Air conditioning' },
                { icon: '📺', label: 'TV' },
                { icon: '🧺', label: 'Washer' },
              ].map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-xl">{amenity.icon}</span>
                  <span>{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingCard 
              property={property}
              pricePerNight={property.price || property.rent || 120}
            />
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <PropertyGallery
        images={images}
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        title={property.title}
      />
    </div>
  );
}