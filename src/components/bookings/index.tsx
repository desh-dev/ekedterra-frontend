"use client";

import { useEffect, useState } from "react";
import BookingCard from "./booking-card";
import PropertyCardSkeleton from "../property/property-card-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { getProperty } from "@/lib/data/client";
import { Property } from "@/lib/graphql/types";
import Image from "next/image";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 10;

const BookingPage = () => {
  const { loading, user } = useAuth();
  const [page, setPage] = useState(1);
  const t = useTranslations("bookings");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get bookings from user
  const bookings = user?.bookings || [];
  const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
  const pagedBookings = bookings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (!pagedBookings.length) {
      setProperties([]);
      return;
    }
    setIsLoading(true);
    setIsError(false);

    // Fetch properties for the bookings
    Promise.all(pagedBookings.map((booking) => getProperty(booking.propertyId)))
      .then((results) => setProperties(results))
      .catch((err) => {
        setIsError(true);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [user, page]);

  if (loading || isLoading) {
    return (
      <div className="m-4 md:m-0 flex flex-col  min-w-[70vw] max-w-7xl">
        <h3 className="text-3xl font-semibold my-4">{t("title")}</h3>
        <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="min-h-screen m-4 min-w-[70vw] max-w-7xl">
        <h3 className="text-3xl font-semibold my-8 place-self-start">
          {t("title")}
        </h3>
        <div className="h-full w-full flex flex-col items-center justify-center mt-20">
          <div className="relative mb-4 w-48 h-48">
            <Image
              src="/properties-not-found.webp"
              alt="bookings not found"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {t("noBookings")}
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {t("noBookingsDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>{t("error")}: {error?.message}</div>;
  }

  return (
    <div className="m-4 min-h-screen">
      <h3 className="text-3xl font-semibold my-8">{t("title")}</h3>

      {/* Bookings Grid */}
      <div className="min-h-screen max-w-7xl mx-auto px-4 lg:px-8 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pagedBookings.map((booking, index) => {
          const property = properties[index];
          if (!property) return null;

          return (
            <BookingCard
              key={booking.id}
              booking={booking}
              property={property}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {t("prev")}
          </button>
          <span>
            {t("page")} {page} {t("of")} {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
