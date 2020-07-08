import ModalNNumber from "../ModalNNumber";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { fetchUser } from "services";
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
  fetchUser: jest.fn()
}));

const mockClearUser = jest.fn();
const mockSetForm = jest.fn();
const mockUpdateValue = jest.fn();

const renderComponent = (disabled, form, nNumber) => {
  return render(<ModalNNumber
    clearUser={mockClearUser}
    disabled={disabled}
    form={form}
    nNumber={nNumber}
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
      expect(props.label).toBe("N Number*");
      expect(props.maxLength).toEqual("8");
      expect(props.name).toBe("N Number");
      expect(props.updateValue).toBe(mockUpdateValue);
      expect(props.value).toBe(nNumber);
      expect(ModalHelperText.mock.calls.length).toBe(0);
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
      test("should set the form lookup info on success", done => {
        fetchUser.mockResolvedValue("we good son");
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("who cares")
          .then(() => {
            expect(fetchUser).toHaveBeenCalledWith("who cares");
            expect(mockSetForm).toHaveBeenCalledWith({
              lookupError: null,
              lookupInfo: "we good son"
            });
            done();
          });
      });
      test("should say user not found if null is returned", done => {
        fetchUser.mockResolvedValue(null);
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("who cares")
          .then(() => {
            expect(fetchUser).toHaveBeenCalledWith("who cares");
            expect(mockSetForm).toHaveBeenCalledWith({
              lookupInfo: {},
              lookupError: "User not found"
            });
            done();
          });
      });
      test("should notify the user of an error on failure", done => {
        fetchUser.mockRejectedValue({ message: "MA THE MEATLOAF!" });
        renderComponent(false, form, "");
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        validatedServiceCall("who cares")
          .then(() => {
            expect(fetchUser).toHaveBeenCalledWith("who cares");
            expect(mockSetForm).toHaveBeenCalledWith({
              lookupInfo: {},
              lookupError: "Error calling lookup service: MA THE MEATLOAF!"
            });
            done();
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
        expect(props.clearUser).toBe(mockClearUser);
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
        expect(props.clearUser).toBe(mockClearUser);
        expect(props.message).toEqual("Eleanor Rigby");
      });
    });
  });
});
