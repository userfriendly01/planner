import { AbstractGraphQLQuery } from "./AbstractGraphQLQuery";
import {
  GraphQLError, GraphQLResponse
} from "./GraphQL.Interfaces";

export type BatchRecordQuery<RecordType> = (accessToken: string, records: Array<RecordType>) => Promise<BatchResults<RecordType>>;

export interface BatchVariables<RecordType> {
  input?: BatchInput<RecordType>;
}

export interface BatchInput<RecordType> {
  [key: string]: Array<RecordType>;
}

export interface BatchGraphQLResponse<RecordType> extends GraphQLResponse<BatchGraphQLData<RecordType>> {
  originalItems?: Array<RecordType>;
}

export interface BatchGraphQLData<RecordType> {
  items: Array<RecordType>
}

export interface BatchResults<RecordType> {
  alertMsg: string;
  errors: GraphQLError[];
  failure: Array<RecordType>;
  hasError: boolean;
  success: Array<RecordType>
}

export abstract class AbstractBatchQuery extends AbstractGraphQLQuery {
  protected abstract batchInputName(): string;

  async runBatch<RecordType>(accessToken: string, records: Array<RecordType>): Promise<BatchResults<RecordType>> {
    if (records.length === 0) {
      return {
        alertMsg: "Please select something to add",
        errors: [],
        failure: [],
        hasError: true,
        success: []
      } as BatchResults<RecordType>;
    }

    const recordsCopy = [...records];
    const callFlowRecordBatches: Array<Array<RecordType>> = [];

    while (recordsCopy.length > 0) {
      // Splice the records into batches of 25
      callFlowRecordBatches.push(recordsCopy.splice(0, 25));
    }

    const batchGraphQLResponses = await Promise.all(
      callFlowRecordBatches.map(
        async recordBatch => {
          const variables: BatchVariables<RecordType> = {
            //Put an empty object here as a placeholder, then set the records to be updated via dynamic property access.  Batch input structure example: { input: { batchCreatePhoneNumber: Array<PhoneNumber> } }
            input: {} as BatchInput<RecordType>
          };

          variables.input[this.batchInputName() as keyof typeof variables] = recordBatch;

          const batchGraphQLResponse = await this.query<BatchVariables<RecordType>, RecordType>(accessToken, this.queryDefinition(), variables) as BatchGraphQLResponse<RecordType>;
          batchGraphQLResponse.originalItems = records;

          return batchGraphQLResponse;
        }
      )
    );

    // logger.info("Create Batch Flow DB Response:", null, false); // TODO: Fix logging to send batchResults
    return this.buildResponse<RecordType>(batchGraphQLResponses);
  }

  /**
   * Consolidate all of the command responses in a batch into 1 response object
   * @param {Array<BatchGraphQLResponse>} batchGraphQLResponse - a set results from all of the operations
   * @returns {Promise<BatchResults>} a consolidated response object
   */
  private buildResponse<RecordType>(batchGraphQLResponse: Array<BatchGraphQLResponse<RecordType>>): BatchResults<RecordType> {
    const batchResults = {
      alertMsg: "",
      errors: [],
      failure: [],
      hasError: false,
      success: []
    } as BatchResults<RecordType>;

    batchGraphQLResponse.forEach( batchGraphQLResponse=>{
      if (batchGraphQLResponse.errors?.length > 0) {
        batchResults.errors = batchResults.errors.concat(batchGraphQLResponse.errors);
        batchResults.failure = batchResults.failure.concat(batchGraphQLResponse.originalItems);
        batchResults.hasError = true;
        batchResults.alertMsg = `Errors occurred processing ${this.queryName()} records`;
      } else {
        const queryDataKey = this.queryName() as keyof typeof batchGraphQLResponse.data;
        batchResults.success = batchResults.success.concat(batchGraphQLResponse.data[queryDataKey]);
      }
    });

    return batchResults;
  }
}