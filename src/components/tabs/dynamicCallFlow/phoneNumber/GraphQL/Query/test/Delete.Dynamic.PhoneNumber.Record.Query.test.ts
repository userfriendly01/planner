import {
  deleteDynamicPhoneNumberRecord,
  deleteDynamicPhoneNumberRecordQuery
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Delete.Dynamic.PhoneNumber.Record.Query";
import {
  PhoneNumber,
  PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { QUERY } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";

describe("DeleteDynamicPhoneNumberRecordQuery", () => {
  let mockAccessToken: string;
  let mockPhoneNumber: PhoneNumber;

  beforeEach(() => {
    mockAccessToken = "mockAccessToken";
    mockPhoneNumber = { phoneNumber: "1234567890" } as PhoneNumber;
  });

  it("should return correct query name", () => {
    expect(deleteDynamicPhoneNumberRecordQuery.queryName()).toEqual("deletePhoneNumber");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation deletePhoneNumber($input:CallFlowDeleteInput!) {
            deletePhoneNumber(input:$input) {
                    phoneNumber
            }
          }`;
    expect(deleteDynamicPhoneNumberRecordQuery.queryDefinition()).toEqual(expectedQuery);
  });

  it("should delete dynamic phone number record successfully", async () => {
    jest.spyOn(deleteDynamicPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      hasError: false,
      errors: []
    } as unknown as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const result = await deleteDynamicPhoneNumberRecord(mockAccessToken, mockPhoneNumber);
    expect(result.hasError).toEqual(false);
  });

  it("should handle error during delete dynamic phone number record", async () => {
    jest.spyOn(deleteDynamicPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: true,
      errors: [{
        message: "Delete failed"
      }]
    }  as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const result = await deleteDynamicPhoneNumberRecord(mockAccessToken, mockPhoneNumber);
    expect(result.hasError).toEqual(true);
  });
});