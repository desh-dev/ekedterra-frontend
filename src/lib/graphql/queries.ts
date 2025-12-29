import { gql } from "@apollo/client";

// Property Queries
export const GET_PROPERTIES = gql`
  query GetProperties($property: PropertyInput, $pagination: PaginationInput!) {
    properties(property: $property, pagination: $pagination) {
      data {
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
        }
        images {
          id
          imageUrl
        }
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const GET_LISTINGS = gql`
  query GetProperties($property: PropertyInput, $pagination: PaginationInput!) {
    properties(property: $property, pagination: $pagination) {
      data {
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
        images {
          id
          imageUrl
        }
        bookings {
          id
          userId
          bookingDate
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const GET_PROPERTY = gql`
  query GetProperty($id: ID!) {
    property(id: $id) {
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
        id
        country
        region
        city
        street
        zip
        longitude
        latitude
      }
      images {
        id
        imageUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROPERTY_AGENT = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      userId
      email
      phone
    }
  }
`;

// User Queries
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      userId
      email
      avatarUrl
      fullName
      phone
      roles {
        id
        role
        verified
      }
      address {
        id
        country
        region
        city
        street
        zip
      }
      favorites {
        id
      }
      bookings {
        id
        propertyId
        bookingDate
        checkoutDate
        status
        createdAt
        property {
          id
          title
          buildingName
          mainImage
          address {
            city
            country
          }
        }
      }
      verificationDocs {
        id
        frontId
        backId
        selfie
        selfieWithId
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_AGENTS = gql`
  query Agents($page: Int!, $limit: Int!) {
    agents(page: $page, limit: $limit) {
      userId
      email
      avatarUrl
      fullName
      phone
      address {
        id
        country
        region
        city
        street
        zip
      }
      roles {
        id
        role
        verified
      }
      verificationDocs {
        id
        frontId
        backId
        selfie
        selfieWithId
      }
      createdAt
      updatedAt
    }
  }
`;

// Booking Queries
export const GET_BOOKINGS = gql`
  query GetBookings($bookingFilterInput: BookingFilterInput!) {
    bookings(bookingFilterInput: $bookingFilterInput) {
      id
      userId
      propertyId
      bookingDate
      checkoutDate
      status
      createdAt
      updatedAt
    }
  }
`;

// export const GET_ALL_BOOKINGS = gql`
//   query Bookings($bookingFilterInput: BookingFilterInput!) {
//     bookings(bookingFilterInput: $bookingFilterInput) {
//       id
//       userId
//       propertyId
//       bookingDate
//       checkoutDate
//       status
//       createdAt
//       updatedAt
//     }
//   }
// `;

export const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    booking(id: $id) {
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

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      category
      price
      stock
      mainImage
      images {
        id
        imageUrl
      }
      salePrice
      bulkPrice
      bulkQty
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts(
    $product: ProductInput!
    $paginationInput: PaginationInput!
  ) {
    products(product: $product, paginationInput: $paginationInput) {
      data {
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
      total
    }
  }
`;

export const GET_PRODUCTS_LISTINGS = gql`
  query GetProducts(
    $product: ProductInput!
    $paginationInput: PaginationInput!
  ) {
    products(product: $product, paginationInput: $paginationInput) {
      data {
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
        images {
          id
          imageUrl
        }
        createdAt
        updatedAt
      }
      total
    }
  }
`;

// export const GET_ALL_PROPERTIES = gql`
//   query GetAllProperties($property: PropertyInput, $pagination: PaginationInput!) {
//     properties(property: $property, pagination: $pagination) {
//       data {
//         id
//         title
//         buildingName
//         type
//         rent
//         rentDuration
//         price
//         vacant
//         mainImage
//         contactInfo
//         category
//         description
//         userId
//         user {
//           userId
//           email
//           fullName
//           phone
//         }
//         address {
//           id
//           country
//           region
//           city
//           street
//           zip
//           longitude
//           latitude
//         }
//         images {
//           id
//           imageUrl
//         }
//         createdAt
//         updatedAt
//       }
//       total
//     }
//   }
// `;
