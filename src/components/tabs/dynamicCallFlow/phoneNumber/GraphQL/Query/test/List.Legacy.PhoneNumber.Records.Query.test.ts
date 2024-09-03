import {
  listLegacyPhoneNumberRecordsQuery, listLegacyPhoneNumberRecords
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/List.Legacy.PhoneNumber.Records.Query";
import { ListResults } from "dynamicCallFlowCommon/GraphQL/AbstractListRecords.Query";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { LegacyPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

describe("ListLegacyPhoneNumberRecordsQuery", () => {
  it("should return correct query name", () => {
    expect(listLegacyPhoneNumberRecordsQuery.queryName()).toEqual("listCctSharedCallFlowDbs");
  });

  it("should return correct query definition", () => {
    const expectedQuery = `
      query listCctSharedCallFlowDbs($limit: Int, $nextToken: String) {
        listCctSharedCallFlowDbs(limit: $limit, nextToken: $nextToken) {
          nextToken
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
              callIntent
              callerType
              callFlowRoute
              dataRequests
              greetingMessages
              languageOffer
              transferNumber
              officeNumbers
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
            tfnRoutingGroup
            tollFreeNumber
            transferCode
            type
            updateTime
            userDestination
            whisper
          }
        }
      }`;
    expect(listLegacyPhoneNumberRecordsQuery.queryDefinition().replace(/\s+/g, " ").trim()).toEqual(expectedQuery.replace(/\s+/g, " ").trim());
  });

  it("should list legacy phone number records successfully", async () => {
    jest.spyOn(listLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        listCctSharedCallFlowDbs: {
          items: LegacyPhoneNumberArray
        }
      } as unknown as ListResults<PhoneNumberRecordType>,
      hasResults: false,
      errors: [],
      nextToken: null
    } as unknown as GraphQLResponse<ListResults<PhoneNumberRecordType>>));
    const results = await listLegacyPhoneNumberRecords(mockAccessToken);
    expect(results.length).toEqual(LegacyPhoneNumberArray?.length);
  });

  it("should handle error during list legacy phone number records", async () => {
    jest.spyOn(listLegacyPhoneNumberRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        listCctSharedCallFlowDbs: {
          items: []
        }
      },
      hasResults: false,
      errors: ["error retrieving list"]
    } as unknown as GraphQLResponse<ListResults<PhoneNumberRecordType>>));
    const result = await listLegacyPhoneNumberRecords(mockAccessToken);
    expect(result).toEqual([]);
  });
});