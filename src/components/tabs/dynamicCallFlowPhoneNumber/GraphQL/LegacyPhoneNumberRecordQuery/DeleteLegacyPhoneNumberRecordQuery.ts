import { AbstractDeleteQuery } from "../../../../../common/GraphQL/AbstractDeleteQuery";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

interface DeleteLegacyPhoneNumberRecordVariables {
  pkey: string;
}

class DeleteLegacyPhoneNumberRecordQuery extends AbstractDeleteQuery {
  protected queryName(): string {
    return "deleteCctSharedCallFlowDb";
  }

  //TODO: Need to add more attributes on the delete
  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input:CctSharedCallFlowDbDelInput!) {
        ${this.queryName()}(input:$input ){
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
          rangeIndicator
          tfnRoutingGroup
          type
        }
      }`;
  }
}

const deleteLegacyPhoneNumberRecordQuery = new DeleteLegacyPhoneNumberRecordQuery();

export async function deleteLegacyCallRecordFlow(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  const variables = {
    pkey: legacyPhoneNumberRecord.pkey
  } as DeleteLegacyPhoneNumberRecordVariables;

  return await deleteLegacyPhoneNumberRecordQuery.delete<CctSharedCallFlowDb, DeleteLegacyPhoneNumberRecordVariables>(accessToken, variables);
}