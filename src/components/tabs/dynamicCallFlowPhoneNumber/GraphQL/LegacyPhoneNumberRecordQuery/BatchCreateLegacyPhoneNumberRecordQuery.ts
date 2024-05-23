import {
  AbstractBatchQuery,
  BatchResults,
  BatchRecordQuery
} from "../../../../../common/GraphQL/AbstractBatchQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class BatchCreateLegacyPhoneNumberRecordQuery extends AbstractBatchQuery {
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

const batchCreateLegacyPhoneNumberQuery = new BatchCreateLegacyPhoneNumberRecordQuery();

export const batchCreateLegacyPhoneNumberRecord: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await batchCreateLegacyPhoneNumberQuery.runBatch<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};
