import {
  ActionRecordType, Announcement, Menu, MenuOptions, Redirect
} from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { ActionXlsxRowGenerator } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Row.Generator";

describe("ActionXlsxRowGenerator", () => {
  it("shouldGenerateXlsxRowsForAnnouncement", () => {
    const generator = new ActionXlsxRowGenerator();
    const actionRecords: Array<ActionRecordType> = [
      {
        actionType: ActionTypeEnum.ANNOUNCEMENT,
        actionId: "1",
        callFlowName: "TestFlow",
        speech: "Hello",
        nextActionId: "2",
        nextActionType: ActionTypeEnum.MENU
      } as Announcement
    ];
    const result = generator.generateXlsxRows(actionRecords);
    expect(result).toEqual([
      {
        actionId: "1",
        actionType: ActionTypeEnum.ANNOUNCEMENT,
        callFlowName: "TestFlow",
        speech: "Hello",
        nextActionId: "2",
        nextActionType: ActionTypeEnum.MENU
      }
    ]);
  });

  it("shouldGenerateXlsxRowsForMenu", () => {
    const generator = new ActionXlsxRowGenerator();
    const actionRecords: Array<ActionRecordType> = [
      {
        actionType: ActionTypeEnum.MENU,
        actionId: "1",
        callFlowName: "TestFlow",
        speech: "Choose an option",
        nextActionId: "2",
        nextActionType: ActionTypeEnum.MENU_OPTIONS,
        allowBargeIn: true,
        finishOnKey: "#",
        minDigits: 1,
        maxDigits: 5,
        timeout: 10,
        repeat: {
          loop: 3,
          nextActionType: ActionTypeEnum.REDIRECT,
          nextActionId: "3",
          callerContextAttributes: JSON.stringify({ reasonForReturning: "Timeout" })
        }
      } as Menu
    ];
    const result = generator.generateXlsxRows(actionRecords);
    expect(result).toEqual([
      {
        actionId: "1",
        actionType: ActionTypeEnum.MENU,
        callFlowName: "TestFlow",
        speech: "Choose an option",
        nextActionId: "2",
        nextActionType: ActionTypeEnum.MENU_OPTIONS,
        menuAllowBargeIn: true,
        menuFinishOnKey: "#",
        menuMinDigits: 1,
        menuMaxDigits: 5,
        menuTimeout: 10,
        menuRepeatLoop: 3,
        menuRepeatNextActionType: ActionTypeEnum.REDIRECT,
        menuRepeatNextActionId: "3",
        menuRepeatReasonForReturning: "Timeout"
      }
    ]);
  });

  it("shouldGenerateXlsxRowsForMenuOptions", () => {
    const generator = new ActionXlsxRowGenerator();
    const actionRecords: Array<ActionRecordType> = [
      {
        actionType: ActionTypeEnum.MENU_OPTIONS,
        actionId: "1",
        callFlowName: "TestFlow",
        options: [{
          digit: "1",
          nextActionType: ActionTypeEnum.ANNOUNCEMENT,
          nextActionId: "2",
          callerContextAttributes: JSON.stringify({
            reasonForReturning: "Option1",
            callIntent: "Intent1"
          })
        }]
      } as MenuOptions
    ];
    const result = generator.generateXlsxRows(actionRecords);
    expect(result).toEqual([
      {
        actionId: "1",
        actionType: ActionTypeEnum.MENU_OPTIONS,
        callFlowName: "TestFlow",
        menuOptionDigit: "1",
        menuOptionNextActionType: ActionTypeEnum.ANNOUNCEMENT,
        menuOptionNextActionId: "2",
        menuOptionReasonForReturning: "Option1",
        menuOptionCallIntent: "Intent1"
      }
    ]);
  });

  it("shouldGenerateXlsxRowsForRedirect", () => {
    const generator = new ActionXlsxRowGenerator();
    const actionRecords: Array<ActionRecordType> = [
      {
        actionType: ActionTypeEnum.REDIRECT,
        actionId: "1",
        callFlowName: "TestFlow",
        url: "http://example.com"
      } as Redirect
    ];
    const result = generator.generateXlsxRows(actionRecords);
    expect(result).toEqual([
      {
        actionId: "1",
        actionType: ActionTypeEnum.REDIRECT,
        callFlowName: "TestFlow",
        redirectUrl: "http://example.com"
      }
    ]);
  });
});