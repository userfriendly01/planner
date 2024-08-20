import { AbstractDeleteRecordQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractDeleteRecord.Query";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import {
  CctSharedCallFlowDb, CctSharedCallFlowDbDelInput
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";

class DeleteLegacyPhoneNumberRecordQuery extends AbstractDeleteRecordQuery {
  queryName(): string {
    return "deleteCctSharedCallFlowDb";
  }

  //TODO: Need to add more attributes on the delete
  queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input:CctSharedCallFlowDbDelInput!) {
        ${this.queryName()}(input:$input ){
          pkey
        }
      }`;
  }
}

export const deleteLegacyPhoneNumberRecordQuery = new DeleteLegacyPhoneNumberRecordQuery();

export async function deleteLegacyPhoneNumberRecord(accessToken: string, legacyPhoneNumberRecord: CctSharedCallFlowDb): Promise<SingleRecordResults<CctSharedCallFlowDb>> {
  return await deleteLegacyPhoneNumberRecordQuery.delete<CctSharedCallFlowDbDelInput, CctSharedCallFlowDb>(accessToken, { pkey: legacyPhoneNumberRecord.pkey });
}