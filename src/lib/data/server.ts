import { apolloClient } from "../apollo/client";
import { GET_PROPERTY, GET_USER } from "../graphql/queries";
import { User } from "../graphql/types";
import { createClient } from "../supabase/server";

export const getUser = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id },
      fetchPolicy: "cache-first",
    });
    // @ts-expect-error Object is possibly 'null'.
    return data?.user as User;
  } catch (error: unknown) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export async function getRoles() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) throw new Error("No user found");
  const user: User = await getUser(data?.claims?.sub || "");
  let isVerified = false;
  const isAdmin = user?.roles?.some((role) => role.role === "admin");
  if (isAdmin) isVerified = user.roles.some((role) => role.verified);
  const isAgent = user?.roles?.some((role) => role.role === "agent");
  const isUser = !isAdmin && !isAgent;
  return {
    isAdmin,
    isVerified,
    isAgent,
    isUser,
  };
}

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
