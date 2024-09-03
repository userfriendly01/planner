import {
  ActionFormFieldConfigs,
  defaultFieldConditionCheck
} from "dynamicCallFlowAction/Form/ActionFieldsConfig";
import { FieldConfig } from "dynamicCallFlowCommon/Form/Form.Interfaces";

describe("Action Fields Config", () => {
  it("shouldNotAllowModificationOfFrozenActionFormFieldConfigs", () => {
    expect(() => {
      ActionFormFieldConfigs["newField"] = {} as FieldConfig;
    }).toThrow();
  });

  it("shouldReturnTrueForDefaultFieldConditionCheck", () => {
    expect(defaultFieldConditionCheck(undefined)).toBe(true);
  });
});