import { AbstractGraphQLQuery } from "./AbstractGraphQL.Query";
import { LoadDataGridMonitorRef } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { logger } from "utils/logger";

export interface ListVariables {
  id?: number;
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
  async getEntireList<RecordType>(accessToken: string, loadDataGridMonitor?: LoadDataGridMonitorRef): Promise<Array<RecordType>> {
    let nextToken: string = null;
    let entireList: Array<RecordType> = [];
    let loopCounter = 0; // used to limit the number of records fetched in local environment to make local testing faster

    try {
      do {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loopCounter++; // used to limit the number of records fetched in local environment to make local testing faster
        const listResults = await this.getList<RecordType>(accessToken, 10000, nextToken);
        nextToken = listResults.nextToken;
        loadDataGridMonitor.current.addToRecordCount(listResults.items.length);
        entireList = entireList.concat(listResults.items);
      } while (nextToken); // This can be set in local environment to limit the number of records fetched
      // } while (nextToken & loopCounter < 3); // This can be set in local environment to limit the number of records fetched
    } catch (error) {
      logger.error(`Error in getEntireList: ${error?.message}`, error );
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