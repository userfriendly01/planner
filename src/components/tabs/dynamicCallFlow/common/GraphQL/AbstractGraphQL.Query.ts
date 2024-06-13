import { env } from "../../../../../globals";

export interface GraphQLVariables {
  id?: number;
}

export interface GraphQLRecord {
  id?: number;
}

export interface GraphQLLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLLocation[];
  path?: string[];
  data?: any;
  errorType?: string;
  errorInfo?: string;
  extensions?: {
    classification?: string;
  };
}

export interface GraphQLResponse<GraphQLDataType> {
  hasResults: boolean;
  data: GraphQLDataType | null;
  errors: GraphQLError[];
}

export abstract class AbstractGraphQLQuery {
  protected abstract queryName(): string;
  protected abstract queryDefinition(): string;

  async query<Variables, GraphQLDataType>(accessToken: string, variables: Variables): Promise<GraphQLResponse<GraphQLDataType>> {
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