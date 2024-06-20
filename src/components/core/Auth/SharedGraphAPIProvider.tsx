import React, { ReactElement } from "react";
import {
  ApolloClient, ApolloProvider, InMemoryCache, createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { env } from "globals";
import { useAdminState } from "context/appContext";

interface Props {
  children: ReactElement
}

// To use this, the tokenManager (defined in App.jsx)
// must get an accessToken. After this point, all 
// calls will automatically include the access token in the header.
// You can use hooks (preferred) or the apolloClient directly
export let apolloClient: ApolloClient<any>;

export const SharedGraphAPIProvider = ({ children }: Props): ReactElement => {
  const state = useAdminState();

  const httpLink = createHttpLink({
    uri: env.GRAPH_API_URL
  });

  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${state.userContext.accessTokenGraph}`
    }
  }));

  apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};
