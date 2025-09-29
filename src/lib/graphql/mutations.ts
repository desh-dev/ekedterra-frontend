import { gql } from "@apollo/client";

// Property Mutations
export const CREATE_PROPERTY = gql`
  mutation CreateProperty($property: PropertyCreateInput!) {
    createProperty(property: $property) {
      id
      title
      buildingName
      type
      rent
      rentDuration
      price
      vacant
      mainImage
      contactInfo
      category
      description
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($id: ID!, $property: PropertyUpdateInput!) {
    updateProperty(id: $id, property: $property) {
      id
      title
      buildingName
      type
      rent
      rentDuration
      price
      vacant
      mainImage
      contactInfo
      category
      description
      userId
      updatedAt
    }
  }
`;

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: ID!) {
    deleteProperty(id: $id)
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($favorite: FavoriteInput!) {
    addFavorite(favorite: $favorite) {
      propertyId
      userId
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation DeleteFavorite($favorite: FavoriteInput!) {
    deleteFavorite(favorite: $favorite)
  }
`;

// Booking Mutations
export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $booking: BookingInput!
    $bookingEventData: BookingEventData!
  ) {
    createBooking(booking: $booking, bookingEventData: $bookingEventData) {
      id
      userId
      propertyId
      bookingDate
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking(
    $id: ID!
    $booking: BookingUpdateInput!
    $bookingEventData: BookingEventData!
  ) {
    updateBooking(
      id: $id
      booking: $booking
      bookingEventData: $bookingEventData
    ) {
      id
      userId
      propertyId
      bookingDate
      status
      updatedAt
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!, $bookingEventData: BookingEventData!) {
    deleteBooking(id: $id, bookingEventData: $bookingEventData)
  }
`;

// User Mutations
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $user: userInput!) {
    updateUser(id: $id, user: $user) {
      userId
      email
      avatarUrl
      fullName
      phone
      role
      verified
      updatedAt
    }
  }
`;

export const ADD_USER_ADDRESS = gql`
  mutation AddUserAddress($userId: ID!, $userAddress: UserAddressInput!) {
    addUserAddress(userId: $userId, userAddress: $userAddress) {
      id
      country
      region
      city
      street
      zip
      createdAt
      updatedAt
    }
  }
`;

export const ADD_ROLE = gql`
  mutation AddRole($role: RoleInput!, $userId: ID!) {
    addRole(role: $role, userId: $userId) {
      id
      role
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`;
