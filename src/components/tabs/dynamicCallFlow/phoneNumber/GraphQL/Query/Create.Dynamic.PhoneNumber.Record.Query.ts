import { PhoneNumber } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import { AbstractCreateRecordQuery } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.CreateRecord.Query";

class CreateDynamicPhoneNumberRecordQuery extends AbstractCreateRecordQuery {
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

const createDynamicPhoneNumberRecordQuery = new CreateDynamicPhoneNumberRecordQuery();

//TODO: Check on why dataRequests is a parameter
export async function createDynamicPhoneNumberRecord(accessToken: string, phoneNumberRecord: PhoneNumber, dataRequests: Array<string>=[]): Promise<SingleRecordResults<PhoneNumber>> {
  phoneNumberRecord.dataRequests = dataRequests;
  //TODO: Need to determine how to set the createTime and updateTime since we don't update, but create a new record each time
  phoneNumberRecord.createTime = Date.now();
  phoneNumberRecord.updateTime = Date.now();

  return await createDynamicPhoneNumberRecordQuery.create<PhoneNumber>(accessToken, phoneNumberRecord);
}