import DidFormInfo from "../DidFormInfo";
import {
  Switch,
  Tooltip
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  ForwardToEntryForm,
  ModalExtension,
  ModalNNumber,
  PhoneNumberInput
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import {
  formModes,
  theme
} from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  initialFormState,
  mockWorkers,
  render,
  setupMockedComponents
} from "testUtils";
import { ThemeProvider } from "styled-components";
import { getOverflowSkillFromProfile } from "utils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  ModalExtension: jest.fn(),
  ModalNNumber: jest.fn(),
  PhoneNumberInput: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn(),
  ForwardToEntryForm: jest.fn()
}));


jest.mock("@mui/material", () => ({
  __esModule: true,
  Tabs: jest.fn(),
  Divider: jest.fn(),
  Switch: jest.fn(),
  Tooltip: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  Edit: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

jest.mock("utils", () => ({
  __esModule: true,
  isExtensionValid: jest.fn(),
  isManagerValid: jest.fn(),
  isProfileIdValid: jest.fn(),
  sortProfilesByName: jest.requireActual("utils").sortProfilesByName,
  sortManagersByName: jest.fn("utils").sortManagersByName,
  getOverflowSkillFromProfile: jest.fn(),
  calabrioTimeZones: jest.requireActual("utils").calabrioTimeZones,
  getValidSkillsObject: jest.fn(),
  formatE164PhoneNumber: jest.fn(),
  getZeroOutEnabledFromProfile: jest.fn()
}));

jest.mock("globals", () => ({
  __esModule: true,
  extensionMatcher: {
    test: jest.fn()
  },
  formModes: jest.requireActual("globals").formModes,
  theme: jest.requireActual("globals").theme
}));

const mockSetForm = jest.fn();

const mockSetForwardToToggle = jest.fn();

describe("<DidFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    useFormState.mockReturnValue({
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        didUser: true
      }
    });
    setupMockedComponents({
      ModalExtension,
      ModalNNumber,
      PhoneNumberInput,
      ForwardToEntryForm,
      Edit,
      Switch,
      Tooltip
    });
  });

  const renderComponent = forwardToToggle => {
    return render(
      <ThemeProvider theme={theme}>
        <DidFormInfo
          worker={mockWorkers[2]}
          forwardToToggle={forwardToToggle}
          setForwardToToggle={mockSetForwardToToggle}
        />
      </ThemeProvider>
    );
  };
  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(PhoneNumberInput.mock.calls.length).toBe(2);

      const expectedInternalRoutingNumberProps = {
        disabled: false,
        allowSevenDigitVdn: false,
        id: "direct-dial-number",
        number: "",
        label: "Direct Dial Number *",
        showError: initialFormState.triton.directDialNum.blurred
      };
      expectOnlyPassedProps(PhoneNumberInput, expectedInternalRoutingNumberProps, 0);

      const expectedAlternateOutgoingProps = {
        disabled: false,
        allowSevenDigitVdn: false,
        id: "skype-teams-did",
        number: "",
        label: "Skype/Teams DID *",
        showError: initialFormState.triton.alternateDid.blurred
      };
      expectOnlyPassedProps(PhoneNumberInput, expectedAlternateOutgoingProps, 1);
    });
  });
  describe("Direct Dial Number", () => {
    test("onBlur - should set blur on field", () => {
      renderComponent();
      act(() => {
        const onBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(1);
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: {
          field: "directDialNum",
          system: "triton"
        }
      });
    });
    test("onBlur - when number is valid, blur should not be set", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          directDialNum: {
            valid: true
          }
        }
      });
      renderComponent();
      act(() => {
        const onBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });

    describe("updateValue", () => {
      test("should set directDialNum number and outgoing to correct value when outgoing is unset", () => {
        renderComponent();
        act(() => {
          const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
          updateValue("(603) 851-8200", null, true, "+16038518200");
        });
        expect(mockSetForm).toBeCalledTimes(2);
        expect(mockSetForm.mock.calls[0][0]).toEqual({
          type: userFormActions.UPDATE_PHONE_NUMBER,
          payload: {
            field: "directDialNum",
            maskedValue: "(603) 851-8200",
            isValid: true,
            e164Number: "+16038518200"
          }
        });
        expect(mockSetForm.mock.calls[1][0]).toEqual({
          type: userFormActions.UPDATE_PHONE_NUMBER,
          payload: {
            field: "outgoing",
            maskedValue: "(603) 851-8200",
            isValid: true,
            e164Number: "+16038518200"
          }
        });
      });

      test("should set directDialNum number and not outgoing to correct value when outgoing is set", () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          triton: {
            ...initialFormState.triton,
            outgoing: {
              blurred: true,
              e164: "+16038518201",
              updated: true,
              valid: true,
              value: "(603) 851-8201"
            },
            didUser: true
          }
        });

        renderComponent();
        act(() => {
          const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
          updateValue("(603) 851-8200", null, true, "+16038518200");
        });
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm.mock.calls[0][0]).toEqual({
          type: userFormActions.UPDATE_PHONE_NUMBER,
          payload: {
            field: "directDialNum",
            maskedValue: "(603) 851-8200",
            isValid: true,
            e164Number: "+16038518200"
          }
        });
      });

      test("should not set outgoing number if input is invalid", () => {
        renderComponent();
        act(() => {
          const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
          updateValue("(603) 851-82", null, false, "+160385182");
        });
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm.mock.calls[0][0]).toEqual({
          type: userFormActions.UPDATE_PHONE_NUMBER,
          payload: {
            field: "directDialNum",
            maskedValue: "(603) 851-82",
            isValid: false,
            e164Number: "+160385182"
          }
        });
      });
    });

    describe(`directDialNum updated && form.formMode === ${formModes.UPDATE}`, () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE,
          triton: {
            ...initialFormState.triton,
            directDialNum: {
              ...initialFormState.triton.directDialNum,
              updated: true
            }
          }
        });
      });
      test("ForwardToEntryForm is rendered with the correct props", () => {
        const rendered = renderComponent(true);
        expectMockedComponent(rendered, { ForwardToEntryForm }, 1);
        const expectedForwardToEntryProps = {
          label: "Please choose a forward to option for the existing direct dial number"
        };
        expectOnlyPassedProps(ForwardToEntryForm, expectedForwardToEntryProps, 0);
      });
      test("updateForwardTo - should update inactiveForwardTo", () => {
        renderComponent(true);
        act(() => {
          const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
          updateForwardTo("WK123456");
        });
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
          payload: "WK123456"
        });
      });
    });
  });
  describe("Alternate DID", () => {
    test("disabled property should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        formMode: formModes.UPDATE,
        triton: {
          ...initialFormState.triton,
          didUser: true
        }
      });
      renderComponent();
      expect(PhoneNumberInput.mock.calls[1][0].disabled).toBe(true);
    });
    test("onBlur - should set blur on field", () => {
      renderComponent();
      act(() => {
        const onBlur = PhoneNumberInput.mock.calls[1][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(1);
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: {
          field: "alternateDid",
          system: "triton"
        }
      });
    });
    test("updateValue - should set internal routing number to correct value", () => {
      renderComponent();
      act(() => {
        const updateValue = PhoneNumberInput.mock.calls[1][0].updateValue;
        updateValue("(603) 851-8200", null, true, "+16038518200");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload: {
          field: "alternateDid",
          maskedValue: "(603) 851-8200",
          isValid: true,
          e164Number: "+16038518200"
        }
      });
    });
  });
});