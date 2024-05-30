import { PhoneNumber } from "../Dynamic.PhoneNumber.Interfaces";
import { AbstractUpdateRecordQuery } from "../../../common/GraphQL/AbstractUpdateRecord.Query";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";

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

const dynamicPhoneNumberUpdateRecordQuery = new UpdateDynamicPhoneNumberRecordQuery();

export async function dynamicPhoneNumberUpdateRecord(accessToken: string, callFlowRecord: PhoneNumber): Promise<SingleRecordResults<PhoneNumber>> {
  callFlowRecord.updateTime = Date.now();
  return await dynamicPhoneNumberUpdateRecordQuery.update<PhoneNumber>(accessToken, callFlowRecord);
}