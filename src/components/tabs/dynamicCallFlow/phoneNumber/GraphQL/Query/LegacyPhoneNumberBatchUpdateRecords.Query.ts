import {
  AbstractBatchRecordsQuery, BatchRecordQuery, BatchResults
} from "../../../common/GraphQL/AbstractBatchRecords.Query";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class LegacyPhoneNumberBatchUpdateRecordsQuery extends AbstractBatchRecordsQuery {
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

const legacyPhoneNumberBatchUpdateRecordsQuery = new LegacyPhoneNumberBatchUpdateRecordsQuery();

export const legacyPhoneNumberBatchUpdateRecords: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await legacyPhoneNumberBatchUpdateRecordsQuery.runBatch<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};