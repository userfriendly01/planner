import ModalExtension from "../ModalExtension";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { checkExtension } from "services";
import {
  getMockedComponentProps,
  render,
  setupMockedComponents
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

const renderComponent = (disabled, form, extension, originalValueReq = true) => {
  return render(<ModalExtension
    clearExtension={mockClearExtension}
    disabled={disabled}
    extension={extension}
    form={form}
    originalValue={"1234"}
    originalValueReq={originalValueReq}
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
      expect(validator("")).toBe(null);
      expect(validator("1")).toBe(null);
      expect(validator("ab45")).toBe(null);
      expect(validator("12")).toBe(null);
      expect(validator("34745")).toEqual(["3474"]);
      expect(validator("1234")).toEqual(["1234"]);
    });
    describe("the validated service call", () => {
      test("should set the form on success with original extension", done => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("1234")
          .then(() => {
            expect(checkExtension).toHaveBeenCalledWith("1234");
            expect(mockSetForm).toHaveBeenCalledWith({
              extensionValid: true,
              extensionUpdated: false
            });
            done();
          });
      });
      test("should set the form on success with non-original valid extension", done => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("5678")
          .then(() => {
            expect(checkExtension).toHaveBeenCalledWith("5678");
            expect(mockSetForm).toHaveBeenCalledWith({
              extensionValid: true,
              extensionUpdated: true
            });
            done();
          });
      });
      test("should set the form on success with no original and valid extension", done => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, form, "", false);
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("5678")
          .then(() => {
            expect(checkExtension).toHaveBeenCalledWith("5678");
            expect(mockSetForm).toHaveBeenCalledWith({
              extensionValid: true,
              extensionUpdated: true
            });
            done();
          });
      });
      test("should say invalid if null is returned", done => {
        checkExtension.mockResolvedValue(null);
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("2222")
          .then(() => {
            expect(checkExtension).toHaveBeenCalledWith("2222");
            expect(mockSetForm).toHaveBeenCalledWith({
              extensionValid: false,
              extensionUpdated: false
            });
            done();
          });
      });
      test("should notify the user of an error on failure", done => {
        checkExtension.mockRejectedValue(false);
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("2222")
          .then(() => {
            expect(checkExtension).toHaveBeenCalledWith("2222");
            expect(mockSetForm).toHaveBeenCalledWith({
              extensionValid: false,
              extensionUpdated: false
            });
            done();
          });
      });
    });
    describe("the modal helper", () => {
      test("should show when extension is valid", () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, {
          extensionValid: true,
          extensionUpdated: true
        }, "2222");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(false);
        expect(props.clearUser).toBe(mockClearExtension);
        expect(props.message).toEqual("Extension is valid");
      });
      test("should show when extension is not valid", () => {
        checkExtension.mockResolvedValue(true);
        renderComponent(false, {
          extensionValid: false,
          extensionUpdated: false
        }, "2222");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(true);
        expect(props.clearUser).toBe(mockClearExtension);
        expect(props.message).toEqual("Extension already in use");
      });
    });
  });
});
