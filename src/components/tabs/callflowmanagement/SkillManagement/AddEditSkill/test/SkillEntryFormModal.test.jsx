import React from "react";
import SkillEntryFormModal from "../SkillEntryFormModal";
import {
  useAdminState,
  skillFormState,
  skillFormDispatch,
  initialSkillFormState,
  skillFormActions,
  useAdminDispatch
} from "context";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState,
  waitFor
} from "testUtils";
import {
  StyledButton,
  Dropdown,
  CustomInput,
  ModalOverlay,
  PhoneNumberInput
} from "components";
import {
  FormControlLabel,
  Paper
} from "@mui/material";
import {
  createSkill
} from "services";
import { getSkills } from "authentication/startups/cct-triton-admin-startup";


jest.mock("services", () => ({
  createSkill: jest.fn()
}));

jest.mock("authentication/startups/cct-triton-admin-startup", () => ({
  getSkills: jest.fn()
}));

jest.mock("@mui/material", () => ({
  FormControlLabel: jest.fn(),
  Switch: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn(),
  skillFormDispatch: jest.fn(),
  skillFormState: jest.fn(),
  initialSkillFormState: jest.requireActual("context").initialSkillFormState,
  skillFormActions: jest.requireActual("context").skillFormActions
}));

jest.mock("components", () => ({
  StyledButton: jest.fn(),
  Dropdown: jest.fn(),
  CustomInput: jest.fn(),
  ModalOverlay: jest.fn(),
  PhoneNumberInput: jest.fn()
}));

jest.useFakeTimers();

const taskQueues = [{
  friendlyName: "task queue 1",
  sid: "TQ123"
}, {
  friendlyName: "cool beans",
  sid: "TQ555"
}];

const applications = [{
  applicationName: "app 1",
  applicationId: "999"
}, {
  applicationName: "cool app2",
  applicationId: "000"
}];

const timeOfDays = [{
  timeOfDayId: 3,
  openTime: "8:00",
  closeTime: "22:00"
}];

const completeFormNoVh = {
  skillFriendlyName: "test",
  skillNum: "test",
  applicationId: 3,
  taskQueueSid: "tqasdf",
  profileIds: [5],
  enableVirtualHold: false,
  vhCallTarget: {
    value: "",
    valid: false,
    e164: "",
    blurred: false
  },
  vhThreshold: "",
  timeOfDay: {
    skill: {
      sunday: 4,
      monday: 5,
      tuesday: 5,
      wednesday: 5,
      thursday: 5,
      friday: 5,
      saturday: 4
    },
    vh: {
      sunday: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null
    }
  }
};

const completeFormWithVh = {
  skillFriendlyName: "test",
  skillNum: "test",
  applicationId: 3,
  taskQueueSid: "tqasdf",
  profileIds: [5],
  enableVirtualHold: true,
  vhCallTarget: {
    value: "5555554321",
    valid: true,
    e164: "+15555554321",
    blurred: false
  },
  vhThreshold: "45",
  timeOfDay: {
    skill: {
      sunday: 4,
      monday: 5,
      tuesday: 5,
      wednesday: 5,
      thursday: 5,
      friday: 5,
      saturday: 4
    },
    vh: {
      sunday: 3,
      monday: 3,
      tuesday: 3,
      wednesday: 3,
      thursday: 3,
      friday: 3,
      saturday: 3
    }
  }
};

const mockCloseModal = jest.fn();
const mockSkillFormDispatch = jest.fn();
const mockAdminDispatch = jest.fn();
const mockSetSaveResult = jest.fn();

const renderComponent = () => {
  return render(<SkillEntryFormModal
    closeModal={mockCloseModal}
    taskQueues={taskQueues}
    applications={applications}
    timeOfDays={timeOfDays}
    saveResult={{}}
    setSaveResult={mockSetSaveResult}
    isAdmin={true}
  />);
};

