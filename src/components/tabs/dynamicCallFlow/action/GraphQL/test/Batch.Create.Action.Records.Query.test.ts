import {
  ActionRecordType,
  Announcement,
  Menu,
  MenuOption,
  MenuOptions,
  Redirect,
  Repeat
} from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import {
  ActionTypeEnum,
  GraphQLResponse
} from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  CallFlowConfig,
  batchCreateDynamicActionQuery,
  batchCreateDynamicActionRecords
} from "dynamicCallFlowAction/GraphQL/Batch.Create.Action.Records.Query";
import {
  QUERY,
  mockAccessToken
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";

import { MockCallFlowConfigOne } from "dynamicCallFlowAction/GraphQL/test/Action.MockData";

describe("BatchCreateActionRecordsQuery", () => {
  it("shouldReturnCorrectQueryName", () => {
    expect(batchCreateDynamicActionQuery.queryName()).toEqual("createCallFlowConfig");
  });

  it("shouldReturnCorrectQueryDefinition", () => {
    const expectedDefinition = `
      mutation createCallFlowConfig($input: CallFlowConfigInput! ) {
        createCallFlowConfig(input: $input) {
            callFlowName
          }
        }`;
    expect(batchCreateDynamicActionQuery.queryDefinition()).toEqual(expectedDefinition);
  });

  it("shouldGenerateCorrectQueryVariablesForAnnouncements", () => {
    const actionRecords: Array<ActionRecordType> = [
      {
        actionId: "1",
        actionType: ActionTypeEnum.ANNOUNCEMENT,
        callFlowName: "TestFlow",
        speech: "Hello",
        nextActionType: ActionTypeEnum.MENU,
        nextActionId: "2"
      } as Announcement
    ];

    const expectedVariables: CallFlowConfig = {
      callFlowName: "TestFlow",
      announcements: [
        {
          actionId: "1",
          actionType: ActionTypeEnum.ANNOUNCEMENT,
          callFlowName: "TestFlow",
          createTime: undefined,
          updateTime: undefined,
          speech: "Hello",
          nextActionType: ActionTypeEnum.MENU,
          nextActionId: "2"
        }
      ],
      captures: [],
      menus: [],
      menuOptions: [],
      redirects: []
    };

    expect(batchCreateDynamicActionQuery.generateQueryVariables(actionRecords)).toEqual(expectedVariables);
  });

  it("shouldGenerateCorrectQueryVariablesForMenus", () => {
    const actionRecords: Array<ActionRecordType> = [
      {
        actionId: "1",
        actionType: ActionTypeEnum.MENU,
        callFlowName: "TestFlow",
        speech: "Press 1",
        allowBargeIn: true,
        finishOnKey: "#",
        minDigits: 1,
        maxDigits: 1,
        timeout: 5,
        repeat: {
          nextActionId: "2",
          nextActionType: ActionTypeEnum.REDIRECT,
          loop: 2
        } as Repeat,
        nextActionType: ActionTypeEnum.REDIRECT,
        nextActionId: "3"
      } as Menu
    ];

    const expectedVariables: CallFlowConfig = {
      callFlowName: "TestFlow",
      announcements: [],
      captures: [],
      menus: [
        {
          actionId: "1",
          actionType: ActionTypeEnum.MENU,
          callFlowName: "TestFlow",
          createTime: undefined,
          updateTime: undefined,
          speech: "Press 1",
          allowBargeIn: true,
          finishOnKey: "#",
          minDigits: 1,
          maxDigits: 1,
          timeout: 5,
          repeat: {
            nextActionId: "2",
            nextActionType: ActionTypeEnum.REDIRECT,
            loop: 2
          } as Repeat,
          nextActionType: ActionTypeEnum.REDIRECT,
          nextActionId: "3"
        }
      ],
      menuOptions: [],
      redirects: []
    };

    expect(batchCreateDynamicActionQuery.generateQueryVariables(actionRecords)).toEqual(expectedVariables);
  });

  it("shouldGenerateCorrectQueryVariablesForMenuOptions", () => {
    const actionRecords: Array<ActionRecordType> = [
      {
        actionId: "1",
        actionType: ActionTypeEnum.MENU_OPTIONS,
        callFlowName: "TestFlow",
        options: [
          {
            digit: "1",
            callerContextAttributes: "",
            nextActionId: "2",
            nextActionType: ActionTypeEnum.REDIRECT
          } as MenuOption,
          {
            digit: "2",
            callerContextAttributes: "",
            nextActionId: "2",
            nextActionType: ActionTypeEnum.REDIRECT
          } as MenuOption
        ]
      } as MenuOptions
    ];

    const expectedVariables: CallFlowConfig = {
      callFlowName: "TestFlow",
      announcements: [],
      captures: [],
      menus: [],
      menuOptions: [
        {
          actionId: "1",
          actionType: ActionTypeEnum.MENU_OPTIONS,
          callFlowName: "TestFlow",
          createTime: undefined,
          updateTime: undefined,
          options: [
            {
              digit: "1",
              callerContextAttributes: "" as MenuOption,
              nextActionId: "2",
              nextActionType: ActionTypeEnum.REDIRECT
            } as MenuOption,
            {
              digit: "2",
              callerContextAttributes: "" as MenuOption,
              nextActionId: "2",
              nextActionType: ActionTypeEnum.REDIRECT
            } as MenuOption
          ]
        }
      ],
      redirects: []
    };

    expect(batchCreateDynamicActionQuery.generateQueryVariables(actionRecords)).toEqual(expectedVariables);
  });

  it("shouldGenerateCorrectQueryVariablesForRedirects", () => {
    const actionRecords: Array<ActionRecordType> = [
      {
        actionId: "1",
        actionType: ActionTypeEnum.REDIRECT,
        callFlowName: "TestFlow",
        url: "http://example.com"
      } as Redirect
    ];

    const expectedVariables: CallFlowConfig = {
      callFlowName: "TestFlow",
      announcements: [],
      captures: [],
      menus: [],
      menuOptions: [],
      redirects: [
        {
          actionId: "1",
          actionType: ActionTypeEnum.REDIRECT,
          callFlowName: "TestFlow",
          createTime: undefined,
          updateTime: undefined,
          url: "http://example.com"
        }
      ]
    };

    expect(batchCreateDynamicActionQuery.generateQueryVariables(actionRecords)).toEqual(expectedVariables);
  });

  it("should create action records successfully", async () => {
    jest.spyOn(batchCreateDynamicActionQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        createCallFlowConfig: {
          items: MockCallFlowConfigOne
        }
      },
      hasResults: true,
      errors: []
    } as GraphQLResponse<ActionRecordType>));
    const result = await batchCreateDynamicActionRecords(mockAccessToken, MockCallFlowConfigOne);
    expect(result.hasError).toEqual(false);
  });

  it("should handle error when creating action records", async () => {
    jest.spyOn(batchCreateDynamicActionQuery, QUERY).mockReturnValue(Promise.resolve({
      data: {
        createCallFlowConfig: {
          items: [] as Array<ActionRecordType>
        }
      },
      hasResults: false,
      errors: [{
        message: "error creating records"
      }]
    } as GraphQLResponse<ActionRecordType>));
    const result = await batchCreateDynamicActionRecords(mockAccessToken, MockCallFlowConfigOne);
    expect(result.hasError).toEqual(true);
  });
});