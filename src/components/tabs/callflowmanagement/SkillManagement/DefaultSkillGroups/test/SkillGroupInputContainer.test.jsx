import React from "react";
import SkillGroupInputContainer from "../SkillGroupInputContainer";
import {
  UserFormButton
} from "../../ClosedFlashMessage/ClosedFlashMessage.Styles";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import { TextField } from "@mui/material";
import {
  addSkillGroup,
  deleteSkillGroup,
  updateSkillGroup
} from "services";
import {
  initialTestState,
  render,
  setupMockedComponents,
  expectOnlyPassedProps,
  skillsList,
  waitFor,
  act,
  getMockedComponentProps
} from "testUtils";
import { ActionTypes } from "../../Skills.Interfaces";
import { Dropdown } from "components";
import { getSkills } from "authentication";

jest.mock("context", () => ({
  useAdminDispatch: jest.fn(),
  useAdminState: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn()
}));

jest.mock("authentication", () => ({
  getSkills: jest.fn()
}));

jest.mock("../../ClosedFlashMessage/ClosedFlashMessage.Styles", () => ({
  UserFormButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  TextField: jest.fn(),
  Button: jest.fn(),
  Paper: jest.fn(),
  Divider: jest.fn(),
  Tabs: jest.fn(),
  Checkbox: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: jest.fn(),
  GridRenderCellParams: jest.fn(),
  GridToolbar: jest.fn()
}));

jest.mock("services", () => ({
  addSkillGroup: jest.fn(),
  deleteSkillGroup: jest.fn(),
  updateSkillGroup: jest.fn()
}));

jest.useFakeTimers();

const mockSetConfirmationModalOpts = jest.fn();
const mockSetSaveResult = jest.fn();
const mockSetAction = jest.fn();
const mockSetTableState = jest.fn();
const confirmationModalOpts = "hi";

const mockDispatch = jest.fn();

const renderComponent = (tableState, action) => {
  render(<SkillGroupInputContainer
    action={action}
    tableState={tableState}
    setTableState={mockSetTableState}
    confirmationModalOpts={confirmationModalOpts}
    setConfirmationModalOpts={mockSetConfirmationModalOpts}
    setSaveResult={mockSetSaveResult}
    setAction={mockSetAction}
  />);
};

