import { apolloClient } from "../apollo/client";
import { GET_USER } from "../graphql/queries";
import { User } from "../graphql/types";
import { createClient } from "../supabase/server";

const getUser = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id },
      fetchPolicy: "network-only",
    });
    //@ts-ignore
    return data?.user as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export const getRoles = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user: User = await getUser(data?.claims?.sub || "");
  const isAdmin = user?.roles?.some((role) => role.role === "admin");
  const isAgent = user?.roles?.some((role) => role.role === "agent");
  const isUser = !isAdmin && !isAgent;
  return {
    isAdmin,
    isAgent,
    isUser,
  };
};
