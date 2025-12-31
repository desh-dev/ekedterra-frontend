"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import PropertyGallery from "@/components/property/property-gallery";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const mainImage = safeImages[selectedIndex] || safeImages[0];

  const handleMainImageClick = () => {
    // Cycle to next image when main image is clicked
    setSelectedIndex((prev) => (prev + 1) % safeImages.length);
  };

  const scrollToThumbnail = (index: number) => {
    const container = document.getElementById("thumbnail-container");
    const thumb = document.getElementById(`thumbnail-${index}`);
    if (container && thumb) {
      thumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 cursor-pointer group"
        onClick={handleMainImageClick}
        onDoubleClick={() => setIsGalleryOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleMainImageClick();
        }}
      >
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div
          id="thumbnail-container"
          className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
        >
          {safeImages.map((src, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={idx}
                id={`thumbnail-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  scrollToThumbnail(idx);
                }}
                className={`relative aspect-square flex-shrink-0 w-20 sm:w-24 overflow-hidden rounded-lg bg-gray-100 border transition-all ${
                  isActive
                    ? "border-primary scale-105"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} ${idx + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      <PropertyGallery
        images={safeImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title={title}
        initialIndex={selectedIndex}
      />
    </div>
  );
}
