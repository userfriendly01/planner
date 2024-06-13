import {
  AbstractBatchRecordsQuery, BatchResults, BatchRecordQuery
} from "../../../common/GraphQL/Abstract.BatchRecords.Query";
import {
  PhoneNumber
} from "../Dynamic.PhoneNumber.Interfaces";


export class BatchDeleteDynamicPhoneNumberRecordsQuery extends AbstractBatchRecordsQuery<string, PhoneNumber> {
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

const batchDeleteDynamicPhoneNumberRecordsQuery = new BatchDeleteDynamicPhoneNumberRecordsQuery();

/**
 * This method simply calls the BatchDeletePhoneNumberQuery.runBatch.  It is here in case any common manipulation of the phone number
 * records occur, they can be done here rather than all over the application.  As of now, it appears it isn't necessary.
 *
 * @param {string} accessToken
 * @param {Array<PhoneNumber>} phoneNumberRecords
 * @return {Promise<BatchResults<PhoneNumber>>}
 */
export const batchDeleteDynamicPhoneNumberRecords: BatchRecordQuery<PhoneNumber> = async (accessToken: string, phoneNumberRecords: Array<PhoneNumber>): Promise<BatchResults<PhoneNumber>> => {
  return await batchDeleteDynamicPhoneNumberRecordsQuery.runBatch(accessToken, (phoneNumberRecords as Array<PhoneNumber>).map((phoneNumber: PhoneNumber) => phoneNumber.phoneNumber));
};