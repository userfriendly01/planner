import {
  listDynamicPhoneNumberRecordsQuery, listDynamicPhoneNumberRecords
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/List.Dynamic.PhoneNumber.Records.Query";
import { mockDynamicPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { ListResults } from "dynamicCallFlowCommon/GraphQL/AbstractListRecords.Query";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { mockAccessToken, QUERY } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";

describe("ListDynamicPhoneNumberRecordsQuery", () => {
  it("should return correct query name", () => {
    expect(listDynamicPhoneNumberRecordsQuery.queryName()).toEqual("listPhoneNumbers");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      query listPhoneNumbers($limit: Int) { 
        listPhoneNumbers(limit: $limit) {
          nextToken
          items {
            pkey: phoneNumber
            brand
            callFlowName
            callFlowRoute
            callFlowTemplate
            callFlowType
            callIntent
            callTypeDescription
            callerType
            channel
            createTime
            dataRequests
            dialedDescription
            employeeId
            greetingMessages
            internetPlacement
            languageOffer
            lineOfBusiness
            marketingChannel
            nextActionId
            nextActionType
            officeNumbers
            phoneNumber
            phoneNumberType
            predictiveCaller
            rangeIndicator
            requestID
            tfnRoutingGroup
            tollFreeNumber
            transferCode
            transferDestination
            updateTime
            whisper
          }
        }
      }`;
    expect(listDynamicPhoneNumberRecordsQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should list dynamic phone number records successfully", async () => {
    jest.spyOn(listDynamicPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        listPhoneNumbers: {
          items: mockDynamicPhoneNumberArray()
        }
      } as unknown as ListResults<PhoneNumberRecordType>,
      hasResults: false,
      errors: [],
      nextToken: null
    } as unknown as GraphQLResponse<ListResults<PhoneNumberRecordType>>));
    const results = await listDynamicPhoneNumberRecords(mockAccessToken);
    expect(results.length).toEqual(mockDynamicPhoneNumberArray()?.length);
  });

  it("should handle error during list dynamic phone number records", async () => {
    jest.spyOn(listDynamicPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        listPhoneNumbers: {
          items: []
        }
      },
      hasResults: false,
      errors: ["error retrieving list"]
    } as unknown as GraphQLResponse<ListResults<PhoneNumberRecordType>>));
    const result = await listDynamicPhoneNumberRecords(mockAccessToken);
    expect(result).toEqual([]);
  });
});