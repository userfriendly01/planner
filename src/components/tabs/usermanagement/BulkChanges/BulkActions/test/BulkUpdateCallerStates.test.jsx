import BulkUpdateCallerStates from "../BulkUpdateCallerStates";
import { CallerStateAttrDropDownOptions } from "../callerStateList";
import {
  getUpdateTemplates
} from "../../BulkTemplates";
import {
  Dropdown
} from "components";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

const optionDropdownOptions = [
  {
    label: "Add Caller State(s)",
    value: "ADD"
  },
  {
    label: "Delete Caller State(s)",
    value: "DELETE"
  },
  {
    label: "Override Caller States",
    value: "OVERRIDE"
  }
];

const mockReplaceTemplates = jest.fn();
const mockUpdateTemplates = jest.fn();
const mockRemoveTemplates = jest.fn();

const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateDefaultSkills />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Dropdown
    });
  });

  const renderComponent = (template, selectedTemplates) => {
    return render(
      <BulkUpdateCallerStates
        template={template || []}
        selectedTemplates={selectedTemplates || []}
        replaceTemplate={mockReplaceTemplates}
        updateTemplate={mockUpdateTemplates}
        removeTemplate={mockRemoveTemplates}
      />
    );
  };
  describe("BulkUpdateCallerStates", () => {
    describe("component is rendered as expected", () => {
      test("render in default state", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls[0][0].options).toStrictEqual(optionDropdownOptions);
        expect(Dropdown.mock.calls[0][0].value.toString()).toBe("");
      });
      test("Options dropdown is updated to 'Add Caller State(s)'", () => {
        renderComponent(updateTemplates.UPDATE_CALLER_STATES, []);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, optionDropdownOptions[0])); // Add Option
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].value).toBe("Add Caller State(s)");
        const onStatesChange = Dropdown.mock.calls[3][0].updateValue;
        act(() => onStatesChange(null, CallerStateAttrDropDownOptions[0])); // First state in the list "AK"
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
      });
      test("Options dropdown is updated to 'Delete Caller State(s)'", () => {
        renderComponent(updateTemplates.UPDATE_CALLER_STATES, []);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, optionDropdownOptions[1])); // Delete option
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].value).toBe("Delete Caller State(s)");
        const onStatesChange = Dropdown.mock.calls[3][0].updateValue;
        act(() => onStatesChange(null, CallerStateAttrDropDownOptions[0])); // First state in the list "AK"
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
      });
      test("Options dropdown is updated to 'Override Caller States'", () => {
        renderComponent(updateTemplates.UPDATE_CALLER_STATES, []);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, optionDropdownOptions[2])); // Override option
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].value).toBe("Override Caller States");
        // expect(Dropdown.mock.calls).toBe(1);
        const onStatesChange = Dropdown.mock.calls[3][0].updateValue;
        act(() => onStatesChange(null, CallerStateAttrDropDownOptions[0])); // First state in the list "AK"
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
      });
      test("Try to get replaceTemplate to fire", () => {
        renderComponent(updateTemplates.UPDATE_CALLER_STATES, [updateTemplates.UPDATE_CALLER_STATES]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, optionDropdownOptions[2])); // Override option
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(Dropdown.mock.calls[1][0].value).toBe("Override Caller States");
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
        const onStatesChange = Dropdown.mock.calls[2][0].updateValue;
        act(() => onStatesChange(null, CallerStateAttrDropDownOptions[0])); // First state in the list "AK"
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
      });
    });
  });
});
