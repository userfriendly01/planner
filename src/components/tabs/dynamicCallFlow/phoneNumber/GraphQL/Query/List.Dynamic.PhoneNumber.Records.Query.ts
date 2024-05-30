import { AbstractListRecordsQuery } from "../../../common/GraphQL/AbstractListRecords.Query";
import {
  PhoneNumber
} from "../Dynamic.PhoneNumber.Interfaces";

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

const dynamicPhoneNumberListRecordsQuery = new ListDynamicPhoneNumberRecordsQuery();

export async function dynamicPhoneNumberListRecords(accessToken: string): Promise<Array<PhoneNumber>> {
  return await dynamicPhoneNumberListRecordsQuery.getEntireList<PhoneNumber>(accessToken);
}