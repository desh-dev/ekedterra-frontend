'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/react/24/solid';
import { Property } from '@/lib/graphql/types';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
}

export default function PropertyCard({ 
  property, 
  isFavorite = false, 
  onToggleFavorite 
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.imageUrl)
    : [property.mainImage];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <div className="relative">
        {/* Image Carousel */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
          {!imageError && images[currentImageIndex] ? (
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          )}

          {/* Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/60'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
          >
            {isFavorite ? (
              <HeartIconSolid className="w-6 h-6 text-[#FF385C]" />
            ) : (
              <HeartIcon className="w-6 h-6 text-white stroke-2 drop-shadow-sm" />
            )}
          </button>

          {/* Guest Favorite Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-900 shadow-sm">
              Guest favorite
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="mt-3 space-y-1">
          {/* Location and Rating */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">
              {property.address?.city}, {property.address?.country}
            </h3>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <StarIcon className="w-4 h-4 text-gray-900" />
              <span className="text-sm text-gray-900">4.94</span>
            </div>
          </div>

          {/* Property Type */}
          <p className="text-gray-500 text-sm truncate">
            {property.type?.charAt(0).toUpperCase() + property.type?.slice(1)}
            {property.buildingName && ` in ${property.buildingName}`}
          </p>

          {/* Dates */}
          <p className="text-gray-500 text-sm">
            Available now
          </p>

          {/* Price */}
          <div className="flex items-baseline space-x-1">
            <span className="font-medium text-gray-900">
              ${property.price || property.rent}
            </span>
            <span className="text-gray-500 text-sm">
              {property.rentDuration === 'daily' ? 'night' : 
               property.rentDuration === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}