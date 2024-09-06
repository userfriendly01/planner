import {
  createDynamicPhoneNumberRecord,
  createDynamicPhoneNumberRecordQuery
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Create.Dynamic.PhoneNumber.Record.Query";
import { DynamicPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { SingleRecordResults } from "dynamicCallFlowCommon/GraphQL/AbstractSingleRecord.Query";
import { PhoneNumber } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";

describe("CreateDynamicPhoneNumberRecordQuery", () => {
  it("shouldReturnCorrectQueryName", () => {
    expect(createDynamicPhoneNumberRecordQuery.queryName()).toBe("createPhoneNumber");
  });

  it("shouldReturnCorrectQueryDefinition", () => {
    const expectedDefinition = `
      mutation createPhoneNumber ($input: PhoneNumberInput! ){
        createPhoneNumber(input: $input) {
          phoneNumber
          phoneNumberType
        }
      }`;
    expect(createDynamicPhoneNumberRecordQuery.queryDefinition().replace(/\s+/g, " ")).toBe(expectedDefinition.replace(/\s+/g, " "));
  });

  it("shouldCreatePhoneNumberRecordSuccessfully", async () => {
    jest.spyOn(createDynamicPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        createPhoneNumber: {
          phoneNumber: "1234567890",
          phoneNumberType: "DID"
        } as PhoneNumber
      },
      hasResults: true,
      errors: []
    } as GraphQLResponse<SingleRecordResults<PhoneNumber>>));

    const result = await createDynamicPhoneNumberRecord(mockAccessToken, { ...DynamicPhoneNumberOne }, ["classify"]);
    expect(result).toEqual({
      alertMsg: "",
      errors: [],
      hasError: false,
      record: {
        phoneNumber: "1234567890",
        phoneNumberType: "DID"
      }
    });
  });
});