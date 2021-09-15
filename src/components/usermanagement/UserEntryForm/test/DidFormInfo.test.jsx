import DidFormInfo from "../DidFormInfo";
import {
  Switch,
  Tooltip
} from "@material-ui/core";
import { ModalPhoneNumber } from "components";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import { formModes } from "globals";
import { getOverflowSkillFromProfile } from "utils";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  ModalPhoneNumber: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("utils", () => ({
  __esModule: true,
  getOverflowSkillFromProfile: jest.fn()
}));

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  Switch: jest.fn(),
  Tooltip: jest.fn(),
  Tabs: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

const mockSetForm = jest.fn();

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
  manager: {
    manager_first_name: "Rebecca",
    manager_last_name: "Miller",
    manager_n_number: "n0001123"
  },
  nNumber: "n1234567",
  profileId: profileList[0].profile_id
};
const mockWorker = {
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
};
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

describe("<DidFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    setupMockedComponents({
      ModalPhoneNumber,
      Switch,
      Tooltip
    });
  });

  const renderComponent = () => {
    return render(
      <DidFormInfo
        worker={mockWorker}
        profiles={profileList}
      />
    );
  };

  const renderChildComponents = () => {
    const didToolTip = Tooltip.mock.calls[0][0];
    render(didToolTip.children);
    const overFlowToolTip = Tooltip.mock.calls[1][0];
    render(overFlowToolTip.children);
  };

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

        expect(ModalPhoneNumber.mock.calls.length).toBe(0);
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
      test("When onChange is called, setForm is called", () => {
        renderComponent();
        render(Tooltip.mock.calls[0][0].children);

        act(() => {
          const onChange = Switch.mock.calls[0][0].onChange;
          onChange();
        });

        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.INITIATE_DID_FIELDS
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

        expect(ModalPhoneNumber.mock.calls.length).toBe(2);

        const expectedInternalRoutingNumberProps = {
          disabled: false,
          allowSevenDigitVdn: false,
          id: "internal-routing-number",
          number: "",
          label: "Internal Routing Number *",
          showError: initialFormState.outgoing.blurred
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedInternalRoutingNumberProps, 0);

        const expectedAlternateOutgoingProps = {
          disabled: false,
          allowSevenDigitVdn: false,
          id: "skype-teams-did",
          number: "",
          label: "Skype/Teams DID *",
          showError: initialFormState.alternateDid.blurred
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedAlternateOutgoingProps, 1);
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
          const onBlur = ModalPhoneNumber.mock.calls[0][0].onBlur;
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
          const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
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
        expect(ModalPhoneNumber.mock.calls[1][0].disabled).toBe(true);
      });
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
          payload: "alternateDid"
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