import { CustomInput } from "components";
import ProfileNameTextField from "../ProfileNameTextField";
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

const label = "Profile Name";

const renderComponent = () =>{
  return render(<ProfileNameTextField label={label} />);
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

describe("<ProfileNameTextField />", () => {
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
      const profileName = "New Profile";
      customInputProps.updateValue(profileName);
      const setFormArgs = {
        "payload": {
          "updated": true,
          "valid": true,
          "value": profileName
        },
        "type": "SET_PROFILE_NAME"
      };
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith(setFormArgs);
      expect(customInputProps.error).toBe(false);
    });
    test("On invalid input value change, error is triggered", () => {
      profileEntryFormState.mockReturnValue(invalidProfileEntryFormState);
      renderComponent();
      const customInputProps = getMockedComponentProps(CustomInput);
      const profileNameInvalid = "";
      const setFormArgsInvalid = {
        "payload": {
          "updated": true,
          "valid": false,
          "value": profileNameInvalid
        },
        "type": "SET_PROFILE_NAME"
      };
      customInputProps.updateValue(profileNameInvalid);
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith(setFormArgsInvalid);
      expect(customInputProps.error).toBe(true);
    });
  });

});