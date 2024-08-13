import { ActionXlsxImportValidator } from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Import.Validator";
import {
  ActionXlsRowType, MenuOptionXlsxRow, MenuXlsxRow
} from "dynamicCallFlowAction/Xlsx/Action.Xlsx.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

describe("ActionXlsxImportValidator", () => {
  let validator: ActionXlsxImportValidator;

  beforeEach(() => {
    validator = new ActionXlsxImportValidator();
  });

  it("shouldReturnErrorsForMissingActionId", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "",
      actionType: "ANNOUNCEMENT",
      callFlowName: "Test"
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("ANNOUNCEMENT Action[undefined] missing actionId.");
  });

  it("shouldReturnErrorsForMissingSpeech", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "1",
      actionType: ActionTypeEnum.ANNOUNCEMENT,
      callFlowName: "Test",
      speech: ""
    }];

    const errors = validator.inspectValues(rows);
    expect(errors).toContain("ANNOUNCEMENT Action[undefined] missing speech.");
  });

  it("shouldReturnErrorsForInvalidActionType", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "1",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      actionType: "INVALID_TYPE",
      callFlowName: "Test"
    }];
    const errors = validator.inspectValues(rows);
    expect(errors).toContain("INVALID_TYPE Action[undefined] invalid actionType of INVALID_TYPE.");
  });

  it("shouldReturnErrorsForMissingCallFlowName", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "1",
      actionType: "ANNOUNCEMENT",
      callFlowName: ""
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("ANNOUNCEMENT Action[undefined] missing callFlowName.");
  });

  it("shouldReturnErrorsForMissing Speech NextActionType NextActionId In Announcement", () => {
    const rows: Array<ActionXlsRowType> = [{
      xlsxId: "1",
      actionId: "1",
      actionType: ActionTypeEnum.ANNOUNCEMENT,
      callFlowName: "Test",
      speech: ""
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("ANNOUNCEMENT Action[1] missing speech.");
    expect(errors).toContain("ANNOUNCEMENT Action[1] missing nextActionType.");
    expect(errors).toContain("ANNOUNCEMENT Action[1] missing nextActionId.");
  });

  it("shouldReturnErrorsForMissing Speech NextActionType NextActionId In Menu", () => {
    const rows: Array<ActionXlsRowType> = [{
      xlsxId: "1",
      actionId: "1",
      actionType: ActionTypeEnum.MENU,
      callFlowName: "Test"
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("MENU Action[1] missing speech.");
    expect(errors).toContain("MENU Action[1] missing nextActionType.");
    expect(errors).toContain("MENU Action[1] missing nextActionId.");
  });

  it("shouldReturnErrorsForMissing menuRepeatNextActionId", () => {
    const rows: Array<ActionXlsRowType> = [{
      xlsxId: "1",
      actionId: "1",
      actionType: ActionTypeEnum.MENU,
      callFlowName: "Test",
      menuRepeatNextActionType: ActionTypeEnum.ANNOUNCEMENT,
      nextActionId: "2",
      nextActionType: ActionTypeEnum.MENUOPTIONS
    } as MenuXlsxRow];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("MENU Action[1] menuRepeatActionType of ANNOUNCEMENT requires a value for menuRepeatNextActionId.");
  });

  it("should set automagically set menuRepeatNextActionType", () => {
    const rows: Array<ActionXlsRowType> = [{
      xlsxId: "1",
      actionId: "1",
      actionType: ActionTypeEnum.MENU,
      callFlowName: "Test",
      speech: "Hello",
      menuRepeatNextActionId: "1",
      nextActionId: "2",
      nextActionType: ActionTypeEnum.MENUOPTIONS
    } as MenuXlsxRow];
    const errors = validator.inspectValues(rows as any);
    expect(errors?.length).toBe(0);
  });

  it("should automatically set menuRepeatNextActionType", () => {
    const rows: Array<ActionXlsRowType> = [{
      xlsxId: "1",
      actionId: "1",
      actionType: ActionTypeEnum.MENU,
      callFlowName: "Test",
      speech: "Hello",
      nextActionId: "2",
      nextActionType: ActionTypeEnum.MENUOPTIONS
    } as MenuXlsxRow];
    const errors = validator.inspectValues(rows as any);
    expect(errors?.length).toBe(0);
  });

  it("should error for missing menuOptionDigit menuOptionNextActionType menuOptionNextActionType", () => {
    const rows: Array<ActionXlsRowType> = [
      {
        xlsxId: "1",
        actionId: "1",
        actionType: ActionTypeEnum.MENUOPTIONS,
        callFlowName: "Test"
      } as MenuOptionXlsxRow
    ];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("MENUOPTIONS Action[1] missing menuOptionDigit.");
    expect(errors).toContain("MENUOPTIONS Action[1] menuOptionNextActionType of unknown requires a value for menuOptionNextActionId.");
    expect(errors).toContain("MENUOPTIONS Action[1] A value for menuOptionNextActionType is required for MenuOptions action.");
  });

  it("shouldReturnErrorsForMissingNextActionTypeInAnnouncement", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "1",
      actionType: "ANNOUNCEMENT",
      callFlowName: "Test",
      speech: "Hello"
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("ANNOUNCEMENT Action[undefined] missing nextActionType.");
  });

  it("shouldReturnErrorsForMissingNextActionIdInAnnouncement", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "1",
      actionType: "ANNOUNCEMENT",
      callFlowName: "Test",
      speech: "Hello",
      nextActionType: "MENU"
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("ANNOUNCEMENT Action[undefined] missing nextActionId.");
  });

  it("shouldReturnErrorsForInvalidRedirectUrl", () => {
    const rows: Array<ActionXlsRowType> = [{
      actionId: "1",
      actionType: "REDIRECT",
      callFlowName: "Test",
      redirectUrl: "invalid-url"
    }];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toContain("REDIRECT Action[undefined] invalid redirectUrl 'invalid-url'.");
  });

  it("shouldNotReturnErrorsForValidRows", () => {
    const rows: Array<ActionXlsRowType> = [
      {
        actionId: "1",
        actionType: "ANNOUNCEMENT",
        callFlowName: "Test",
        speech: "Hello",
        nextActionType: "HANGUP"
      },
      {
        actionId: "2",
        actionType: "REDIRECT",
        callFlowName: "Test",
        redirectUrl: "http://example.com"
      }
    ];
    const errors = validator.inspectValues(rows as any);
    expect(errors).toEqual([]);
  });
});