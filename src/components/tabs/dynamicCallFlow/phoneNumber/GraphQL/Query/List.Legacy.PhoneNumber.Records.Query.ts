import { AbstractListRecordsQuery } from "../../../common/GraphQL/AbstractListRecords.Query";
import { CctSharedCallFlowDb } from "../Legacy.PhoneNumber.Interfaces";
import { LoadDataGridMonitorRef } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";

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

const listLegacyPhoneNumberRecordsQuery = new ListLegacyPhoneNumberRecordsQuery();

export async function listLegacyPhoneNumberRecords(accessToken: string, loadDataGridMonitor?: LoadDataGridMonitorRef): Promise<Array<CctSharedCallFlowDb>> {
  return await listLegacyPhoneNumberRecordsQuery.getEntireList<CctSharedCallFlowDb>(accessToken, loadDataGridMonitor);
}