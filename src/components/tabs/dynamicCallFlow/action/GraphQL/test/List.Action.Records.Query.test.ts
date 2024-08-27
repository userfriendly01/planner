import {
  listActionRecords, listActionRecordsQuery
} from "dynamicCallFlowAction/GraphQL/List.Action.Records.Query";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { MockCallFlowConfigOne } from "dynamicCallFlowAction/GraphQL/test/Action.MockData";
import { GraphQLResponse } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";

describe("ListActionRecordsQuery", () => {
  it("shouldReturnCorrectQueryName", () => {
    expect(listActionRecordsQuery.queryName()).toEqual("getCallFlowConfig");
  });

  it("shouldReturnCorrectQueryDefinition", () => {
    const expectedDefinition = `
      query getCallFlowConfig {
        getCallFlowConfig {
          items {
            ... on Menu {
              allowBargeIn
              finishOnKey
              actionId
              actionType
              callFlowName
              createTime
              maxDigits
              minDigits
              nextActionId
              nextActionType
              repeat {
                callerContextAttributes
                loop
                nextActionId
                nextActionType
              }
              speech
              timeout
              updateTime
            }
            ... on MenuOptions {
              __typename
              actionId
              actionType
              callFlowName
              createTime
              updateTime
              options {
                callerContextAttributes
                digit
                nextActionId
                nextActionType
              }
            }
            ... on Announcement {
              nextActionId
              actionId
              actionType
              callFlowName
              createTime
              nextActionType
              speech
              updateTime
            }
            ... on Redirect {
              actionId
              actionType
              callFlowName
              createTime
              url
              updateTime
            }
          }
        }
      }`;
    expect(listActionRecordsQuery.queryDefinition()).toEqual(expectedDefinition);
  });

  it("should list action records successfully", async () => {
    jest.spyOn(listActionRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        getCallFlowConfig: {
          items: MockCallFlowConfigOne
        }
      },
      hasResults: true,
      errors: []
    } as GraphQLResponse<ActionRecordType>));
    const records = await listActionRecords(mockAccessToken);
    expect(records?.length).toEqual(3);
  });

  it("should throw error when listing action records", async () => {
    jest.spyOn(listActionRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        getCallFlowConfig: {
          items: [] as Array<ActionRecordType>
        }
      },
      hasResults: false,
      errors: [{
        message: "error listing records"
      }]
    } as GraphQLResponse<ActionRecordType>));

    try {
      await listActionRecords(mockAccessToken);
    } catch(error) {
      expect(error?.message).toEqual("error listing records");
    }
  });
});