describe("<SkillEntryFormModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    skillFormState.mockReturnValue(initialSkillFormState);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    skillFormDispatch.mockReturnValue(mockSkillFormDispatch);
    setupMockedComponents({
      StyledButton,
      Dropdown,
      CustomInput,
      ModalOverlay,
      PhoneNumberInput
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(CustomInput.mock.calls.length).toBe(2);
      expect(Dropdown.mock.calls.length).toBe(10);
      expect(Dropdown.mock.calls[0][0].options).toEqual([{
        label: "test1",
        value: 1
      }, {
        label: "test2",
        value: 2
      }, {
        label: "test3",
        value: 3
      }, {
        label: "test4",
        value: 396
      }, {
        label: "test5",
        value: 12
      }]);
      expect(Dropdown.mock.calls[1][0].options).toEqual([{
        label: "task queue 1",
        value: "TQ123"
      }, {
        label: "cool beans",
        value: "TQ555"
      }]);
      expect(Dropdown.mock.calls[2][0].options).toEqual([{
        label: "app 1",
        value: "999"
      }, {
        label: "cool app2",
        value: "000"
      }]);
      expect(Dropdown.mock.calls[3][0].options).toEqual([{
        label: "8:00 - 22:00",
        value: 3
      }]);
      expect(FormControlLabel.mock.calls.length).toBe(1);
      expect(PhoneNumberInput.mock.calls.length).toBe(0);
      expect(StyledButton.mock.calls.length).toBe(2);
      expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
    });
  });
  describe("virtual hold toggle", () => {
    test("toggle on should update enablevirtualhold in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const vhToggle = FormControlLabel.mock.calls[0][0].control.props.onChange;
      act(() => {
        vhToggle({}, true);
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_ENABLE_VIRTUAL_HOLD",
        payload: true
      });
    });
    test("toggle off should update enablevirtualhold to false and reset vh values in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const vhToggle = FormControlLabel.mock.calls[0][0].control.props.onChange;
      act(() => {
        vhToggle({}, false);
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_ENABLE_VIRTUAL_HOLD",
        payload: false
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_VH_CALL_TARGET",
        payload: initialSkillFormState.vhCallTarget
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_VH_THRESHOLD",
        payload: initialSkillFormState.vhThreshold
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_VH_TIME_OF_DAYS",
        payload: initialSkillFormState.timeOfDay.vh
      });
    });
    test("should render additional virtual hold inputs", () => {
      const enabledVH = {
        ...initialSkillFormState,
        enableVirtualHold: true
      };
      skillFormState.mockReturnValueOnce(enabledVH);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(CustomInput.mock.calls.length).toBe(3);
      expect(Dropdown.mock.calls.length).toBe(17);
      expect(PhoneNumberInput.mock.calls.length).toBe(1);
    });
  });
  describe("dropdowns are updated", () => {
    test("profile dropdown option updates profile in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const profileDropdown = Dropdown.mock.calls[0][0];
      expect(profileDropdown.multiple).toBe(true);
      act(() => {
        profileDropdown.updateValue({}, [{ value: 1 }]);
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_PROFILE_IDS",
        payload: [1]
      });
    });
    test("task queue dropdown option updates task queue sid in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const taskQDropdown = Dropdown.mock.calls[1][0];
      act(() => {
        taskQDropdown.updateValue({}, { value: "TQ555" });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TASK_QUEUE",
        payload: "TQ555"
      });
    });
    test("application dropdown option updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const applicationDropdown = Dropdown.mock.calls[2][0];
      act(() => {
        applicationDropdown.updateValue({}, { value: 1 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_APPLICATION_ID",
        payload: 1
      });
    });
    test("sunday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const sundayDropdown = Dropdown.mock.calls[3][0];
      act(() => {
        sundayDropdown.updateValue({}, { value: 1 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          sunday: 1
        }
      });
    });
    test("saturday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const saturdayDropdown = Dropdown.mock.calls[4][0];
      act(() => {
        saturdayDropdown.updateValue({}, { value: 12 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          saturday: 12
        }
      });
    });
    test("monday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const mondayDropdown = Dropdown.mock.calls[5][0];
      act(() => {
        mondayDropdown.updateValue({}, { value: 2 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          monday: 2
        }
      });
    });
    test("tuesday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const tuesdayDropdown = Dropdown.mock.calls[6][0];
      act(() => {
        tuesdayDropdown.updateValue({}, { value: 7 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          tuesday: 7
        }
      });
    });
    test("wednesday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const wednesdayDropdown = Dropdown.mock.calls[7][0];
      act(() => {
        wednesdayDropdown.updateValue({}, { value: 37 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          wednesday: 37
        }
      });
    });
    test("thursday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const thursdayDropdown = Dropdown.mock.calls[8][0];
      act(() => {
        thursdayDropdown.updateValue({}, { value: 8 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          thursday: 8
        }
      });
    });
    test("friday skill time of day dropdown options updates applicationId in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const fridayDropdown = Dropdown.mock.calls[9][0];
      act(() => {
        fridayDropdown.updateValue({}, { value: 9 });
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_TIME_OF_DAYS",
        payload: {
          ...initialSkillFormState.timeOfDay.skill,
          friday: 9
        }
      });
    });
    describe("vh dropdowns", () => {
      beforeEach(() => {
        const enabledVH = {
          ...initialSkillFormState,
          enableVirtualHold: true
        };
        skillFormState.mockReturnValueOnce(enabledVH);
      });
      test("sunday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const sundayVhDropdown = Dropdown.mock.calls[10][0];
        act(() => {
          sundayVhDropdown.updateValue({}, { value: 1 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            sunday: 1
          }
        });
      });
      test("saturday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const saturdayVhDropdown = Dropdown.mock.calls[11][0];
        act(() => {
          saturdayVhDropdown.updateValue({}, { value: 12 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            saturday: 12
          }
        });
      });
      test("monday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const mondayVhDropdown = Dropdown.mock.calls[12][0];
        act(() => {
          mondayVhDropdown.updateValue({}, { value: 2 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            monday: 2
          }
        });
      });
      test("tuesday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const tuesdayVhDropdown = Dropdown.mock.calls[13][0];
        act(() => {
          tuesdayVhDropdown.updateValue({}, { value: 7 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            tuesday: 7
          }
        });
      });
      test("wednesday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const wednesdayVhDropdown = Dropdown.mock.calls[14][0];
        act(() => {
          wednesdayVhDropdown.updateValue({}, { value: 37 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            wednesday: 37
          }
        });
      });
      test("thursday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const thursdayVhVhDropdown = Dropdown.mock.calls[15][0];
        act(() => {
          thursdayVhVhDropdown.updateValue({}, { value: 8 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            thursday: 8
          }
        });
      });
      test("friday vh time of day dropdown options updates applicationId in skillformstate", () => {
        renderComponent();
        render(Paper.mock.calls[0][0].children);
        const fridayVhDropdown = Dropdown.mock.calls[16][0];
        act(() => {
          fridayVhDropdown.updateValue({}, { value: 9 });
        });
        expect(mockSkillFormDispatch).toBeCalledWith({
          type: "SET_VH_TIME_OF_DAYS",
          payload: {
            ...initialSkillFormState.timeOfDay.vh,
            friday: 9
          }
        });
      });
    });
  });
  describe("inputs are updated", () => {
    test("skill friendly name updates skillFriendlyName in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const skillNameInput = CustomInput.mock.calls[0][0];
      act(() => {
        skillNameInput.updateValue("new skill");
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_SKILL_FRIENDLY_NAME",
        payload: "new skill"
      });
    });
    test("skill num updates skillNum in skillformstate", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const skillNumInput = CustomInput.mock.calls[1][0];
      act(() => {
        skillNumInput.updateValue("skill123  ");
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_SKILL_NUM",
        payload: "skill123"
      });
    });
    test("Virtual Hold Threshold updates vhThreshold in skillformstate", () => {
      const enabledVH = {
        ...initialSkillFormState,
        enableVirtualHold: true
      };
      skillFormState.mockReturnValueOnce(enabledVH);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const callTargetInput = PhoneNumberInput.mock.calls[0][0];
      act(() => {
        callTargetInput.updateValue("5555551234", "5555551234", true, "+15555551234");
      });
      expect(mockSkillFormDispatch).toHaveBeenCalledWith({
        type: "SET_VH_CALL_TARGET",
        payload: {
          value: "5555551234",
          valid: true,
          e164: "+15555551234",
          blurred: false
        }
      });
    });
    test("Virtual Hold Threshold updates vhThreshold in skillformstate", () => {
      const enabledVH = {
        ...initialSkillFormState,
        enableVirtualHold: true
      };
      skillFormState.mockReturnValueOnce(enabledVH);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      const skillNumInput = CustomInput.mock.calls[2][0];
      act(() => {
        skillNumInput.updateValue(" 40 ");
      });
      expect(mockSkillFormDispatch).toBeCalledWith({
        type: "SET_VH_THRESHOLD",
        payload: "40"
      });
    });
  });
  describe("buttons", () => {
    test("when cancel button is clicked, calls close modal and clears form", () => {
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
      const clickCancel = StyledButton.mock.calls[0][0].onClick;
      expect(mockSkillFormDispatch).not.toHaveBeenCalledWith({
        type: skillFormActions.RESET_FORM
      });
      act(() => {
        clickCancel();
      });
      expect(mockSkillFormDispatch).toHaveBeenCalledWith({
        type: skillFormActions.RESET_FORM
      });
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
    test("add/update skill button is NOT disabled when required fields are valid/complete (no VH)", () => {

      skillFormState.mockReturnValueOnce(completeFormNoVh);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(false);
    });
    test("add/update skill button is disabled when some required fields are empty", () => {
      skillFormState.mockReturnValueOnce(completeFormWithVh);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(false);
    });
    test("add/update skill button is disabled when some required fields are empty", () => {
      const incompleteForm = {
        ...completeFormWithVh,
        timeOfDay: {
          ...completeFormWithVh.timeOfDay,
          vh: {
            sunday: null,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null
          }
        }
      };
      skillFormState.mockReturnValueOnce(incompleteForm);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(true);
    });
  });
  describe("create skill is called", () => {
    test("user is not admin, does not call createSkill", () => {
      skillFormState.mockReturnValueOnce(completeFormNoVh);
      render(<SkillEntryFormModal
        closeModal={mockCloseModal}
        taskQueues={taskQueues}
        applications={applications}
        timeOfDays={timeOfDays}
        saveResult={{}}
        setSaveResult={mockSetSaveResult}
        isAdmin={false}
      />);
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(false);
      act(() => {
        addSkillButton.onClick();
      });
      expect(createSkill).toHaveBeenCalledTimes(0);
    });
    test("add skill gets calls, but not all fields have valid values", () => {
      const incompleteForm = {
        ...completeFormWithVh,
        vhThreshold: "",
        taskQueueSid: ""
      };
      skillFormState.mockReturnValueOnce(incompleteForm);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      act(() => {
        addSkillButton.onClick();
      });
      expect(createSkill).toHaveBeenCalledTimes(0);
    });
    test("call succeeds, form resets, getSkills is called, and modal displays success overlay, then closes", async () => {
      const testStateWithUpperNNumberForUser = {
        ...initialTestState
      };
      testStateWithUpperNNumberForUser.userContext.nNumber = "n1234567";
      useAdminState.mockReturnValue(initialTestState);
      createSkill.mockResolvedValueOnce({
        status: 200
      });
      skillFormState.mockReturnValueOnce(completeFormNoVh);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(false);
      act(() => {
        addSkillButton.onClick();
      });
      expect(createSkill).toHaveBeenCalledTimes(1);
      expect(createSkill).toHaveBeenCalledWith({
        skillFriendlyName: "test",
        skillNum: "test",
        profileIds: [5],
        applicationId: 3,
        taskQueueSid: "tqasdf",
        vhCallTarget: null,
        vhThreshold: null,
        updatedBy: "n1234567",
        timeOfDayIds: [
          {
            dayId: 1,
            timeOfDayId: 4,
            vhTimeOfDayId: null
          },
          {
            dayId: 2,
            timeOfDayId: 5,
            vhTimeOfDayId: null
          },
          {
            dayId: 3,
            timeOfDayId: 5,
            vhTimeOfDayId: null
          },
          {
            dayId: 4,
            timeOfDayId: 5,
            vhTimeOfDayId: null
          },
          {
            dayId: 5,
            timeOfDayId: 5,
            vhTimeOfDayId: null
          },
          {
            dayId: 6,
            timeOfDayId: 5,
            vhTimeOfDayId: null
          },
          {
            dayId: 7,
            timeOfDayId: 4,
            vhTimeOfDayId: null
          }
        ]
      });
      await waitFor(() => {
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "Request Successfully Processed",
          status: "success"
        });
        expect(getSkills).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
        expect(mockSkillFormDispatch).toHaveBeenLastCalledWith({
          type: "RESET_FORM"
        });
      });
    });
    test("call partially fails/succeeds with a 206, form resets, getSkills is called, displays message, stays open", async () => {
      createSkill.mockResolvedValueOnce({
        status: 206,
        data: {
          result: {
            message: "Partial Success: skill created in callflow but failed to add to contactmanager"
          }
        }
      });
      skillFormState.mockReturnValueOnce(completeFormNoVh);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(false);
      act(() => {
        addSkillButton.onClick();
      });
      expect(createSkill).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "Partial Success: skill created in callflow but failed to add to contactmanager",
          status: "partial fail"
        });
        expect(getSkills).toHaveBeenCalledTimes(1);
        expect(mockCloseModal).toHaveBeenCalledTimes(0);
        expect(mockSkillFormDispatch).toHaveBeenLastCalledWith({
          type: "RESET_FORM"
        });
      });
    });
    test("call fails, shows error message", async () => {
      createSkill.mockRejectedValueOnce({ message: "boo" });
      skillFormState.mockReturnValueOnce(completeFormNoVh);
      renderComponent();
      render(Paper.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(2);
      const addSkillButton = StyledButton.mock.calls[1][0];
      expect(addSkillButton.disabled).toBe(false);
      act(() => {
        addSkillButton.onClick();
      });
      expect(createSkill).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "Request Failed: boo",
          status: "fail"
        });
        expect(getSkills).toHaveBeenCalledTimes(0);
        expect(mockCloseModal).toHaveBeenCalledTimes(0);

      });
    });
  });
});