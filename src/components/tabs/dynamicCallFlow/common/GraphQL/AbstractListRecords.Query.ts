import {
  AbstractGraphQLQuery, GraphQLVariables
} from "./AbstractGraphQL.Query";

export interface ListVariables extends GraphQLVariables {
  limit?: number;
  nextToken?: string;
}

export interface ListGraphQLData<RecordType> {
  [key: string]: ListResults<RecordType>;
}

export interface ListResults<RecordType> {
  nextToken: string;
  items: Array<RecordType>;
}

export abstract class AbstractListRecordsQuery extends AbstractGraphQLQuery {
  async getEntireList<RecordType>(accessToken: string): Promise<Array<RecordType>> {
    let nextToken: string = null;
    let entireList: Array<RecordType> = [];

    try {
      do {
        const listResults = await this.getList<RecordType>(accessToken, 10000, nextToken);

        nextToken = listResults.nextToken;
        entireList = entireList.concat(listResults.items);
        console.debug(`Retrieved ${listResults.items.length} of ${entireList.length} records`);
      } while (nextToken);
    } catch (error) {
      console.error(`Error in getEntireList: ${error?.message}`, { error });
    }

    return entireList;
  }

  async getList<RecordType>(accessToken: string, limit = 1000, nextToken?: string): Promise<ListResults<RecordType>> {
    const listVariables = {
      limit,
      nextToken
    } as ListVariables;

    const graphQLResponse = await this.query<ListVariables, ListGraphQLData<RecordType>>(accessToken, listVariables);

    if (graphQLResponse.errors?.length > 0) {
      throw new Error(`${graphQLResponse.errors.map(graphQLError => graphQLError.message)}`);
    }

    return graphQLResponse.data[this.queryName() as keyof typeof graphQLResponse.data] as ListResults<RecordType>;
  }
}