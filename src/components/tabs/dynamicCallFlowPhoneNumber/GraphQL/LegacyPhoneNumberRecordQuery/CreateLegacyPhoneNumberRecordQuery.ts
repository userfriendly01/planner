import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";
import { AbstractAddQuery } from "../../../../../common/GraphQL/AbstractAddQuery";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";

class CreateLegacyPhoneNumberRecordQuery extends AbstractAddQuery {
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

const createLegacyPhoneNumberRecordQuery = new CreateLegacyPhoneNumberRecordQuery();

//TODO: Set create time
export async function createLegacyPhoneNumberRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb, dataRequests: Array<string>=[]): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  legacyPhoneNumberRecord.content.dataRequests = dataRequests;
  legacyPhoneNumberRecord.createTime = new Date().toISOString();
  legacyPhoneNumberRecord.updateTime = new Date().toISOString();
  return await createLegacyPhoneNumberRecordQuery.add<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecord);
}