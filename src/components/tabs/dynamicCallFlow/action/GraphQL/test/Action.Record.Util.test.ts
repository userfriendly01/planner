import { Action } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "dynamicCallFlowAction/GraphQL/Action.Record.Util";
import { CALL_FLOW_NAME } from "dynamicCallFlowAction/Form/ActionFields";

describe("ActionRecordUtil", () => {
  it("shouldReturnPropertyValueForValidKey", () => {
    const actionRecord = {
      actionId: "1",
      callFlowName: "Test Action"
    } as Action;
    expect(ActionRecordUtil.getPropertyValue(actionRecord, CALL_FLOW_NAME)).toBe("Test Action");
  });

  it("shouldReturnUndefinedForInvalidKey", () => {
    const actionRecord = {
      actionId: "1",
      callFlowName: "Test Action"
    } as Action;
    expect(ActionRecordUtil.getPropertyValue(actionRecord, "invalidKey")).toBeUndefined();
  });

  it("shouldReturnUndefinedIfActionRecordIsNull", () => {
    expect(ActionRecordUtil.getPropertyValue(null, CALL_FLOW_NAME)).toBeUndefined();
  });

  it("shouldReturnUndefinedIfKeyIsNull", () => {
    const actionRecord = {
      actionId: "1",
      callFlowName: "Test Action"
    } as Action;
    expect(ActionRecordUtil.getPropertyValue(actionRecord, null)).toBeUndefined();
  });

  it("shouldSetPropertyValueForValidKey", () => {
    const actionRecord = {
      actionId: "1",
      callFlowName: "Test Action"
    } as Action;
    const updatedRecord = ActionRecordUtil.setPropertyValue(actionRecord, CALL_FLOW_NAME, "Updated Action");
    expect(updatedRecord.callFlowName).toBe("Updated Action");
  });

  it("shouldReturnUndefinedIfSetActionRecordIsNull", () => {
    expect(ActionRecordUtil.setPropertyValue(null, CALL_FLOW_NAME, "Updated Action")).toBeUndefined();
  });

  it("shouldReturnUndefinedIfSetKeyIsNull", () => {
    const actionRecord = {
      actionId: "1",
      callFlowName: "Test Action"
    } as Action;
    expect(ActionRecordUtil.setPropertyValue(actionRecord, null, "Updated Action")).toBeUndefined();
  });

  it("shouldReturnUndefinedIfSetValueIsNull", () => {
    const actionRecord = {
      actionId: "1",
      callFlowName: "Test Action"
    } as Action;
    expect(ActionRecordUtil.setPropertyValue(actionRecord, CALL_FLOW_NAME, null)).toBeUndefined();
  });
});