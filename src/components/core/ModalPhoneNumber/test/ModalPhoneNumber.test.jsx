import ModalPhoneNumber from "../ModalPhoneNumber";
import MaskedInput from "react-text-mask";
import React from "react";
import {
  getE164Number,
  isNumberValid,
  unMaskPhoneNumber
} from "@lmig/phone-number-utils";
import {
  Switch,
  TextField
} from "@mui/material";
import {
  act,
  getLastInstanceCalled,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";


jest.mock("react-text-mask", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("@mui/material", () => ({
  __esModule: true,
  Switch: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Tabs: jest.fn(),
  Tab: jest.fn(),
  Paper: jest.fn(),
  Checkbox: jest.fn()
}));

jest.mock("@lmig/phone-number-utils", () => ({
  getE164Number: jest.fn(),
  isNumberValid: jest.fn(),
  unMaskPhoneNumber: jest.fn()
}));

const id = "outgoing-id";
const label = "Outgoing Number";
const number = "12345";
const mockHelperText = "I'm helper text!";
const mockOnBlur = jest.fn();
const mockUpdateValue = jest.fn();
const tenDigitMask = ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
const sevenDigitMask = [/[1-9]/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/];

const renderComponent = (
  allowSevenDigitVdn,
  error,
  showError,
  helperText
) => {
  return render(
    <ModalPhoneNumber
      allowSevenDigitVdn={allowSevenDigitVdn}
      error={error}
      helperText={helperText}
      id={id}
      number={number}
      onBlur={mockOnBlur}
      label={label}
      showError={showError}
      updateValue={mockUpdateValue}
    />
  );
};

describe("<ModalPhoneNumber />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isNumberValid.mockReturnValue(false);
    unMaskPhoneNumber.mockReturnValue("unmaskednumber");
    getE164Number.mockReturnValue("e164number");
    setupMockedComponents({
      Switch,
      TextField,
      MaskedInput
    });
  });
  describe("Initial Render", () => {
    describe("10 digit mask", () => {
      test("Should render props with 10 digit mask ", () => {
        renderComponent(false, false, false, mockHelperText);
        expectOnlyPassedProps(TextField, {
          disabled: false,
          error: false,
          helperText: mockHelperText,
          id,
          label: label,
          name: label,
          onBlur: mockOnBlur,
          margin: "normal",
          variant: "outlined",
          value: number
        }, getLastInstanceCalled(TextField));
        const renderInputMask = TextField.mock.calls[0][0].InputProps.inputComponent;
        const InputMask = renderInputMask({ inputRef: jest.fn() });
        render(InputMask);
        expect(MaskedInput.mock.calls[0][0].mask).toStrictEqual(tenDigitMask);
      });
    });
    describe("Should allow for 7 digits", () => {
      test("Should render props with 7 digit mask ", () => {
        renderComponent(true, false, false, mockHelperText);
        expectOnlyPassedProps(TextField, {
          disabled: false,
          error: false,
          helperText: mockHelperText,
          id,
          label: label,
          name: label,
          onBlur: mockOnBlur,
          margin: "normal",
          variant: "outlined",
          value: number
        }, getLastInstanceCalled(TextField));
        const renderInputMask = TextField.mock.calls[0][0].InputProps.inputComponent;
        const InputMask = renderInputMask({ inputRef: jest.fn() });
        render(InputMask);
        expect(Switch.mock.calls[0][0].checked).toBe(false);
        const toggleSwitch = Switch.mock.calls[0][0].onChange;
        act(() => toggleSwitch());
        expect(Switch.mock.calls[1][0].checked).toBe(true);
        const render7DigitInputMask = TextField.mock.calls[1][0].InputProps.inputComponent;
        const newInputMask = render7DigitInputMask({ inputRef: jest.fn() });
        render(newInputMask);
        expect(MaskedInput.mock.calls[1][0].mask).toStrictEqual(sevenDigitMask);
      });
    });
    describe("error === true", () => {
      test("should render Text Field with error === true", () => {
        renderComponent(false, true, false, mockHelperText);
        expectOnlyPassedProps(TextField, {
          disabled: false,
          error: true,
          helperText: mockHelperText,
          id,
          label: label,
          name: label,
          onBlur: mockOnBlur,
          margin: "normal",
          variant: "outlined",
          value: number
        }, getLastInstanceCalled(TextField));
      });
    });
    describe("showError === true", () => {
      describe("validationError === true", () => {
        test("should render Text Field with error === true", () => {
          renderComponent(false, false, true, mockHelperText);
          expectOnlyPassedProps(TextField, {
            disabled: false,
            error: true,
            helperText: mockHelperText,
            id,
            label: label,
            name: label,
            onBlur: mockOnBlur,
            margin: "normal",
            variant: "outlined",
            value: number
          }, getLastInstanceCalled(TextField));
        });
      });
      describe("validationError === false", () => {
        beforeEach(() => {
          isNumberValid.mockReturnValue(true);
        });
        test("should render Text Field with error === false", () => {
          renderComponent(false, false, true, mockHelperText);
          expectOnlyPassedProps(TextField, {
            disabled: false,
            error: false,
            helperText: mockHelperText,
            id,
            label: label,
            name: label,
            onBlur: mockOnBlur,
            margin: "normal",
            variant: "outlined",
            value: number
          }, getLastInstanceCalled(TextField));
        });
      });
    });
    describe("helper text is not passed through", () => {
      describe("showError === true", () => {
        describe("validationError === false", () => {
          beforeEach(() => {
            isNumberValid.mockReturnValue(true);
          });
          test("should render no helper text", () => {
            renderComponent(false, false, true, "");
            expectOnlyPassedProps(TextField, {
              disabled: false,
              error: false,
              helperText: null,
              id,
              label: label,
              name: label,
              onBlur: mockOnBlur,
              margin: "normal",
              variant: "outlined",
              value: number
            }, getLastInstanceCalled(TextField));
          });
        });
        describe("validationError === true", () => {
          describe("mask is 10 digits", () => {
            test("should render no helper text", () => {
              renderComponent(false, false, true, "");
              expectOnlyPassedProps(TextField, {
                disabled: false,
                error: true,
                helperText: "Enter a valid ten digit phone number",
                id,
                label: label,
                name: label,
                onBlur: mockOnBlur,
                margin: "normal",
                variant: "outlined",
                value: number
              }, getLastInstanceCalled(TextField));
            });
          });
          describe("mask is 7 digits", () => {
            test("should render no helper text", () => {
              renderComponent(true, false, true, "");
              expect(Switch.mock.calls[0][0].checked).toBe(false);
              const toggleSwitch = Switch.mock.calls[0][0].onChange;
              act(() => toggleSwitch());
              expectOnlyPassedProps(TextField, {
                disabled: false,
                error: true,
                helperText: "Enter a seven digit VDN",
                id,
                label: label,
                name: label,
                onBlur: mockOnBlur,
                margin: "normal",
                variant: "outlined",
                value: number
              }, getLastInstanceCalled(TextField));
            });
          });
        });
      });
    });
  });
  describe("onBlur is called", () => {
    test("handleOnBlur should be called", () => {
      renderComponent(false, false, false, mockHelperText);
      const onBlur = TextField.mock.calls[0][0].onBlur;
      act(() => onBlur());
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });
  describe("onChange is called", () => {
    renderComponent(false, false, false, mockHelperText);
    const onChange = TextField.mock.calls[0][0].onChange;
    act(() => onChange({
      target: {
        value: "newValue"
      }
    }));
    expect(mockUpdateValue).toHaveBeenCalledTimes(1);
  });
});