import ExtensionInput from "../ExtensionInput";
import {
  CustomInput,
  ModalHelperText,
  UserFormButton
} from "components";
import {
  useFormState,
  useFormDispatch
} from "context";
import React from "react";
import {
  getMockedComponentProps,
  initialFormState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  CustomInput: jest.fn(),
  ModalHelperText: jest.fn(),
  StyledButton: jest.fn(),
  UserFormButton: jest.fn()
}));

jest.mock("context", () => ({
  useFormDispatch: jest.fn(),
  useFormState: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

const mockOnBlur = jest.fn();
const mockSetForm = jest.fn();

const renderComponent = (disabled, extension, isError, message) => {
  return render(<ExtensionInput
    disabled={disabled}
    extension={extension}
    message={message}
    isError={isError}
    onBlur={mockOnBlur}
  />);
};

describe("<Extension Input />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CustomInput,
      ModalHelperText,
      UserFormButton
    });
    jest.clearAllMocks();
    useFormState.mockReturnValue(initialFormState);
    useFormDispatch.mockReturnValue(mockSetForm);
  });
  describe("testing the CustomInput props", () => {
    test("the initial state should be just an empty text field, with the correct label, and no helper text", () => {
      const disabled = false;
      const extension = "";
      renderComponent(disabled, extension);

      // CustomInput
      const customInputProps = getMockedComponentProps(CustomInput);
      expect(customInputProps.disabled).toBe(disabled);
      expect(customInputProps.label).toBe("Extension");
      expect(customInputProps.maxLength).toEqual("5");
      expect(customInputProps.name).toBe("Extension");
      const ext = "1111";
      customInputProps.updateValue(ext);
      //Faith update later
      customInputProps.onBlur();
      expect(mockOnBlur).toHaveBeenCalledWith();
      expect(customInputProps.value).toBe(extension);

      // ModalHelperText
      expect(ModalHelperText.mock.calls.length).toBe(0);
    });
    test("the validator should enforce a strict 4 or 5 digit extension rule", () => {
      renderComponent(false, "");
      const props = getMockedComponentProps(CustomInput);
      const validator = props.validator;
      expect(validator("")).toBe(false);
      expect(validator("1")).toBe(false);
      expect(validator("ab45")).toBe(false);
      expect(validator("12")).toBe(false);
      expect(validator("3y745")).toEqual(false);
      expect(validator("34745")).toEqual(true);
      expect(validator("93y745")).toEqual(false);
      expect(validator("1234")).toEqual(true);
      expect(validator("91234")).toEqual(true);
    });
    describe("ModalExtensionHelper", () => {
      test("should show message when one is provided", () => {
        const message = "Some info message";
        renderComponent(false, "2222", false, message);
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(false);
        expect(props.message).toBe(message);
        props.clearFunction();
      });
      test("should show error message when one is provided", () => {
        const message = "Some error message";
        renderComponent(false, "2222", true, message);
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(true);
        expect(props.message).toBe(message);
      });
      test("onUpdate is called with extension changes", () => {
        const disabled = false;
        const extension = "";
        const isError = false;
        const message = "normal message";
        renderComponent(disabled, extension, isError, message);

        const customInputProps = getMockedComponentProps(CustomInput);
        const ext = "91111";
        customInputProps.updateValue(ext);
      });
    });
  });
});
