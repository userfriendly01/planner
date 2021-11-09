import DidFormInfoUpdate from "../DidFormInfoUpdate";
import {
  InputAdornment,
  Switch,
  Tooltip
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import {
  ForwardToEntryForm,
  ModalExtension,
  ModalNNumber,
  ModalPhoneNumber,
  OutlinedSelect
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  initialFormState,
  initialTestState,
  managerList,
  mockSkills,
  mockStore,
  mockWorkers,
  profileList,
  render,
  setupMockedComponents
} from "testUtils";
import { getOverflowSkillFromProfile } from "utils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  ModalExtension: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  OutlinedSelect: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn(),
  ForwardToEntryForm: jest.fn()
}));


jest.mock("@material-ui/core", () => ({
  __esModule: true,
  InputAdornment: jest.fn(),
  Tabs: jest.fn(),
  Switch: jest.fn(),
  Tooltip: jest.fn()
}));

jest.mock("@material-ui/icons", () => ({
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
  getOverflowSkillFromProfile: jest.fn()
}));

jest.mock("globals", () => ({
  __esModule: true,
  extensionMatcher: {
    test: jest.fn()
  },
  formModes: jest.requireActual("globals").formModes
}));

const mockSetForm = jest.fn();

const mockSetForwardToToggle = jest.fn();

describe("<BasicFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    useFormState.mockReturnValue(initialFormState);
    setupMockedComponents({
      ModalExtension,
      ModalNNumber,
      ModalPhoneNumber,
      OutlinedSelect,
      ForwardToEntryForm,
      InputAdornment,
      Edit,
      Switch,
      Tooltip
    });
  });

  const renderComponent = forwardToToggle => {
    return render(
      <DidFormInfoUpdate
        skills={mockSkills}
        worker={mockWorkers[2]}
        workers={mockWorkers}
        profiles={profileList}
        managers={managerList}
        forwardToToggle={forwardToToggle}
        setForwardToToggle={mockSetForwardToToggle}
      />,
      initialTestState
    );
  };

  describe("Outgoing Number", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 3);
      const expectedOutgoingProps = {
        disabled: false,
        id: "outgoing-number",
        allowSevenDigitVdn: false,
        showError: initialFormState.outgoing.blurred,
        number: "",
        label: "Outgoing Number *",
        icon: null
      };
      expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 0);
    });
    test("disabled property should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        formMode: formModes.UPDATE,
        editDisabled: true
      });
      renderComponent(false);
      expect(ModalPhoneNumber.mock.calls[0][0].disabled).toBe(true);
    });
    test("onBlur - invalid number should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = ModalPhoneNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "outgoing"
      });
    });
    test("onBlur - valid number should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        outgoing: {
          ...initialFormState.outgoing,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = ModalPhoneNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set outgoing to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
        updateValue("(603) 851-8200", null, true, "+16038518200");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload: {
          field: "outgoing",
          maskedValue: "(603) 851-8200",
          isValid: true,
          e164Number: "+16038518200"
        }
      });
    });
    describe(`worker.directDialNum && form.formMode !== ${formModes.INSERT}`, () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE
        });
      });
      test("StyledIcon is rendered with the correct props", () => {
        renderComponent(true);
        render(ModalPhoneNumber.mock.calls[0][0].icon);
        render(InputAdornment.mock.calls[0][0].children);

        const expectedStyledIconProps = {
          fontSize: "large"
        };
        expectOnlyPassedProps(Edit, expectedStyledIconProps, 0);
      });
      test("forwardToToggle === true", () => {
        renderComponent(true);
        render(ModalPhoneNumber.mock.calls[0][0].icon);
        render(InputAdornment.mock.calls[0][0].children);
        act(() => {
          const onClick = Edit.mock.calls[0][0].onClick;
          onClick();
        });
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.EDIT_PEN_CLICK_FORWARD_TO_TOGGLE,
          payload: mockWorkers[2]
        });
        expect(mockSetForwardToToggle).toBeCalledTimes(1);
        expect(mockSetForwardToToggle).toBeCalledWith(false);
      });
      test("forwardToToggle === false", () => {
        renderComponent(false);
        render(ModalPhoneNumber.mock.calls[0][0].icon);
        render(InputAdornment.mock.calls[0][0].children);
        act(() => {
          const onClick = Edit.mock.calls[0][0].onClick;
          onClick();
        });
        expect(mockSetForm).toBeCalledWith({ type: userFormActions.EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE });
        expect(mockSetForwardToToggle).toBeCalledTimes(1);
        expect(mockSetForwardToToggle).toBeCalledWith(true);
      });
    });
    describe(`forwardToToggle === true && form.formMode === ${formModes.UPDATE}`, () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE
        });
      });
      test("ForwardToEntryForm is rendered with the correct props", () => {
        const rendered = renderComponent(true);
        expectMockedComponent(rendered, { ForwardToEntryForm }, 1);
        const expectedForwardToEntryProps = {
          label: "Please choose a forward to option for the existing outgoing number",
          skills: mockSkills,
          workers: mockWorkers
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
  describe("Did Fields", () => {
    beforeEach(() => {
      useFormState.mockReturnValue({
        ...initialFormState,
        didUser: true
      });
    });
    describe("Initial State", () => {
      test("Should render the correct initial state", () => {
        renderComponent();
        expect(ModalPhoneNumber.mock.calls.length).toBe(3);

        const expectedInternalRoutingNumberProps = {
          disabled: false,
          allowSevenDigitVdn: false,
          id: "internal-routing-number",
          number: "",
          label: "Internal Routing Number *",
          showError: initialFormState.outgoing.blurred
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedInternalRoutingNumberProps, 1);

        const expectedAlternateOutgoingProps = {
          disabled: false,
          allowSevenDigitVdn: false,
          id: "skype-teams-did",
          number: "",
          label: "Skype/Teams DID *",
          showError: initialFormState.alternateDid.blurred
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedAlternateOutgoingProps, 2);
      });
    });
    describe("Internal Routing Number", () => {
      test("onBlur - should set blur on field", () => {
        renderComponent();
        act(() => {
          const onBlur = ModalPhoneNumber.mock.calls[1][0].onBlur;
          onBlur();
        });
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.SET_BLUR_ON_FIELD,
          payload: "directDialNum"
        });
      });
      test("updateValue - should set internal routing number to correct value", () => {
        renderComponent();
        act(() => {
          const updateValue = ModalPhoneNumber.mock.calls[1][0].updateValue;
          updateValue("(603) 851-8200", null, true, "+16038518200");
        });
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.UPDATE_PHONE_NUMBER,
          payload: {
            field: "directDialNum",
            maskedValue: "(603) 851-8200",
            isValid: true,
            e164Number: "+16038518200"
          }
        });
      });
    });
    describe("Alternate DID", () => {
      test("disabled property should be true", () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE,
          didUser: true
        });
        renderComponent();
        expect(ModalPhoneNumber.mock.calls[2][0].disabled).toBe(true);
      });
      test("onBlur - should set blur on field", () => {
        renderComponent();
        act(() => {
          const onBlur = ModalPhoneNumber.mock.calls[2][0].onBlur;
          onBlur();
        });
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.SET_BLUR_ON_FIELD,
          payload: "alternateDid"
        });
      });
      test("updateValue - should set internal routing number to correct value", () => {
        renderComponent();
        act(() => {
          const updateValue = ModalPhoneNumber.mock.calls[2][0].updateValue;
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
});