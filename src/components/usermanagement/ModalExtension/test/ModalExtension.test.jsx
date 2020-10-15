import ModalExtension from "../ModalExtension";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { checkExtension } from "services";
import {
  act,
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

const mockClearExtension = jest.fn();
const mockSetForm = jest.fn();
const mockUpdateValue = jest.fn();

const renderComponent = (disabled, form, extension, isEditExisting = true, error) => {
  return render(<ModalExtension
    clearExtension={mockClearExtension}
    disabled={disabled}
    error={error}
    extension={extension}
    form={form}
    originalValue={"1234"}
    isEditExisting={isEditExisting}
    setForm={mockSetForm}
    updateValue={mockUpdateValue} />);
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
    const form = {};
    test("the initial state should be just an empty text field, with the correct label, and no helper text", () => {
      const disabled = false;
      const extension = "";
      renderComponent(disabled, form, extension);
      const props = getMockedComponentProps(CustomInput);
      expect(props.disabled).toBe(disabled);
      expect(props.label).toBe("Extension");
      expect(props.maxLength).toEqual("4");
      expect(props.name).toBe("Extension");
      expect(props.updateValue).toBe(mockUpdateValue);
      expect(props.value).toBe(extension);
      expect(ModalHelperText.mock.calls.length).toBe(0);
    });
    test("the validator sent in should enforce a strict Extension rule", () => {
      renderComponent(false, form, "");
      const props = getMockedComponentProps(CustomInput);
      const validator = props.validator;
      expect(validator("")).toBe(false);
      expect(validator("1")).toBe(false);
      expect(validator("ab45")).toBe(false);
      expect(validator("12")).toBe(false);
      expect(validator("34745")).toEqual(false);
      expect(validator("1234")).toEqual(true);
    });
    describe("the validated service call", () => {
      test("should set the form on success with original extension", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, form, "");
        const extension = "1234";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockSetForm).toHaveBeenCalledWith({
            extension,
            extensionValid: true,
            extensionUpdated: false
          });
        });
      });
      test("should set the form on success with non-original valid extension", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, form, "1111");
        const extension = "5678";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockSetForm).toHaveBeenCalledWith({
            extension,
            extensionValid: true,
            extensionUpdated: true
          });
        });
      });
      test("should set the form on success with no original and valid extension", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, form, "", false);
        const extension = "5678";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockSetForm).toHaveBeenCalledWith({
            extension,
            extensionValid: true,
            extensionUpdated: true
          });
        });
      });
      test("should say invalid if null is returned", async () => {
        checkExtension.mockResolvedValue(null);
        renderComponent(false, form, "");
        const extension = "2222";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockSetForm).toHaveBeenCalledWith({
            extension,
            extensionValid: false,
            extensionUpdated: false
          });
        });
      });
      test("should notify the user of an error on failure", async () => {
        checkExtension.mockRejectedValue(false);
        renderComponent(false, form, "");
        const extension = "2222";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(extension));
        await waitFor(() => {
          expect(checkExtension).toHaveBeenCalledWith(extension);
          expect(mockSetForm).toHaveBeenCalledWith({
            extension,
            extensionValid: false,
            extensionUpdated: false
          });
        });
      });
    });
    describe("the modal helper", () => {
      test("should show when extension is validating", async () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, {
          extension: "1111",
          extensionValid: true,
          extensionUpdated: true
        }, "2222");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall("1234"));
        await waitFor(() => {
          // get the render BEFORE the last because this will render once again due to this promise being called
          const helperProps = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText) - 1);
          expect(helperProps.error).toBe(false);
          expect(helperProps.clearFunction).toBe(mockClearExtension);
          expect(helperProps.message).toEqual("Validating...");
        });
      });
      test("should show when extension is valid", () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, {
          extension: "1111",
          extensionValid: true,
          extensionUpdated: true
        }, "2222");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(false);
        expect(props.clearFunction).toBe(mockClearExtension);
        expect(props.message).toEqual("Extension is valid");
      });
      test("should show when extension is not valid", () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, {
          extension: "1111",
          extensionValid: false,
          extensionUpdated: false
        }, "2222");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(true);
        expect(props.clearFunction).toBe(mockClearExtension);
        expect(props.message).toEqual("Extension already in use");
      });
    });

    describe("error prop is passed", () => {
      const error = true;

      test("should render CustomInput with error flag", () => {
        renderComponent(false, {
          extension: "1111",
          extensionValid: false,
          extensionUpdated: false
        }, "2222", true, error);
        expect(getMockedComponentProps(CustomInput).error).toBe(error);
      });
    });

    describe("error prop is not passed", () => {
      const error = undefined;

      test("should render CustomInput with error flag", () => {
        renderComponent(false, {
          extension: "1111",
          extensionValid: false,
          extensionUpdated: false
        }, "2222", true, error);
        expect(getMockedComponentProps(CustomInput).error).toBe(undefined);
      });
    });
  });
});
