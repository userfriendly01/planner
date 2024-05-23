import { PhoneNumber } from "../DynamicPhoneNumber.Interfaces";
import {
  AbstractDeleteQuery
} from "../../../../../common/GraphQL/AbstractDeleteQuery";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";

interface DeleteDynamicPhoneNumberVariables {
  phoneNumber: string;
}

class DeleteDynamicPhoneNumberQuery extends AbstractDeleteQuery {
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

const deletePhoneNumberQuery = new DeleteDynamicPhoneNumberQuery();

export async function deleteDynamicPhoneNumber(accessToken: string, dynamicPhoneNumber: PhoneNumber): Promise<SingleRecordResults<PhoneNumber>> {
  const variables = {
    phoneNumber: dynamicPhoneNumber.phoneNumber
  } as DeleteDynamicPhoneNumberVariables;

  return await deletePhoneNumberQuery.delete<PhoneNumber, DeleteDynamicPhoneNumberVariables>(accessToken, variables);
}