import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { BatchPhoneNumberRecord } from "../GraphQL/Util/BatchPhoneNumberRecord.Util";
import { NEXT_ACTION_ID } from "../Field/DynamicPhoneNumberFields";
import { BatchResults } from "../../../../common/GraphQL/AbstractBatchQuery";

/**
   * Since the UI grid loads phone number records from 2 tables, we should
   * remove duplicates from the opposite table, since they shouldn't exist.  This 
   * function will call batchDeleteItems, while toggling the nextActionId value so 
   * it will delete the rows.
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords - the rows just updated or created
   * @param {string} accessToken - token to use while calling graphql query
   * @returns Promise<BatchResponse<PhoneNumberRecordType>>
   */
//TODO: Need to review this function to see if it is still needed
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
