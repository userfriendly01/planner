import React, { ReactElement } from "react";
import {
  ApolloClient, ApolloProvider, InMemoryCache, createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { env } from "globals";
import { useAdminState } from "context";

interface Props {
  children: ReactElement
}

export const SharedGraphAPIProvider = ({ children }: Props): ReactElement => {
  const state = useAdminState();

  const httpLink = createHttpLink({
    uri: `${env.GRAPH_API_URL}/graphql`
  });

  const authLink = setContext(async (_, { headers }) => {
    const { accessToken } =  state.userContext;

    return {
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : ""
      }
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};
