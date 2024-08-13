import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { AbstractCreateRecordQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.CreateRecord.Query";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";

class CreateLegacyPhoneNumberRecordQuery extends AbstractCreateRecordQuery {
  queryName(): string {
    return "createCctSharedCallFlowDb";
  }

  queryDefinition(): string {
    return `
      mutation ${this.queryName()} ($input: CctSharedCallFlowDbInput!) {
        ${this.queryName()}(input: $input) {
          agentId
          brand
          callFlowTemplate
          channel
          content  {
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
          pkey
          accountManager
          affinityVDN
          callTypeDescription
          transferCode
          internetPlacement
          callDetails1
          callDetails2
          tollFreeNumber
          lineOfBusiness
          marketingChannel
          predictiveCaller
          whisper
          requestID
          selfServiceIndicator
          userDestination
          rangeIndicator
          tfnRoutingGroup
          type
        }
      }`;
  }
}

const createLegacyPhoneNumberRecordQuery = new CreateLegacyPhoneNumberRecordQuery();

//TODO: Check on why dataRequests is a parameter
export async function createLegacyPhoneNumberRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb, dataRequests: Array<string>=[]): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  legacyPhoneNumberRecord.content.dataRequests = dataRequests;
  //TODO: Need to determine how to set the createTime and updateTime since we don't update, but create a new record each time
  legacyPhoneNumberRecord.createTime = new Date().toISOString();
  legacyPhoneNumberRecord.updateTime = new Date().toISOString();

  return await createLegacyPhoneNumberRecordQuery.create<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecord);
}