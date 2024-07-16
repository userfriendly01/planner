import { PhoneNumber } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { AbstractUpdateRecordQuery } from "dynamicCallFlowCommon/GraphQL/AbstractUpdateRecord.Query";
import { SingleRecordResults } from "dynamicCallFlowCommon/GraphQL/AbstractSingleRecord.Query";

class UpdateDynamicPhoneNumberRecordQuery extends AbstractUpdateRecordQuery {
  protected queryName(): string {
    return "updatePhoneNumber";
  }

  //TODO: Need to add more attributes on the update
  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input:PhoneNumberInput!) {
            ${this.queryName()}(input:$input) {
                    phoneNumber
            }
          }`;
  }
}

const updateDynamicPhoneNumberRecordQuery = new UpdateDynamicPhoneNumberRecordQuery();

export async function updateDynamicPhoneNumberRecord(accessToken: string, phoneNumberRecord: PhoneNumber): Promise<SingleRecordResults<PhoneNumber>> {
  phoneNumberRecord.updateTime = Date.now();
  return await updateDynamicPhoneNumberRecordQuery.update<PhoneNumber>(accessToken, phoneNumberRecord);
}