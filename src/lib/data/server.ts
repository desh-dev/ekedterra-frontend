import { apolloClient } from "../apollo/client";
import { GET_PROPERTY } from "../graphql/queries";

export async function getProperty(id: string) {
  try {
    const { data } = await apolloClient.query({
      query: GET_PROPERTY,
      variables: { id },
      errorPolicy: "all",
    });
    // @ts-expect-error Object is possibly 'null'.
    const property = data?.property;

    return property;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}
