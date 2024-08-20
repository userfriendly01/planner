import {
  batchDeleteLegacyPhoneNumberRecords,
  batchDeleteLegacyPhoneNumberRecordsQuery
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Delete.Legacy.PhoneNumber.Records.Query";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { LegacyPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

describe("BatchDeleteLegacyPhoneNumberRecordsQuery", () => {
  it("should return correct batch input name", () => {
    expect(batchDeleteLegacyPhoneNumberRecordsQuery.batchInputName()).toEqual("pkey");
  });

  it("should return correct query name", () => {
    expect(batchDeleteLegacyPhoneNumberRecordsQuery.queryName()).toEqual("batchDeleteCctSharedCallFlowDb");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation batchDeleteCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchDelInput!) {
          batchDeleteCctSharedCallFlowDb(input: $input) {
            items {
              pkey
            }
          }
        }`;
    expect(batchDeleteLegacyPhoneNumberRecordsQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should delete legacy phone number records successfully", async () => {
    jest.spyOn(batchDeleteLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchDeleteCctSharedCallFlowDb: {
          items: undefined
        }
      },
      hasResults: false,
      errors: []
    } as GraphQLResponse<PhoneNumberRecordType>));
    const results = await batchDeleteLegacyPhoneNumberRecords(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.errors?.length).toEqual(0);
  });

  it("should handle error during batch delete legacy phone number records", async () => {
    jest.spyOn(batchDeleteLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: true,
      errors: [{
        message: "batch has errors"
      }]
    } as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const results = await batchDeleteLegacyPhoneNumberRecords(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.errors?.length).toEqual(1);
  });
});