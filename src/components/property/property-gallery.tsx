"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function PropertyGallery({
  images,
  isOpen,
  onClose,
  title,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

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
          <div className="fixed inset-0 bg-black" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full max-w-none bg-black text-white">
                {/* Header */}
                <div
                  className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6"
                  style={{
                    paddingTop: "max(1.5rem, env(safe-area-inset-top))",
                  }}
                >
                  <button
                    onClick={onClose}
                    className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">Close</span>
                  </button>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {currentIndex + 1} / {images.length}
                    </p>
                  </div>
                  <div className="w-20" /> {/* Spacer for centering */}
                </div>

                {/* Main Image */}
                <div className="relative h-full flex items-center justify-center">
                  {images.length > 0 && (
                    <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
                      <Image
                        src={images[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        width={1200}
                        height={800}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronLeftIcon className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronRightIcon className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-center space-x-2 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentIndex
                              ? "border-white"
                              : "border-transparent opacity-60 hover:opacity-80"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyboard Navigation */}
                <div
                  className="fixed inset-0 -z-10"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") goToPrevious();
                    if (e.key === "ArrowRight") goToNext();
                    if (e.key === "Escape") onClose();
                  }}
                  tabIndex={0}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
