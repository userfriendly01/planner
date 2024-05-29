import {
  AbstractBatchRecordsQuery, BatchResults, BatchRecordQuery
} from "../../../common/GraphQL/AbstractBatchRecords.Query";
import {
  PhoneNumber
} from "../DynamicPhoneNumber.Interfaces";


export class DynamicPhoneNumberBatchDeleteRecordsQuery extends AbstractBatchRecordsQuery {
  protected batchInputName(): string {
    return "batchDeletePhoneNumberInput";
  }

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
}

const batchDeletePhoneNumberQuery = new DynamicPhoneNumberBatchDeleteRecordsQuery();

/**
 * This method simply calls the BatchDeletePhoneNumberQuery.runBatch.  It is here in case any common manipulation of the phone number
 * records occur, they can be done here rather than all over the application.  As of now, it appears it isn't necessary.
 *
 * @param {string} accessToken
 * @param {Array<PhoneNumber>} phoneNumberRecords
 * @return {Promise<BatchResults<PhoneNumber>>}
 */
export const batchDeleteDynamicCallFlowRecord: BatchRecordQuery<PhoneNumber> = async (accessToken: string, phoneNumberRecords: Array<PhoneNumber>): Promise<BatchResults<PhoneNumber>> => {
  return await batchDeletePhoneNumberQuery.runBatch<PhoneNumber>(accessToken, phoneNumberRecords as Array<PhoneNumber>);
};