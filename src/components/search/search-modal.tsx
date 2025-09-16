'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PropertyType, PropertyCategory, RentDuration } from '@/lib/graphql/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchState {
  country: string;
  city: string;
  type: PropertyType | '';
  category: PropertyCategory | '';
  rentDuration: RentDuration | '';
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    country: '',
    city: '',
    type: '',
    category: '',
    rentDuration: '',
  });

  const [activeTab, setActiveTab] = useState<'homes' | 'experiences' | 'services'>('homes');

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search:', searchState);
    onClose();
  };

  const clearAll = () => {
    setSearchState({
      country: '',
      city: '',
      type: '',
      category: '',
      rentDuration: '',
    });
  };

  const tabs = [
    { id: 'homes', label: 'Homes', icon: '🏠' },
    { id: 'experiences', label: 'Experiences', icon: '💡', badge: 'NEW' },
    { id: 'services', label: 'Services', icon: '🛎️', badge: 'NEW' },
  ];

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
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
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
                <div className="relative p-6 pb-0">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>

                  {/* Tabs */}
                  <div className="flex space-x-1 mb-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                          activeTab === tab.id
                            ? 'text-black'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                            {tab.badge}
                          </span>
                        )}
                        {activeTab === tab.id && (
                          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-black rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Form */}
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {/* Where */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Where?
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Search destinations"
                          value={searchState.country}
                          onChange={(e) => setSearchState({ ...searchState, country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={searchState.city}
                          onChange={(e) => setSearchState({ ...searchState, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Type
                      </label>
                      <select
                        value={searchState.type}
                        onChange={(e) => setSearchState({ ...searchState, type: e.target.value as PropertyType })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      >
                        <option value="">Any type</option>
                        <option value={PropertyType.STUDIO}>Studio</option>
                        <option value={PropertyType.ROOM}>Room</option>
                        <option value={PropertyType.APARTMENT}>Apartment</option>
                        <option value={PropertyType.HOUSE}>House</option>
                        <option value={PropertyType.HOTEL}>Hotel</option>
                        <option value={PropertyType.GUESTHOUSE}>Guesthouse</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Category
                      </label>
                      <select
                        value={searchState.category}
                        onChange={(e) => setSearchState({ ...searchState, category: e.target.value as PropertyCategory })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      >
                        <option value="">Any category</option>
                        <option value={PropertyCategory.HOUSING}>Housing</option>
                        <option value={PropertyCategory.BUSINESS}>Business</option>
                        <option value={PropertyCategory.LAND}>Land</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Duration
                      </label>
                      <select
                        value={searchState.rentDuration}
                        onChange={(e) => setSearchState({ ...searchState, rentDuration: e.target.value as RentDuration })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      >
                        <option value="">Any duration</option>
                        <option value={RentDuration.DAILY}>Daily</option>
                        <option value={RentDuration.MONTHLY}>Monthly</option>
                        <option value={RentDuration.YEARLY}>Yearly</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={clearAll}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 underline"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={handleSearch}
                      className="flex items-center space-x-2 bg-[#FF385C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E31C5F] transition-colors"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4" />
                      <span>Search</span>
                    </button>
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