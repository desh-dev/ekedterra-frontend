'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CategoryTabsProps {
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const t = useTranslations('home.categories');

  const categories = [
    { id: '', label: t('all'), icon: '🏠' },
    { id: 'apartment', label: t('apartments'), icon: '🏢' },
    { id: 'house', label: t('houses'), icon: '🏡' },
    { id: 'studio', label: t('studios'), icon: '🏠' },
    { id: 'room', label: t('rooms'), icon: '🛏️' },
    { id: 'hotel', label: t('hotels'), icon: '🏨' },
    { id: 'guesthouse', label: t('guesthouses'), icon: '🏘️' },
    { id: 'land', label: t('land'), icon: '🌍' },
    { id: 'business', label: t('business'), icon: '🏢' },
  ];
  const [activeCategory, setActiveCategory] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200));
  };

  const scrollRight = () => {
    setScrollPosition(scrollPosition + 200);
  };

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-gray-200 py-4 mb-8">
      <div className="relative">
        {/* Left scroll button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          style={{ opacity: scrollPosition > 0 ? 1 : 0 }}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Right scroll button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>

        {/* Categories container */}
        <div className="overflow-hidden mx-8">
          <div
            className="flex space-x-8 transition-transform duration-300"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-3 border-b-2 transition-colors ${
                  activeCategory === category.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
