import { AbstractUpdateRecordQuery } from "dynamicCallFlowCommon/GraphQL/AbstractUpdateRecord.Query";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { SingleRecordResults } from "dynamicCallFlowCommon/GraphQL/AbstractSingleRecord.Query";

class UpdateLegacyPhoneNumberRecordQuery extends AbstractUpdateRecordQuery {
  protected queryName(): string {
    return "updateCctSharedCallFlowDb";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: CctSharedCallFlowDbInputMod!) {
        updateCctSharedCallFlowDb(input:$input) {
          pkey
        }
      }`;
  }
}

const updateLegacyPhoneNumberRecordQuery = new UpdateLegacyPhoneNumberRecordQuery();

export async function updateLegacyPhoneNumberRecord(accessToken: string, callFlowRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  callFlowRecord.updateTime = new Date().toISOString();
  return await updateLegacyPhoneNumberRecordQuery.update<CctSharedCallFlowDb>(accessToken, callFlowRecord);
}