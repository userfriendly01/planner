import {
  checkForDuplicateErrorMessage, isValidUUID
} from "dynamicCallFlowCommon/GraphQL/GraphQL.Util";
import { GraphQLError } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

jest.mock("uuid", () => ({ v4: () => "123456789" }));

describe("GraphQL.Util", () => {
  // beforeAll(() => {
  //   jest.spyOn(window, "fetch");
  // });

  beforeEach(() => {
    jest.clearAllMocks();
    // window.fetch.mockImplementation(() => Promise.resolve({
  });

  it("shouldAppendDuplicateRecordMessageForConditionalCheckFailedException", () => {
    const errors: Array<GraphQLError> = [
      {
        errorType: "DynamoDB:ConditionalCheckFailedException",
        message: "Original message"
      }
    ];
    checkForDuplicateErrorMessage(errors);
    expect(errors[0].message).toBe("Original message\nRecord already exists.");
  });

  it("shouldNotModifyMessageForOtherErrorTypes", () => {
    const errors: Array<GraphQLError> = [
      {
        errorType: "SomeOtherError",
        message: "Original message"
      }
    ];
    checkForDuplicateErrorMessage(errors);
    expect(errors[0].message).toBe("Original message");
  });

  it("shouldReturnTrueForValidUUID", () => {
    // const mockValidate = validate as jest.Mock;
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(isValidUUID(validUuid)).toBe(true);
  });

  it("shouldReturnFalseForInvalidUUID", () => {
    const invalidUuid = "invalid-uuid";
    expect(isValidUUID(invalidUuid)).toBe(false);
  });

  // it("shouldGenerateValidUUID", () => {
  //   const uuid = generateUuid();
  //   expect(isValidUUID(uuid)).toBe(true);
  // });
});