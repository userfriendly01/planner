import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { BatchPhoneNumberRecord } from "dynamicCallFlowPhoneNumber/GraphQL/Batch.PhoneNumber.Records.Util";
import { BatchResults } from "dynamicCallFlowCommon/GraphQL/Abstract.BatchRecords.Query";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";

/**
   * Since the UI grid loads phone number records from 2 tables, each duplicate record must be deleted from the opposite table.
   * This is accomplished by converting the phone number record to the opposite table's format and then calling the delete function to ensure only one record exists accross both tables.
   * @param {string} accessToken - token to use while calling graphql query
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords - the rows just updated or created
   * @returns Promise<BatchResponse<PhoneNumberRecordType>>
   */
export const deleteOppositeRows = (
  accessToken: string,
  phoneNumberRecords: Array<PhoneNumberRecordType>
): Promise<BatchResults<PhoneNumberRecordType>> => {
  const oppositeRows: Array<PhoneNumberRecordType> = phoneNumberRecords.map(phoneNumberRecord => PhoneNumberRecordUtil.convertPhoneNumberRecord(phoneNumberRecord));

  return BatchPhoneNumberRecord.delete(accessToken, oppositeRows);
};
