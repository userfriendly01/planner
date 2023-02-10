import BulkUpdateManager from "../BulkUpdateManager";
import { getUpdateTemplates } from "../../BulkTemplates";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockReplaceTemplates = jest.fn();
const mockUpdateTemplates = jest.fn();
const mockRemoveTemplates = jest.fn();

const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown
    });
  });

  const renderComponent = selectedTemplates => {
    return render(
      <BulkUpdateManager
        template={updateTemplates.UPDATE_USERS_MANAGER}
        selectedTemplates={selectedTemplates || []}
        replaceTemplate={mockReplaceTemplates}
        updateTemplate={mockUpdateTemplates}
        removeTemplate={mockRemoveTemplates}
      />
    );
  };

  describe("initial render", () => {
    describe("component is rendered as expected", () => {
      test("should render options in default state", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].label).toBe("Triton Team Manager");
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        expect(Dropdown.mock.calls[0][0].options).toStrictEqual(initialTestState.managerContext.managers.map(m => {
          return {
            label: `${m.manager_first_name} ${m.manager_first_name}`,
            value: m.manager_n_number,
            ...m
          };
        }));
        expect(Dropdown.mock.calls[1][0].label).toBe("Calabrio Team");
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[1][0].options).toStrictEqual(initialTestState.calabrioContext.teams.map(t => {
          return {
            label: t.name,
            value: t.groupId,
            ...t
          };
        }));
      });
    });
  });
  describe("Manager Dropdown updateValue is called", () => {
    test("new Manager n# should be updated", () => {
      renderComponent([]);
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(Dropdown.mock.calls[0][0].value).toBe("");
      const onNNumberChange = Dropdown.mock.calls[0][0].updateValue;
      act(() => onNNumberChange(null, initialTestState.managerContext.managers[1]));
      expect(Dropdown.mock.calls.length).toBe(4);
      expect(Dropdown.mock.calls[2][0].value).toStrictEqual("n7454853");
    });
  });
  describe("Calabrio Dropdown updateValue is called", () => {
    test("new Manager calabrio Team should be updated", () => {
      renderComponent([]);
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(Dropdown.mock.calls[0][0].value).toBe("");
      const onTeamChange = Dropdown.mock.calls[1][0].updateValue;
      act(() => onTeamChange(null, initialTestState.calabrioContext.teams[1]));
      expect(Dropdown.mock.calls.length).toBe(4);
      expect(Dropdown.mock.calls[3][0].value).toStrictEqual(102);
    });
  });
  describe("New Manager is not valid", () => {
    describe("Template is found in selected tempaltes", () => {
      test("removeTemplate should be called", () => {
        renderComponent([updateTemplates.UPDATE_USERS_MANAGER]);
        expect(Dropdown.mock.calls.length).toBe(2);
        const onNNumberChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onNNumberChange(null, initialTestState.managerContext.managers[1]));
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
        expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_USERS_MANAGER);
      });
    });
    describe("Template is not found in selected tempaltes", () => {
      test("no template changes should be made", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        const onNNumberChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onNNumberChange(null, initialTestState.managerContext.managers[1]));
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe("New Manager is valid", () => {
    describe("Template is found in selected tempaltes", () => {
      test("updateTemplate should be called", () => {
        renderComponent([updateTemplates.UPDATE_USERS_MANAGER]);
        expect(Dropdown.mock.calls.length).toBe(2);
        const onNNumberChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onNNumberChange(null, initialTestState.managerContext.managers[1]));
        const onTeamChange = Dropdown.mock.calls[3][0].updateValue;
        act(() => onTeamChange(null, initialTestState.calabrioContext.teams[1]));
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
        expect(mockUpdateTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_USERS_MANAGER, {
          calabrioTeamId: 102,
          nNumber: "n7454853"
        });
      });
    });
    describe("Template is not found in selected tempaltes", () => {
      test("replaceTemplate should be called", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        const onNNumberChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onNNumberChange(null, initialTestState.managerContext.managers[1]));
        const onTeamChange = Dropdown.mock.calls[3][0].updateValue;
        act(() => onTeamChange(null, initialTestState.calabrioContext.teams[1]));
        expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
        expect(mockReplaceTemplates).toHaveBeenCalledWith({
          ...updateTemplates.UPDATE_USERS_MANAGER,
          data: {
            calabrioTeamId: 102,
            nNumber: "n7454853"
          }
        });
      });
    });
  });
});