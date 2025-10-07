"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

export interface ListingsFilterValues {
  rent?: number;
  isVacant?: boolean;
  buildingName?: string;
  title?: string;
  street?: string;
}

interface ListingsFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ListingsFilterValues) => void;
  initialFilters?: ListingsFilterValues;
}

const ListingsFiltersModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
}: ListingsFiltersModalProps) => {
  const [rent, setRent] = useState<string>("");
  const [isVacant, setIsVacant] = useState<string>("all");
  const [buildingName, setBuildingName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [street, setStreet] = useState<string>("");

  // Initialize form with existing filters
  useEffect(() => {
    if (initialFilters) {
      setRent(initialFilters.rent?.toString() || "");
      setIsVacant(
        initialFilters.isVacant === undefined
          ? "all"
          : initialFilters.isVacant
          ? "yes"
          : "no"
      );
      setBuildingName(initialFilters.buildingName || "");
      setTitle(initialFilters.title || "");
      setStreet(initialFilters.street || "");
    }
  }, [initialFilters, isOpen]);

  const handleApply = () => {
    const filters: ListingsFilterValues = {
      rent: rent ? Number(rent) : undefined,
      isVacant: isVacant === "all" ? undefined : isVacant === "yes",
      buildingName: buildingName?.trim() || undefined,
      title: title?.trim() || undefined,
      street: street?.trim() || undefined,
    };

    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setRent("");
    setIsVacant("all");
    setBuildingName("");
    setTitle("");
    setStreet("");

    // Apply empty filters to reset
    onApplyFilters({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.5,
              }}
              className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg md:mx-4 max-h-[90vh] overflow-y-auto md:max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">
                  Filter Properties
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Title Filter */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Property Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Filter by title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Building Name Filter */}
                <div>
                  <label
                    htmlFor="buildingName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Building Name
                  </label>
                  <input
                    type="text"
                    id="buildingName"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    placeholder="Filter by building name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Street/Area Filter */}
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Street/Area
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Filter by street or area..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Rent Filter */}
                <div>
                  <label
                    htmlFor="rent"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Maximum Rent
                  </label>
                  <input
                    type="number"
                    id="rent"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="Filter by maximum rent..."
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Vacant Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="all"
                        checked={isVacant === "all"}
                        onChange={(e) => setIsVacant(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-gray-700">All properties</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="yes"
                        checked={isVacant === "yes"}
                        onChange={(e) => setIsVacant(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-gray-700">Vacant only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="no"
                        checked={isVacant === "no"}
                        onChange={(e) => setIsVacant(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-gray-700">Occupied only</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 space-y-3">
                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={handleApply} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ListingsFiltersModal;
