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
      address {
        country
        region
        city
        street
        zip
        longitude
        latitude
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_PROPERTY_ADDRESS = gql`
  mutation AddPropertyAddress(
    $propertyId: ID!
    $propertyAddress: PropertyAddressInput!
  ) {
    addPropertyAddress(
      propertyId: $propertyId
      propertyAddress: $propertyAddress
    ) {
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

export const UPDATE_PROPERTY_ADDRESS = gql`
  mutation UpdatePropertyAddress(
    $propertyId: ID!
    $propertyAddress: PropertyAddressInput!
  ) {
    updatePropertyAddress(
      propertyId: $propertyId
      propertyAddress: $propertyAddress
    ) {
      id
      country
      region
      city
      street
      zip
    }
  }
`;

export const ADD_PROPERTY_IMAGES = gql`
  mutation AddPropertyImages(
    $propertyId: ID!
    $propertyImages: [PropertyImageInput]!
  ) {
    addPropertyImages(
      propertyId: $propertyId
      propertyImages: $propertyImages
    ) {
      id
      imageUrl
    }
  }
`;

export const DELETE_PROPERTY_IMAGE = gql`
  mutation DeletePropertyImage($id: ID!) {
    deletePropertyImage(id: $id)
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

export const UPDATE_USER_ADDRESS = gql`
  mutation UpdateUserAddress($userId: ID!, $userAddress: UserAddressInput!) {
    updateUserAddress(userId: $userId, userAddress: $userAddress) {
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

export const ADD_VERIFICATION_DOCS = gql`
  mutation AddVerificationDocs(
    $userId: ID!
    $verificationDocs: VerificationDocsInput!
  ) {
    addVerificationDocs(userId: $userId, verificationDocs: $verificationDocs) {
      id
      frontId
      backId
      selfie
      selfieWithId
    }
  }
`;

export const UPDATE_VERIFICATION_DOCS = gql`
  mutation UpdateVerificationDocs(
    $userId: ID!
    $verificationDocs: VerificationDocsInput!
  ) {
    updateVerificationDocs(
      userId: $userId
      verificationDocs: $verificationDocs
    ) {
      id
      frontId
      backId
      selfie
      selfieWithId
    }
  }
`;

export const DELETE_VERIFICATION_DOCS = gql`
  mutation DeleteVerificationDocs($id: ID!) {
    deleteVerificationDocs(id: $id)
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($product: ProductCreateInput!) {
    createProduct(product: $product) {
      id
      name
      description
      category
      price
      stock
      mainImage
      salePrice
      bulkPrice
      bulkQty
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $product: ProductInput!) {
    updateProduct(id: $id, product: $product) {
      id
      name
      description
      category
      price
      stock
      mainImage
      salePrice
      bulkPrice
      bulkQty
      userId
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const ADD_PRODUCT_IMAGES = gql`
  mutation AddProductImages(
    $productId: ID!
    $productImages: [ProductImageInput]!
  ) {
    addProductImages(productId: $productId, productImages: $productImages) {
      id
      imageUrl
    }
  }
`;

export const DELETE_PRODUCT_IMAGE = gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`;

export const UPDATE_USER_VERIFICATION = gql`
  mutation UpdateUserVerification($id: ID!, $verified: Boolean!, $email: String) {
    updateUserVerification(id: $id, verified: $verified, email: $email)
  }
`