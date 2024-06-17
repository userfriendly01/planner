import {
  BatchCallFlowDeleteInput,
  BatchCallFlowDeleteResponse,
  CallFlowDeleteInput
} from "./DynamicCallFlow.Interfaces";
import { BatchResults } from "./Abstract.BatchRecords.Query";
import { AbstractGraphQLQuery } from "./AbstractGraphQL.Query";

export abstract class AbstractBatchDeleteDynamicCallFlowQuery<RecordType> extends AbstractGraphQLQuery {
  protected queryName(): string {
    return "batchDeletePhoneNumber";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: PhoneNumberDeleteBatchInput!) {
        ${this.queryName()}(input: $input) {
          items {
              phoneNumber
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

    const variables = {
      input: {
        batchDeleteInput: this.generateCallFlowDeleteInputs(records)
      }
    } as BatchCallFlowDeleteInput;
    const graphQLResponse =
      await this.query<BatchCallFlowDeleteInput, BatchCallFlowDeleteResponse>(accessToken, variables);

    return {
      alertMsg: graphQLResponse.errors.length === 0 ? "" : `Errors occurred processing ${this.queryName()} records`,
      errors: graphQLResponse.errors || [],
      failure: [],
      hasError: graphQLResponse.errors.length > 0,
      success: records
    } as BatchResults<RecordType>;
  }
}