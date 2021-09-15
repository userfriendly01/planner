import BasicFormInfo from "../BasicFormInfo";
import { InputAdornment } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import {
  ModalExtension,
  ModalNNumber,
  ModalPhoneNumber,
  OutlinedSelect,
  ForwardToEntryForm
} from "components";
import {
  initialState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes,
  extensionMatcher
} from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";
import {
  getExtensionInputValid,
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
  Tabs: jest.fn()
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
  getExtensionInputValid: jest.fn(),
  isManagerValid: jest.fn(),
  isProfileIdValid: jest.fn(),
  sortProfilesByName: jest.requireActual("utils").sortProfilesByName,
  sortManagersByName: jest.fn("utils").sortManagersByName
}));

jest.mock("globals", () => ({
  __esModule: true,
  extensionMatcher: {
    test: jest.fn()
  },
  formModes: jest.requireActual("globals").formModes
}));

const mockSetForm = jest.fn();

const managerList = [
  {
    manager_first_name: "John",
    manager_last_name: "Wick",
    manager_n_number: "n1234567",
    manager_id: "01"
  },
  {
    manager_first_name: "Test",
    manager_last_name: "Manager",
    manager_n_number: "n7454853",
    manager_id: "02"
  }
];
const officeMap = new Map([
  [
    "ABC123",
    {

      office_nme: "Office 1",
      office_num: "ABC123"
    }
  ],
  [
    "0002",
    {

      office_nme: "Office 2",
      office_num: "0002"
    }
  ]
]);
const profileList = [
  {
    profile_nme: "test1",
    profile_id: 1,
    overflow_skill: null
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    overflow_skill: "whateverOverflowSkill"
  },
  {
    profile_nme: "test3",
    profile_id: 3,
    overflow_skill: "anotherOverflowSkill"
  }
];
const validFormOptions = {
  alternateDid: {
    e164: "+18001234567",
    masked: "(800)123-4567",
    tenDig: "8001234567"
  },
  defaultSkills: {
    levels: {
      "a": 1,
      "b": 3
    },
    skills: ["a", "b", "c"]
  },
  did: "6034567890",
  didE164: "+16034567890",
  directDialNum: {
    e164: "+18002345678",
    masked: "(800)234-5678",
    tenDig: "8002345678"
  },
  extension: "1234",
  manager: managerList[0],
  nNumber: "n1234567",
  profileId: profileList[0].profile_id
};
const mockWorkers = [
  {
    attributes: {
      default_skills: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
      full_name: "Test 1",
      office_location_name: "Neptune",
      routing: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
      profile_id: 15
    },
    sid: "WK0",
    skillsDifferent: false
  },
  {
    attributes: {
      full_name: "Test 2",
      office_location_name: "Uranus",
      profile_id: 15
    },
    sid: "WK1",
    skillsDifferent: false
  },
  {
    // DID worker with overflow skill
    sid: "WK2",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 3",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Jupiter",
      profile_id: profileList[1].profile_id,
      routing: {
        skills: [
          profileList[1].overflow_skill,
          "whatever"
        ],
        levels: {
          "whatever": 1
        }
      }
    }
  },
  {
    // DID worker without overflow skill
    sid: "WK3",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 4",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Pluto",
      profile_id: profileList[1].profile_id,
      routing: {
        skills: [
          "payinBills"
        ],
        levels: {
          "payinBills": 1
        }
      }
    }
  }
];
const mockSkills = [
  {
    skill: "aisgl1"
  }
];
const initialFormState = {
  formMode: formModes.INSERT,
  defaultSkills: [],
  defaultSkillsUpdated: false,
  didUser: false,
  extension: {
    value: "",
    blurred: false,
    updated: false,
    valid: false
  },
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: "",
    blurred: false,
    updated: false
  },
  nNumber: {
    value: "n",
    blurred: false,
    updated: false
  },
  nNumberFetchedUser: null,
  outgoing: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  profileId: {
    value: "",
    blurred: false,
    updated: false
  },
  alternateDid: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  directDialNum: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};
const initialTestState = {
  ...initialState,
  officeContext: {
    offices: officeMap
  },
  profileContext: {
    profiles: profileList
  },
  managerContext: {
    managers: managerList
  }
};

const mockSetForwardToToggle = jest.fn();

describe("<BasicFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(initialFormState);
    setupMockedComponents({
      ModalExtension,
      ModalNNumber,
      ModalPhoneNumber,
      OutlinedSelect,
      ForwardToEntryForm,
      InputAdornment,
      Edit
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
      getExtensionInputValid.mockReturnValue(false);
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
});