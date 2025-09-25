"use client";

import { apolloClient } from "../apollo/client";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../graphql/mutations";
import { GET_PROPERTIES, GET_PROPERTY, GET_USER } from "../graphql/queries";
import { FavoriteInput, PropertyInput } from "../graphql/types";

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
