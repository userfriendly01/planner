import { AbstractGraphQLQuery } from "./AbstractGraphQL.Query";
import { logger } from "utils/logger";
import { LoadDataGridMonitorRef } from "dynamicCallFlowCommon/DataGrid/Load.DataGrid.Monitor";

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
        loadDataGridMonitor?.current.addToRecordCount(listResults.items.length);
        entireList = entireList.concat(listResults.items);
      } while (nextToken);
      // } while (nextToken && loopCounter < 1);
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
