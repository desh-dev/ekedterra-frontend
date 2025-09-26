"use client";

import { apolloClient } from "../apollo/client";
import { ADD_FAVORITE, REMOVE_FAVORITE, CREATE_BOOKING, UPDATE_BOOKING, DELETE_BOOKING } from "../graphql/mutations";
import { GET_PROPERTIES, GET_PROPERTY, GET_PROPERTY_AGENT, GET_USER } from "../graphql/queries";
import { FavoriteInput, PropertyInput, BookingInput, BookingEventData, BookingUpdateInput } from "../graphql/types";

const LIMIT = 10;

export const getUser = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id },
      fetchPolicy: "network-only",
    });
    //@ts-ignore
    return data?.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export const getPropertyAgent = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PROPERTY_AGENT,
      variables: { id },
      fetchPolicy: "network-only",
    });
    //@ts-ignore
    return data?.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Booking functions
export const createBooking = async (booking: BookingInput, bookingEventData: BookingEventData): Promise<any> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_BOOKING,
      variables: { booking, bookingEventData },
    });
    return (data as any)?.createBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id: string, booking: BookingUpdateInput, bookingEventData: BookingEventData): Promise<any> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_BOOKING,
      variables: { id, booking, bookingEventData },
    });
    return (data as any)?.updateBooking;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (id: string, bookingEventData: BookingEventData): Promise<any> => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_BOOKING,
      variables: { id, bookingEventData },
    });
    return (data as any)?.deleteBooking;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

export const getProperty = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PROPERTY,
      variables: { id },
    });
    //@ts-ignore
    return data?.property;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProperties = async ({
  pageParam,
  property,
}: {
  pageParam: number;
  property?: PropertyInput;
}) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PROPERTIES,
      variables: {
        pagination: { page: pageParam, limit: LIMIT },
        property,
      },
    });

    //@ts-ignore
    const properties = data?.properties?.data;
    //@ts-ignore
    const total = data?.properties?.total;

    return { properties, total };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addFavorite = async (favorite: FavoriteInput) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_FAVORITE,
      variables: { favorite },
    });
    //@ts-ignore
    return data?.addFavorite;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeFavorite = async (favorite: FavoriteInput) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_FAVORITE,
      variables: { favorite },
    });
    //@ts-ignore
    return data?.removeFavorite;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
