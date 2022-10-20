import { CustomInput } from "components";
import OverflowSkillTextField from "../OverflowSkillTextField";
import React from "react";
import {
  setupMockedComponents,
  render,
  getMockedComponentProps,
  initialProfileEntryFormState,
  validProfileEntryFormState,
  invalidProfileEntryFormState
} from "testUtils";
import {
  profileEntryFormState,
  profileEntryFormDispatch
} from "context";

const label = "Overflow skill";

const renderComponent = () =>{
  return render(<OverflowSkillTextField label={label} />);
};

jest.mock("components", () => ({
  __esModule: true,
  CustomInput: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

const mockSetForm = jest.fn();

describe("<OverflowSkillTextField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      CustomInput
    });
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
  });

  describe("testing input and changed to it", () => {
    test("the initial state should be just an empty text field, with the correct label", () => {
      profileEntryFormState.mockReturnValue(initialProfileEntryFormState);
      renderComponent();
      const customInputProps = getMockedComponentProps(CustomInput);
      expect(customInputProps.label).toBe(label);
      expect(customInputProps.name).toBe(label);
      expect(customInputProps.error).toBe(false);
      expect(customInputProps.maxLength).toEqual("80");
    });
    test("On valid input value change, state is updated", () => {
      profileEntryFormState.mockReturnValue(validProfileEntryFormState);
      renderComponent();
      const customInputProps = getMockedComponentProps(CustomInput);
      const skillName = "validskill";
      customInputProps.updateValue(skillName);
      const setFormArgs = {
        "payload": {
          "updated": true,
          "valid": true,
          "value": skillName
        },
        "type": "SET_OVERFLOW_SKILL"
      };
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith(setFormArgs);
      expect(customInputProps.error).toBe(false);
    });
    test("Empty/blank input value is accepted as valid value", () => {
      profileEntryFormState.mockReturnValue(validProfileEntryFormState);
      renderComponent();
      const customInputProps = getMockedComponentProps(CustomInput);
      const skillBlank = "";
      const setFormArgsInvalid = {
        "payload": {
          "updated": true,
          "valid": true,
          "value": skillBlank
        },
        "type": "SET_OVERFLOW_SKILL"
      };
      customInputProps.updateValue(skillBlank);
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith(setFormArgsInvalid);
      expect(customInputProps.error).toBe(false);
    });
    test("On invalid input value error is thrown", () => {
      profileEntryFormState.mockReturnValue(invalidProfileEntryFormState);
      renderComponent();
      const customInputProps = getMockedComponentProps(CustomInput);
      const skillInvalid = "te$t";
      const setFormArgsInvalid = {
        "payload": {
          "updated": true,
          "valid": false,
          "value": skillInvalid
        },
        "type": "SET_OVERFLOW_SKILL"
      };
      customInputProps.updateValue(skillInvalid);
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith(setFormArgsInvalid);
      expect(customInputProps.error).toBe(true);
    });
  });

});