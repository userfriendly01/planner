import { PhoneNumber } from "../DynamicPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";
import { AbstractCreateRecordQuery } from "../../../common/GraphQL/AbstractCreateRecord.Query";

class DynamicPhoneNumberCreateRecordQuery extends AbstractCreateRecordQuery {
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

const dynamicPhoneNumberCreateRecordQuery = new DynamicPhoneNumberCreateRecordQuery();

export async function dynamicPhoneNumberCreateRecord(accessToken: string, phoneNumberRecord: PhoneNumber, dataRequests: Array<string>=[]): Promise<SingleRecordResults<PhoneNumber>> {
  phoneNumberRecord.dataRequests = dataRequests;
  phoneNumberRecord.createTime = Date.now();
  phoneNumberRecord.updateTime = Date.now();
  return await dynamicPhoneNumberCreateRecordQuery.create<PhoneNumber>(accessToken, phoneNumberRecord);
}