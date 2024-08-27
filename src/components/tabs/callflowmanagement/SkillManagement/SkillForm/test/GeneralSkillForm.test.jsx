import React from "react";
import { GeneralSkillForm }from "../GeneralSkillForm";
import {
  initialSkillState,
  initialTestState,
  mockSkillFormState,
  render,
  setupMockedComponents
} from "testUtils";
import { Switch } from "@mui/material";
import { Dropdown } from "components/Dropdown";
import { CustomInput } from "components/CustomInput";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import { skillActions } from "context/reducers/skillReducer";
import { isTaskQueueError } from "utils/skillsUtils";
import { formModes } from "globals/index";

jest.mock("@mui/material", () => ({
  Switch: jest.fn(),
  Button: jest.fn(),
  Tabs: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useSkillState: jest.fn(),
  useSkillDispatch: jest.fn()
}));

jest.mock("utils/skillsUtils", () => ({
  isTaskQueueError: jest.fn(),
  getTargetExpression: jest.requireActual("utils/skillsUtils").getTargetExpression
}));


const mockSkillDispatch = jest.fn();
const levels = [];
for(let i = 1; i < 100; i++ ){ levels.push({
  label: i.toString(),
  value: i
}); }
const ouOptions = initialSkillState.operatingUnits.map(ou => ({
  value: ou.ou_sid,
  label: ou.ou_name
}));
const profileOptions = initialTestState.profileContext.profiles.map(p => ({
  value: p.profile_id,
  label: p.profile_name
}));
const taskQueuePrefix = [
  {
    label: "Show All",
    value: "show-all"
  },
  {
    label: "Add TaskQueue",
    value: "add-taskqueue"
  },
  {
    label: "divider",
    value: "divider"
  }
];
const taskQueueOptions = initialSkillState.taskQueues.map(queue => ({
  label: queue.friendly_name,
  value: queue.sid,
  ...queue
}));

const renderComponent = () => {
  return render(<GeneralSkillForm />);
};

