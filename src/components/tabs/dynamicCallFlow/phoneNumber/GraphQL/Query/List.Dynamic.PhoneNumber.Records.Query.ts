import { AbstractListRecordsQuery } from "dynamicCallFlowCommon/GraphQL/AbstractListRecords.Query";
import { PhoneNumber } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { LoadDataGridMonitorRef } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";

class ListDynamicPhoneNumberRecordsQuery extends AbstractListRecordsQuery {
  protected queryName(): string {
    return "listPhoneNumbers";
  }

  //TODO: Need to implement nextToken in shared-graph-api
  protected queryDefinition(): string {
    return `
      query ${this.queryName()}($limit: Int) { 
        ${this.queryName()}(limit: $limit) {
          nextToken
          items {
            pkey: phoneNumber
            brand
            callFlowName
            callFlowRoute
            callFlowTemplate
            callFlowType
            callIntent
            callTypeDescription
            callerType
            channel
            createTime
            dataRequests
            dialedDescription
            employeeId
            greetingMessages
            internetPlacement
            languageOffer
            lineOfBusiness
            marketingChannel
            nextActionId
            nextActionType
            officeNumbers
            phoneNumber
            phoneNumberType
            predictiveCaller
            rangeIndicator
            requestID
            tfnRoutingGroup
            tollFreeNumber
            transferCode
            transferDestination
            updateTime
            whisper
          }
        }
      }`;
  }
}

const listDynamicPhoneNumberRecordsQuery = new ListDynamicPhoneNumberRecordsQuery();

export async function listDynamicPhoneNumberRecords(accessToken: string, loadDataGridMonitor?: LoadDataGridMonitorRef): Promise<Array<PhoneNumber>> {
  return await listDynamicPhoneNumberRecordsQuery.getEntireList<PhoneNumber>(accessToken, loadDataGridMonitor);
}