import {
  AbstractBatchQuery, BatchRecordQuery, BatchResults
} from "../../../../../common/GraphQL/AbstractBatchQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class BatchUpdateLegacyPhoneNumberRecordQuery extends AbstractBatchQuery {
  protected batchInputName(): string {
    return "batchFlowUpdateInput";
  }

  protected queryName(): string {
    return "batchUpdateCctSharedCallFlowDb";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: CctSharedCallFlowDbBatchUpdateInput!) {
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
              tfnRoutingGroup
              transferCode
              type
              userDestination
              whisper
            }
          }
        }`;
  }
}

const batchUpdateLegacyPhoneNumberRecordQuery = new BatchUpdateLegacyPhoneNumberRecordQuery();

export const batchUpdateLegacyPhoneNumberRecord: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await batchUpdateLegacyPhoneNumberRecordQuery.runBatch<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};