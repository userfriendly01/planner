import { AbstractUpdateRecordQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractUpdateRecord.Query";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";

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

export async function updateLegacyPhoneNumberRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  legacyPhoneNumberRecord.updateTime = new Date().toISOString();
  return await updateLegacyPhoneNumberRecordQuery.update<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecord);
}