import ModalNNumber from "../ModalNNumber";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { fetchUser } from "services";
import {
  act,
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
  fetchUser: jest.fn()
}));

const mockClearFunction = jest.fn();
const mockSetForm = jest.fn();
const mockUpdateValue = jest.fn();

const renderComponent = (disabled, form, nNumber, error, onBlur) => {
  return render(<ModalNNumber
    clearUser={mockClearFunction}
    disabled={disabled}
    error={error}
    form={form}
    nNumber={nNumber}
    onBlur={onBlur}
    setForm={mockSetForm}
    updateValue={mockUpdateValue} />);
};

describe("<ModalNNumber />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CustomInput,
      ModalHelperText
    });
    jest.clearAllMocks();
  });
  describe("testing the CustomInput props", () => {
    const form = {
      lookupInfo: {}
    };
    test("the initial state should be just an empty text field, with the correct label, and no helper text", () => {
      const disabled = false;
      const nNumber = "";
      renderComponent(disabled, form, nNumber);
      const props = getMockedComponentProps(CustomInput);
      expect(props.disabled).toBe(disabled);
      expect(props.label).toBe("N Number");
      expect(props.maxLength).toEqual("8");
      expect(props.name).toBe("N Number");
      expect(props.updateValue).toBe(mockUpdateValue);
      expect(props.value).toBe(nNumber);
      expect(ModalHelperText.mock.calls.length).toBe(0);
    });
    test("error prop = true should pass error to CustomInput component", () => {
      const disabled = false;
      const nNumber = "";
      const error = true;
      renderComponent(disabled, form, nNumber, error);
      const props = getMockedComponentProps(CustomInput);
      expect(props.error).toBe(error);
    });
    test("no error prop passed should not pass error to CustomInput component", () => {
      const disabled = false;
      const nNumber = "";
      const error = undefined;
      renderComponent(disabled, form, nNumber, error);
      const props = getMockedComponentProps(CustomInput);
      expect(props.error).toBe(error);
    });
    test("the validator sent in should enforce a strict nNumber rule", () => {
      renderComponent(false, form, "");
      const props = getMockedComponentProps(CustomInput);
      const validator = props.validator;
      expect(validator("")).toBe(false);
      expect(validator("13245678")).toBe(false);
      expect(validator("n122345")).toBe(false);
      expect(validator("e1234567")).toBe(false);
      expect(validator("n1234567")).toBe(true);
      expect(validator("N1234567")).toBe(true);
    });
    describe("the validated service call", () => {
      test("should set the form lookup info on success", async () => {
        fetchUser.mockResolvedValue("we good son");
        renderComponent(false, form, "");
        const nNumber = "n0269913";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(nNumber));
        await waitFor(() => {
          expect(fetchUser).toHaveBeenCalledWith(nNumber);
          expect(mockSetForm).toHaveBeenCalledWith({
            lookupError: null,
            lookupInfo: "we good son",
            nNumber
          });
        });
      });
      test("should say user not found if null is returned", async () => {
        fetchUser.mockResolvedValue(null);
        renderComponent(false, form, "");
        const nNumber = "n0269913";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(nNumber));
        await waitFor(() => {
          expect(fetchUser).toHaveBeenCalledWith(nNumber);
          expect(mockSetForm).toHaveBeenCalledWith({
            lookupInfo: {},
            lookupError: "User not found",
            nNumber
          });
        });
      });
      test("should notify the user of an error on failure", async () => {
        fetchUser.mockRejectedValue({ message: "MA THE MEATLOAF!" });
        renderComponent(false, form, "");
        const nNumber = "n0269913";
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall("n0269913"));
        await waitFor(() => {
          expect(fetchUser).toHaveBeenCalledWith("n0269913");
          expect(mockSetForm).toHaveBeenCalledWith({
            lookupInfo: {},
            lookupError: "Error calling lookup service: MA THE MEATLOAF!",
            nNumber
          });
        });
      });
    });
    describe("the modal helper", () => {
      test("should show when there is a lookup error", () => {
        fetchUser.mockResolvedValue("we good son");
        renderComponent(false, {
          lookupError: "There is an error"
        }, "");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(true);
        expect(props.clearFunction).toBe(mockClearFunction);
        expect(props.message).toEqual("There is an error");
      });
      test("should show when there is good lookup info", () => {
        fetchUser.mockResolvedValue("we good son");
        renderComponent(false, {
          lookupInfo: {
            firstName: "Eleanor",
            lastName: "Rigby"
          }
        }, "");
        const props = getMockedComponentProps(ModalHelperText);
        expect(props.error).toBe(false);
        expect(props.clearFunction).toBe(mockClearFunction);
        expect(props.message).toEqual("Eleanor Rigby");
      });
    });
  });
});
