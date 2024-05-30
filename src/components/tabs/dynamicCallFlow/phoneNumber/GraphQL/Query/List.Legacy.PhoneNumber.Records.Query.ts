import { AbstractListRecordsQuery } from "../../../common/GraphQL/AbstractListRecords.Query";
import { CctSharedCallFlowDb } from "../Legacy.PhoneNumber.Interfaces";

class ListLegacyPhoneNumberRecordsQuery extends AbstractListRecordsQuery {
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

const legacyPhoneNumberListRecordsQuery = new ListLegacyPhoneNumberRecordsQuery();

export async function legacyPhoneNumberListRecords(accessToken: string): Promise<Array<CctSharedCallFlowDb>> {
  return await legacyPhoneNumberListRecordsQuery.getEntireList<CctSharedCallFlowDb>(accessToken);
}