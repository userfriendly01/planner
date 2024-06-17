import {
  AbstractGraphQLQuery
} from "./AbstractGraphQL.Query";
import {
  GraphQLError,
  GraphQLResponse
} from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export type BatchRecordQuery<RecordType> = (accessToken: string, records: Array<RecordType>) => Promise<BatchResults<RecordType>>;

export interface BatchVariables<VariableType> {
  input?: BatchInput<VariableType>;
}

export interface BatchInput<VariableType> {
  [key: string]: Array<VariableType>;
}

export interface BatchGraphQLResponse<ResponseDataType> extends GraphQLResponse<BatchGraphQLData<ResponseDataType>> {
  originalItems?: Array<ResponseDataType>;
}

export interface BatchGraphQLData<ResponseDataType> {
  items: Array<ResponseDataType>
}

export interface BatchResults<ResponseDataType> {
  alertMsg: string;
  errors: GraphQLError[];
  failure: Array<ResponseDataType>;
  hasError: boolean;
  success: Array<ResponseDataType>
}

export abstract class AbstractBatchRecordsQuery extends AbstractGraphQLQuery {
  protected abstract batchInputName(): string;

  async runBatch<VariableType, ResponseDataType>(accessToken: string, variables: Array<VariableType>): Promise<BatchResults<ResponseDataType>> {
    if (variables?.length === 0) {
      return {
        alertMsg: "Please select something to add",
        errors: [],
        failure: [],
        hasError: true,
        success: []
      } as BatchResults<ResponseDataType>;
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

          const batchGraphQLResponse = await this.query<BatchVariables<VariableType>, ResponseDataType>(accessToken, variables) as BatchGraphQLResponse<ResponseDataType>;
          batchGraphQLResponse.originalItems = [];

          return batchGraphQLResponse;
        }
      )
    );

    // logger.info("Create Batch Flow DB Response:", null, false); // TODO: Fix logging to send batchResults
    return this.buildResponse<ResponseDataType>(batchGraphQLResponses);
  }

  /**
   * Consolidate all of the command responses in a batch into 1 response object
   * @param {Array<BatchGraphQLResponse>} batchGraphQLResponses - a set results from all of the operations
   * @returns {Promise<BatchResults>} a consolidated response object
   */
  buildResponse<ResponseDataType>(batchGraphQLResponses: Array<BatchGraphQLResponse<ResponseDataType>>): BatchResults<ResponseDataType> {
    const batchResults = {
      alertMsg: "",
      errors: [],
      failure: [],
      hasError: false,
      success: []
    } as BatchResults<ResponseDataType>;

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