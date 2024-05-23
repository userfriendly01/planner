import { AbstractListQuery } from "../../../../../common/GraphQL/AbstractListQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class ListLegacyPhoneNumberRecordsQuery extends AbstractListQuery {
  protected queryName(): string {
    return "listCctSharedCallFlowDbs";
  }

  protected queryDefinition(): string {
    return `
      query ${this.queryName()}($limit: Int, $nextToken: String) {
        ${this.queryName()}(limit: $limit, nextToken: $nextToken) {
          nextToken
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
              callIntent
              callerType
              callFlowRoute
              dataRequests
              greetingMessages
              languageOffer
              transferNumber
              officeNumbers
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
            tfnRoutingGroup
            tollFreeNumber
            transferCode
            type
            updateTime
            userDestination
            whisper
          }
        }
      }`;
  }
}

const listLegacyPhoneNumberRecordsQuery = new ListLegacyPhoneNumberRecordsQuery();

export async function listLegacyPhoneNumberRecords(accessToken: string): Promise<Array<CctSharedCallFlowDb>> {
  return await listLegacyPhoneNumberRecordsQuery.getEntireList<CctSharedCallFlowDb>(accessToken);
}