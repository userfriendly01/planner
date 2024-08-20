import {
  batchCreateDynamicPhoneNumberRecords,
  batchCreateDynamicPhoneNumberRecordsQuery
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Create.Dynamic.PhoneNumber.Records.Query";
import {
  PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { mockDynamicPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";

describe("BatchCreateDynamicPhoneNumberRecordsQuery", () => {
  it("should return correct batch input name", () => {
    expect(batchCreateDynamicPhoneNumberRecordsQuery.batchInputName()).toEqual("batchPhoneNumberInput");
  });

  it("should return correct query name", () => {
    expect(batchCreateDynamicPhoneNumberRecordsQuery.queryName()).toEqual("batchCreatePhoneNumber");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      mutation batchCreatePhoneNumber ($input: PhoneNumberCreateBatchInput!) {
        batchCreatePhoneNumber(input: $input) {
          items {
            phoneNumber
            callFlowName
            createTime
            updateTime
            nextActionType
            nextActionId
            callFlowTemplate
            dialedDescription
            phoneNumberType
            tfnRoutingGroup
            brand
            dataRequests
            greetingMessages
            languageOffer
            transferDestination
            callerType
            callFlowRoute
            callIntent
            callFlowType
            channel
            predictiveCaller
            employeeId
            callTypeDescription
            internetPlacement
            lineOfBusiness
            marketingChannel
            rangeIndicator
            requestID
            tollFreeNumber
            transferCode
            whisper
            officeNumbers
          }
        }
      }`;
    expect(batchCreateDynamicPhoneNumberRecordsQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should create dynamic phone number records successfully", async () => {
    jest.spyOn(batchCreateDynamicPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchCreatePhoneNumber: {
          items: mockDynamicPhoneNumberArray()
        }
      },
      hasResults: false,
      errors: []
    } as unknown as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const result = await batchCreateDynamicPhoneNumberRecords(mockAccessToken, mockDynamicPhoneNumberArray());
    expect(result.hasError).toEqual(false);
  });

  it("should handle error during batch create dynamic phone number records", async () => {
    jest.spyOn(batchCreateDynamicPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: undefined,
      hasResults: false,
      errors: [{
        message: "Batch create failed"
      }]
    } as GraphQLResponse<BatchResults<PhoneNumberRecordType>>));
    const result = await batchCreateDynamicPhoneNumberRecords(mockAccessToken, mockDynamicPhoneNumberArray());
    expect(result.hasError).toEqual(true);
  });
});