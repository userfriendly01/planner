import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";
import { AbstractCreateRecordQuery } from "../../../common/GraphQL/AbstractCreateRecord.Query";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";

class LegacyPhoneNumberCreateRecordQuery extends AbstractCreateRecordQuery {
  protected queryName(): string {
    return "createCctSharedCallRoutingGlobalDb";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()} ($input: CreateCctSharedCallRoutingGlobalDbInput!) {
        ${this.queryName()}(input: $input) {
          pkey
          skey
          brand
          callerState
          callerType
          callIntent
          channel
          dayOfWeek
          endTime
          percentOfCallers
          policyType
          startTime
          transferDestination
          transferMessage
          twilioSkill
          crcSkill
          priority
          alternateTransferDestination
          tfnRoutingGroup
          occupancyCheck {
            percentage
            team
          }
          routingSteps {
            callerState
            teams
            time
          }
        }
      }`;
  }
}

const legacyPhoneNumberCreateRecordQuery = new LegacyPhoneNumberCreateRecordQuery();

//TODO: Set create time
export async function legacyPhoneNumberCreateRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb, dataRequests: Array<string>=[]): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  legacyPhoneNumberRecord.content.dataRequests = dataRequests;
  legacyPhoneNumberRecord.createTime = new Date().toISOString();
  legacyPhoneNumberRecord.updateTime = new Date().toISOString();
  return await legacyPhoneNumberCreateRecordQuery.create<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecord);
}