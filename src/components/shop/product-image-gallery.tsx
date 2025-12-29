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

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
        onClick={() => setIsGalleryOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsGalleryOpen(true);
        }}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {safeImages.slice(0, 4).map((src, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 border transition-colors ${
                  isActive ? "border-primary" : "border-transparent"
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