describe("<SkillGroupInputContainer />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      TextField,
      UserFormButton
    });
  });
  describe("action is not ADD, EDIT, or DELETE", () => {
    test("clicking button does nothing", () => {
      renderComponent({ selected: []}, "boo");
      expect(Dropdown.mock.calls.length).toBe(0);
      expect(TextField.mock.calls.length).toBe(1);
      expect(UserFormButton.mock.calls.length).toBe(1);
      const onClick = UserFormButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(addSkillGroup).toHaveBeenCalledTimes(0);
      expect(deleteSkillGroup).toHaveBeenCalledTimes(0);
      expect(updateSkillGroup).toHaveBeenCalledTimes(0);
    });
  });
  describe("action is ADD", () => {
    describe("initial render", () => {
      describe("selected length === 0", () => {
        const tableState = {
          selected: []
        };
        test("should render as expected with skillGroupName an empty string, button disabled", () => {
          renderComponent(tableState, ActionTypes.ADD);
          expectOnlyPassedProps(TextField, {
            value: ""
          });
          expectOnlyPassedProps(UserFormButton, {
            disabled: true
          });
        });
      });
      describe("selected length === 1", () => {
        const tableState = {
          selected: [skillsList[0]]
        };
        test("should render as expected with skillGroupName an empty string, button disabled", () => {
          renderComponent(tableState, ActionTypes.ADD);
          expectOnlyPassedProps(TextField, {
            value: ""
          });
          expectOnlyPassedProps(UserFormButton, {
            disabled: true
          });
        });
      });
      describe("selected length > 1", () => {
        const tableState = {
          selected: [...skillsList]
        };
        test("should render as expected with skillGroupName an empty string, button disabled", () => {
          renderComponent(tableState, ActionTypes.ADD);
          expectOnlyPassedProps(TextField, {
            value: ""
          });
          expectOnlyPassedProps(UserFormButton, {
            disabled: true
          });
        });
      });
    });
    describe("TextField onChange is called", () => {
      describe("selected length === 0", () => {
        const tableState = {
          selected: []
        };
        test("should render as expected with skillGroupName an empty string, button disabled", () => {
          renderComponent(tableState, ActionTypes.ADD);
          const onChange = TextField.mock.calls[0][0].onChange;
          const groupName = "New Skill Grouping";
          act(() => {
            onChange({
              target: {
                value: groupName
              }
            });
          });
          expect(TextField.mock.calls.length).toBe(2);
          expect(TextField.mock.calls[1][0].value).toBe(groupName);
          expectOnlyPassedProps(UserFormButton, {
            disabled: true
          });
        });
      });
      describe("selected length === 1", () => {
        const tableState = {
          selected: [skillsList[0]]
        };
        test("should render as expected with skillGroupName an empty string, button enabled", () => {
          renderComponent(tableState, ActionTypes.ADD);
          const onChange = TextField.mock.calls[0][0].onChange;
          const groupName = "New Skill Grouping";
          act(() => {
            onChange({
              target: {
                value: groupName
              }
            });
          });
          expect(TextField.mock.calls.length).toBe(2);
          expect(TextField.mock.calls[1][0].value).toBe(groupName);
          expectOnlyPassedProps(UserFormButton, {
            disabled: false
          });
        });
      });
    });
    describe("Add button is clicked", () => {
      const tableState = {
        selected: [skillsList[0], skillsList[1]]
      };
      test("Name is not unique, error message shows", async () => {
        renderComponent(tableState, ActionTypes.ADD);
        const textFieldProps = getMockedComponentProps(TextField);
        const change = textFieldProps.onChange;
        const groupName = "skillgroup1";  // already exists
        change({
          target: {
            value: groupName
          }
        });
        expect(TextField.mock.calls.length).toBe(2);
        expect(TextField.mock.calls[1][0].value).toBe(groupName);
        expectOnlyPassedProps(UserFormButton, {
          disabled: false
        });
        const buttonProps = getMockedComponentProps(UserFormButton);
        const onClick = buttonProps.onClick;
        act(() => {
          onClick();
        });
        await waitFor(() => {
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(0);
          expectOnlyPassedProps(TextField, {
            helperText: "Skill group names must be unique",
            error: true,
            value: groupName
          } );
        });
      });
      test("Add button is clicked, but transaction is cancelled", () => {
        renderComponent(tableState, ActionTypes.ADD);
        const onChange = TextField.mock.calls[0][0].onChange;
        const groupName = "new skill group";
        act(() => {
          onChange({
            target: {
              value: groupName
            }
          });
        });
        expect(TextField.mock.calls.length).toBe(2);
        expect(TextField.mock.calls[1][0].value).toBe(groupName);
        expectOnlyPassedProps(UserFormButton, {
          disabled: false
        });
        const onClick = UserFormButton.mock.calls[0][0].onClick;
        act(() => {
          onClick();
        });
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        const onCancel = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.handleClose;
        act(() => {
          onCancel();
        });
        expect(mockSetConfirmationModalOpts).toBeCalledWith({
          ...confirmationModalOpts,
          open: false
        });
        expect(mockSetSaveResult).toHaveBeenCalledTimes(1);
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "",
          status: null
        });
        expect(addSkillGroup).toHaveBeenCalledTimes(0);
      });
      test("SkillGroup added successfully", async () => {
        addSkillGroup.mockResolvedValueOnce([{ insertId: 6 }]);
        renderComponent(tableState, ActionTypes.ADD);
        const onChange = TextField.mock.calls[0][0].onChange;
        const groupName = "new skill group";
        act(() => {
          onChange({
            target: {
              value: groupName
            }
          });
        });
        expect(TextField.mock.calls.length).toBe(2);
        expect(TextField.mock.calls[1][0].value).toBe(groupName);
        expectOnlyPassedProps(UserFormButton, {
          disabled: false
        });
        const onClick = UserFormButton.mock.calls[1][0].onClick;
        act(() => {
          onClick();
        });
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        expectOnlyPassedProps(TextField, {
          value: groupName
        }, 1);
        const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
        act(() => {
          onConfirm();
        });
        await waitFor(() => {
          expect(addSkillGroup).toHaveBeenCalledTimes(1);
          expect(addSkillGroup).toHaveBeenCalledWith({
            skill_group_nme: "new skill group",
            skillIds: [1, 2]
          });
          expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
          expect(mockSetSaveResult).toHaveBeenNthCalledWith(1, {
            message: "Processing...",
            status: "saving"
          });
          expect(mockSetSaveResult).toHaveBeenNthCalledWith(2, {
            message: "Request Successfully Processed",
            status: "success"
          });
          expect(mockSetSaveResult).toHaveBeenNthCalledWith(3, {
            message: "",
            status: null
          });
          expect(getSkills).toHaveBeenCalledTimes(1);
        });
      });
      test("SkillGroup failes to add successfully", async () => {
        addSkillGroup.mockRejectedValueOnce("boooo");
        renderComponent(tableState, ActionTypes.ADD);
        const onChange = TextField.mock.calls[0][0].onChange;
        const groupName = "new skill group";
        act(() => {
          onChange({
            target: {
              value: groupName
            }
          });
        });
        expect(TextField.mock.calls.length).toBe(2);
        expect(TextField.mock.calls[1][0].value).toBe(groupName);
        expectOnlyPassedProps(UserFormButton, {
          disabled: false
        });
        const onClick = UserFormButton.mock.calls[0][0].onClick;
        act(() => {
          onClick();
        });
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        expectOnlyPassedProps(TextField, {
          value: groupName
        }, 1);
        const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
        act(() => {
          onConfirm();
        });
        await waitFor(() => {
          expect(addSkillGroup).toHaveBeenCalledTimes(1);
          expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
          expect(mockSetSaveResult).toHaveBeenNthCalledWith(1, {
            message: "Processing...",
            status: "saving"
          });
          expect(mockSetSaveResult).toHaveBeenNthCalledWith(2, {
            message: "Request Failed",
            status: "fail"
          });
          expect(mockDispatch).toHaveBeenCalledTimes(0);
          expect(mockSetTableState).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
  describe("action is delete", () => {
    describe("initial render", () => {
      test("dropdown and button renders", () => {
        renderComponent({ selected: []}, ActionTypes.DELETE);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(UserFormButton.mock.calls.length).toBe(1);
        expect(TextField.mock.calls.length).toBe(0);
        expectOnlyPassedProps(UserFormButton, {
          disabled: true,
          children: ["Delete", " Skill Group"]
        });
      });
    });
    describe("Skill group is selected for delete", () => {
      test("User form button is clicked, modal opens, but is canceled", () => {
        renderComponent({ selected: []}, ActionTypes.DELETE);
        expect(Dropdown.mock.calls.length).toBe(1);
        expectOnlyPassedProps(UserFormButton, {
          disabled: true,
          children: ["Delete", " Skill Group"]
        });
        const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => dropdownOnChange({}, {
          label: "skillgroup1",
          value: 1
        }));
        expect(Dropdown.mock.calls.length).toBe(2);
        expectOnlyPassedProps(UserFormButton, {
          disabled: false,
          children: ["Delete", " Skill Group"]
        });

        const onClickUserFormButt = UserFormButton.mock.calls[1][0].onClick;
        act(() => onClickUserFormButt());
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        const onCancel = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.handleClose;
        act(() => onCancel());
        expect(mockSetConfirmationModalOpts).toBeCalledWith({
          ...confirmationModalOpts,
          open: false
        });
        expect(mockSetSaveResult).toHaveBeenCalledTimes(1);
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "",
          status: null
        });
        expect(deleteSkillGroup).toHaveBeenCalledTimes(0);
        expect(addSkillGroup).toHaveBeenCalledTimes(0);
        expect(updateSkillGroup).toHaveBeenCalledTimes(0);
      });
      test("User form button is clicked, modal opens, confirm clicked, call to delete succeeds", async () => {
        deleteSkillGroup.mockResolvedValueOnce("yay!");
        renderComponent({ selected: []}, ActionTypes.DELETE);
        expect(Dropdown.mock.calls.length).toBe(1);
        expectOnlyPassedProps(UserFormButton, {
          disabled: true,
          children: ["Delete", " Skill Group"]
        });
        const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => dropdownOnChange({}, {
          label: "skillgroup1",
          value: 1
        }));
        expect(Dropdown.mock.calls.length).toBe(2);
        expectOnlyPassedProps(UserFormButton, {
          disabled: false,
          children: ["Delete", " Skill Group"]
        });

        const onClickUserFormButt = UserFormButton.mock.calls[1][0].onClick;
        act(() => onClickUserFormButt());
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
        act(() => onConfirm());
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "Processing...",
          status: "saving"
        });
        await waitFor(() => {
          expect(deleteSkillGroup).toHaveBeenLastCalledWith(1);
          expect(getSkills).toHaveBeenCalledTimes(1);
          jest.runAllTimers();
          expect(mockSetAction).toHaveBeenCalledTimes(1);
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledWith({
            ...confirmationModalOpts,
            open: false
          });
          expect(mockSetSaveResult).toHaveBeenCalledWith({
            message: "",
            status: null
          });
        });
      });
      test("User form button is clicked, modal opens, confirm clicked, call to delete fails", async () => {
        deleteSkillGroup.mockRejectedValueOnce("boo");
        renderComponent({ selected: []}, ActionTypes.DELETE);
        expect(Dropdown.mock.calls.length).toBe(1);
        const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => dropdownOnChange({}, {
          label: "skillgroup1",
          value: 1
        }));
        expect(Dropdown.mock.calls.length).toBe(2);
        const onClickUserFormButt = UserFormButton.mock.calls[1][0].onClick;
        act(() => onClickUserFormButt());
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
        act(() => onConfirm());
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "Processing...",
          status: "saving"
        });
        await waitFor(() => {
          expect(deleteSkillGroup).toHaveBeenLastCalledWith(1);
          expect(getSkills).toHaveBeenCalledTimes(0);
          expect(mockSetAction).toHaveBeenCalledTimes(0);
          expect(mockSetSaveResult).toHaveBeenCalledWith({
            message: "Request Failed",
            status: "fail"
          });
        });
      });
    });
  });
  describe("action is edit", () => {
    describe("initial render", () => {
      test("dropdown and text field are present", () => {
        renderComponent({ selected: []}, ActionTypes.EDIT);
        expect(Dropdown).toHaveBeenCalled();
        expect(TextField).toHaveBeenCalled();
        expect(UserFormButton).toHaveBeenCalled();
        expectOnlyPassedProps(UserFormButton, {
          children: ["Edit", " Skill Group"]
        });
      });
    });
    describe("Skill group is selected for edit", () => {
      describe("skill group name is not changed, only the selected skills, user form button is clicked", () => {
        test("error occurs when creating the request body, set save result occurs with failed message", async () => {
          const tableState = {
            selected: {}  //object will cause error
          };
          renderComponent(tableState, ActionTypes.EDIT);
          expect(Dropdown).toHaveBeenCalled();
          expect(TextField).toHaveBeenCalled();
          expect(UserFormButton).toHaveBeenCalled();
          const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => dropdownOnChange({}, {
            value: 1 ,
            label: "skillgroup1"
          }));
          const userFormOnClick = UserFormButton.mock.calls[1][0].onClick;
          act(() => userFormOnClick());
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);

          await waitFor(() => {
            expect(deleteSkillGroup).toHaveBeenCalledTimes(0);
            expect(addSkillGroup).toHaveBeenCalledTimes(0);
            expect(updateSkillGroup).toHaveBeenCalledTimes(0);

            expect(mockSetSaveResult).toHaveBeenCalledWith({
              message: "Request Failed",
              status: "fail"
            });
          });
        });
        test("modal is cancelled", () => {
          const tableState = {
            selected: [...skillsList]
          };
          renderComponent(tableState, ActionTypes.EDIT);
          expect(Dropdown).toHaveBeenCalled();
          expect(TextField).toHaveBeenCalled();
          expect(UserFormButton).toHaveBeenCalled();
          const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => dropdownOnChange({}, {
            value: 1 ,
            label: "skillgroup1"
          }));
          const userFormOnClick = UserFormButton.mock.calls[0][0].onClick;
          act(() => userFormOnClick());
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const onCancel = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.handleClose;
          act(() => onCancel());
          expect(mockSetConfirmationModalOpts).toBeCalledWith({
            ...confirmationModalOpts,
            open: false
          });
          expect(mockSetSaveResult).toHaveBeenCalledTimes(1);
          expect(mockSetSaveResult).toHaveBeenCalledWith({
            message: "",
            status: null
          });
          expect(deleteSkillGroup).toHaveBeenCalledTimes(0);
          expect(addSkillGroup).toHaveBeenCalledTimes(0);
          expect(updateSkillGroup).toHaveBeenCalledTimes(0);
        });
        test("confirmation modal is confirmed, editskillgroup succeeds", async () => {
          updateSkillGroup.mockResolvedValueOnce("yay");
          const tableState = {
            selected: [...skillsList]
          };
          renderComponent(tableState, ActionTypes.EDIT);
          expect(Dropdown).toHaveBeenCalled();
          expect(TextField).toHaveBeenCalled();
          expect(UserFormButton).toHaveBeenCalled();
          const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => dropdownOnChange({}, {
            value: 1 ,
            label: "skillgroup1"
          }));
          const userFormOnClick = UserFormButton.mock.calls[1][0].onClick;
          act(() => userFormOnClick());
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
          act(() => onConfirm());

          await waitFor(() => {
            expect(deleteSkillGroup).toHaveBeenCalledTimes(0);
            expect(addSkillGroup).toHaveBeenCalledTimes(0);
            expect(updateSkillGroup).toHaveBeenCalledTimes(1);
            expect(updateSkillGroup).toHaveBeenCalledWith(1, {
              skill_group_nme: "skillgroup1",
              skillIds: [1, 2, 3, 4, 5]
            });
            expect(mockSetSaveResult).toHaveBeenCalledWith({
              message: "Processing...",
              status: "saving"
            });
            expect(mockSetSaveResult).toHaveBeenCalledWith({
              message: "Request Successfully Processed",
              status: "success"
            });
            expect(getSkills).toHaveBeenCalledTimes(1);
            expect(mockSetConfirmationModalOpts).toHaveBeenLastCalledWith({
              ...confirmationModalOpts,
              open: false
            });
          });
        });
        test("confirmation modal is confirmed, editskillgroup fails", async () => {
          updateSkillGroup.mockRejectedValueOnce("fail");
          const tableState = {
            selected: [...skillsList]
          };
          renderComponent(tableState, ActionTypes.EDIT);
          expect(Dropdown).toHaveBeenCalled();
          expect(TextField).toHaveBeenCalled();
          expect(UserFormButton).toHaveBeenCalled();
          const dropdownOnChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => dropdownOnChange({}, {
            value: 1 ,
            label: "skillgroup1"
          }));
          const userFormOnClick = UserFormButton.mock.calls[1][0].onClick;
          act(() => userFormOnClick());
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
          act(() => onConfirm());

          await waitFor(() => {
            expect(deleteSkillGroup).toHaveBeenCalledTimes(0);
            expect(addSkillGroup).toHaveBeenCalledTimes(0);
            expect(updateSkillGroup).toHaveBeenCalledTimes(1);
            expect(updateSkillGroup).toHaveBeenCalledWith(1, {
              skillIds: [1, 2, 3, 4, 5],
              skill_group_nme: "skillgroup1"
            });
            expect(mockSetSaveResult).toHaveBeenCalledWith({
              message: "Processing...",
              status: "saving"
            });
            expect(mockSetSaveResult).toHaveBeenCalledWith({
              message: "Request Failed",
              status: "fail"
            });
            expect(getSkills).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
  });
});