import {
  BatchRecordQuery, BatchResults
} from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import {
  CallFlowDeleteInput, PhoneNumber, PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  AbstractBatchDeleteDynamicCallFlowQuery
} from "components/tabs/dynamicCallFlow/common/GraphQL/Batch.Delete.DynamicCallFlow.Query";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";

/**
 * This class is responsible for deleting phone number records.  It is a subclass of AbstractBatchDeleteDynamicCallFlowQuery.  The query definition
 * resides in the parent class.  This class is responsible for generating the inputs for the delete mutation.
 */
export class BatchDeleteDynamicPhoneNumberRecordsQuery extends AbstractBatchDeleteDynamicCallFlowQuery<PhoneNumber> {
  protected generateCallFlowDeleteInputs(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<CallFlowDeleteInput> {
    return phoneNumberRecords.map( phoneNumberRecord =>
      ({
        id: PhoneNumberRecordUtil.getPkey(phoneNumberRecord)
      } as CallFlowDeleteInput));
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
  return await batchDeleteDynamicPhoneNumberRecordsQuery.batchQuery(accessToken, phoneNumberRecords);
};