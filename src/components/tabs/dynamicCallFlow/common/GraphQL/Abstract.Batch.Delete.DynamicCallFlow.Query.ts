import {
  CallFlowDeleteBatchInput,
  BatchCallFlowDeleteResponse,
  GraphQLResponse, CallFlowDeleteInput
} from "./DynamicCallFlow.Interfaces";
import { BatchResults } from "./Abstract.BatchRecords.Query";
import { AbstractGraphQLQuery } from "./AbstractGraphQL.Query";

/**
 * This class is responsible for deleting dynamic phone number ***AND*** action records.  It is a subclass of AbstractBatchDeleteDynamicCallFlowQuery.
 * The query definition here is shared between phone number and action.  The cicct-shared-graph-api project needs updated to rename the query to something
 * more common between phone number and action.  As it stands now, it is a bit ambiguous to name it batchDeletePhoneNumber yet it deletes both phone number
 * and action records.
 */
export abstract class AbstractBatchDeleteDynamicCallFlowQuery<RecordType> extends AbstractGraphQLQuery {
  /**
   * batchDeletePhoneNumber mutation is used for both dynamic phone numbers & actions. Should be refactored in GraphQL
   * to be less ambiguous.  This name isn't clear that it is used for both types of records.
   */
  queryName(): string {
    return "batchDeletePhoneNumber";
  }

  /**
   * This queryDefinition is used to delete both phone number and action records.  The cicct-shared-graph-api project needs updated to rename the query to
   * something more common between phone number and action.  As it stands now, it is a bit ambiguous to name it batchDeletePhoneNumber yet it deletes both phone number
   * and action records.
   *
   * @protected
   */
  queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: CallFlowDeleteBatchInput!) {
        ${this.queryName()}(input: $input) {
          items {
              id
          }
        }
      }`;
  }

  protected abstract generateCallFlowDeleteInputs(records: Array<RecordType>): Array<CallFlowDeleteInput>;

  /**
   * This method iterates through the array CallFlowDeleteBatchInput(s) and executes the query for each entry and stores the
   * GraphQLResponse<BatchCallFlowDeleteResponse>(es) as an array which is then used to build the BatchResults method response
   *
   * @param {string} accessToken
   * @param {Array<RecordType>} records
   * @return {Promise<BatchResults<RecordType>>}
   */
  async batchQuery(accessToken: string, records: Array<RecordType>): Promise<BatchResults<RecordType>> {
    const batchOfCallFlowDeleteBatchInput: Array<CallFlowDeleteBatchInput> = this.generateBatchOfGraphQLInputs(records);

    const batchGraphQLResponses: Array<GraphQLResponse<BatchCallFlowDeleteResponse>> = await Promise.all(
      batchOfCallFlowDeleteBatchInput.map(
        async graphQLInputVariables => {
          return await this.query<CallFlowDeleteBatchInput, BatchCallFlowDeleteResponse>(accessToken, graphQLInputVariables) as GraphQLResponse<BatchCallFlowDeleteResponse>;
        }
      )
    );

    return this.buildResponse(batchGraphQLResponses);
  }

  /**
   * This method generates an array of CallFlowDeleteBatchInput.  It splices the records into batches of 25 CallFlowDeleteInput
   * as that is the limit that GraphQL will accept.
   *
   * @param records
   * @return {Array<CallFlowDeleteBatchInput>}
   * @protected
   */
  protected generateBatchOfGraphQLInputs(records: Array<RecordType>): Array<CallFlowDeleteBatchInput> {
    const batchOfCallFlowDeleteBatchInput: Array<CallFlowDeleteBatchInput> = [];
    const recordsCopy = [...records];

    while (recordsCopy.length > 0) {
      // Splice the records into batches of 25
      const callFlowDeleteBatchInput = {
        input: {
          batchDeleteInput: this.generateCallFlowDeleteInputs(recordsCopy.splice(0, 25))
        }
      } as CallFlowDeleteBatchInput;

      batchOfCallFlowDeleteBatchInput.push(callFlowDeleteBatchInput);
    }

    return batchOfCallFlowDeleteBatchInput;
  }

  private buildResponse(batchGraphQLResponses: Array<GraphQLResponse<BatchCallFlowDeleteResponse>>): BatchResults<RecordType> {
    const batchResults = {
      alertMsg: "",
      errors: [],
      failure: [],
      hasError: false,
      success: []
    } as BatchResults<RecordType>;

    batchGraphQLResponses.forEach(batchGraphQLResponse => {
      if (batchGraphQLResponse.errors?.length > 0) {
        batchResults.errors = batchResults.errors.concat(batchGraphQLResponse.errors);
        batchResults.hasError = true;
        batchResults.alertMsg = `Errors occurred processing ${this.queryName()} records`;
      }
    });

    return batchResults;
  }
}