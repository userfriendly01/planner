import {
  CallFlowDeleteBatchInput,
  BatchCallFlowDeleteResponse,
  GraphQLResponse, CallFlowDeleteInput
} from "./DynamicCallFlow.Interfaces";
import { BatchResults } from "./Abstract.BatchRecords.Query";
import { AbstractGraphQLQuery } from "./AbstractGraphQL.Query";

export abstract class AbstractBatchDeleteDynamicCallFlowQuery<RecordType> extends AbstractGraphQLQuery {
  protected queryName(): string {
    return "batchDeletePhoneNumber";
  }

  protected queryDefinition(): string {
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
   * This method mimics the AbstractBatchRecordsQuery.buildResponse as this particular batch job cannot extend that abstract class
   * since it bundles the ActionRecords into the subtypes of Announcement, Menu, MenuOptions, and Redirect.  We should look in to
   * NOT bundling the records up in that manner and send all records to GraphQL and let GraphQL separate them by ActionType.  That
   * would enable this batch job to extend the AbstractBatchRecordsQuery class and follow the pattern of the other batch jobs.
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