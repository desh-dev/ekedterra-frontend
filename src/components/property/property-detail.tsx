"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Property } from "@/lib/graphql/types";
import BookingCard from "./booking-card";
import PropertyGallery from "./property-gallery";
import Header from "../search/header";
import { useAuth } from "@/providers/auth-provider";
import { useAppStore } from "@/providers/app-store-provider";
import useIsDesktop from "@/hooks/useIsDesktop";
import { useRouter } from "@/i18n/routing";
import { addFavorite, removeFavorite } from "@/lib/data/client";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import Footer from "../layout/footer";
import { Button } from "../ui/button";
import BookingModal from "./booking-modal";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user, setUser, isUser } = useAuth();
  const { setLogin } = useAppStore((state) => state);
  const { isDesktop } = useIsDesktop();
  const router = useRouter();

  const images =
    property.images && property.images.length > 0
      ? property.images.map((img) => img.imageUrl)
      : [property.mainImage];
  const isFavorite = user?.favorites?.some((fav) => fav?.id === property.id);

  // Check if user has an existing booking for this property
  const existingBooking = user?.bookings?.find(
    (booking) =>
      booking.propertyId === property.id && booking.status === "pending"
  );

  const totalImages = images.length;
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return isDesktop ? setLogin(true) : router.push("/auth/login");

    // Optimistically update user favorites
    const prevFavorites = user.favorites || [];
    let newFavorites;
    if (isFavorite) {
      newFavorites = prevFavorites.filter((fav) => fav?.id !== property.id);
      setUser({ ...user, favorites: newFavorites });
      try {
        await removeFavorite({ userId: user.userId, propertyId: property.id });
      } catch (err) {
        console.error("Failed to remove favorite:", err);
        // Revert optimistic update
        setUser({ ...user, favorites: prevFavorites });
        toast.error("Failed to remove favorite.");
      }
    } else {
      newFavorites = [...prevFavorites, { id: property.id }];
      setUser({ ...user, favorites: newFavorites });
      try {
        await addFavorite({ userId: user.userId, propertyId: property.id });
      } catch (err) {
        console.error("Failed to add favorite:", err);
        // Revert optimistic update
        setUser({ ...user, favorites: prevFavorites });
        toast.error("Failed to add favorite.");
      }
    }
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
  const handleBookingClick = () => {
    setShowBookingModal(true);
  };

  return (
    <div>
      <div className="hidden md:block">
        <Header />
      </div>
      {/* Fixed Back Button */}

      <div className="min-h-screen md:max-w-7xl md:mx-auto md:px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="hidden md:block text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm">
              {/* <div className="flex items-center space-x-1">
                <StarIcon className="w-4 h-4 text-gray-900" />
                <span className="font-medium">4.94</span>
                <span className="text-gray-500">·</span>
                <button className="underline hover:no-underline">
                  23 reviews
                </button>
              </div>
              <span className="text-gray-500">·</span> */}
              {property.address && (
                <span className="text-gray-900">
                  {property.address?.street}, {property.address?.city}
                </span>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-4">
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
        {/* Mobile Carousel */}
        <div className="md:hidden -mt-12">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden"
            {...swipeHandlers}
          >
            <Image
              src={images[currentImageIndex] || property.mainImage}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 80vw"
              className="object-cover"
              onClick={() => setShowAllPhotos(true)}
            />
            {/* Overlayed Buttons */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-start px-4 pt-4 z-10">
              <button
                className="rounded-full p-2 bg-white border border-gray-200 shadow hover:bg-gray-100"
                onClick={() => router.back()}
                aria-label="Back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <button
                  className="rounded-full p-2 bg-white border border-gray-200 shadow hover:bg-gray-100"
                  onClick={handleShare}
                  aria-label="Share"
                >
                  <ShareIcon className="w-6 h-6" />
                </button>
                {isUser && (
                  <button
                    className="rounded-full p-2 bg-white border border-gray-200 shadow hover:bg-gray-100"
                    onClick={handleToggleFavorite}
                    aria-label="Save"
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="w-6 h-6 text-[#FF385C]" />
                    ) : (
                      <HeartIcon className="w-6 h-6" />
                    )}
                  </button>
                )}
              </div>
            </div>
            {/* slide counter */}
            {totalImages > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                {currentImageIndex + 1} / {totalImages}
              </div>
            )}
          </div>
          {/* Overlay info card */}
          <div className="relative -mt-4 capitalize">
            <div className="bg-white rounded-t-2xl shadow-md p-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {property.title}
              </h1>
              {property.address && (
                <p className="text-gray-600 text-sm mt-1">
                  {property.address?.city}
                  {", "} {property.address?.street}
                </p>
              )}
              <div className="flex items-center gap-6 mt-3 text-xs text-gray-700">
                {property.type && (
                  <span className="capitalize">{property.type}</span>
                )}
                {property.buildingName && (
                  <span>· {property.buildingName}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery - Desktop/Tablet */}
        <div className="hidden md:block mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
            {/* Main Image */}
            <div className="md:col-span-2 md:row-span-2">
              <div className="relative aspect-square md:aspect-[4/3] cursor-pointer group">
                <Image
                  src={images[0] || property.mainImage}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 80vw"
                  className="object-cover group-hover:brightness-90 transition-all"
                  onClick={() => setShowAllPhotos(true)}
                />
              </div>
            </div>
            {/* Side Images */}
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group"
              >
                <Image
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 80vw"
                  className="object-cover group-hover:brightness-90 transition-all"
                  onClick={() => setShowAllPhotos(true)}
                />
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">
                      +{images.length - 5} photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAllPhotos(true)}
            className="mt-4 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">Show all photos</span>
          </button>
        </div>
        {/* Content */}
        <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 capitalize">
          <h1 className="hidden">{property.title}</h1>
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="hidden md:block pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold capitalize">
                {property.type}{" "}
                {property.buildingName && `- ${property.buildingName}`}
              </h2>
              {/* <div className="flex items-center space-x-4 text-gray-600">
                <span>2 guests</span>
                <span>·</span>
                <span>1 bedroom</span>
                <span>·</span>
                <span>1 bed</span>
                <span>·</span>
                <span>1 bathroom</span>
              </div> */}
            </div>
            {/* Features */}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About this place</h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>
            {/* Amenities */}
            {/* <div className="pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "📶", label: "Wifi" },
                  { icon: "🍳", label: "Kitchen" },
                  { icon: "🅿️", label: "Free parking on premises" },
                  { icon: "❄️", label: "Air conditioning" },
                  { icon: "📺", label: "TV" },
                  { icon: "🧺", label: "Washer" },
                ].map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xl">{amenity.icon}</span>
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
          {/* Right Column - Booking Card */}
          <div className="hidden md:block lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard
                property={property}
                handleBookingClick={handleBookingClick}
                existingBooking={existingBooking}
              />
            </div>
          </div>
          <div className="fixed md:hidden bottom-0 left-0 right-0 px-4 py-2 bg-white flex border-t border-gray-200 justify-between items-center">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold uppercase">
                {property.currency || "xaf"} {property.rent?.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">{property.rentDuration}</p>
            </div>{" "}
            <Button size="lg" onClick={handleBookingClick}>
              {existingBooking ? "Reschedule" : "Reserve"}
            </Button>
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
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
        existingBooking={existingBooking}
        onBookingSuccess={() => {
          // Refresh user data or trigger a re-fetch
          // The booking modal already updates the user state
        }}
      />
      <Footer />
    </div>
  );
}
