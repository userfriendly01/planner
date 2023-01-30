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
  addSkillGroup, addSkillGroupsSkill
} from "services/skillgroup";
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

jest.mock("context", () => ({
  useAdminDispatch: jest.fn(),
  useAdminState: jest.fn()
}));

jest.mock("../../ClosedFlashMessage/ClosedFlashMessage.Styles", () => ({
  UserFormButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  TextField: jest.fn()
}));

jest.mock("services/skillgroup", () => ({
  addSkillGroup: jest.fn(),
  addSkillGroupsSkill: jest.fn()
}));

const mockSetConfirmationModalOpts = jest.fn();
const mockSetSaveResult = jest.fn();
const mockSetAction = jest.fn();
const mockSetTableState = jest.fn();
const action = ActionTypes.ADD;
const confirmationModalOpts = "hi";

const mockDispatch = jest.fn();

const renderComponent = tableState => {
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
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      TextField,
      UserFormButton
    });
  });
  describe("initial render", () => {
    describe("selected length === 0", () => {
      const tableState = {
        selected: []
      };
      test("should render as expected with skillGroupName an empty string, button disabled", () => {
        renderComponent(tableState);
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
        renderComponent(tableState);
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
        renderComponent(tableState);
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
        renderComponent(tableState);
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
        renderComponent(tableState);
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
      renderComponent(tableState);
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
      renderComponent(tableState);
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
      expect(addSkillGroupsSkill).toHaveBeenCalledTimes(0);
    });
    test("SkillGroup added successfully with all selected skills", async () => {
      addSkillGroup.mockResolvedValueOnce({ insertId: 6 });
      addSkillGroupsSkill.mockResolvedValueOnce("yay").mockResolvedValueOnce("yay");
      renderComponent(tableState);
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
        expect(addSkillGroupsSkill).toHaveBeenCalledTimes(2);
        expect(addSkillGroupsSkill).toHaveBeenNthCalledWith(1, 6, 1);
        expect(addSkillGroupsSkill).toHaveBeenNthCalledWith(2, 6, 2);
        expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
        expect(mockSetSaveResult).toHaveBeenNthCalledWith(1, {
          message: "Processing...",
          status: "saving"
        });
        expect(mockSetSaveResult).toHaveBeenNthCalledWith(2, {
          message: "Request Successfully Processed",
          status: "success"
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockSetTableState).toHaveBeenCalledWith({ selected: []});
      });
    });
    test("SkillGroup added successfully some skills fail to add to group", async () => {
      addSkillGroup.mockResolvedValueOnce({ insertId: 6 });
      addSkillGroupsSkill.mockResolvedValueOnce("yay").mockRejectedValueOnce("boo");
      renderComponent(tableState);
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
        expect(addSkillGroupsSkill).toHaveBeenCalledTimes(2);
        expect(addSkillGroupsSkill).toHaveBeenNthCalledWith(1, 6, 1);
        expect(addSkillGroupsSkill).toHaveBeenNthCalledWith(2, 6, 2);
        expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
        expect(mockSetSaveResult).toHaveBeenNthCalledWith(1, {
          message: "Processing...",
          status: "saving"
        });
        expect(mockSetSaveResult).toHaveBeenNthCalledWith(2, {
          message: "Skill group was created, but the following skills failed to be added: aisgL1",
          status: "partial fail"
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockSetTableState).toHaveBeenCalledWith({ selected: []});
      });
    });
    test("SkillGroup added successfully all skills fail to add to group", async () => {
      addSkillGroup.mockResolvedValueOnce({ insertId: 6 });
      addSkillGroupsSkill.mockRejectedValueOnce("boo").mockRejectedValueOnce("boo");
      renderComponent(tableState);
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
        expect(addSkillGroupsSkill).toHaveBeenCalledTimes(2);
        expect(addSkillGroupsSkill).toHaveBeenNthCalledWith(1, 6, 1);
        expect(addSkillGroupsSkill).toHaveBeenNthCalledWith(2, 6, 2);
        expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
        expect(mockSetSaveResult).toHaveBeenNthCalledWith(1, {
          message: "Processing...",
          status: "saving"
        });
        expect(mockSetSaveResult).toHaveBeenNthCalledWith(2, {
          message: "Skill Grouping was created, but all selected skills failed to add",
          status: "fail"
        });
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(mockSetTableState).toHaveBeenCalledTimes(0);
      });
    });
    test("SkillGroup failes to add successfully", async () => {
      addSkillGroup.mockRejectedValueOnce("boooo");
      renderComponent(tableState);
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
        expect(addSkillGroupsSkill).toHaveBeenCalledTimes(0);
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