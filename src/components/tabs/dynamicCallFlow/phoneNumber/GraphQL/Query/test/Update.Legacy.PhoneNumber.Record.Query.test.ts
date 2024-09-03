import {
  updateLegacyPhoneNumberRecordQuery, updateLegacyPhoneNumberRecord
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Update.Legacy.PhoneNumber.Record.Query";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { SingleRecordResults } from "components/tabs/dynamicCallFlow/common/GraphQL/AbstractSingleRecord.Query";
import { query } from "express";
import { mockAccessToken, QUERY } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import {
  updateDynamicPhoneNumberRecord,
  updateDynamicPhoneNumberRecordQuery
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Update.Dynamic.PhoneNumber.Record.Query";
import { PhoneNumber, PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { DynamicPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

describe("UpdateLegacyPhoneNumberRecordQuery", () => {
  it("should return correct query name", () => {
    expect(updateLegacyPhoneNumberRecordQuery.queryName()).toEqual("updateCctSharedCallFlowDb");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation updateCctSharedCallFlowDb($input: CctSharedCallFlowDbInputMod!) {
        updateCctSharedCallFlowDb(input:$input) {
          pkey
        }
      }`;
    expect(updateLegacyPhoneNumberRecordQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should update legacy phone number record successfully", async () => {
    jest.spyOn(updateLegacyPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        updateCctSharedCallFlowDb: {
          pkey: "1234567890",
          type: "DID"
        } as CctSharedCallFlowDb
      },
      hasResults: true,
      errors: []
    } as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const results = await updateLegacyPhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(results.errors?.length).toEqual(0);
  });

  it("should handle error during update legacy phone number record", async () => {
    jest.spyOn(updateLegacyPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        updateCctSharedCallFlowDb: undefined
      },
      hasResults: false,
      errors: [{
        message: "error updating record"
      }]
    } as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));
    const results = await updateLegacyPhoneNumberRecord(mockAccessToken, LegacyPhoneNumberOne);
    expect(results.errors?.length).toEqual(1);
  });
});