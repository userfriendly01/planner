import {
  AbstractBatchRecordsQuery,
  BatchResults,
  BatchRecordQuery
} from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";

class BatchCreateLegacyPhoneNumberRecordsQuery extends AbstractBatchRecordsQuery {
  batchInputName(): string {
    return "batchFlowCreateInput";
  }

  queryName(): string {
    return "batchCreateCctSharedCallFlowDb";
  }

  queryDefinition(): string {
    return `
      mutation ${this.queryName()} ($input: CctSharedCallFlowDbBatchCreateInput!) {
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
        }
      }`;
  }
}

export const batchCreateLegacyPhoneNumberRecordsQuery = new BatchCreateLegacyPhoneNumberRecordsQuery();

export const batchCreateLegacyPhoneNumberRecords: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await batchCreateLegacyPhoneNumberRecordsQuery.runBatch<CctSharedCallFlowDb, CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};
