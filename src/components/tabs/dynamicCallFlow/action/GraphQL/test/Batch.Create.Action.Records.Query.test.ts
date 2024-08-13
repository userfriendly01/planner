import {
  ActionRecordType, Announcement, Menu
} from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import {
  ActionTypeEnum, GraphQLResponse
} from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  BatchCreateActionRecordsQuery,
  CallFlowConfig
} from "dynamicCallFlowAction/GraphQL/Batch.Create.Action.Records.Query";

describe("BatchCreateActionRecordsQuery", () => {
  let query: BatchCreateActionRecordsQuery;

  beforeEach(() => {
    query = new BatchCreateActionRecordsQuery();
  });

  it("shouldReturnCorrectQueryName", () => {
    expect(query.queryName()).toBe("createCallFlowConfig");
  });

  it("shouldReturnCorrectQueryDefinition", () => {
    expect(query.queryDefinition().replace(/\s+/g, " ")).toBe(
      " mutation createCallFlowConfig($input: CallFlowConfigInput! ) { createCallFlowConfig(input: $input) { callFlowName } }"
    );
  });

  it("shouldGenerateCorrectQueryVariables", () => {
    const actionRecords: Array<ActionRecordType> = [
      {
        actionId: "1",
        actionType: ActionTypeEnum.ANNOUNCEMENT,
        callFlowName: "TestFlow",
        speech: "Hello",
        nextActionType: ActionTypeEnum.MENU,
        nextActionId: "2"
      } as Announcement,
      {
        actionId: "2",
        actionType: ActionTypeEnum.MENU,
        callFlowName: "TestFlow",
        speech: "Press 1",
        allowBargeIn: true,
        finishOnKey: "#",
        minDigits: 1,
        maxDigits: 1,
        timeout: 5,
        repeat: {
          callerContextAttributes: "{}",
          loop: 3,
          nextActionType: ActionTypeEnum.MENU,
          nextActionId: "2"
        },
        nextActionType: ActionTypeEnum.REDIRECT,
        nextActionId: "3"
      } as Menu
    ];

    const expectedVariables: CallFlowConfig = {
      callFlowName: "TestFlow",
      announcements: [
        {
          actionId: "1",
          actionType: ActionTypeEnum.ANNOUNCEMENT,
          callFlowName: "TestFlow",
          createTime: undefined,
          speech: "Hello",
          nextActionType: ActionTypeEnum.MENU,
          nextActionId: "2",
          updateTime: undefined
        }
      ],
      menus: [
        {
          actionId: "2",
          actionType: ActionTypeEnum.MENU,
          callFlowName: "TestFlow",
          createTime: undefined,
          speech: "Press 1",
          allowBargeIn: true,
          finishOnKey: "#",
          minDigits: 1,
          maxDigits: 1,
          timeout: 5,
          repeat: {
            callerContextAttributes: "{}",
            loop: 3,
            nextActionType: ActionTypeEnum.MENU,
            nextActionId: "2"
          },
          nextActionType: ActionTypeEnum.REDIRECT,
          nextActionId: "3",
          updateTime: undefined
        }
      ],
      menuOptions: [],
      redirects: []
    };

    expect(query.generateQueryVariables(actionRecords)).toEqual(expectedVariables);
  });

  it("shouldGenerateBatchOfGraphQLInputVariables", () => {
    const actionRecords: Array<ActionRecordType> = Array(30).fill({
      actionId: "1",
      actionType: ActionTypeEnum.ANNOUNCEMENT,
      callFlowName: "TestFlow",
      speech: "Hello",
      nextActionType: ActionTypeEnum.MENU,
      nextActionId: "2"
    } as Announcement);

    const batchVariables = query.generateBatchOfGraphQLInputVariables(actionRecords);
    expect(batchVariables.length).toBe(2);
    expect(batchVariables[0].input.announcements.length).toBe(25);
    expect(batchVariables[1].input.announcements.length).toBe(5);
  });

  it("shouldBuildResponseWithErrors", () => {
    const batchGraphQLResponses: Array<GraphQLResponse<CallFlowConfig>> = [
      { errors: [{ message: "Error 1" }]} as GraphQLResponse<CallFlowConfig>,
      { errors: [{ message: "Error 2" }]} as GraphQLResponse<CallFlowConfig>
    ];

    const result = query.buildResponse(batchGraphQLResponses);
    expect(result.hasError).toBe(true);
    expect(result.errors.length).toBe(2);
    expect(result.alertMsg).toBe("Errors occurred processing createCallFlowConfig records");
  });

  it("shouldBuildResponseWithoutErrors", () => {
    const batchGraphQLResponses: Array<GraphQLResponse<CallFlowConfig>> = [
      { data: { callFlowName: "TestFlow" }} as GraphQLResponse<CallFlowConfig>,
      { data: { callFlowName: "TestFlow2" }} as GraphQLResponse<CallFlowConfig>
    ];

    const result = query.buildResponse(batchGraphQLResponses);
    expect(result.hasError).toBe(false);
    expect(result.errors.length).toBe(0);
  });
});