import { GraphQLResponse } from "./GraphQL.Interfaces";
import { env } from "../../globals";

export abstract class AbstractGraphQLQuery {
  protected abstract queryName(): string;
  protected abstract queryDefinition(): string;

  async query<Variables, GraphQLDataType>(accessToken: string, query: string, variables: Variables): Promise<GraphQLResponse<GraphQLDataType>> {
    const response: Response = await fetch(env.GRAPH_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: this.queryDefinition().replace(/[\n\r]/g, ""),
        operationName: this.queryName(),
        variables: variables
      })
    });

    const graphQLResponse: GraphQLResponse<GraphQLDataType> = await response.json();

    return graphQLResponse;
  }
}