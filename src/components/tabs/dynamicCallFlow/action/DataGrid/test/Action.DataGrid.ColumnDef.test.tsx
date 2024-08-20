import { ActionDataGridColumnDef } from "components/tabs/dynamicCallFlow/action/DataGrid/Action.DataGrid.ColumnDef";
import { GridColDef } from "@mui/x-data-grid";
import {
  OPTIONS, REPEAT, SPEECH
} from "dynamicCallFlowAction/Form/ActionFields";

describe("ActionDataGridColumnDef", () => {
  it("shouldHaveCorrectLength", () => {
    expect(ActionDataGridColumnDef.length).toEqual(14);
  });

  it("shouldHaveCorrectFields", () => {
    const fields = ActionDataGridColumnDef.map((column: GridColDef) => column.field);
    expect(fields).toEqual([
      "", "actionId", "actionType", "callFlowName", "nextActionId", "nextActionType", "speech", "timeout", "finishOnKey", "minDigits", "maxDigits", "options", "repeat", "url"
    ]);
  });

  it("shouldHaveSortableColumns", () => {
    const sortableColumns = ActionDataGridColumnDef.every((column: GridColDef) => column.sortable);
    expect(sortableColumns).toBe(true);
  });

  it("shouldHaveCorrectAlign", () => {
    const aligns = ActionDataGridColumnDef.every((column: GridColDef) => column.align === "left");
    expect(aligns).toBe(true);
  });

  it("shouldHaveRenderCellForSpecificFields", () => {
    const fieldsWithRenderCell = ActionDataGridColumnDef.filter((column: GridColDef) => column.renderCell).map((column: GridColDef) => column.field);
    expect(fieldsWithRenderCell).toEqual(["speech", "options", "repeat"]);
  });

  it("shouldHaveCorrectWidthForColumns", () => {
    const widths = ActionDataGridColumnDef.map((column: GridColDef) => column.width);
    expect(widths).toEqual([50, 300, 150, 110, 300, 150, 300, 110, 110, 110, 110, 300, 300, 300]);
  });

  it("shouldHaveTooltipForSpeechField", () => {
    const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === SPEECH);
    expect(speechColumn?.renderCell).toBeDefined();
  });

  it("shouldHaveTooltipForOptionsField", () => {
    const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === OPTIONS);
    expect(optionsColumn?.renderCell).toBeDefined();
  });

  it("shouldHaveTooltipForRepeatField", () => {
    const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === REPEAT);
    expect(repeatColumn?.renderCell).toBeDefined();
  });

  it("shouldHaveCorrectHeaderNames", () => {
    const headerNames = ActionDataGridColumnDef.map((column: GridColDef) => column.headerName);
    expect(headerNames).toEqual([
      "", "Action Id", "Action Type", "Call Flow Name", "Next Action Id", "Next Action Type", "Speech", "Menu Timeout", "Menu Finish On Key", "Menu Min Digits", "Menu Max Digits", "Menu Options", "Menu Repeat", "Redirect URL"
    ]);
  });

  describe("ActionDataGridColumnDef", () => {
    it("shouldHaveCorrectFieldForActionId", () => {
      const actionIdColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionId");
      expect(actionIdColumn?.field).toBe("actionId");
    });

    it("shouldHaveCorrectHeaderNameForActionId", () => {
      const actionIdColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionId");
      expect(actionIdColumn?.headerName).toBe("Action Id");
    });

    it("shouldHaveSortableActionIdField", () => {
      const actionIdColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionId");
      expect(actionIdColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForActionId", () => {
      const actionIdColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionId");
      expect(actionIdColumn?.width).toBe(300);
    });

    it("shouldHaveCorrectAlignmentForActionId", () => {
      const actionIdColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionId");
      expect(actionIdColumn?.align).toBe("left");
    });
  });

  describe("ActionDataGridColumnDef", () => {
    it("shouldHaveCorrectFieldForActionType", () => {
      const actionTypeColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionType");
      expect(actionTypeColumn?.field).toBe("actionType");
    });

    it("shouldHaveCorrectHeaderNameForActionType", () => {
      const actionTypeColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionType");
      expect(actionTypeColumn?.headerName).toBe("Action Type");
    });

    it("shouldHaveSortableActionTypeField", () => {
      const actionTypeColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionType");
      expect(actionTypeColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForActionType", () => {
      const actionTypeColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionType");
      expect(actionTypeColumn?.width).toBe(150);
    });

    it("shouldHaveCorrectAlignmentForActionType", () => {
      const actionTypeColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "actionType");
      expect(actionTypeColumn?.align).toBe("left");
    });
  });

  describe("ActionDataGridColumnDef", () => {
    it("shouldHaveCorrectFieldForCallFlowName", () => {
      const callFlowNameColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "callFlowName");
      expect(callFlowNameColumn?.field).toBe("callFlowName");
    });

    it("shouldHaveCorrectHeaderNameForCallFlowName", () => {
      const callFlowNameColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "callFlowName");
      expect(callFlowNameColumn?.headerName).toBe("Call Flow Name");
    });

    it("shouldHaveSortableCallFlowNameField", () => {
      const callFlowNameColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "callFlowName");
      expect(callFlowNameColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForCallFlowName", () => {
      const callFlowNameColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "callFlowName");
      expect(callFlowNameColumn?.width).toBe(110);
    });

    it("shouldHaveCorrectAlignmentForCallFlowName", () => {
      const callFlowNameColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "callFlowName");
      expect(callFlowNameColumn?.align).toBe("left");
    });
  });

  describe("ActionDataGridColumnDef", () => {
    it("shouldHaveCorrectFieldForSpeech", () => {
      const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "speech");
      expect(speechColumn?.field).toBe("speech");
    });

    it("shouldHaveCorrectHeaderNameForSpeech", () => {
      const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "speech");
      expect(speechColumn?.headerName).toBe("Speech");
    });

    it("shouldHaveSortableSpeechField", () => {
      const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "speech");
      expect(speechColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForSpeech", () => {
      const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "speech");
      expect(speechColumn?.width).toBe(300);
    });

    it("shouldHaveCorrectAlignmentForSpeech", () => {
      const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "speech");
      expect(speechColumn?.align).toBe("left");
    });

    it("shouldRenderTooltipForSpeech", () => {
      const speechColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "speech");
      expect(speechColumn?.renderCell).toBeDefined();
    });
  });

  it("shouldHaveCorrectFieldForTimeout", () => {
    const timeoutColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "timeout");
    expect(timeoutColumn?.field).toBe("timeout");
  });

  it("shouldHaveCorrectHeaderNameForTimeout", () => {
    const timeoutColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "timeout");
    expect(timeoutColumn?.headerName).toBe("Menu Timeout");
  });

  it("shouldHaveSortableTimeoutField", () => {
    const timeoutColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "timeout");
    expect(timeoutColumn?.sortable).toBe(true);
  });

  it("shouldHaveCorrectWidthForTimeout", () => {
    const timeoutColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "timeout");
    expect(timeoutColumn?.width).toBe(110);
  });

  it("shouldHaveCorrectAlignmentForTimeout", () => {
    const timeoutColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "timeout");
    expect(timeoutColumn?.align).toBe("left");
  });

  it("shouldHaveCorrectFieldForFinishOnKey", () => {
    const finishOnKeyColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "finishOnKey");
    expect(finishOnKeyColumn?.field).toBe("finishOnKey");
  });

  it("shouldHaveCorrectHeaderNameForFinishOnKey", () => {
    const finishOnKeyColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "finishOnKey");
    expect(finishOnKeyColumn?.headerName).toBe("Menu Finish On Key");
  });

  it("shouldHaveSortableFinishOnKeyField", () => {
    const finishOnKeyColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "finishOnKey");
    expect(finishOnKeyColumn?.sortable).toBe(true);
  });

  it("shouldHaveCorrectWidthForFinishOnKey", () => {
    const finishOnKeyColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "finishOnKey");
    expect(finishOnKeyColumn?.width).toBe(110);
  });

  it("shouldHaveCorrectAlignmentForFinishOnKey", () => {
    const finishOnKeyColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "finishOnKey");
    expect(finishOnKeyColumn?.align).toBe("left");
  });

  describe("ActionDataGridColumnDef", () => {
    it("shouldHaveCorrectFieldForMinDigits", () => {
      const minDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "minDigits");
      expect(minDigitsColumn?.field).toBe("minDigits");
    });

    it("shouldHaveCorrectHeaderNameForMinDigits", () => {
      const minDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "minDigits");
      expect(minDigitsColumn?.headerName).toBe("Menu Min Digits");
    });

    it("shouldHaveSortableMinDigitsField", () => {
      const minDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "minDigits");
      expect(minDigitsColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForMinDigits", () => {
      const minDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "minDigits");
      expect(minDigitsColumn?.width).toBe(110);
    });

    it("shouldHaveCorrectAlignmentForMinDigits", () => {
      const minDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "minDigits");
      expect(minDigitsColumn?.align).toBe("left");
    });

    it("shouldHaveCorrectFieldForMaxDigits", () => {
      const maxDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "maxDigits");
      expect(maxDigitsColumn?.field).toBe("maxDigits");
    });

    it("shouldHaveCorrectHeaderNameForMaxDigits", () => {
      const maxDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "maxDigits");
      expect(maxDigitsColumn?.headerName).toBe("Menu Max Digits");
    });

    it("shouldHaveSortableMaxDigitsField", () => {
      const maxDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "maxDigits");
      expect(maxDigitsColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForMaxDigits", () => {
      const maxDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "maxDigits");
      expect(maxDigitsColumn?.width).toBe(110);
    });

    it("shouldHaveCorrectAlignmentForMaxDigits", () => {
      const maxDigitsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "maxDigits");
      expect(maxDigitsColumn?.align).toBe("left");
    });

    it("shouldHaveCorrectFieldForOptions", () => {
      const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "options");
      expect(optionsColumn?.field).toBe("options");
    });

    it("shouldHaveCorrectHeaderNameForOptions", () => {
      const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "options");
      expect(optionsColumn?.headerName).toBe("Menu Options");
    });

    it("shouldHaveSortableOptionsField", () => {
      const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "options");
      expect(optionsColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForOptions", () => {
      const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "options");
      expect(optionsColumn?.width).toBe(300);
    });

    it("shouldHaveCorrectAlignmentForOptions", () => {
      const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "options");
      expect(optionsColumn?.align).toBe("left");
    });

    it("shouldRenderTooltipForOptions", () => {
      const optionsColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "options");
      expect(optionsColumn?.renderCell).toBeDefined();
    });
  });

  describe("ActionDataGridColumnDef", () => {
    it("shouldHaveCorrectFieldForRepeat", () => {
      const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "repeat");
      expect(repeatColumn?.field).toBe("repeat");
    });

    it("shouldHaveCorrectHeaderNameForRepeat", () => {
      const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "repeat");
      expect(repeatColumn?.headerName).toBe("Menu Repeat");
    });

    it("shouldHaveSortableRepeatField", () => {
      const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "repeat");
      expect(repeatColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForRepeat", () => {
      const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "repeat");
      expect(repeatColumn?.width).toBe(300);
    });

    it("shouldHaveCorrectAlignmentForRepeat", () => {
      const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "repeat");
      expect(repeatColumn?.align).toBe("left");
    });

    it("shouldRenderTooltipForRepeat", () => {
      const repeatColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "repeat");
      expect(repeatColumn?.renderCell).toBeDefined();
    });

    it("shouldHaveCorrectFieldForUrl", () => {
      const urlColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "url");
      expect(urlColumn?.field).toBe("url");
    });

    it("shouldHaveCorrectHeaderNameForUrl", () => {
      const urlColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "url");
      expect(urlColumn?.headerName).toBe("Redirect URL");
    });

    it("shouldHaveSortableUrlField", () => {
      const urlColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "url");
      expect(urlColumn?.sortable).toBe(true);
    });

    it("shouldHaveCorrectWidthForUrl", () => {
      const urlColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "url");
      expect(urlColumn?.width).toBe(300);
    });

    it("shouldHaveCorrectAlignmentForUrl", () => {
      const urlColumn = ActionDataGridColumnDef.find((column: GridColDef) => column.field === "url");
      expect(urlColumn?.align).toBe("left");
    });
  });
});