'use client';

import { PropertyInput } from '@/lib/graphql/types';

interface HomeHeroProps {
  onSearch: (filters: PropertyInput) => void;
}

export default function HomeHero({ onSearch }: HomeHeroProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="h-[400px] md:h-[500px] bg-gradient-to-r from-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=600&fit=crop&crop=center')`
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Find your next stay
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl">
            Discover amazing places to stay around the world
          </p>
        </div>
      </div>

      {/* Featured locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Popular destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'San Francisco', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' },
              { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=150&fit=crop' },
              { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop' },
              { name: 'Miami', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' }
            ].map((location) => (
              <button
                key={location.name}
                onClick={() => onSearch({ address: { city: location.name } })}
                className="text-left group"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url('${location.image}')` }}
                  />
                </div>
                <p className="font-medium text-gray-900">{location.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}