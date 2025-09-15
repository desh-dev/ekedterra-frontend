'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '@/lib/graphql/queries';
import { Property, PropertyInput, PaginationInput } from '@/lib/graphql/types';
import PropertyGrid from '@/components/property/property-grid';
import CategoryTabs from '@/components/home/category-tabs';
import HomeHero from '@/components/home/home-hero';

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState<PropertyInput>({});
  
  const { data, loading, error, refetch } = useQuery(GET_PROPERTIES, {
    variables: {
      property: searchFilters,
      pagination: { page: 1, limit: 20 } as PaginationInput
    },
    errorPolicy: 'all'
  });

  const properties: Property[] = data?.properties?.data || [];
  const total = data?.properties?.total || 0;

  const handleSearch = (filters: PropertyInput) => {
    setSearchFilters(filters);
    refetch({
      property: filters,
      pagination: { page: 1, limit: 20 }
    });
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...searchFilters, category: category as any };
    setSearchFilters(newFilters);
    refetch({
      property: newFilters,
      pagination: { page: 1, limit: 20 }
    });
  };

  // Show mock data while GraphQL endpoint is not connected
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Beautiful Apartment in Downtown',
      buildingName: 'Luxury Towers',
      type: 'apartment' as any,
      rent: 120,
      rentDuration: 'daily' as any,
      price: 120,
      vacant: true,
      mainImage: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=500&h=500&fit=crop&crop=center',
      contactInfo: '+1234567890',
      category: 'housing' as any,
      description: 'A stunning apartment with city views',
      userId: 'user1',
      address: {
        id: '1',
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        street: '123 Main St',
        zip: '94105',
        longitude: -122.4194,
        latitude: 37.7749
      },
      images: [
        { id: '1', imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=500&h=500&fit=crop&crop=center' },
        { id: '2', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop&crop=center' }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Cozy Studio Near Beach',
      buildingName: 'Seaside Complex',
      type: 'studio' as any,
      rent: 85,
      rentDuration: 'daily' as any,
      price: 85,
      vacant: true,
      mainImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop&crop=center',
      contactInfo: '+1234567891',
      category: 'housing' as any,
      description: 'Perfect beachside getaway',
      userId: 'user2',
      address: {
        id: '2',
        country: 'United States',
        region: 'California',
        city: 'Santa Monica',
        street: '456 Beach Blvd',
        zip: '90401',
        longitude: -118.4912,
        latitude: 34.0195
      },
      images: [
        { id: '3', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop&crop=center' }
      ],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      title: 'Modern House with Garden',
      buildingName: '',
      type: 'house' as any,
      rent: 200,
      rentDuration: 'daily' as any,
      price: 200,
      vacant: true,
      mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&crop=center',
      contactInfo: '+1234567892',
      category: 'housing' as any,
      description: 'Spacious house with beautiful garden',
      userId: 'user3',
      address: {
        id: '3',
        country: 'United States',
        region: 'California',
        city: 'Palo Alto',
        street: '789 Garden Way',
        zip: '94301',
        longitude: -122.1430,
        latitude: 37.4419
      },
      images: [
        { id: '4', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop&crop=center' }
      ],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    }
  ];

  // Use mock data if GraphQL data is not available
  const displayProperties = properties.length > 0 ? properties : mockProperties;

  return (
    <div className="min-h-screen bg-white">
      <HomeHero onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <CategoryTabs onCategoryChange={handleCategoryChange} />
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${total || displayProperties.length} stays`}
          </p>
        </div>

        {/* Property Grid */}
        <PropertyGrid 
          properties={displayProperties}
          loading={loading && properties.length === 0}
          onToggleFavorite={(propertyId) => {
            // TODO: Implement favorite toggle with GraphQL mutation
            console.log('Toggle favorite:', propertyId);
          }}
        />

        {/* Error handling */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">
              Could not load properties. Using sample data for demonstration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}