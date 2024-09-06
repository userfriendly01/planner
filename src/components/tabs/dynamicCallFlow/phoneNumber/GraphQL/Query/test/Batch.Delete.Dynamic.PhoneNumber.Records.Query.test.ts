import {
  batchDeleteDynamicPhoneNumberRecords,
  batchDeleteDynamicPhoneNumberRecordsQuery
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Delete.Dynamic.PhoneNumber.Records.Query";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { mockDynamicPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";

describe("BatchDeleteDynamicPhoneNumberRecordsQuery", () => {
  it("should delete dynamic phone number records successfully", async () => {
    jest.spyOn(batchDeleteDynamicPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: false,
      errors: []
    } as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const results = await batchDeleteDynamicPhoneNumberRecords(mockAccessToken, mockDynamicPhoneNumberArray());
    expect(results.errors?.length).toEqual(0);
  });

  it("should handle error during batch delete dynamic phone number records", async () => {
    jest.spyOn(batchDeleteDynamicPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: false,
      errors: [{
        message: "Batch delete failed"
      }]
    } as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const results = await batchDeleteDynamicPhoneNumberRecords(mockAccessToken, mockDynamicPhoneNumberArray());
    expect(results.errors?.length).toEqual(1);
  });
});