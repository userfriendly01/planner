import { AbstractUpdateQuery } from "../../../../../common/GraphQL/AbstractUpdateQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";

class UpdateLegacyPhoneNumberRecordQuery extends AbstractUpdateQuery {
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

const updateLegacyCallFlowRecordQuery = new UpdateLegacyPhoneNumberRecordQuery();

export async function updateLegacyPhoneNumberRecord(accessToken: string, callFlowRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  callFlowRecord.updateTime = new Date().toISOString();
  return await updateLegacyCallFlowRecordQuery.update<CctSharedCallFlowDb>(accessToken, callFlowRecord);
}