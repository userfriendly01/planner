import {
  BatchResults, BatchRecordQuery
} from "../../../common/GraphQL/Abstract.BatchRecords.Query";
import {
  CallFlowDeleteInput,
  PhoneNumber, PhoneNumberRecordType
} from "../Dynamic.PhoneNumber.Interfaces";
import {
  AbstractBatchDeleteDynamicCallFlowQuery
} from "components/tabs/dynamicCallFlow/common/GraphQL/Batch.Delete.DynamicCallFlow.Query";
import { PhoneNumberRecordUtil } from "dynamicCallFlow/GraphQL/PhoneNumber.Record.Util";


export class BatchDeleteDynamicPhoneNumberRecordsQuery extends AbstractBatchDeleteDynamicCallFlowQuery<PhoneNumber> {
  protected generateCallFlowDeleteInputs(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<CallFlowDeleteInput> {
    return phoneNumberRecords.map( phoneNumberRecord =>
      ({
        id: PhoneNumberRecordUtil.getPkey(phoneNumberRecord),
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