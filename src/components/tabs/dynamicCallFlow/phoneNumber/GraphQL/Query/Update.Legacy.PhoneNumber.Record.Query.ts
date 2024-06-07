import { AbstractUpdateRecordQuery } from "../../../common/GraphQL/AbstractUpdateRecord.Query";
import { CctSharedCallFlowDb } from "../Legacy.PhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";

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