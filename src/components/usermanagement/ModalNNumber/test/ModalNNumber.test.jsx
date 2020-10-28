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

const mockOnClear = jest.fn();
const mockOnComplete = jest.fn();
const mockOnBlur = jest.fn();

const renderComponent = (disabled, label) => {
  return render(<ModalNNumber
    disabled={disabled}
    label={label}
    onBlur={mockOnBlur}
    onClear={mockOnClear}
    onComplete={mockOnComplete}
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
    const label = "Test N Number";
    test("the initial state should be just an empty text field, with the correct label, and no helper text", () => {
      renderComponent(disabled, label);
      const props = getMockedComponentProps(CustomInput);
      expect(props.disabled).toBe(disabled);
      expect(props.label).toBe(label);
      expect(props.maxLength).toEqual("8");
      expect(props.name).toBe("N Number");
      expect(props.value).toBe("n");
      expect(ModalHelperText.mock.calls.length).toBe(0);
    });
    test("the validator sent in should enforce a strict nNumber rule", () => {
      renderComponent(disabled, label);
      const props = getMockedComponentProps(CustomInput);
      const validator = props.validator;
      expect(validator("")).toBe(false);
      expect(validator("13245678")).toBe(false);
      expect(validator("n122345")).toBe(false);
      expect(validator("e1234567")).toBe(false);
      expect(validator("n1234567")).toBe(true);
      expect(validator("N1234567")).toBe(true);
    });
    describe("When onBlur is initiated, should behave as expected", () => {
      test("when the onBlur function is called and lookupResults are null, setError is called", async () => {
        renderComponent(disabled, label);
        const props = getMockedComponentProps(CustomInput);
        const onBlur = props.onBlur;
        expect(CustomInput.mock.calls[0][0].error).toBe(false);
        await act(() => onBlur());
        expect(CustomInput.mock.calls[1][0].error).toBe("Incomplete Entry");
        expect(mockOnBlur).toBeCalledTimes(1);
      });
      test.only("lookup Results are not null", async () => {
        renderComponent(disabled, label);
        fetchUser.mockRejectedValue({ aww: "fail" });
        const props = getMockedComponentProps(CustomInput);
        const onBlur = props.onBlur;
        expect(CustomInput.mock.calls[0][0].error).toBe(false);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall("n0263786"));
        expect(fetchUser).toHaveBeenCalledWith("n0263786");
        await act(() => onBlur());
        expect(CustomInput.mock.calls[1][0].error).toBe(null);
        expect(mockOnBlur).toBeCalledTimes(1);
      });
      test("custom onBlur is null and lookup Results are null, no action should be taken on handleBlur", async () => {
        render(<ModalNNumber
          disabled={disabled}
          label={label}
          onClear={mockOnClear}
          onComplete={mockOnComplete}
        />);
        const res = {
          firstName: "Faith",
          lastName: "Cuneo"
        };
        fetchUser.mockResolvedValue(res);
        const props = getMockedComponentProps(CustomInput);
        const onBlur = props.onBlur;
        expect(CustomInput.mock.calls[0][0].error).toBe(false);
        const validatedServiceCall = props.validatedServiceCall;
        await act(() => validatedServiceCall("n0263786"));
        expect(fetchUser).toHaveBeenCalledWith("n0263786");
        await act(() => onBlur());
        expect(CustomInput.mock.calls[1][0].error).toBe(null);
      });
    });
    test("when the updateValue function is called, updateValue prop is called", async () => {
      renderComponent(disabled, label);
      const updateValue = CustomInput.mock.calls[0][0].updateValue;
      await act(() => updateValue("n0099887"));
      expect(CustomInput.mock.calls[1][0].value).toBe("n0099887");
    });
    describe("fetchUser returns a successful response", () => {
      const nNumber = "n0269913";
      const disabled = false;
      test("Error should be false, and lookup results should be as expected", async () => {
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
        expect(mockOnClear).toHaveBeenCalledTimes(1);
        expectMockedComponent(rendered, { ModalHelperText }, 0);
      });
    });
  });
});
