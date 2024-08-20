import {
  batchUpdateLegacyPhoneNumberRecordsQuery, batchUpdateLegacyPhoneNumberRecords
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Update.LegacyPhoneNumber.Records.Query";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { LegacyPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

describe("BatchUpdateLegacyPhoneNumberRecordsQuery", () => {
  it("should return correct batch input name", () => {
    expect(batchUpdateLegacyPhoneNumberRecordsQuery.batchInputName()).toEqual("batchFlowUpdateInput");
  });

  it("should return correct query name", () => {
    expect(batchUpdateLegacyPhoneNumberRecordsQuery.queryName()).toEqual("batchUpdateCctSharedCallFlowDb");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation batchUpdateCctSharedCallFlowDb($input: CctSharedCallFlowDbBatchUpdateInput!) {
          batchUpdateCctSharedCallFlowDb(input: $input) {
            items {
              accountManager
              affinityVDN
              agentId
              brand
              callDetails1
              callDetails2
              callFlowTemplate
              callTypeDescription
              channel
              content {
                callFlowRoute
                callIntent
                callerType
                dataRequests
                greetingMessages
                languageOffer
                transferNumber
              }
              createTime
              dialedDescription
              employeeId
              internetPlacement
              lineOfBusiness
              marketingChannel
              pkey
              predictiveCaller
              rangeIndicator
              requestID
              selfServiceIndicator
              tollFreeNumber
              tfnRoutingGroup
              transferCode
              type
              userDestination
              whisper
            }
          }
        }`;
    expect(batchUpdateLegacyPhoneNumberRecordsQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should update legacy phone number records successfully", async () => {
    jest.spyOn(batchUpdateLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchCreatePhoneNumber: {
          items: []
        }
      },
      hasError: false,
      errors: []
    } as unknown as GraphQLResponse<PhoneNumberRecordType>));
    const results = await batchUpdateLegacyPhoneNumberRecords(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.errors?.length).toEqual(0);
  });

  it("should handle error during batch update legacy phone number records", async () => {
    jest.spyOn(batchUpdateLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchCreatePhoneNumber: {
          items: []
        }
      },
      hasError: false,
      errors: ["error updating records"]
    } as unknown as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const results = await batchUpdateLegacyPhoneNumberRecords(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.errors?.length).toEqual(1);
  });
});