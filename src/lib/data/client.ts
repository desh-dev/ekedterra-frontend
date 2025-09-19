"use client";

import { apolloClient } from "../apollo/client";
import { GET_PROPERTIES } from "../graphql/queries";
import { PropertyInput } from "../graphql/types";

const LIMIT = 10;

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
      variables: { pagination: { page: pageParam, limit: LIMIT }, property },
    });

    //@ts-ignore
    const properties = data?.properties?.data;
    //@ts-ignore
    const total = data?.properties?.total;

    return { properties, total };
  } catch (error) {
    console.error(error);
  }
};
