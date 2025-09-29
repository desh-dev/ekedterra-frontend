import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql",
});

const authLink = new SetContextLink(({ headers }, _) => {
  // Get the authentication token from localStorage if it exists
  // We'll integrate this with Supabase auth later

  const rawTokenString =
    typeof window !== "undefined"
      ? Cookies.get("sb-ytbcthjcgzjnpjchfklw-auth-token")?.split("base64-")[1]
      : null;
  if (!rawTokenString) return { headers };
  const decoded = atob(rawTokenString);
  const start = decoded.indexOf('access_token":"') + 'access_token":"'.length;
  const end = decoded.indexOf('","token_type"');

  const token = decoded.substring(start, end);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ["userId"],
      },
      Property: {
        keyFields: ["id"],
      },
      Booking: {
        keyFields: ["id"],
      },
      Product: {
        keyFields: ["id"],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
