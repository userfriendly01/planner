import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import {
  ActionTypeEnum, CallFlowDeleteInput, GraphQLResponse
} from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  batchDeleteActionRecords, batchDeleteActionRecordsQuery
} from "dynamicCallFlowAction/GraphQL/Batch.Delete.Action.Records.Query";
import {
  mockAccessToken, QUERY
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { MockCallFlowConfigOne } from "dynamicCallFlowAction/GraphQL/test/Action.MockData";

describe("BatchDeleteActionRecordsQuery", () => {
  it("shouldGenerateCorrectCallFlowDeleteInputs", () => {
    const actionRecords: Array<ActionRecordType> = [
      {
        actionId: "1",
        actionType: ActionTypeEnum.ANNOUNCEMENT
      } as ActionRecordType,
      {
        actionId: "2",
        actionType: ActionTypeEnum.MENU
      } as ActionRecordType
    ];

    const expectedInputs: Array<CallFlowDeleteInput> = [
      {
        id: "1",
        actionType: ActionTypeEnum.ANNOUNCEMENT
      },
      {
        id: "2",
        actionType: ActionTypeEnum.MENU
      }
    ];

    expect(batchDeleteActionRecordsQuery.generateCallFlowDeleteInputs(actionRecords)).toEqual(expectedInputs);
  });

  it("shouldReturnEmptyArrayForEmptyActionRecords", () => {
    const actionRecords: Array<ActionRecordType> = [];
    expect(batchDeleteActionRecordsQuery.generateCallFlowDeleteInputs(actionRecords)).toEqual([]);
  });

  it("shouldHandleNullActionRecords", () => {
    expect(batchDeleteActionRecordsQuery.generateCallFlowDeleteInputs(null)).toEqual([]);
  });

  it("shouldHandleUndefinedActionRecords", () => {
    expect(batchDeleteActionRecordsQuery.generateCallFlowDeleteInputs(undefined)).toEqual([]);
  });

  it("should delete action records successfully", async () => {
    jest.spyOn(batchDeleteActionRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchDeletePhoneNumber: {
          items: MockCallFlowConfigOne
        }
      },
      hasResults: true,
      errors: []
    } as GraphQLResponse<ActionRecordType>));
    const result = await batchDeleteActionRecords(mockAccessToken, MockCallFlowConfigOne);
    expect(result.hasError).toEqual(false);
  });

  it("should handle error when deleting action records", async () => {
    jest.spyOn(batchDeleteActionRecordsQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        batchDeletePhoneNumber: {
          items: [] as Array<ActionRecordType>
        }
      },
      hasResults: false,
      errors: [{
        message: "error deleting records"
      }]
    } as GraphQLResponse<ActionRecordType>));
    const result = await batchDeleteActionRecords(mockAccessToken, MockCallFlowConfigOne);
    expect(result.hasError).toEqual(true);
  });
});