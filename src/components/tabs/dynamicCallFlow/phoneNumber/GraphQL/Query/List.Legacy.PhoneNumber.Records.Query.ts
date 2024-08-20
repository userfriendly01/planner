import { AbstractListRecordsQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractListRecords.Query";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";

import { LoadDataGridMonitorRef } from "dynamicCallFlowCommon/DataGrid/Load.DataGrid.Monitor";

class ListLegacyPhoneNumberRecordsQuery extends AbstractListRecordsQuery {
  queryName(): string {
    return "listCctSharedCallFlowDbs";
  }

  queryDefinition(): string {
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

export const listLegacyPhoneNumberRecordsQuery = new ListLegacyPhoneNumberRecordsQuery();

export async function listLegacyPhoneNumberRecords(accessToken: string, loadDataGridMonitor?: LoadDataGridMonitorRef): Promise<Array<CctSharedCallFlowDb>> {
  return await listLegacyPhoneNumberRecordsQuery.getEntireList<CctSharedCallFlowDb>(accessToken, loadDataGridMonitor);
}