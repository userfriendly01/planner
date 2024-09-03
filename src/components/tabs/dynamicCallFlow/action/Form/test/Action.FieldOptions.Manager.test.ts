import { ActionFieldOptionsManager } from "dynamicCallFlowAction/Form/ActionFieldOptionsManager";
import { Action } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import {
  ACTION_ID, CALL_FLOW_NAME
} from "dynamicCallFlowAction/Form/ActionFields";

describe("ActionFieldOptionsManager", () => {
  let manager: ActionFieldOptionsManager;

  beforeEach(() => {
    manager = new ActionFieldOptionsManager();
  });

  it("shouldReturnCorrectRecordPropertyValue", () => {
    const actionRecord: Action = {
      actionId: "1",
      actionType: "MENU",
      callFlowName: "TestFlow"
    };

    const result = manager.getRecordPropertyValue(actionRecord, ACTION_ID);
    expect(result).toBe("1");
  });

  it("shouldReturnCorrectFieldOptionsCacheKey", () => {
    const result = manager.getFieldOptionsCacheKey();
    expect(result).toBe("DYNAMIC_CALL_FLOW_CALL_FLOW_CONFIGURATION_FORM_FIELD_OPTIONS");
  });

  it("shouldReturnCorrectDataDrivenOptionsFieldNames", () => {
    const result = manager.getDataDrivenOptionsFieldNames();
    expect(result).toEqual([CALL_FLOW_NAME]);
  });

  it("shouldReturnEmptyArrayForDataDrivenOptionsFieldNamesWithList", () => {
    const result = manager.getDataDrivenOptionsFieldNamesWithList();
    expect(result).toEqual([]);
  });

  it("shouldReturnEmptyStaticFieldOptions", () => {
    const result = manager.getStaticFieldOptions();
    expect(result).toEqual({});
  });
});