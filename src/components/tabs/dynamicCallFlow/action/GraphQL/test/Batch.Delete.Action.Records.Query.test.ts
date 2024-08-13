import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import {
  ActionTypeEnum, CallFlowDeleteInput
} from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { BatchDeleteActionRecordsQuery } from "dynamicCallFlowAction/GraphQL/Batch.Delete.Action.Records.Query";

describe("BatchDeleteActionRecordsQuery", () => {
  let query: BatchDeleteActionRecordsQuery;

  beforeEach(() => {
    query = new BatchDeleteActionRecordsQuery();
  });

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

    expect(query.generateCallFlowDeleteInputs(actionRecords)).toEqual(expectedInputs);
  });

  it("shouldReturnEmptyArrayForEmptyActionRecords", () => {
    const actionRecords: Array<ActionRecordType> = [];
    expect(query.generateCallFlowDeleteInputs(actionRecords)).toEqual([]);
  });

  it("shouldHandleNullActionRecords", () => {
    expect(query.generateCallFlowDeleteInputs(null)).toEqual([]);
  });

  it("shouldHandleUndefinedActionRecords", () => {
    expect(query.generateCallFlowDeleteInputs(undefined)).toEqual([]);
  });
});