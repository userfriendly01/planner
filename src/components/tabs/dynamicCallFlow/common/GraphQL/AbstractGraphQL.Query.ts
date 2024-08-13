import { env } from "globals/index";
import { GraphQLResponse } from "./DynamicCallFlow.Interfaces";

export abstract class AbstractGraphQLQuery {
  abstract queryName(): string;
  abstract queryDefinition(): string;

  async query<VariableType, GraphQLDataType>(accessToken: string, variables: VariableType): Promise<GraphQLResponse<GraphQLDataType>> {
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

    return await response.json() as GraphQLResponse<GraphQLDataType>;
  }
}