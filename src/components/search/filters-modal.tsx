"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PropertyType } from "@/lib/graphql/types";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  minPrice: number;
  maxPrice: number;
  propertyType: PropertyType | "";
  amenities: string[];
  bedrooms: number | "";
  bathrooms: number | "";
  instantBook: boolean;
}

const amenityOptions = [
  { id: "wifi", label: "Wifi", icon: "📶" },
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "parking", label: "Free parking", icon: "🅿️" },
  { id: "pool", label: "Pool", icon: "🏊‍♂️" },
  { id: "gym", label: "Gym", icon: "💪" },
  { id: "aircon", label: "Air conditioning", icon: "❄️" },
  { id: "washer", label: "Washer", icon: "🧺" },
  { id: "tv", label: "TV", icon: "📺" },
];

export default function FiltersModal({
  isOpen,
  onClose,
  onApplyFilters,
}: FiltersModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 50,
    maxPrice: 800,
    propertyType: "",
    amenities: [],
    bedrooms: "",
    bathrooms: "",
    instantBook: false,
  });

  const handleAmenityToggle = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      minPrice: 50,
      maxPrice: 800,
      propertyType: "",
      amenities: [],
      bedrooms: "",
      bathrooms: "",
      instantBook: false,
    });
  };

  const propertyCount = 1000; // This would come from actual search results

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
                    Filters
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-6 pb-6 space-y-8 max-h-[70vh] overflow-y-auto">
                  {/* Recommended for you */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Recommended for you
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {amenityOptions.slice(0, 3).map((amenity) => (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                            filters.amenities.includes(amenity.id)
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <span className="text-2xl mb-2">{amenity.icon}</span>
                          <span className="text-xs text-center font-medium">
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type of place */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Type of place</h3>
                    <div className="flex space-x-2">
                      {[
                        { value: "", label: "Any type" },
                        // { value: PropertyType.ROOM, label: "Room" },
                        // { value: PropertyType.APARTMENT, label: "Entire home" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              propertyType: type.value as PropertyType,
                            })
                          }
                          className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                            filters.propertyType === type.value
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Price range</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Trip price, includes all fees
                    </p>

                    {/* Price histogram visualization */}
                    <div className="h-16 bg-gray-50 rounded-lg mb-4 flex items-end justify-center p-2">
                      <div className="flex items-end space-x-1 h-full">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-[#FF385C] rounded-sm"
                            style={{
                              height: `${Math.random() * 100}%`,
                              width: "8px",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Price inputs */}
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Minimum
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minPrice: Number(e.target.value),
                              })
                            }
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Maximum
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                maxPrice: Number(e.target.value),
                              })
                            }
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rooms and beds */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Rooms and beds</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">Bedrooms</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600">Any</span>
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              onClick={() =>
                                setFilters({ ...filters, bedrooms: num })
                              }
                              className={`w-8 h-8 rounded-full border text-sm font-medium ${
                                filters.bedrooms === num
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 text-gray-700 hover:border-gray-400"
                              }`}
                            >
                              {num}+
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">Beds</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600">Any</span>
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              className={`w-8 h-8 rounded-full border text-sm font-medium border-gray-300 text-gray-700 hover:border-gray-400`}
                            >
                              {num}+
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All amenities */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {amenityOptions.map((amenity) => (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`flex items-center space-x-3 p-3 border rounded-lg text-left transition-colors ${
                            filters.amenities.includes(amenity.id)
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <span className="text-xl">{amenity.icon}</span>
                          <span className="text-sm font-medium">
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <button
                    onClick={handleClear}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={handleApply}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Show {propertyCount.toLocaleString()}+ places
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
