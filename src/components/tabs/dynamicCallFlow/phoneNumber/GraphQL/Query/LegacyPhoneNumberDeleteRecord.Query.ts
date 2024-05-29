import { AbstractDeleteRecordQuery } from "../../../common/GraphQL/AbstractDeleteRecord.Query";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

interface LegacyPhoneNumberDeleteRecordVariables {
  pkey: string;
}

class LegacyPhoneNumberDeleteRecordQuery extends AbstractDeleteRecordQuery {
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

const legacyPhoneNumberDeleteRecordQuery = new LegacyPhoneNumberDeleteRecordQuery();

export async function legacyPhoneNumberDeleteRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  const variables = {
    pkey: legacyPhoneNumberRecord.pkey
  } as LegacyPhoneNumberDeleteRecordVariables;

  return await legacyPhoneNumberDeleteRecordQuery.delete<CctSharedCallFlowDb, LegacyPhoneNumberDeleteRecordVariables>(accessToken, variables);
}