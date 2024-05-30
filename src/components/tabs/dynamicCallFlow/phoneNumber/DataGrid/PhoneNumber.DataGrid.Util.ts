import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { BatchPhoneNumberRecord } from "../GraphQL/Batch.PhoneNumber.Records.Util";
import { NEXT_ACTION_ID } from "../Form/Dynamic.PhoneNumber.Form.Fields";
import { BatchResults } from "../../common/GraphQL/Abstract.BatchRecords.Query";

/**
   * Since the UI grid loads phone number records from 2 tables, we should
   * remove duplicates from the opposite table, since they shouldn't exist.  This 
   * function will call batchDeleteItems, while toggling the nextActionId value so 
   * it will delete the rows.
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords - the rows just updated or created
   * @param {string} accessToken - token to use while calling graphql query
   * @returns Promise<BatchResponse<PhoneNumberRecordType>>
   */
export const deleteOppositeRows = (
  phoneNumberRecords: Array<PhoneNumberRecordType>,
  accessToken: string
): Promise<BatchResults<PhoneNumberRecordType>> => {
  const oppositeRows: Array<PhoneNumberRecordType> = phoneNumberRecords.map(phoneNumberRecord => {
    return {
      ...phoneNumberRecord,
      nextActionId: phoneNumberRecord[NEXT_ACTION_ID as keyof typeof phoneNumberRecord] ? "" : "simulatedNextActionId"
    } as PhoneNumberRecordType;
  });

  return BatchPhoneNumberRecord.delete(accessToken, oppositeRows);
};
