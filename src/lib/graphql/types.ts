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

export enum RentDuration {
  DAILY = "daily",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export type UserRole = "admin" | "agent";
export enum BookingStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  CANCELLED = "cancelled",
  UNKNOWN = "unknown",
}

export interface Property {
  id: string;
  title: string;
  buildingName?: string;
  type: PropertyType;
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

export interface User {
  userId: string;
  email: string;
  avatarUrl?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  verified: boolean;
  address?: UserAddress;
  favorites?: Property[];
  bookings?: Booking[];
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
  status: BookingStatus;
  property?: Property;
  createdAt: string;
  updatedAt: string;
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
