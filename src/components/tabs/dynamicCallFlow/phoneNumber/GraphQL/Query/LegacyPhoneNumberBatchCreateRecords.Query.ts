import {
  AbstractBatchRecordsQuery,
  BatchResults,
  BatchRecordQuery
} from "../../../common/GraphQL/AbstractBatchRecords.Query";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class LegacyPhoneNumberBatchCreateRecordsQuery extends AbstractBatchRecordsQuery {
  protected batchInputName(): string {
    return "batchFlowCreateInput";
  }

  protected queryName(): string {
    return "batchCreateCctSharedCallFlowDb";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: CctSharedCallFlowDbBatchCreateInput!) {
        ${this.queryName()}(input: $input) {
          items {
            accountManager
            affinityVDN
            agentId
            brand
            callDetails1
            callDetails2
            callFlowTemplate
            callTypeDescription
            channel
            content {
              callFlowRoute
              callIntent
              callerType
              dataRequests
              greetingMessages
              languageOffer
              transferNumber
            }
            createTime
            dialedDescription
            employeeId
            internetPlacement
            lineOfBusiness
            marketingChannel
            pkey
            predictiveCaller
            rangeIndicator
            requestID
            selfServiceIndicator
            tollFreeNumber
            transferCode
            type
            userDestination
            whisper
          }
        }`;
  }
}

const legacyPhoneNumberBatchCreateRecordsQuery = new LegacyPhoneNumberBatchCreateRecordsQuery();

export const legacyPhoneNumberBatchCreateRecords: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await legacyPhoneNumberBatchCreateRecordsQuery.runBatch<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};
