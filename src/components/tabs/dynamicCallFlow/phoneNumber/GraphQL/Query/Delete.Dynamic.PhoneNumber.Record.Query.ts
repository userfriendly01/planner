import {
  CallFlowDeleteInput, PhoneNumber
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  AbstractDeleteRecordQuery
} from "dynamicCallFlowCommon/GraphQL/AbstractDeleteRecord.Query";
import { SingleRecordResults } from "dynamicCallFlowCommon/GraphQL/AbstractSingleRecord.Query";

class DeleteDynamicPhoneNumberRecordQuery extends AbstractDeleteRecordQuery {
  protected queryName(): string {
    return "deletePhoneNumber";
  }

  //TODO: Need to add more attributes on the delete
  protected queryDefinition(): string {
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