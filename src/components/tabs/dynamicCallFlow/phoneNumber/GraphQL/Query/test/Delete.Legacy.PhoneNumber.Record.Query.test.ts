import {
  deleteLegacyPhoneNumberRecordQuery, deleteLegacyPhoneNumberRecord
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Delete.Legacy.PhoneNumber.Record.Query";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { LegacyPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

describe("DeleteLegacyPhoneNumberRecordQuery", () => {
  it("should return correct query name", () => {
    expect(deleteLegacyPhoneNumberRecordQuery.queryName()).toEqual("deleteCctSharedCallFlowDb");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation deleteCctSharedCallFlowDb($input:CctSharedCallFlowDbDelInput!) {
        deleteCctSharedCallFlowDb(input:$input ){
          pkey
        }
      }`;
    expect(deleteLegacyPhoneNumberRecordQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should delete legacy phone number record successfully", async () => {
    jest.spyOn(deleteLegacyPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        deleteCctSharedCallFlowDb: undefined
      },
      hasResults: false,
      errors: []
    } as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const results = await deleteLegacyPhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(results.errors?.length).toEqual(0);
  });

  it("should handle error during delete legacy phone number record", async () => {
    jest.spyOn(deleteLegacyPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: false,
      errors: ["error deleting legacy phone number record"]
    } as unknown as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const results = await deleteLegacyPhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(results.errors?.length).toEqual(1);
  });
});