describe("<GeneralSkillForm/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useSkillState.mockReturnValue(initialSkillState);
    useSkillDispatch.mockReturnValue(mockSkillDispatch);
    isTaskQueueError.mockReturnValue(false);
    setupMockedComponents({
      Dropdown,
      CustomInput,
      Switch
    });
  });
  describe("formMode === INSERT", () => {
    describe("initial render", () => {
      test("should render expected components", () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Task Queue Details");
        expect(CustomInput).toHaveBeenCalledTimes(2);
        expect(Dropdown).toHaveBeenCalledTimes(4);
        expect(Switch).toHaveBeenCalledTimes(2);
        expect(CustomInput.mock.calls[1][0].label).toBe("Skill *");
        expect(CustomInput.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].label).toBe("Profiles *");
        expect(Dropdown.mock.calls[2][0].options).toStrictEqual(profileOptions);
        expect(Dropdown.mock.calls[2][0].value).toStrictEqual([]);
        expect(Dropdown.mock.calls[3][0].label).toBe("Task Queue *");
        expect(Dropdown.mock.calls[3][0].options).toStrictEqual([ ...taskQueuePrefix, ...taskQueueOptions ]);
        expect(Dropdown.mock.calls[3][0].value).toBe(null);
        expect(Switch.mock.calls[1][0].checked).toBe(false);
      });
    });
    describe("new task queue is selected", () => {
      describe("initial state", () => {
        test("skillDispatch is called", async () => {
          renderComponent();
          const updateTaskQueue = Dropdown.mock.calls[3][0].updateValue;
          updateTaskQueue(null, { value: "add-taskqueue" });
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.CLEAR_FORM_FIELD,
            payload: "taskQueue"
          });
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "taskQueue",
              value: {
                ...initialSkillState.skillForm.taskQueues,
                isNew: true
              }
            }
          });
        });
        test("components render as expected", async () => {
          useSkillState.mockReturnValue({
            ...initialSkillState,
            skillForm: {
              ...initialSkillState.skillForm,
              taskQueue: {
                ...initialSkillState.skillForm.taskQueue,
                isNew: true
              }
            }
          });
          renderComponent();
          expect(Dropdown).toHaveBeenCalledTimes(6);
          expect(CustomInput).toHaveBeenCalledTimes(4);
          expect(CustomInput.mock.calls[3][0].label).toBe("New Task Queue Friendly Name *");
          expect(CustomInput.mock.calls[3][0].value).toStrictEqual(null);
          expect(Dropdown.mock.calls[5][0].label).toBe("Operating Unit *");
          expect(Dropdown.mock.calls[5][0].options).toStrictEqual(ouOptions);
          expect(Dropdown.mock.calls[5][0].value).toBe(null);
        });
        describe("new task queue name is updated", () => {
          test("setFormDispatch is called", () => {
            useSkillState.mockReturnValue({
              ...initialSkillState,
              skillForm: {
                ...initialSkillState.skillForm,
                taskQueue: {
                  ...initialSkillState.skillForm.taskQueue,
                  isNew: true
                }
              }
            });
            renderComponent();
            const value = "I'm a new Queue!";
            expect(Dropdown).toHaveBeenCalledTimes(6);
            expect(CustomInput).toHaveBeenCalledTimes(4);
            expect(CustomInput.mock.calls[3][0].label).toBe("New Task Queue Friendly Name *");
            const updateTqName = CustomInput.mock.calls[3][0].updateValue;
            updateTqName(value);
            expect(mockSkillDispatch).not.toHaveBeenCalled();
            expect(CustomInput).toHaveBeenCalledTimes(6);
            const onBlur = CustomInput.mock.calls[5][0].onBlur;
            onBlur();
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "taskQueue",
                value: {
                  ...initialSkillState.skillForm.taskQueue,
                  isNew: true,
                  friendly_name: value
                }
              }
            });
          });
        });
        describe("operating unit is updated", () => {
          test("setFormDispatch is called", () => {
            useSkillState.mockReturnValue({
              ...initialSkillState,
              skillForm: {
                ...initialSkillState.skillForm,
                taskQueue: {
                  ...initialSkillState.skillForm.taskQueue,
                  isNew: true
                }
              }
            });
            renderComponent();
            const value = "OU32145";
            expect(Dropdown).toHaveBeenCalledTimes(6);
            expect(CustomInput).toHaveBeenCalledTimes(4);
            expect(Dropdown.mock.calls[5][0].label).toBe("Operating Unit *");
            const updateOU = Dropdown.mock.calls[5][0].updateValue;
            updateOU(null, { value: value });
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: skillActions.SET_FORM_FIELD,
              payload: {
                key: "taskQueue",
                value: {
                  ...initialSkillState.skillForm.taskQueue,
                  isNew: true,
                  operating_unit_sid: value
                }
              }
            });
          });
        });
      });
    });
    describe("task queues are filtered by taskqueue name", () => {
      test("only matching task queues are rendered", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(2);
        const value = "psu";
        const updateSkillName = CustomInput.mock.calls[1][0].updateValue;
        updateSkillName(value);
        expect(CustomInput).toHaveBeenCalledTimes(3);
        const onBlur = CustomInput.mock.calls[2][0].onBlur;
        onBlur();
        expect(mockSkillDispatch).toHaveBeenCalledTimes(2);
        expect(CustomInput).toHaveBeenCalledTimes(4);
        expect(Dropdown).toHaveBeenCalledTimes(8);
        expect(Dropdown.mock.calls[7][0].options).toStrictEqual([...taskQueuePrefix, taskQueueOptions[1], taskQueueOptions[2]]);
      });
      describe("show all is selected on filtered list", () => {
        test("task queue dropdowns return to unfiltered list", () => {
          renderComponent();
          expect(CustomInput).toHaveBeenCalledTimes(2);
          const value = "psu";
          const updateSkillName = CustomInput.mock.calls[1][0].updateValue;
          updateSkillName(value);
          expect(CustomInput).toHaveBeenCalledTimes(3);
          const onBlur = CustomInput.mock.calls[2][0].onBlur;
          onBlur();
          expect(mockSkillDispatch).toHaveBeenCalledTimes(2);
          expect(CustomInput).toHaveBeenCalledTimes(4);
          expect(Dropdown).toHaveBeenCalledTimes(8);
          expect(Dropdown.mock.calls[7][0].options).toStrictEqual([...taskQueuePrefix, taskQueueOptions[1], taskQueueOptions[2]]);
          const showAll = Dropdown.mock.calls[7][0].updateValue;
          showAll(null, { value: "show-all" });
          expect(Dropdown).toHaveBeenCalledTimes(10);
          expect(Dropdown.mock.calls[9][0].options).toStrictEqual([...taskQueuePrefix, ...taskQueueOptions]);
        });
      });
    });
    describe("task queue dropdown is updated", () => {
      test("setFormDispatch is called", () => {
        renderComponent();
        const updateProfile = Dropdown.mock.calls[3][0].updateValue;
        updateProfile(null, taskQueueOptions[3]);
        expect(mockSkillDispatch).toHaveBeenCalledWith({
          type: skillActions.SET_FORM_FIELD,
          payload: {
            key: "taskQueue",
            value: {
              ...taskQueueOptions[3],
              isNew: false
            }
          }
        });
      });
      describe("value === divider", () => {
        test("setFormDispatch is not called", () => {
          renderComponent();
          const updateProfile = Dropdown.mock.calls[3][0].updateValue;
          updateProfile(null, { value: "divider" });
          expect(mockSkillDispatch).toHaveBeenCalledTimes(0);
        });
      });
    });
    describe("task queue dropdown is cleared", () => {
      test("setFormDispatch is called", () => {
        renderComponent();
        const updateProfile = Dropdown.mock.calls[3][0].updateValue;
        updateProfile(null, null);
        expect(mockSkillDispatch).toHaveBeenCalledWith({
          type: skillActions.CLEAR_FORM_FIELD,
          payload: "taskQueue"
        });
      });
    });
    describe("profile dropdown is updated", () => {
      test("setFormDispatch is called", () => {
        renderComponent();
        const updateProfile = Dropdown.mock.calls[2][0].updateValue;
        updateProfile(null, [{ value: 1 }, { value: 2 }]);
        expect(mockSkillDispatch).toHaveBeenCalledWith({
          type: skillActions.SET_FORM_FIELD,
          payload: {
            key: "profileIds",
            value: [1,2]
          }
        });
      });
    });
    describe("skill name is already taken", () => {
      test("helper text is displayed", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(2);
        const value = "lscOBDialer1";
        const updateSkillName = CustomInput.mock.calls[1][0].updateValue;
        updateSkillName(value);
        expect(CustomInput).toHaveBeenCalledTimes(3);
        expect(CustomInput.mock.calls[2][0].helperText).toBe("This skill name already exists");
      });
    });
    describe("isTaskQueueError === true", () => {
      test("error message is displayed", () => {
        isTaskQueueError.mockReturnValue(true);
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("The selected Task Queues target expression does not match the skill entered");
      });
    });
    describe("levels are toggled on", () => {
      describe("initial render", () => {
        test("should render expected components", () => {
          renderComponent();
          expect(Switch).toHaveBeenCalledTimes(2);
          const toggleSwitch = Switch.mock.calls[1][0].onChange;
          toggleSwitch();
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "levels",
              value: {
                min: null,
                max: null
              }
            }
          });
          expect(Dropdown.mock.calls[6][0].label).toBe("Min Level *");
          expect(Dropdown.mock.calls[6][0].options).toStrictEqual(levels);
          expect(Dropdown.mock.calls[6][0].value).toBe(null);
          expect(Dropdown.mock.calls[7][0].label).toBe("Max Level *");
          expect(Dropdown.mock.calls[7][0].options).toStrictEqual(levels);
          expect(Dropdown.mock.calls[7][0].value).toBe(null);
        });
      });
      describe("min level is updated", () => {
        test("setFormDispatch is called", () => {
          renderComponent();
          expect(Switch).toHaveBeenCalledTimes(2);
          const toggleSwitch = Switch.mock.calls[1][0].onChange;
          toggleSwitch();
          expect(Dropdown.mock.calls[6][0].label).toBe("Min Level *");
          const updateValue = Dropdown.mock.calls[6][0].updateValue;
          updateValue(null, 1);
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "levels",
              value: {
                ...initialSkillState.skillForm.levels,
                min: 1
              }
            }
          });
        });
      });
      describe("max level is updated", () => {
        test("setFormDispatch is called", () => {
          renderComponent();
          expect(Switch).toHaveBeenCalledTimes(2);
          const toggleSwitch = Switch.mock.calls[1][0].onChange;
          toggleSwitch();
          expect(Dropdown.mock.calls[7][0].label).toBe("Max Level *");
          const updateValue = Dropdown.mock.calls[7][0].updateValue;
          updateValue(null, 1);
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.SET_FORM_FIELD,
            payload: {
              key: "levels",
              value: {
                ...initialSkillState.skillForm.levels,
                max: 1
              }
            }
          });
        });
      });
    });
  });
  describe("formMode === UPDATE", () => {
    beforeEach(() => {
      useSkillState.mockReturnValue({
        ...initialSkillState,
        skillForm: {
          ...mockSkillFormState,
          formMode: formModes.UPDATE,
          taskQueue: {
            ...mockSkillFormState.taskQueue,
            isNew: false
          }
        }
      });
    });
    describe("initial render", () => {
      test("should render expected components", () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Task Queue Details");
        expect(CustomInput).toHaveBeenCalledTimes(2);
        expect(Dropdown).toHaveBeenCalledTimes(8);
        expect(Switch).toHaveBeenCalledTimes(2);
        expect(CustomInput.mock.calls[1][0].label).toBe("Skill *");
        expect(CustomInput.mock.calls[1][0].value).toBe("testskill");
        expect(Dropdown.mock.calls[4][0].label).toBe("Profiles *");
        expect(Dropdown.mock.calls[4][0].options).toStrictEqual(profileOptions);
        expect(Dropdown.mock.calls[4][0].value).toStrictEqual([{
          label: "Game of Phones",
          value: 0
        }]);
        expect(Dropdown.mock.calls[5][0].label).toBe("Task Queue *");
        expect(Dropdown.mock.calls[5][0].options).toStrictEqual([ ...taskQueuePrefix, ...taskQueueOptions ]);
        expect(Dropdown.mock.calls[5][0].value).toBe(null);
        expect(Switch.mock.calls[1][0].checked).toBe(true);
      });
    });
  });
});