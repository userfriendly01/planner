import {
  v4 as uuidv4, validate as uuidValidate
} from "uuid";

import { GraphQLError } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export const ErrorDuplicateRecord = "Record already exists.";

export const checkForDuplicateErrorMessage = (graphQLError: Array<GraphQLError>): void => {
  graphQLError?.forEach(error => {
    if (error.errorType === "DynamoDB:ConditionalCheckFailedException") {
      error.message = error.message.concat("\n").concat(ErrorDuplicateRecord);
    }
  });
};

export function isValidUUID(uuid: string): boolean {
  return uuidValidate(uuid);
}

export function generateUuid(): string {
  return uuidv4();
}