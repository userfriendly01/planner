import {
  CallFlowDeleteInput, PhoneNumber
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  AbstractDeleteRecordQuery
} from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractDeleteRecord.Query";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";

export class DeleteDynamicPhoneNumberRecordQuery extends AbstractDeleteRecordQuery {
  queryName(): string {
    return "deletePhoneNumber";
  }

  //TODO: Need to add more attributes on the delete
  queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input:CallFlowDeleteInput!) {
            ${this.queryName()}(input:$input) {
                    phoneNumber
            }
          }`;
  }
}

const deleteDynamicPhoneNumberRecordQuery = new DeleteDynamicPhoneNumberRecordQuery();

export async function deleteDynamicPhoneNumberRecord(accessToken: string, dynamicPhoneNumber: PhoneNumber): Promise<SingleRecordResults<PhoneNumber>> {
  return await deleteDynamicPhoneNumberRecordQuery.delete<CallFlowDeleteInput, PhoneNumber>(accessToken, { id: dynamicPhoneNumber.phoneNumber });
}