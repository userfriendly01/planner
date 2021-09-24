import BasicFormInfo from "../BasicFormInfo";
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
import {
  extensionMatcher,
  formModes
} from "globals";
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
import {
  getOverflowSkillFromProfile,
  isExtensionValid,
  isProfileIdValid,
  isManagerValid
} from "utils";

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
      <BasicFormInfo
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

  const renderChildComponents = () => {
    const didToolTip = Tooltip.mock.calls[0][0];
    render(didToolTip.children);
    const overFlowToolTip = Tooltip.mock.calls[1][0];
    render(overFlowToolTip.children);
  };

  describe("Manager dropdown", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { OutlinedSelect }, 2);
      const expectedManagerProps = {
        label: "Manager *",
        labelWidth: 67,
        optionsList: managerList,
        value: "",
        helperText: null,
        error: false
      };
      expectOnlyPassedProps(OutlinedSelect, expectedManagerProps, 0);
      const managerOptionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
      const managerOption = managerOptionsDisplayFunc(managerList[0]);
      expect(managerOption).toEqual({
        display: `${managerList[0].manager_first_name} ${managerList[0].manager_last_name}`,
        key: managerList[0].manager_id,
        value: JSON.stringify(managerList[0])
      });
    });
    describe("manager field is invalid", () => {
      test("error field should be true", () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          manager: {
            ...initialFormState.manager,
            blurred: true
          }
        });
        isManagerValid.mockReturnValue(false);
        renderComponent(false);
        expect(OutlinedSelect.mock.calls[0][0].error).toBe(true);
      });
    });
    test("helperText is null - manager is valid", () => {
      isManagerValid.mockReturnValue(true);
      renderComponent(false);
      expect(OutlinedSelect.mock.calls[0][0].helperText).toBe(null);
    });
    test("helperText is populated - manager is not valid and has been updated", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        manager: {
          ...initialFormState.manager,
          updated: true
        }
      });
      isManagerValid.mockReturnValue(false);
      renderComponent(false);
      expect(OutlinedSelect.mock.calls[0][0].helperText).toBe("Please select a manager");
    });
    test("onBlur - invalid manager should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = OutlinedSelect.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "manager"
      });
    });
    test("onBlur - valid manager should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        manager: {
          ...initialFormState.manager,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = OutlinedSelect.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set manager to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = OutlinedSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(managerList[0]));
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_MANAGER,
        payload: JSON.stringify(managerList[0])
      });
    });
  });
  describe("Team dropdown", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { OutlinedSelect }, 2);
      const expectedTeamProps = {
        label: "Team *",
        labelWidth: 44,
        optionsList: profileList,
        value: "",
        helperText: null,
        error: false
      };
      expectOnlyPassedProps(OutlinedSelect, expectedTeamProps, 1);
      const teamOptionsDisplayFunc = OutlinedSelect.mock.calls[1][0].optionsDisplayFunc;
      const teamOption = teamOptionsDisplayFunc(profileList[0]);
      expect(teamOption).toEqual({
        display: profileList[0].profile_nme,
        key: profileList[0].profile_id,
        value: profileList[0].profile_id
      });
    });
    test("error field should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        profileId: {
          ...initialFormState.profileId,
          blurred: true
        }
      });
      isProfileIdValid.mockReturnValue(false);
      renderComponent(false);
      expect(OutlinedSelect.mock.calls[1][0].error).toBe(true);
    });
    test("helperText is null - profileId is valid", () => {
      isProfileIdValid.mockReturnValue(true);
      renderComponent(false);
      expect(OutlinedSelect.mock.calls[1][0].helperText).toBe(null);
    });
    test("helperText is populated - profileId is not valid and has been updated", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        profileId: {
          ...initialFormState.profileId,
          updated: true
        }
      });
      isProfileIdValid.mockReturnValue(false);
      renderComponent(false);
      expect(OutlinedSelect.mock.calls[1][0].helperText).toBe("Please select a team");
    });
    test("onBlur - invalid profileId should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = OutlinedSelect.mock.calls[1][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "profileId"
      });
    });
    test("onBlur - valid profileId should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        profileId: {
          ...initialFormState.profileId,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = OutlinedSelect.mock.calls[1][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set profile_id to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = OutlinedSelect.mock.calls[1][0].updateValue;
        updateValue(profileList[0].profile_id);
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_TEAM,
        payload: {
          profileId: profileList[0].profile_id,
          profiles: profileList
        }
      });
    });
  });
  describe("Outgoing Number", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
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
  describe("nNumber field", () => {
    const fetchedUser = {
      n_number: "n0263786",
      first_name: "Faith",
      last_name: "Cuneo"
    };
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { ModalNNumber }, 1);
      const expectedNNumberProps = {
        disabled: false,
        fetchedUser: null,
        label: "N Number *",
        value: "n"
      };
      expectOnlyPassedProps(ModalNNumber, expectedNNumberProps, 0);
    });
    test("disabled property should be true on update form", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        formMode: formModes.UPDATE
      });
      renderComponent(false);
      expect(ModalNNumber.mock.calls[0][0].disabled).toBe(true);
    });
    test("disabled property should be true on successful fetched user", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        nNumberFetchedUser: fetchedUser
      });
      renderComponent(false);
      expect(ModalNNumber.mock.calls[0][0].disabled).toBe(true);
    });
    test("onBlur - invalid number should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = ModalNNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "nNumber"
      });
    });
    test("onBlur - valid number should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        nNumber: {
          ...initialFormState.nNumber,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = ModalNNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("onClear - should clear nNumber", () => {
      renderComponent(false);
      act(() => {
        const onClear = ModalNNumber.mock.calls[0][0].onClear;
        onClear();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.CLEAR_N_NUMBER
      });
    });
    test("onComplete - should complete nNumber", () => {
      renderComponent(false);
      act(() => {
        const onComplete = ModalNNumber.mock.calls[0][0].onComplete;
        onComplete(fetchedUser, "n0263786");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.COMPLETE_N_NUMBER,
        payload: {
          nNumber: "n0263786",
          fetchedUser: fetchedUser
        }
      });
    });
    test("onUpdate - should set nNumber to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].onUpdate;
        updateValue("n0263786");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_N_NUMBER,
        payload: "n0263786"
      });
    });
  });
  describe("Extension field", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { ModalExtension }, 1);
      const expectedExtensionProps = {
        disabled: false,
        extension: "",
        error: false,
        originalValue: mockWorkers[2].attributes.extension
      };
      expectOnlyPassedProps(ModalExtension, expectedExtensionProps, 0);
    });
    test("original value should be undefined", () => {
      render(
        <BasicFormInfo
          skills={mockSkills}
          worker={null}
          workers={mockWorkers}
          profiles={profileList}
          managers={managerList}
          forwardToToggle={false}
          mockSetForwardToToggle={mockSetForwardToToggle}
        />,
        initialTestState
      );
      expect(ModalExtension.mock.calls[0][0].originalValue).toBe(undefined);
    });
    test("disabled property should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        extension: {
          ...initialFormState.extension,
          valid: true
        }
      });
      extensionMatcher.test.mockReturnValue(true);
      renderComponent(false);
      expect(ModalExtension.mock.calls[0][0].disabled).toBe(true);
    });
    test("error field should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        extension: {
          ...initialFormState.extension,
          blurred: true
        }
      });
      isExtensionValid.mockReturnValue(false);
      renderComponent(false);
      expect(ModalExtension.mock.calls[0][0].error).toBe(true);
    });
    test("onUpdate - should set extension to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = ModalExtension.mock.calls[0][0].onUpdate;
        updateValue("1234", false);
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_EXTENSION,
        payload: {
          extension: "1234",
          isValid: false
        }
      });
    });
    test("onBlur - should reset the field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = ModalExtension.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({ type: userFormActions.CLEAR_EXTENSION });
    });
    test("onClear - should reset the field", () => {
      renderComponent(false);
      act(() => {
        const onClear = ModalExtension.mock.calls[0][0].onClear;
        onClear();
      });
      expect(mockSetForm).toBeCalledWith({ type: userFormActions.CLEAR_EXTENSION });
    });
  });
  describe("Did Fields", () => {
    describe("form.didUser === false", () => {
      beforeEach(() => {
        useFormState.mockReturnValue(initialFormState);
      });
      describe("Initial State", () => {
        test("Should render the correct initial state", () => {
          renderComponent();
          const didToolTip = Tooltip.mock.calls[0][0];
          expect(didToolTip.title).toBe("");
          expect(didToolTip.placement).toBe("bottom-start");
          const rendered = render(didToolTip.children);
          expect(rendered.container).toHaveTextContent("DID User");

          const didSwitch = Switch.mock.calls[0][0];
          expect(didSwitch.checked).toEqual(false);
          expect(didSwitch.disabled).toEqual(false);
          expect(didSwitch.inputProps).toEqual({ "aria-label": "toggle-did-user" });

          expect(ModalPhoneNumber.mock.calls.length).toBe(1);
        });
        test(`DID Tooltip Title should be message when formMode === ${formModes.UPDATE}`, () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.UPDATE
          });
          renderComponent();
          expect(Tooltip.mock.calls[0][0].title).toBe("Twilio DID can not be removed");
        });
      });
      describe("DID User Switch", () => {
        describe("form is in edit mode or form is in add mode opened fresh (no users have been added yet)", () => {
          test("When onChange is called, setForm is called", () => {
            renderComponent();
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onChange = Switch.mock.calls[0][0].onChange;
              onChange();
            });
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.INITIATE_DID_FIELDS });
          });
        });
        describe("still on add form after at least one user has been added", () => {
          beforeEach(() => useFormState.mockReturnValue({
            ...initialFormState,
            userPreviouslyAdded: true
          }));
          test("When onChange is called, setForm is called", () => {
            renderComponent();
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onChange = Switch.mock.calls[0][0].onChange;
              onChange();
            });
            expect(mockSetForm).toHaveBeenCalledTimes(2);
            expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.INITIATE_DID_FIELDS });
            expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.CLEAR_OUTGOING_NUMBER });
          });
        });
      });
    });
    describe("form.didUser === true", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          didUser: true
        });
      });
      describe("Initial State", () => {
        test("Should render the correct initial state", () => {
          renderComponent();
          const didToolTip = Tooltip.mock.calls[0][0];
          expect(didToolTip.title).toBe("");
          expect(didToolTip.placement).toBe("bottom-start");
          const renderedDidToolTip = render(didToolTip.children);
          expect(renderedDidToolTip.container).toHaveTextContent("DID User");

          const didSwitch = Switch.mock.calls[0][0];
          expect(didSwitch.checked).toEqual(true);
          expect(didSwitch.disabled).toEqual(false);
          expect(didSwitch.inputProps).toEqual({ "aria-label": "toggle-did-user" });

          const overFlowToolTip = Tooltip.mock.calls[1][0];
          expect(overFlowToolTip.title).toBe("");
          expect(overFlowToolTip.placement).toBe("bottom-start");
          const renderedOverflowTT = render(overFlowToolTip.children);
          expect(renderedOverflowTT.container).toHaveTextContent("Overflow Skill");

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
        test("Overflow Tooltip Title should be message when overflowSkill is not undefined", () => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          renderComponent();
          expect(Tooltip.mock.calls[1][0].title).toBe("No overflow skill exists for this team");
        });
      });
      describe("Overflow Skill Switch", () => {
        test("Should be disabled with overFlowSkills are undefined", () => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          renderComponent();
          renderChildComponents();

          act(() => {
            const onChange = Switch.mock.calls[1][0].onChange;
            onChange();
          });

          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: userFormActions.INITIATE_ZERO_OUT_FIELDS
          });
        });
        test("When onChange is called, setForm is called", () => {
          renderComponent();
          renderChildComponents();

          act(() => {
            const onChange = Switch.mock.calls[1][0].onChange;
            onChange();
          });

          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: userFormActions.INITIATE_ZERO_OUT_FIELDS
          });
        });
      });
      describe("Internal Routing Number", () => {
        test("onBlur - should set blur on field", () => {
          renderComponent();
          renderChildComponents();
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
          renderChildComponents();
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
          renderChildComponents();
          expect(ModalPhoneNumber.mock.calls[2][0].disabled).toBe(true);
        });
        test("onBlur - should set blur on field", () => {
          renderComponent();
          renderChildComponents();
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
          renderChildComponents();
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
});