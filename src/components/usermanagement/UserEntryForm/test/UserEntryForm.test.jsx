import UserEntryForm from "../UserEntryForm";
import {
  Tabs,
  Tab
} from "@material-ui/core";
import {
  ModalOverlay,
  SkillsFormInfo,
  BasicFormInfo,
  DidFormInfo,
  UserFormButtons,
  StyledButton
} from "components";
import {
  initialState,
  useAdminState,
  useFormState,
  useFormDispatch
} from "context";
import { formModes } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";

jest.useFakeTimers();

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  Tabs: jest.fn(),
  Tab: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  ModalOverlay: jest.fn(),
  SkillsFormInfo: jest.fn(),
  BasicFormInfo: jest.fn(),
  DidFormInfo: jest.fn(),
  UserFormButtons: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions,
  initialState: jest.requireActual("context").initialState
}));

const mockSetForm = jest.fn();
const mockHandleClose = jest.fn();

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
  defaultSkills: {},
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

describe("<UserEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(initialFormState);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      ModalOverlay,
      SkillsFormInfo,
      BasicFormInfo,
      DidFormInfo,
      UserFormButtons,
      StyledButton,
      Tabs,
      Tab
    });
  });

  const renderComponent = () => {
    return render(
      <UserEntryForm
        workers={mockWorkers}
        worker= {mockWorkers[0]}
        skills= {mockSkills}
        handleClose={mockHandleClose}
      />, initialTestState
    );
  };
  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(Tabs.mock.calls.length).toBe(1);
      expect(Tabs.mock.calls[0][0].value).toBe(0);

      render(Tabs.mock.calls[0][0].children);
      expect(Tab.mock.calls.length).toBe(3);
      expect(Tab.mock.calls[0][0].label).toBe("Basic Info");
      expect(Tab.mock.calls[1][0].label).toBe("DID Info");
      expect(Tab.mock.calls[2][0].label).toBe("Default Skills");

      expect(BasicFormInfo.mock.calls.length).toBe(1);
      expect(DidFormInfo.mock.calls.length).toBe(0);
      expect(SkillsFormInfo.mock.calls.length).toBe(0);
      expect(UserFormButtons.mock.calls.length).toBe(1);
    });
    describe("Modal Overlay", () => {
      test("Modal Overlay should render when loading.saveUser", () => {
        renderComponent();
        act(() => {
          const updateLoading = UserFormButtons.mock.calls[0][0].updateLoading;
          updateLoading({
            lookupUser: false,
            overlayMessage: "Saving User...",
            saveStatus: "loading",
            saveUser: true
          });
        });
        const expectedModalOverlayProps = {
          status: "loading",
          message: "Saving User..."
        };
        expectOnlyPassedProps(ModalOverlay, expectedModalOverlayProps, 0);
      });
      test("loading should be updated when ModalOverlay handleClose is called", () => {
        const rendered = renderComponent();
        act(() => {
          const updateLoading = UserFormButtons.mock.calls[0][0].updateLoading;
          updateLoading({
            lookupUser: false,
            overlayMessage: "Saving User...",
            saveStatus: "loading",
            saveUser: true
          });
        });
        expect(rendered.container).toHaveTextContent("ModalOverlay");
        act(() => {
          const handleClose = ModalOverlay.mock.calls[0][0].handleClose;
          handleClose();
        });
        expectMockedComponent(rendered, ModalOverlay, 0);
        expect(rendered.container).not.toHaveTextContent("ModalOverlay");
      });
    });
    describe("Header", () => {
      test(`Header should read 'Add a User' when form.formMode === ${formModes.INSERT}`, () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Add a User");
      });
      test(`Header should read 'Edit User' & user's name when form.formMode === ${formModes.UPDATE}`, () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE
        });
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Edit User");
        expect(rendered.container).toHaveTextContent("Test 1");
      });
    });
    describe("Tabs", () => {
      test("When Basic Info Tab is clicked, <BasicFormInfo/> should be rendered", () => {
        const rendered = renderComponent();
        render(Tabs.mock.calls[0][0].children);
        act(() => {
          const onChange = Tabs.mock.calls[0][0].onChange;
          onChange(null, 0);
        });
        expect(rendered.container).toHaveTextContent("BasicFormInfo");
        expect(rendered.container).not.toHaveTextContent("DidFormInfo");
        expect(rendered.container).not.toHaveTextContent("SkillsFormInfo");
        expect(rendered.container).toHaveTextContent("UserFormButtons");
      });
      test("When DID Info Tab is clicked, <DidFormInfo/> should be rendered", () => {
        const rendered = renderComponent();
        render(Tabs.mock.calls[0][0].children);
        act(() => {
          const onChange = Tabs.mock.calls[0][0].onChange;
          onChange(null, 1);
        });
        expect(rendered.container).not.toHaveTextContent("BasicFormInfo");
        expect(rendered.container).toHaveTextContent("DidFormInfo");
        expect(rendered.container).not.toHaveTextContent("SkillsFormInfo");
        expect(rendered.container).toHaveTextContent("UserFormButtons");
      });
      test("When Default Skills Tab is clicked, <SkillsFormInfo/> should be rendered", () => {
        const rendered = renderComponent();
        render(Tabs.mock.calls[0][0].children);
        act(() => {
          const onChange = Tabs.mock.calls[0][0].onChange;
          onChange(null, 2);
        });
        expect(rendered.container).not.toHaveTextContent("BasicFormInfo");
        expect(rendered.container).not.toHaveTextContent("DidFormInfo");
        expect(rendered.container).toHaveTextContent("SkillsFormInfo");
        expect(rendered.container).toHaveTextContent("UserFormButtons");
      });
    });
  });
});