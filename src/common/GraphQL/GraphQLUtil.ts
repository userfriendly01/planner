import { GraphQLError } from "./GraphQL.Interfaces";
import {
  v4 as uuidv4, validate as uuidValidate
} from "uuid"; // TODO: Need to create a delcaration file for uuid

export const ErrorDuplicateRecord = "Record already exists.";

export const checkForDuplicateErrorMessage = (graphQLError: Array<GraphQLError>): void => {
  graphQLError?.forEach(error => {
    if (error.errorType === "DynamoDB:ConditionalCheckFailedException") {
      error.message = error.message.concat("\n").concat(ErrorDuplicateRecord);
    }
  });
};

export function validateAndGeneratePkeyIfNeeded(pkey: string): string {
  return uuidValidate(pkey) ? pkey : uuidv4();
}