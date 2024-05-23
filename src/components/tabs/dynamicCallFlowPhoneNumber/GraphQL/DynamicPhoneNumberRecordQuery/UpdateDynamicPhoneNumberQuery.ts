import { PhoneNumber } from "../DynamicPhoneNumber.Interfaces";
import { AbstractUpdateQuery } from "../../../../../common/GraphQL/AbstractUpdateQuery";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";

class UpdateDynamicPhoneNumberQuery extends AbstractUpdateQuery {
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

const updatePhoneNumberQuery = new UpdateDynamicPhoneNumberQuery();

export async function updateDynamicPhoneNumber(accessToken: string, callFlowRecord: PhoneNumber): Promise<SingleRecordResults<PhoneNumber>> {
  callFlowRecord.updateTime = Date.now();
  return await updatePhoneNumberQuery.update<PhoneNumber>(accessToken, callFlowRecord);
}