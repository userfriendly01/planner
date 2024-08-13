import {
  v4 as uuidv4
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

const UUID_REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

export function isValidUUID(uuid: string): boolean {
  return UUID_REGEX && UUID_REGEX.test(uuid);
}

export function generateUuid(): string {
  return uuidv4();
}