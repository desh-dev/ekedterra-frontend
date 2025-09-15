'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon, UserCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import SearchModal from '@/components/search/search-modal';
import UserMenu from '@/components/user/user-menu';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <div className="text-[#FF385C] text-2xl font-bold">
                airbnb
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-6 py-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <div className="flex items-center space-x-6 text-sm">
                <span className="font-medium text-gray-900">Where</span>
                <span className="text-gray-500">|</span>
                <span className="font-medium text-gray-900">When</span>
                <span className="text-gray-500">|</span>
                <span className="font-medium text-gray-900">Type</span>
              </div>
              <div className="bg-[#FF385C] p-2 rounded-full">
                <MagnifyingGlassIcon className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>

          {/* Search Icon - Mobile */}
          <div className="md:hidden flex-1 mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm bg-white"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-500 text-sm">Where to?</span>
            </button>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center space-x-4">
            {/* Become a Host - Desktop only */}
            <Link 
              href="/host" 
              className="hidden md:block text-sm font-medium text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-full transition-colors"
            >
              Airbnb your home
            </Link>

            {/* Globe Icon - Desktop only */}
            <button className="hidden md:block p-3 hover:bg-gray-50 rounded-full transition-colors">
              <GlobeAltIcon className="h-4 w-4 text-gray-700" />
            </button>

            {/* Wishlist - Mobile only */}
            <Link href="/wishlists" className="md:hidden p-2">
              <HeartIcon className="h-6 w-6 text-gray-700" />
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full pl-3 pr-2 py-1 hover:shadow-md transition-shadow"
              >
                <Bars3Icon className="h-4 w-4 text-gray-700" />
                <div className="bg-gray-500 rounded-full p-1">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
              </button>
              
              {isUserMenuOpen && (
                <UserMenu onClose={() => setIsUserMenuOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}