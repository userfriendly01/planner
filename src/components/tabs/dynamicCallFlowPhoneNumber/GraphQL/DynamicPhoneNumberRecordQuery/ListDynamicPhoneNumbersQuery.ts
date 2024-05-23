import { AbstractListQuery } from "../../../../../common/GraphQL/AbstractListQuery";
import {
  PhoneNumber
} from "../DynamicPhoneNumber.Interfaces";

class ListDynamicPhoneNumbersQuery extends AbstractListQuery {
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

const listPhoneNumbersQuery = new ListDynamicPhoneNumbersQuery();

export async function listDynamicPhoneNumberRecords(accessToken: string): Promise<Array<PhoneNumber>> {
  return await listPhoneNumbersQuery.getEntireList<PhoneNumber>(accessToken);
}