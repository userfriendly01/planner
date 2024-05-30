import {
  AbstractBatchRecordsQuery, BatchRecordQuery, BatchResults
} from "../../../common/GraphQL/Abstract.BatchRecords.Query";
import {
  PhoneNumber
} from "../Dynamic.PhoneNumber.Interfaces";

export class BatchCreateDynamicPhoneNumberRecordsQuery extends AbstractBatchRecordsQuery {
  protected batchInputName(): string {
    return "batchPhoneNumberInput";
  }

  protected queryName(): string {
    return "batchCreatePhoneNumber";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: PhoneNumberCreateBatchInput!) {
        ${this.queryName()}(input: $input) {
          items {
            phoneNumber
            callFlowName
            createTime
            updateTime
            nextActionType
            nextActionId
            callFlowTemplate
            dialedDescription
            phoneNumberType
            tfnRoutingGroup
            brand
            dataRequests
            greetingMessages
            languageOffer
            transferDestination
            callerType
            callFlowRoute
            callIntent
            callFlowType
            channel
            predictiveCaller
            employeeId
            callTypeDescription
            internetPlacement
            lineOfBusiness
            marketingChannel
            rangeIndicator
            requestID
            tollFreeNumber
            transferCode
            whisper
            officeNumbers
          }
        }
      }`;
  }
}

const batchCreateDynamicPhoneNumberRecordsQuery = new BatchCreateDynamicPhoneNumberRecordsQuery();

/**
 * This method simply calls the BatchCreatePhoneNumberQuery.runBatch.  It is here in case any common manipulation of the phone number
 * records occur, they can be done here rather than all over the application.  As of now, it appears it isn't necessary.
 * @param {string} accessToken
 * @param {Array<PhoneNumber>} phoneNumberRecords
 * @return {Promise<BatchResults<PhoneNumber>>}
 */
export const batchCreateDynamicPhoneNumberRecords: BatchRecordQuery<PhoneNumber> = async (accessToken: string, phoneNumberRecords: Array<PhoneNumber>): Promise<BatchResults<PhoneNumber>> => {
  return await batchCreateDynamicPhoneNumberRecordsQuery.runBatch<PhoneNumber>(accessToken, phoneNumberRecords);
};

/**
 * For dynamic phone number update, really we are just calling the batch create.  When a dynamic phone number is added
 * to DynamoDB, it will overwrite the existing record if there is one since the pkey is the phone number.  This method was
 * created simply for continuity
 * @param {string} accessToken
 * @param {Array<PhoneNumber>} phoneNumberRecords
 * @return {Promise<BatchResults<PhoneNumber>>}
 */
export const batchUpdateDynamicPhoneNumberRecordsQuery: BatchRecordQuery<PhoneNumber> = async (accessToken: string, phoneNumberRecords: Array<PhoneNumber>): Promise<BatchResults<PhoneNumber>> => {
  return await batchCreateDynamicPhoneNumberRecordsQuery.runBatch<PhoneNumber>(accessToken, phoneNumberRecords);
};