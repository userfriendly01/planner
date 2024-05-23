import { PhoneNumber } from "../DynamicPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";
import { AbstractAddQuery } from "../../../../../common/GraphQL/AbstractAddQuery";

class AddDynamicPhoneNumberRecordQuery extends AbstractAddQuery {
  protected queryName(): string {
    return "createPhoneNumber";
  }

  //TODO: Need to add more attributes on the create
  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()} ($input: PhoneNumberInput! ){
        ${this.queryName()}(input: $input) {
          phoneNumber
          phoneNumberType
        }
      }`;
  }
}

const addDynamicPhoneNumberRecordQuery = new AddDynamicPhoneNumberRecordQuery();

export async function addDynamicPhoneNumberRecord(accessToken: string, phoneNumberRecord: PhoneNumber, dataRequests: Array<string>=[]): Promise<SingleRecordResults<PhoneNumber>> {
  phoneNumberRecord.dataRequests = dataRequests;
  phoneNumberRecord.createTime = Date.now();
  phoneNumberRecord.updateTime = Date.now();
  return await addDynamicPhoneNumberRecordQuery.add<PhoneNumber>(accessToken, phoneNumberRecord);
}