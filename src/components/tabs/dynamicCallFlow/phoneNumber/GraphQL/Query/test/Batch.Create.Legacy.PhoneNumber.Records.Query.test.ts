import {
  batchCreateLegacyPhoneNumberRecords,
  batchCreateLegacyPhoneNumberRecordsQuery
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Create.Legacy.PhoneNumber.Records.Query";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { LegacyPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

describe("BatchCreateLegacyPhoneNumberRecordsQuery", () => {
  it("should return correct batch input name", () => {
    expect(batchCreateLegacyPhoneNumberRecordsQuery.batchInputName()).toEqual("batchFlowCreateInput");
  });

  it("should return correct query name", () => {
    expect(batchCreateLegacyPhoneNumberRecordsQuery.queryName()).toEqual("batchCreateCctSharedCallFlowDb");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation batchCreateCctSharedCallFlowDb ($input: CctSharedCallFlowDbBatchCreateInput!) {
        batchCreateCctSharedCallFlowDb(input: $input) {
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
            transferCode
            type
            userDestination
            whisper
          }
        }
      }`;
    expect(batchCreateLegacyPhoneNumberRecordsQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should create legacy phone number records successfully", async () => {
    jest.spyOn(batchCreateLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchCreateCctSharedCallFlowDb: LegacyPhoneNumberArray
      },
      hasResults: false,
      errors: []
    } as GraphQLResponse<PhoneNumberRecordType>));
    const results = await batchCreateLegacyPhoneNumberRecords(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.hasError).toEqual(false);
  });

  it("should handle error during batch create legacy phone number records", async () => {
    jest.spyOn(batchCreateLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: false,
      errors: [{
        message: "Batch create failed"
      }]
    } as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const results = await batchCreateLegacyPhoneNumberRecords(mockAccessToken, LegacyPhoneNumberArray);
    expect(results.hasError).toEqual(true);
  });
});