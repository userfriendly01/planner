import ModalNNumber from "../ModalNNumber";
import {
  CustomInput,
  ModalHelperText
} from "components";
import React from "react";
import { fetchUser } from "services";
import {
  act,
  expectMockedComponent,
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

const mockResetParentState = jest.fn();
const mockUpdateValue = jest.fn();
const mockSetIsValid = jest.fn();

const renderComponent = (disabled, nNumber) => {
  return render(<ModalNNumber
    disabled={disabled}
    nNumber={nNumber}
    updateNNumber={mockUpdateValue}
    resetParentState={mockResetParentState}
    setIsValid={mockSetIsValid}
  />);
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
    const disabled = false;
    const nNumber = "";
    test("the initial state should be just an empty text field, with the correct label, and no helper text", () => {
      renderComponent(disabled, nNumber);
      const props = getMockedComponentProps(CustomInput);
      expect(props.disabled).toBe(disabled);
      expect(props.label).toBe("N Number");
      expect(props.maxLength).toEqual("8");
      expect(props.name).toBe("N Number");
      expect(props.updateValue).toBe(mockUpdateValue);
      expect(props.value).toBe(nNumber);
      expect(ModalHelperText.mock.calls.length).toBe(0);
    });
    test("the validator sent in should enforce a strict nNumber rule", () => {
      renderComponent(disabled, nNumber);
      const props = getMockedComponentProps(CustomInput);
      const validator = props.validator;
      expect(validator("")).toBe(false);
      expect(validator("13245678")).toBe(false);
      expect(validator("n122345")).toBe(false);
      expect(validator("e1234567")).toBe(false);
      expect(validator("n1234567")).toBe(true);
      expect(validator("N1234567")).toBe(true);
    });
    test("when the onBlur function is called, setError is called", async () => {
      renderComponent(disabled, nNumber);
      const props = getMockedComponentProps(CustomInput);
      const onBlur = props.onBlur;
      expect(CustomInput.mock.calls[0][0].error).toBe(false);
      await act(() => onBlur());
      expect(CustomInput.mock.calls[1][0].error).toBe(true);
    });
    describe("fetchUser returns a successful response", () => {
      const nNumber = "n0269913";
      const disabled = false;
      test("should call setIsValid, error should be false, and lookup results should be as expected", async () => {
        const res = {
          firstName: "Faith",
          lastName: "Cuneo"
        };
        fetchUser.mockResolvedValue(res);
        renderComponent(disabled, nNumber);
        const props = getMockedComponentProps(CustomInput);

        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(nNumber));
        await waitFor(() => {
          expect(fetchUser).toHaveBeenCalledWith(nNumber);
          expect(mockSetIsValid).toHaveBeenCalledWith(true);
          expect(ModalHelperText.mock.calls[0][0].message).toBe("Faith Cuneo");
          expect(ModalHelperText.mock.calls[0][0].error).toBe(false);
          expect(props.error).toBe(false);
        });
      });
      test("should say user not found if null is returned", async () => {
        fetchUser.mockResolvedValue(null);
        renderComponent(disabled, nNumber);
        const props = getMockedComponentProps(CustomInput);

        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(nNumber));
        await waitFor(() => {
          expect(fetchUser).toHaveBeenCalledWith(nNumber);
          expect(mockSetIsValid).toHaveBeenCalledTimes(0);
          expect(ModalHelperText.mock.calls[0][0].message).toBe("User not found");
          expect(ModalHelperText.mock.calls[0][0].error).toBe(true);
        });
      });
    });
    describe("fetchUser returns a fail response", () => {
      const nNumber = "n0269913";
      const disabled = false;
      test("should notify the user of an error on failure", async () => {
        fetchUser.mockRejectedValue({ message: "MA THE MEATLOAF!" });
        renderComponent(disabled, nNumber);
        const props = getMockedComponentProps(CustomInput);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(nNumber));
        await waitFor(() => {
          expect(fetchUser).toHaveBeenCalledWith(nNumber);
          expect(mockSetIsValid).toHaveBeenCalledTimes(0);
          expect(ModalHelperText.mock.calls[0][0].message).toBe("Error calling lookup service: MA THE MEATLOAF!");
          expect(ModalHelperText.mock.calls[0][0].error).toBe(true);
        });
      });
    });
    describe("the modal helper", () => {
      const nNumber = "n0269913";
      const disabled = false;
      test("when the clear function is clicked, the 4 expected functions are called", async () => {
        const res = {
          firstName: "Faith",
          lastName: "Cuneo"
        };
        fetchUser.mockResolvedValue(res);
        const rendered = renderComponent(disabled, nNumber);

        const props = getMockedComponentProps(CustomInput);
        expectMockedComponent(rendered, { ModalHelperText }, 0);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall(nNumber));
        expectMockedComponent(rendered, { ModalHelperText }, 1);
        const modalClearFunction = ModalHelperText.mock.calls[0][0].clearFunction;
        await act(() => modalClearFunction());
        expect(fetchUser).toHaveBeenCalledWith(nNumber);
        expect(mockResetParentState).toHaveBeenCalledTimes(1);
        expect(mockSetIsValid).toHaveBeenCalledWith(false);
        expectMockedComponent(rendered, { ModalHelperText }, 0);
      });
    });
  });
});
