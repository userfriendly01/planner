import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { AbstractCreateRecordQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.CreateRecord.Query";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";

import { GraphQLInputVariables } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

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

//TODO: Check on why dataRequests is a parameter
export async function createLegacyPhoneNumberRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb, dataRequests: Array<string>=[]): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  legacyPhoneNumberRecord.content.dataRequests = dataRequests;
  //TODO: Need to determine how to set the createTime and updateTime since we don't update, but create a new record each time
  legacyPhoneNumberRecord.createTime = new Date().toISOString();
  legacyPhoneNumberRecord.updateTime = new Date().toISOString();

  return await createLegacyPhoneNumberRecordQuery.create<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecord);
}