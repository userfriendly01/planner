import ModalExtension from "../ModalExtension";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { checkExtension } from "services";
import {
  act,
  expectMockedComponent,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  CustomInput: jest.fn(),
  ModalHelperText: jest.fn()
}));

jest.mock("services", () => ({
  __esModule: true,
  checkExtension: jest.fn()
}));

const originalExtension = "1234";

const mockOnBlur = jest.fn();
const mockOnClear = jest.fn();
const mockOnUpdate = jest.fn();

const renderComponent = (disabled, extension, error, originalValue) => {
  return render(<ModalExtension
    disabled={disabled}
    error={error}
    extension={extension}
    onBlur={mockOnBlur}
    onClear={mockOnClear}
    onUpdate={mockOnUpdate}
    originalValue={originalValue}
  />);
};

describe("<ModalExtension />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CustomInput,
      ModalHelperText
    });
    jest.clearAllMocks();
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
      expect(mockOnUpdate).toHaveBeenCalledWith(ext, false);
      customInputProps.onBlur();
      expect(mockOnBlur).toHaveBeenCalledWith();
      expect(customInputProps.value).toBe(extension);

      // ModalHelperText
      expect(ModalHelperText.mock.calls.length).toBe(0);
    });
    test("the validator sent in should enforce a strict Extension rule", () => {
      renderComponent(false, "");
      const props = getMockedComponentProps(CustomInput);
      const validator = props.validator;
      expect(validator("")).toBe(false);
      expect(validator("1")).toBe(false);
      expect(validator("ab45")).toBe(false);
      expect(validator("12")).toBe(false);
      expect(validator("3y745")).toEqual(false);
      expect(validator("34745")).toEqual(true);
      expect(validator("1234")).toEqual(true);
    });
    describe("the validated service call", () => {
      test("should call onUpdate on success with original extension", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, "", false, originalExtension);
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(originalExtension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(originalExtension);
          expect(mockOnUpdate).toHaveBeenCalledWith(originalExtension, true);
        });
      });
      test("should call onUpdate on success with non-original valid extension", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, "", false, originalExtension);
        const extension = "5678";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockOnUpdate).toHaveBeenCalledWith(extension, true);
        });
      });
      test("should set the form on success with no original and valid extension", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, "", false);
        const extension = "5678";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockOnUpdate).toHaveBeenCalledWith(extension, true);
        });
      });
      test("should say invalid if null is returned", async () => {
        checkExtension.mockResolvedValue(null);
        renderComponent(false, "");
        const extension = "2222";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockOnUpdate).toHaveBeenCalledWith(extension, false);
        });
      });
      test("should notify the user of an error on failure", async () => {
        checkExtension.mockRejectedValue(false);
        renderComponent(false, "");
        const extension = "2222";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockOnUpdate).toHaveBeenCalledWith(extension, false);
        });
      });
    });
    describe("the modal helper", () => {
      test("should show when extension is validating", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, "2222");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall("1234"));
        await waitFor(() => {
          // get render BEFORE the last one because it will re-render once more with empty message
          const helperProps = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText) - 1);
          expect(helperProps.error).toBe(false);
          expect(helperProps.message).toEqual("Validating...");
        });
      });
      test("should show extension is valid in initial render if extension is valid 4 digits", () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, "2222");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(false);
        props.clearFunction();
        expect(mockOnClear).toHaveBeenCalledTimes(1);
        expect(props.message).toEqual("Extension is valid");
      });
      test("should not show ModalHelperText in initial render if extension is not valid 4 digits", () => {
        checkExtension.mockResolvedValue(true);
        const rendered = renderComponent(false, "");
        expectMockedComponent(rendered, ModalHelperText, 0);
      });
    });

    describe("error prop is passed", () => {
      const error = true;

      test("should render CustomInput with error flag", () => {
        renderComponent(false, "2222", true);
        expect(getMockedComponentProps(CustomInput).error).toBe(error);
      });
    });

    describe("error prop is not passed", () => {
      const error = undefined;

      test("should render CustomInput with error flag", () => {
        renderComponent(false, "2222", error);
        expect(getMockedComponentProps(CustomInput).error).toBe(error);
      });
    });
  });
});
