import { CctSharedCallFlowDb } from "../Legacy.PhoneNumber.Interfaces";
import { AbstractCreateRecordQuery } from "../../../common/GraphQL/Abstract.CreateRecord.Query";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";

class CreateLegacyPhoneNumberRecordQuery extends AbstractCreateRecordQuery {
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
  return await createLegacyPhoneNumberRecordQuery.create<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecord);
}