// Generated types based on GraphQL schemas

export type PropertyType =
  | "house"
  | "hotel"
  | "apartment"
  | "studio"
  | "store"
  | "room"
  | "guesthouse"
  | undefined;
export type PropertyCategory = "housing" | "land" | "business";

export type PropductCategory =
  | "transport"
  | "electronics"
  | "furniture"
  | "home"
  | "health"
  | "food"
  | "travel"
  | "education"
  | "clothing"
  | "toys"
  | "fashion"
  | "beauty"
  | "sports"
  | "service"
  | "music"
  | "gaming"
  | "other";

export type RentDuration = "daily" | "monthly" | "yearly";

export interface UserRole {
  id: string;
  role: string;
  verified: boolean;
}

export interface VerificationDocs {
  id: string;
  frontId: string;
  backId: string;
  selfie: string;
  selfieWithId: string;
}

export type BookingStatus = "pending" | "successful" | "cancelled" | "unknown";

export interface Property {
  id: string;
  title: string;
  buildingName?: string;
  type: PropertyType;
  currency: string;
  rent?: number;
  rentDuration?: RentDuration;
  price?: number;
  vacant: boolean;
  mainImage: string;
  contactInfo: string;
  category: PropertyCategory;
  description: string;
  userId: string;
  address?: PropertyAddress;
  images?: PropertyImage[];
  bookings?: Booking[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyAddress {
  id: string;
  country: string;
  region: string;
  city: string;
  street: string;
  zip: string;
  longitude?: number;
  latitude?: number;
}

export interface PropertyImage {
  id: string;
  imageUrl: string;
}

export interface ImageInput {
  imageUrl: string;
}

export interface User {
  userId: string;
  email: string;
  avatarUrl?: string;
  fullName: string;
  phone?: string;
  roles: UserRole[];
  address?: UserAddress;
  favorites?: Partial<Property>[];
  bookings?: Booking[];
  verificationDocs?: VerificationDocs;
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  id: string;
  country: string;
  region: string;
  city: string;
  street: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  bookingDate: string;
  checkoutDate: string;
  status: BookingStatus;
  property?: Property;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInput {
  userId: string;
  propertyId: string;
  status?: BookingStatus;
  bookingDate: string;
  checkoutDate?: string;
}

export interface BookingFilterInput {
  page: number;
  limit: number;
  propertyId?: string;
  userId?: string;
}

export interface BookingUpdateInput {
  status?: BookingStatus;
  bookingDate?: string;
  checkoutDate?: string;
}

export interface BookingEventData {
  bookingId?: string;
  userContact: string;
  agentContact: string;
  propertyInfo: {
    propertyId: string;
    propertyTitle: string;
  };
}

export interface PaginatedProperty {
  data: Property[];
  total: number;
}

// Input Types
export interface PropertyInput {
  id?: string;
  title?: string;
  buildingName?: string;
  type?: PropertyType;
  rent?: number;
  rentDuration?: RentDuration;
  price?: number;
  vacant?: boolean;
  mainImage?: string;
  contactInfo?: string;
  category?: PropertyCategory;
  description?: string;
  userId?: string;
  address?: PropertyAddressInput;
}

export interface PropertyAddressInput {
  country?: string;
  region?: string;
  city?: string;
  street?: string;
  zip?: string;
  longitude?: number;
  latitude?: number;
}

export interface PaginationInput {
  page: number;
  limit: number;
}

export interface SearchFilters {
  country?: string;
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  rentDuration?: RentDuration;
  category?: PropertyCategory;
}

export interface FavoriteInput {
  propertyId: string;
  userId: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: PropductCategory;
  price: number;
  stock: number;
  mainImage: string;
  salePrice: number;
  bulkPrice: number;
  bulkQty: number;
  userId: string;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  id?: string;
  name?: string;
  description?: string;
  category?: PropductCategory;
  price?: number;
  stock?: number;
  mainImage?: string;
  salePrice?: number;
  bulkPrice?: number;
  bulkQty?: number;
  userId?: string;
}
