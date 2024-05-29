import { AbstractUpdateRecordQuery } from "../../../common/GraphQL/AbstractUpdateRecord.Query";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";

class LegacyPhoneNumberUpdateRecordQuery extends AbstractUpdateRecordQuery {
  protected queryName(): string {
    return "updateCctSharedCallFlowDb";
  }

  protected queryDefinition(): string {
    return `
      mutation updateCctSharedCallFlowDb($input:CctSharedCallFlowDbInputMod!) {
        updateCctSharedCallFlowDb(input:$input) {
          pkey
          agentId
          brand
          callFlowTemplate
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

const legacyPhoneNumberUpdateRecordQuery = new LegacyPhoneNumberUpdateRecordQuery();

export async function legacyPhoneNumberUpdateRecord(accessToken: string, callFlowRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  callFlowRecord.updateTime = new Date().toISOString();
  return await legacyPhoneNumberUpdateRecordQuery.update<CctSharedCallFlowDb>(accessToken, callFlowRecord);
}