import { PhoneNumber } from "../DynamicPhoneNumber.Interfaces";
import {
  AbstractDeleteRecordQuery
} from "../../../common/GraphQL/AbstractDeleteRecord.Query";
import { SingleRecordResults } from "../../../common/GraphQL/AbstractSingleRecord.Query";

interface DynamicPhoneNumberDeleteRecordVariables {
  phoneNumber: string;
}

class DynamicPhoneNumberDeleteRecordQuery extends AbstractDeleteRecordQuery {
  protected queryName(): string {
    return "deletePhoneNumber";
  }

  //TODO: Need to add more attributes on the delete
  protected queryDefinition(): string {
    return `
      mutation ${this.queryName}($input:PhoneNumberDeleteInput!) {
            ${this.queryName}(input:$input) {
                    phoneNumber
            }
          }`;
  }
}

const dynamicPhoneNumberDeleteRecordQuery = new DynamicPhoneNumberDeleteRecordQuery();

export async function dynamicPhoneNumberDeleteRecord(accessToken: string, dynamicPhoneNumber: PhoneNumber): Promise<SingleRecordResults<PhoneNumber>> {
  const variables = {
    phoneNumber: dynamicPhoneNumber.phoneNumber
  } as DynamicPhoneNumberDeleteRecordVariables;

  return await dynamicPhoneNumberDeleteRecordQuery.delete<PhoneNumber, DynamicPhoneNumberDeleteRecordVariables>(accessToken, variables);
}