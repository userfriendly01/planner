import { AbstractDeleteRecordQuery } from "../../../common/GraphQL/AbstractDeleteRecord.Query";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";
import { CctSharedCallFlowDb, CctSharedCallFlowDbDelInput } from "../Legacy.PhoneNumber.Interfaces";

class DeleteLegacyPhoneNumberRecordQuery extends AbstractDeleteRecordQuery {
  protected queryName(): string {
    return "deleteCctSharedCallFlowDb";
  }

  //TODO: Need to add more attributes on the delete
  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input:CctSharedCallFlowDbDelInput!) {
        ${this.queryName()}(input:$input ){
          pkey
        }
      }`;
  }
}

const deleteLegacyPhoneNumberRecordQuery = new DeleteLegacyPhoneNumberRecordQuery();

export async function deleteLegacyPhoneNumberRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  return await deleteLegacyPhoneNumberRecordQuery.delete<CctSharedCallFlowDbDelInput, CctSharedCallFlowDb>(accessToken, { pkey: legacyPhoneNumberRecord.pkey });
}