import {
  AbstractGraphQLQuery, GraphQLError, GraphQLResponse
} from "./AbstractGraphQL.Query";

export type BatchRecordQuery<RecordType> = (accessToken: string, records: Array<RecordType>) => Promise<BatchResults<RecordType>>;

export interface BatchVariables<VariableType> {
  input?: BatchInput<VariableType>;
}

export interface BatchInput<VariableType> {
  [key: string]: Array<VariableType>;
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

export abstract class AbstractBatchRecordsQuery<VariableType, RecordType> extends AbstractGraphQLQuery {
  protected abstract batchInputName(): string;

  async runBatch(accessToken: string, variables: Array<VariableType>): Promise<BatchResults<RecordType>> {
    if (variables?.length === 0) {
      return {
        alertMsg: "Please select something to add",
        errors: [],
        failure: [],
        hasError: true,
        success: []
      } as BatchResults<RecordType>;
    }

    const variablesCopy = [...variables];
    const variableBatches: Array<Array<VariableType>> = [];

    while (variablesCopy.length > 0) {
      // Splice the records into batches of 25
      variableBatches.push(variablesCopy.splice(0, 25));
    }

    const batchGraphQLResponses = await Promise.all(
      variableBatches.map(
        async variablesBatch => {
          const variables: BatchVariables<VariableType> = {
            //Put an empty object here as a placeholder, then set the records to be updated via dynamic property access.  Batch input structure example: { input: { batchCreatePhoneNumber: Array<PhoneNumber> } }
            input: {} as BatchInput<VariableType>
          };

          variables.input[this.batchInputName()] = variablesBatch;

          const batchGraphQLResponse = await this.query<BatchVariables<VariableType>, RecordType>(accessToken, variables) as BatchGraphQLResponse<RecordType>;
          batchGraphQLResponse.originalItems = [];

          return batchGraphQLResponse;
        }
      )
    );

    // logger.info("Create Batch Flow DB Response:", null, false); // TODO: Fix logging to send batchResults
    return this.buildResponse<RecordType>(batchGraphQLResponses);
  }

  /**
   * Consolidate all of the command responses in a batch into 1 response object
   * @param {Array<BatchGraphQLResponse>} batchGraphQLResponses - a set results from all of the operations
   * @returns {Promise<BatchResults>} a consolidated response object
   */
  protected buildResponse<RecordType>(batchGraphQLResponses: Array<BatchGraphQLResponse<RecordType>>): BatchResults<RecordType> {
    const batchResults = {
      alertMsg: "",
      errors: [],
      failure: [],
      hasError: false,
      success: []
    } as BatchResults<RecordType>;

    batchGraphQLResponses.forEach( batchGraphQLResponse=>{
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