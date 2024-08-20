import { SingleRecordResults } from "dynamicCallFlowCommon/GraphQL/AbstractSingleRecord.Query";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumber } from "google-libphonenumber";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  CREATE_CCT_SHARED_CALL_FLOW_DB_QUERY,
  createLegacyPhoneNumberRecord, createLegacyPhoneNumberRecordQuery
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Create.Legacy.PhoneNumber.Record.Query";
import { LegacyPhoneNumberOne } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";
import { mockAccessToken, QUERY } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";

describe("CreateDynamicPhoneNumberRecordQuery", () => {
  it("shouldReturnCorrectQueryName", () => {
    expect(createLegacyPhoneNumberRecordQuery.queryName()).toBe(CREATE_CCT_SHARED_CALL_FLOW_DB_QUERY);
  });

  it("shouldReturnCorrectQueryDefinition", () => {
    const expectedDefinition = `
      mutation createCctSharedCallFlowDb ($input: CctSharedCallFlowDbInput!) {
        createCctSharedCallFlowDb(input: $input) {
          agentId
          brand
          callFlowTemplate
          channel
          content  {
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
          pkey
          accountManager
          affinityVDN
          callTypeDescription
          transferCode
          internetPlacement
          callDetails1
          callDetails2
          tollFreeNumber
          lineOfBusiness
          marketingChannel
          predictiveCaller
          whisper
          requestID
          selfServiceIndicator
          userDestination
          rangeIndicator
          tfnRoutingGroup
          type
        }
      }`;
    expect(createLegacyPhoneNumberRecordQuery.queryDefinition().replace(/\s+/g, " ")).toBe(expectedDefinition.replace(/\s+/g, " "));
  });

  it("shouldCreateLegacyPhoneNumberRecordSuccessfully", async () => {
    jest.spyOn(createLegacyPhoneNumberRecordQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        createCctSharedCallFlowDb: {
          pkey: "1234567890",
          type: "DID"
        } as CctSharedCallFlowDb
      },
      hasResults: true,
      errors: []
    } as GraphQLResponse<SingleRecordResults<PhoneNumberRecordType>>));

    const result = await createLegacyPhoneNumberRecord(mockAccessToken, { ...LegacyPhoneNumberOne });
    expect(result).toEqual({
      alertMsg: "",
      errors: [],
      hasError: false,
      record: {
        pkey: "1234567890",
        type: "DID"
      }
    });
  });
});