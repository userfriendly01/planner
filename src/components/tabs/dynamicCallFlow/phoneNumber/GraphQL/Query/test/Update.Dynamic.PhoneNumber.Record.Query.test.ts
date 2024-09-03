import {
  updateDynamicPhoneNumberRecordQuery, updateDynamicPhoneNumberRecord
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Update.Dynamic.PhoneNumber.Record.Query";
import {
  PhoneNumber,
  PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { DynamicPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";

describe("UpdateDynamicPhoneNumberRecordQuery", () => {
  it("should return correct query name", () => {
    expect(updateDynamicPhoneNumberRecordQuery.queryName()).toEqual("updatePhoneNumber");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation updatePhoneNumber($input:PhoneNumberInput!) {
            updatePhoneNumber(input:$input) {
                    phoneNumber
            }
          }`;
    expect(updateDynamicPhoneNumberRecordQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should update dynamic phone number record successfully", async () => {
    jest.spyOn(updateDynamicPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        phoneNumber: "1234567890",
        phoneNumberType: "DID"
      } as PhoneNumber,
      hasResults: true,
      errors: []
    } as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const results = await updateDynamicPhoneNumberRecord(mockAccessToken, { ...DynamicPhoneNumberOne });
    expect(results.errors?.length).toEqual(0);
  });

  it("should handle error during update dynamic phone number record", async () => {
    jest.spyOn(updateDynamicPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: false,
      errors: [ {
        message: "error updating record"
      }]
    } as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const results = await updateDynamicPhoneNumberRecord(mockAccessToken, { ...DynamicPhoneNumberOne });
    expect(results.errors?.length).toEqual(1);
  });
});